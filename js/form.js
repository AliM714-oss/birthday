// ===== FORM SYSTEM =====
const Form = {
    // Initialize form
    init() {
        this.setupMessageForm();
    },
    
    // Setup message form submission
    setupMessageForm() {
        const messageForm = Utils.$('#message-form');
        const formFeedback = Utils.$('#form-feedback');
        
        if (!messageForm || !formFeedback) return;
        
        messageForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const submitButton = messageForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            const name = Utils.$('#sender-name').value.trim();
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            formFeedback.textContent = '';
            formFeedback.className = 'loading';
            formFeedback.textContent = 'Sending your message...';
            formFeedback.classList.add('show');
            
            Utils.announceToScreenReader('Sending your message...');
            
            try {
                const formData = new FormData(messageForm);
                
                // Add timestamp to form data
                formData.append('timestamp', new Date().toLocaleString());
                
                const response = await fetch(messageForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success!
                    formFeedback.className = 'success show';
                    formFeedback.innerHTML = `
                        <i class="fas fa-check-circle" style="font-size: 1.5rem; margin-right: 10px;"></i>
                        <strong>Message sent successfully, ${name}!</strong><br>
                        <small>Thank you for your message. Ali will see it soon!</small>
                    `;
                    
                    // Clear form
                    messageForm.reset();
                    
                    // Celebration!
                    Utils.safeSetTimeout(() => {
                        Utils.launchConfetti();
                    }, 300);
                    
                    // Play success sound if music is enabled
                    if (Utils.state.audio && Utils.state.isMusicPlaying) {
                        const successSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
                        successSound.volume = 0.3;
                        successSound.play().catch(() => {});
                    }
                    
                    Utils.announceToScreenReader(`Message sent successfully, ${name}! Thank you!`);
                    
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form error:', error);
                formFeedback.className = 'error show';
                formFeedback.innerHTML = `
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem; margin-right: 10px;"></i>
                    <strong>Oops! Something went wrong.</strong><br>
                    <small>Please try again or refresh the page.</small>
                `;
                
                Utils.announceToScreenReader('Error sending message. Please try again.');
                
            } finally {
                // Reset button
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Auto-hide feedback after 5 seconds
                Utils.safeSetTimeout(() => {
                    formFeedback.classList.remove('show');
                    Utils.safeSetTimeout(() => {
                        formFeedback.textContent = '';
                        formFeedback.className = '';
                    }, 300);
                }, 5000);
            }
        });
    }
};

// Make Form available globally
window.Form = Form;
