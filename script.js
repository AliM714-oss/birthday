document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if(section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Confetti
    const confettiBtn = document.getElementById('confetti-btn');
    if(confettiBtn) {
        confettiBtn.addEventListener('click', function() {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        });
    }

    // Click Game
    let score = 0;
    let gameActive = false;
    const scoreDisplay = document.getElementById('score');
    const clickBtn = document.getElementById('click-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if(clickBtn) {
        clickBtn.addEventListener('click', function() {
            if(!gameActive) {
                gameActive = true;
                score = 0;
                scoreDisplay.textContent = score;
                
                setTimeout(() => {
                    gameActive = false;
                    alert(`Time's up! Final score: ${score}`);
                }, 10000);
            }
            
            if(gameActive) {
                score++;
                scoreDisplay.textContent = score;
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            }
        });
    }
    
    if(resetBtn) {
        resetBtn.addEventListener('click', function() {
            score = 0;
            gameActive = false;
            scoreDisplay.textContent = score;
        });
    }

    // Music Toggle
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    const musicIcon = musicToggle.querySelector('i');
    const musicText = musicToggle.querySelector('span');
    
    if(musicToggle) {
        musicToggle.addEventListener('click', function() {
            if(bgMusic.paused) {
                bgMusic.play();
                musicIcon.className = 'fas fa-volume-up';
                musicText.textContent = 'Pause Music';
            } else {
                bgMusic.pause();
                musicIcon.className = 'fas fa-music';
                musicText.textContent = 'Play Music';
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    if(themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if(document.body.classList.contains('dark-mode')) {
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Light Mode';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeText.textContent = 'Dark Mode';
            }
        });
    }

    // Start with first section active
    if(sections.length > 0) {
        sections[0].classList.add('active');
    }
});
