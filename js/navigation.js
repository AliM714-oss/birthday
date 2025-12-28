// ===== NAVIGATION SYSTEM =====
const Navigation = {
    // Initialize navigation
    init() {
        this.setupNavButtons();
        this.setupNavbarScroll();
        this.setupThemeToggle();
        this.setupMusicToggle();
        this.setupConfetti();
        this.fixMobileNavbar();
        
        // Listen for resize events with debouncing
        window.addEventListener('resize', Utils.debounce(() => this.fixMobileNavbar(), 250));
    },
    
    // Setup navigation buttons
    setupNavButtons() {
        const navButtons = Utils.$$('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = btn.getAttribute('href').substring(1);
                
                // Update active button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show section
                this.showSection(targetSection);
            });
        });
    },
    
    // Show section with smooth scrolling
    // In the showSection function, update the quiz section handling:
function showSection(sectionId) {
    // ... existing code ...
    
    // 5. Special section initialization
    if (sectionId === 'quiz') {
        // Wait a tiny bit to ensure DOM is ready
        setTimeout(() => {
            // If quiz hasn't started but questions are loaded, start it
            if (!Quiz.state.started && Quiz.state.questions.length > 0) {
                Quiz.startNewQuiz();
            }
            // If questions aren't loaded yet, displayQuestion will handle it
            else if (Quiz.state.questions.length === 0) {
                // Show loading message
                Utils.$('#question-text').textContent = "Loading questions...";
                // The questions will load automatically via Quiz.init()
            }
        }, 100);
    }
}
    
    // Fix mobile navbar layout
    fixMobileNavbar() {
        const navbar = Utils.$('.navbar');
        const navContainer = Utils.$('.nav-container');
        
        if (!navbar || !navContainer) return;
        
        if (Utils.isMobile()) {
            // Mobile-specific adjustments
            document.body.style.paddingTop = '60px';
            
            // Ensure all buttons fit
            const buttons = Utils.$$('.nav-btn');
            let totalWidth = 0;
            
            buttons.forEach(btn => {
                totalWidth += btn.offsetWidth;
            });
            
            if (totalWidth > window.innerWidth) {
                navContainer.style.gap = '1px';
                buttons.forEach(btn => {
                    btn.style.padding = '6px 1px';
                    btn.style.fontSize = '0.6rem';
                });
            }
        } else {
            // Reset desktop styles
            document.body.style.paddingTop = '';
            navContainer.style.gap = '';
            
            Utils.$$('.nav-btn').forEach(btn => {
                btn.style.padding = '';
                btn.style.fontSize = '';
            });
        }
    },
    
    // Setup navbar scroll behavior
    setupNavbarScroll() {
        const navbar = Utils.$('.navbar');
        if (!navbar) return;
        
        let lastScrollTop = 0;
        let isScrolling = false;
        
        navbar.classList.add('visible');
        
        if (window.innerWidth >= 769) {
            window.addEventListener('scroll', () => {
                if (isScrolling) return;
                
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                // Don't hide at the top of the page
                if (currentScroll < 100) {
                    navbar.classList.remove('hidden');
                    navbar.classList.add('visible');
                    lastScrollTop = currentScroll;
                    return;
                }
                
                // Hide/show based on scroll direction
                if (currentScroll > lastScrollTop) {
                    navbar.classList.remove('visible');
                    navbar.classList.add('hidden');
                } else {
                    navbar.classList.remove('hidden');
                    navbar.classList.add('visible');
                }
                
                lastScrollTop = currentScroll;
                isScrolling = true;
                
                setTimeout(() => {
                    isScrolling = false;
                }, 150);
            });
        }
    },
    
    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = Utils.$('#theme-toggle');
        if (!themeToggle) return;
        
        // Apply saved theme
        if (Utils.state.isDarkTheme) {
            document.body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', () => {
            Utils.state.isDarkTheme = !Utils.state.isDarkTheme;
            document.body.classList.toggle('dark-theme');
            
            const icon = themeToggle.querySelector('i');
            const label = themeToggle.querySelector('.btn-label');
            
            if (icon) {
                icon.className = Utils.state.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            if (label) {
                label.textContent = Utils.state.isDarkTheme ? 'Light' : 'Dark';
            }
            
            localStorage.setItem('theme', Utils.state.isDarkTheme ? 'dark' : 'light');
            Utils.announceToScreenReader(`Theme switched to ${Utils.state.isDarkTheme ? 'dark' : 'light'} mode`);
        });
    },
    
    // Setup music toggle
    setupMusicToggle() {
        const musicToggle = Utils.$('#music-toggle');
        if (!musicToggle) return;
        
        // Create audio element
        Utils.state.audio = new Audio('assets/birthday-music.mp3');
        Utils.state.audio.loop = true;
        Utils.state.audio.volume = 0.5;
        
        // Update UI based on saved state
        if (Utils.state.isMusicPlaying) {
            const icon = musicToggle.querySelector('i');
            const label = musicToggle.querySelector('.btn-label');
            if (icon) icon.className = 'fas fa-volume-up';
            if (label) label.textContent = 'Music';
        }
        
        musicToggle.addEventListener('click', () => {
            if (!Utils.state.isMusicPlaying) {
                // Try to play music
                Utils.state.audio.play()
                    .then(() => {
                        Utils.state.isMusicPlaying = true;
                        const icon = musicToggle.querySelector('i');
                        const label = musicToggle.querySelector('.btn-label');
                        if (icon) icon.className = 'fas fa-volume-up';
                        if (label) label.textContent = 'Music';
                        localStorage.setItem('musicEnabled', 'true');
                        Utils.announceToScreenReader('Music started');
                    })
                    .catch((error) => {
                        console.log('Music play failed:', error);
                        const label = musicToggle.querySelector('.btn-label');
                        if (label) label.textContent = 'Click Again';
                        setTimeout(() => {
                            if (label) label.textContent = 'Music';
                        }, 2000);
                    });
            } else {
                // Pause music
                Utils.state.audio.pause();
                Utils.state.isMusicPlaying = false;
                const icon = musicToggle.querySelector('i');
                const label = musicToggle.querySelector('.btn-label');
                if (icon) icon.className = 'fas fa-music';
                if (label) label.textContent = 'Music';
                localStorage.setItem('musicEnabled', 'false');
                Utils.announceToScreenReader('Music paused');
            }
        });
        
        // Auto-play after user interaction if previously enabled
        if (Utils.state.isMusicPlaying) {
            document.addEventListener('click', function enableMusicOnce() {
                if (Utils.state.audio.paused) {
                    Utils.state.audio.play().catch(e => {
                        console.log("Autoplay after interaction failed:", e);
                    });
                }
                document.removeEventListener('click', enableMusicOnce);
            }, { once: true });
        }
    },
    
    // Setup confetti button
    setupConfetti() {
        const confettiBtn = Utils.$('#confetti-btn');
        if (confettiBtn) {
            confettiBtn.addEventListener('click', () => {
                Utils.launchConfetti();
                Utils.announceToScreenReader('Confetti launched!');
                
                // Button animation
                confettiBtn.classList.add('pulse');
                setTimeout(() => {
                    confettiBtn.classList.remove('pulse');
                }, 500);
            });
        }
    }
};

// Make Navigation available globally
window.Navigation = Navigation;
