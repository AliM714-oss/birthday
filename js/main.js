// ===== MAIN APPLICATION =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🎂 Happy 18th Birthday Fatima! 🚀");
    
    try {
        // Check if required modules exist
        if (typeof Utils === 'undefined') {
            console.error("❌ Utils module not found!");
            return;
        }
        
        if (typeof Navigation === 'undefined') {
            console.error("❌ Navigation module not found!");
            return;
        }
        
        if (typeof Games === 'undefined') {
            console.error("❌ Games module not found!");
            return;
        }
        
        if (typeof Quiz === 'undefined') {
            console.error("❌ Quiz module not found!");
            return;
        }
        
        if (typeof Form === 'undefined') {
            console.error("❌ Form module not found!");
            return;
        }
        
        console.log("✅ All modules loaded");
        
        // Initialize all systems
        Navigation.init();
        Games.init();
        await Quiz.init();
        Form.init();
        
        // Initialize welcome popup
        initWelcomeSystem();
        
        // Show home section by default
        Navigation.showSection('home');
        
        console.log("✅ All systems initialized successfully!");
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        alert("Website failed to load. Please refresh the page.");
    }
});

// ===== WELCOME POPUP SYSTEM =====
function initWelcomeSystem() {
    console.log("🎉 Welcome system initializing...");
    
    setTimeout(() => {
        const popup = document.getElementById('welcome-popup');
        
        if (!popup) {
            console.error("Popup element not found!");
            return;
        }
        
        // Check if already shown today
        const today = new Date().toDateString();
        const lastShown = localStorage.getItem('popupLastShown');
        
        if (lastShown !== today) {
            console.log("Showing welcome popup for the first time today");
            
            // Show the popup
            popup.style.display = 'flex';
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Launch gentle confetti
            setTimeout(() => {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }, 300);
            
            // Save that we showed it today
            localStorage.setItem('popupLastShown', today);
        } else {
            console.log("Popup already shown today, skipping");
            // Still launch confetti but no popup
            setTimeout(() => {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 50,
                        spread: 60
                    });
                }
            }, 800);
        }
        
        // Setup close buttons
        document.querySelectorAll('.close-popup, .close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                popup.classList.remove('active');
                document.body.style.overflow = '';
                popup.style.display = 'none';
                
                // Launch confetti when exploring
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 80
                    });
                }
            });
        });
        
        // Confetti button in popup
        const confettiBtn = document.querySelector('.start-confetti');
        if (confettiBtn) {
            confettiBtn.addEventListener('click', function() {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 150,
                        spread: 100
                    });
                    
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 80,
                        origin: { x: 0 }
                    });
                }
            });
        }
        
    }, 1000);
}
