// ===== MAIN APPLICATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🎂 Happy 18th Birthday Fatima! 🚀");
    
    try {
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
        Utils.announceToScreenReader('Welcome to Fatima\'s 18th birthday website!');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        Utils.announceToScreenReader('Error initializing website. Please refresh the page.', 'assertive');
    }
});

// ===== WELCOME POPUP SYSTEM =====
function initWelcomeSystem() {
    console.log("🎉 Welcome system initializing...");
    
    Utils.safeSetTimeout(() => {
        const popup = Utils.$('#welcome-popup');
        
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
            popup.hidden = false;
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Launch gentle confetti
            Utils.safeSetTimeout(() => {
                Utils.launchConfetti();
            }, 300);
            
            // Save that we showed it today
            localStorage.setItem('popupLastShown', today);
            Utils.announceToScreenReader('Welcome to Fatima\'s 18th birthday website!');
            
        } else {
            console.log("Popup already shown today, skipping");
            // Still launch confetti but no popup
            Utils.safeSetTimeout(() => {
                Utils.launchConfetti();
            }, 800);
        }
        
        // Setup close buttons
        Utils.$$('.close-popup, .close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                popup.classList.remove('active');
                document.body.style.overflow = '';
                popup.hidden = true;
                
                // Launch confetti when exploring
                Utils.launchConfetti();
                Utils.announceToScreenReader('Start exploring the website!');
            });
        });
        
        // Confetti button in popup
        const confettiBtn = popup.querySelector('.start-confetti');
        if (confettiBtn) {
            confettiBtn.addEventListener('click', () => {
                Utils.launchConfetti();
                Utils.announceToScreenReader('Confetti celebration!');
            });
        }
        
    }, 1000);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    Utils.announceToScreenReader('An error occurred on the page. Please check the console.', 'assertive');
});

// ===== PROGRESSIVE ENHANCEMENT =====
// Check for modern browser features
if ('querySelector' in document && 'addEventListener' in window) {
    document.documentElement.classList.add('js-enabled');
} else {
    document.documentElement.classList.add('no-js');
    Utils.announceToScreenReader('This website requires JavaScript for full functionality.');
}

// ===== SERVICE WORKER FOR OFFLINE SUPPORT (OPTIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}
