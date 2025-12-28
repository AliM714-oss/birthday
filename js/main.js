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
