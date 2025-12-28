// ===== GAMES SYSTEM =====
const Games = {
    // Click Game State
    clickGame: {
        active: false,
        clicks: 0,
        timeLeft: 10,
        timer: null,
        highScores: Utils.loadFromStorage('clickHighScores', [0, 0, 0])
    },
    
    // Reaction Game State
    reactionGame: {
        waiting: false,
        startTime: null,
        stats: Utils.loadFromStorage('reactionStats', {
            times: [],
            best: null,
            avg: null,
            attempts: 0
        })
    },
    
    // Initialize games
    init() {
        this.initClickGame();
        this.initReactionGame();
        
        // Update displays with saved data
        this.updateClickDisplay();
        this.updateReactionDisplay();
    },
    
    // ===== CLICK GAME =====
    initClickGame() {
        const startBtn = Utils.$('#start-click');
        const resetBtn = Utils.$('#reset-click');
        const clickArea = Utils.$('#click-area');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startClickGame());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetClickScores());
        if (clickArea) clickArea.addEventListener('click', () => this.handleClick());
    },
    
    startClickGame() {
        if (this.clickGame.active) return;
        
        this.clickGame.active = true;
        this.clickGame.clicks = 0;
        this.clickGame.timeLeft = 10;
        
        // Update UI
        Utils.$('#start-click').innerHTML = '<i class="fas fa-play"></i> Clicking...';
        Utils.$('#click-count').textContent = '0';
        Utils.$('#click-timer').textContent = '10';
        Utils.$('#click-cps').textContent = '0';
        
        // Start timers
        this.clickGame.timer = Utils.safeSetInterval(() => this.updateClickTimer(), 1000);
        this.clickGame.cpsTimer = Utils.safeSetInterval(() => this.updateCPS(), 1000);
        
        Utils.announceToScreenReader('Click challenge started! Click as fast as you can!');
    },
    
    updateClickTimer() {
        this.clickGame.timeLeft--;
        Utils.$('#click-timer').textContent = this.clickGame.timeLeft;
        
        if (this.clickGame.timeLeft <= 0) {
            this.endClickGame();
        }
    },
    
    updateCPS() {
        if (!this.clickGame.active) return;
        
        const cps = Math.round(this.clickGame.clicks / (10 - this.clickGame.timeLeft) * 10) / 10;
        Utils.$('#click-cps').textContent = cps;
    },
    
    handleClick() {
        if (!this.clickGame.active) return;
        
        this.clickGame.clicks++;
        Utils.$('#click-count').textContent = this.clickGame.clicks;
        
        // Visual feedback
        const clickArea = Utils.$('#click-area');
        clickArea.style.transform = 'scale(0.98)';
        setTimeout(() => {
            clickArea.style.transform = 'scale(1)';
        }, 100);
    },
    
    endClickGame() {
        if (!this.clickGame.active) return;
        
        this.clickGame.active = false;
        Utils.cleanupAllTimers();
        
        // Update UI
        Utils.$('#start-click').innerHTML = '<i class="fas fa-play"></i> Start Clicking';
        Utils.$('#click-timer').textContent = '10';
        Utils.$('#click-cps').textContent = '0';
        
        // Calculate final CPS
        const finalCPS = Math.round(this.clickGame.clicks / 10 * 10) / 10;
        
        // Update high scores
        this.updateHighScores(this.clickGame.clicks);
        
        // Show results
        const message = `Click Challenge Complete!\n\nClicks: ${this.clickGame.clicks}\nCPS: ${finalCPS}\nBest: ${this.clickGame.highScores[0]}`;
        alert(message);
        Utils.announceToScreenReader(`Click challenge complete! ${this.clickGame.clicks} clicks, ${finalCPS} clicks per second. Best score: ${this.clickGame.highScores[0]}`);
        
        // Celebration for good scores
        if (this.clickGame.clicks > 50) {
            Utils.launchConfetti();
        }
    },
    
    updateHighScores(score) {
        this.clickGame.highScores.push(score);
        this.clickGame.highScores.sort((a, b) => b - a);
        this.clickGame.highScores = this.clickGame.highScores.slice(0, 3);
        
        this.updateClickDisplay();
        Utils.saveToStorage('clickHighScores', this.clickGame.highScores);
    },
    
    updateClickDisplay() {
        Utils.$('#click-highscore').textContent = this.clickGame.highScores[0];
    },
    
    resetClickScores() {
        this.clickGame.highScores = [0, 0, 0];
        this.updateClickDisplay();
        localStorage.removeItem('clickHighScores');
        alert('High scores cleared!');
        Utils.announceToScreenReader('Click game high scores cleared');
    },
    
    // ===== REACTION GAME =====
    initReactionGame() {
        const startBtn = Utils.$('#start-reaction');
        const resetBtn = Utils.$('#reset-reaction');
        const reactionArea = Utils.$('#reaction-area');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startReactionTest());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetReactionStats());
        if (reactionArea) reactionArea.addEventListener('click', () => this.handleReactionClick());
    },
    
    startReactionTest() {
        if (this.reactionGame.waiting) return;
        
        const reactionArea = Utils.$('#reaction-area');
        const reactionText = reactionArea.querySelector('.reaction-timer');
        
        this.reactionGame.waiting = true;
        reactionArea.classList.add('waiting');
        reactionText.textContent = 'Wait for green...';
        
        // Random delay between 2-5 seconds
        const delay = 2000 + Math.random() * 3000;
        
        Utils.safeSetTimeout(() => {
            if (!this.reactionGame.waiting) return;
            
            reactionArea.classList.remove('waiting');
            reactionArea.classList.add('ready');
            reactionText.textContent = 'CLICK NOW!';
            this.reactionGame.startTime = Date.now();
            Utils.announceToScreenReader('Click now!');
        }, delay);
    },
    
    handleReactionClick() {
        const reactionArea = Utils.$('#reaction-area');
        const stats = this.reactionGame.stats;
        
        if (reactionArea.classList.contains('ready')) {
            // Calculate reaction time
            const reactionTime = (Date.now() - this.reactionGame.startTime) / 1000;
            
            // Update display
            Utils.$('#reaction-last').textContent = `${reactionTime.toFixed(2)}s`;
            
            // Update stats
            stats.times.push(reactionTime);
            stats.attempts = (stats.attempts || 0) + 1;
            
            // Update best time
            if (!stats.best || reactionTime < stats.best) {
                stats.best = reactionTime;
                Utils.$('#reaction-best').textContent = `${stats.best.toFixed(2)}s`;
            }
            
            // Calculate average
            const sum = stats.times.reduce((a, b) => a + b, 0);
            stats.avg = sum / stats.times.length;
            Utils.$('#reaction-avg').textContent = `${stats.avg.toFixed(2)}s`;
            Utils.$('#reaction-attempts').textContent = stats.attempts;
            
            // Save stats
            Utils.saveToStorage('reactionStats', stats);
            
            // Reset for next attempt
            this.reactionGame.waiting = false;
            reactionArea.classList.remove('ready');
            reactionArea.querySelector('.reaction-timer').textContent = 'Click to Start';
            
            // Show feedback
            let feedback = '';
            if (reactionTime < 0.2) feedback = 'Superhuman! 🦸';
            else if (reactionTime < 0.3) feedback = 'Lightning fast! ⚡';
            else if (reactionTime < 0.4) feedback = 'Great reaction! 🎯';
            else if (reactionTime < 0.5) feedback = 'Good job! 👍';
            else feedback = 'Keep practicing! 💪';
            
            alert(`Reaction time: ${reactionTime.toFixed(2)}s\n${feedback}`);
            Utils.announceToScreenReader(`Reaction time: ${reactionTime.toFixed(2)} seconds. ${feedback}`);
            
        } else if (reactionArea.classList.contains('waiting')) {
            // Clicked too soon
            this.reactionGame.waiting = false;
            reactionArea.classList.remove('waiting');
            reactionArea.querySelector('.reaction-timer').textContent = 'Too Soon!';
            Utils.announceToScreenReader('Too soon! Wait for green.');
            
            Utils.safeSetTimeout(() => {
                reactionArea.querySelector('.reaction-timer').textContent = 'Click to Start';
            }, 1000);
        } else {
            // Start new test
            this.startReactionTest();
        }
    },
    
    updateReactionDisplay() {
        const stats = this.reactionGame.stats;
        
        if (stats.best) {
            Utils.$('#reaction-best').textContent = `${stats.best.toFixed(2)}s`;
        }
        if (stats.avg) {
            Utils.$('#reaction-avg').textContent = `${stats.avg.toFixed(2)}s`;
        }
        if (stats.attempts) {
            Utils.$('#reaction-attempts').textContent = stats.attempts;
        }
    },
    
    resetReactionStats() {
        this.reactionGame.stats = { times: [], best: null, avg: null, attempts: 0 };
        Utils.$('#reaction-last').textContent = '0.00s';
        Utils.$('#reaction-best').textContent = '0.00s';
        Utils.$('#reaction-avg').textContent = '0.00s';
        Utils.$('#reaction-attempts').textContent = '0';
        localStorage.removeItem('reactionStats');
        alert('Reaction stats cleared!');
        Utils.announceToScreenReader('Reaction game statistics cleared');
    }
};

// Make Games available globally
window.Games = Games;
