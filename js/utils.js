// ===== UTILITY FUNCTIONS =====
const Utils = {
    // State Management
    state: {
        currentSection: 'home',
        isDarkTheme: localStorage.getItem('theme') === 'dark',
        isMusicPlaying: localStorage.getItem('musicEnabled') === 'true',
        audio: null
    },
    
    // Active intervals and timeouts for cleanup
    activeIntervals: [],
    activeTimeouts: [],
    
    // ===== TIMER MANAGEMENT =====
    safeSetInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.activeIntervals.push(id);
        return id;
    },
    
    safeSetTimeout(callback, delay) {
        const id = setTimeout(callback, delay);
        this.activeTimeouts.push(id);
        return id;
    },
    
    cleanupAllTimers() {
        this.activeIntervals.forEach(id => clearInterval(id));
        this.activeTimeouts.forEach(id => clearTimeout(id));
        this.activeIntervals = [];
        this.activeTimeouts = [];
    },
    
    // ===== DEBOUNCE =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // ===== CONFETTI =====
    launchConfetti() {
        if (typeof confetti !== 'function') return;
        
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        setTimeout(() => {
            confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0 } });
        }, 250);
        
        setTimeout(() => {
            confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1 } });
        }, 500);
        
        setTimeout(() => {
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
        }, 750);
    },
    
    // ===== DOM HELPERS =====
    $(selector) {
        return document.querySelector(selector);
    },
    
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    // ===== LOCAL STORAGE =====
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`Failed to save ${key} to localStorage:`, e);
        }
    },
    
    loadFromStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.warn(`Failed to load ${key} from localStorage:`, e);
            return defaultValue;
        }
    },
    
    // ===== ACCESSIBILITY =====
    announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 3000);
        }
    },
    
    // ===== MOBILE DETECTION =====
    isMobile() {
        return window.innerWidth <= 768;
    },
    
    // ===== SCROLL HELPERS =====
    smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },
    
    // ===== FORMATTING =====
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // ===== ERROR HANDLING =====
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        this.announceToScreenReader(`An error occurred: ${context}`, 'assertive');
    }
};

// Make Utils available globally
window.Utils = Utils;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    Utils.cleanupAllTimers();
});
