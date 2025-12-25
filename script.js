// ===== GLOBAL VARIABLES =====
let currentSection = 'home';
let isDarkTheme = false;
let musicEnabled = false;
let audioElement = null;

// Quiz variables
let quizQuestions = [];
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];
let quizStarted = false;

// Game variables
let memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    time: 0,
    timer: null,
    gameActive: false
};

let typingGame = {
    active: false,
    startTime: null,
    timer: null,
    timeLeft: 60,
    wordsTyped: 0,
    totalWords: 0,
    accuracy: 100
};

let reactionGame = {
    waiting: false,
    startTime: null,
    reactionTimes: [],
    bestTime: null,
    averageTime: null,
    attempts: 0
};

let clickGame = {
    active: false,
    clicks: 0,
    timeLeft: 10,
    timer: null,
    highScores: [0, 0, 0],
    clickTimer: null
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎂 Birthday website for Fatima loaded!");
    
    // Initialize all components
    initializeNavigation();
    initializeTheme();
    initializeMusic();
    initializeGames();
    initializeQuiz();
    initializeConfetti();
    initializeWishSystem();
    
    // Show home section by default
    showSection('home');
    
    // Load saved preferences
    loadPreferences();
    
    // Add floating animation to cake icon
    const cakeIcon = document.querySelector('.fa-birthday-cake');
    if (cakeIcon) {
        cakeIcon.classList.add('floating');
    }
});

// ===== NAVIGATION =====
function initializeNavigation() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            
            // Update active button
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show target section
            showSection(targetSection);
            
            // Special handling for games section
            if (targetSection === 'games') {
                initializeMemoryGame();
            }
        });
    });
    
    // Scroll to top button
    document.getElementById('scroll-top')?.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Quick games access
    document.getElementById('games-quick')?.addEventListener('click', function() {
        showSection('games');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('a[href="#games"]').classList.add('active');
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Smooth scroll to section
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Special initialization for certain sections
        if (sectionId === 'quiz' && !quizStarted) {
            startNewQuiz();
        }
        
        if (sectionId === 'games') {
            resetGames();
        }
    }
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const themeLabel = themeToggle?.querySelector('.btn-label');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkTheme();
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (isDarkTheme) {
                disableDarkTheme();
            } else {
                enableDarkTheme();
            }
        });
    }
}

function enableDarkTheme() {
    document.body.classList.add('dark-theme');
    isDarkTheme = true;
    
    const themeIcon = document.querySelector('#theme-toggle i');
    const themeLabel = document.querySelector('#theme-toggle .btn-label');
    
    if (themeIcon) themeIcon.className = 'fas fa-sun';
    if (themeLabel) themeLabel.textContent = 'Light Mode';
    
    localStorage.setItem('theme', 'dark');
}

function disableDarkTheme() {
    document.body.classList.remove('dark-theme');
    isDarkTheme = false;
    
    const themeIcon = document.querySelector('#theme-toggle i');
    const themeLabel = document.querySelector('#theme-toggle .btn-label');
    
    if (themeIcon) themeIcon.className = 'fas fa-moon';
    if (themeLabel) themeLabel.textContent = 'Dark Mode';
    
    localStorage.setItem('theme', 'light');
}

// ===== MUSIC PLAYER =====
function initializeMusic() {
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle?.querySelector('i');
    const musicLabel = musicToggle?.querySelector('.btn-label');
    
    // Create audio element
    audioElement = new Audio('assets/birthday-music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.5;
    
    // Load music preference
    const musicPreference = localStorage.getItem('musicEnabled');
    if (musicPreference === 'true') {
        musicEnabled = true;
        if (musicIcon) musicIcon.className = 'fas fa-volume-up';
        if (musicLabel) musicLabel.textContent = 'Music On';
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', function() {
            if (!musicEnabled) {
                // Enable and play music
                musicEnabled = true;
                audioElement.play()
                    .then(() => {
                        console.log("🎵 Music started successfully");
                        if (musicIcon) musicIcon.className = 'fas fa-volume-up';
                        if (musicLabel) musicLabel.textContent = 'Music On';
                        localStorage.setItem('musicEnabled', 'true');
                        
                        // Show success notification
                        showNotification('Music enabled! 🎵', 'success');
                    })
                    .catch(error => {
                        console.error("Music play failed:", error);
                        musicEnabled = false;
                        if (musicIcon) musicIcon.className = 'fas fa-music';
                        if (musicLabel) musicLabel.textContent = 'Click Again';
                        
                        // Show error notification
                        showNotification('Click the button again to enable music', 'warning');
                    });
            } else {
                // Disable music
                musicEnabled = false;
                audioElement.pause();
                if (musicIcon) musicIcon.className = 'fas fa-music';
                if (musicLabel) musicLabel.textContent = 'Music Off';
                localStorage.setItem('musicEnabled', 'false');
                
                // Show notification
                showNotification('Music paused', 'info');
            }
        });
    }
    
    // Auto-play after user interaction if previously enabled
    if (musicPreference === 'true') {
        document.addEventListener('click', function enableMusicOnce() {
            if (audioElement.paused) {
                audioElement.play().catch(e => {
                    console.log("Auto-play blocked, waiting for user click");
                });
            }
            document.removeEventListener('click', enableMusicOnce);
        }, { once: true });
    }
}

// ===== CONFETTI =====
function initializeConfetti() {
    const confettiBtn = document.getElementById('confetti-btn');
    
    if (confettiBtn) {
        confettiBtn.addEventListener('click', function() {
            launchConfetti();
            
            // Button animation
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
        });
    }
    
    // Also launch confetti on birthday wish button
    document.getElementById('wish-btn')?.addEventListener('click', function() {
        setTimeout(launchConfetti, 500);
    });
}

function launchConfetti() {
    // Multiple confetti bursts for celebration
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 80,
            origin: { x: 0 }
        });
    }, 250);
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 80,
            origin: { x: 1 }
        });
    }, 500);
    
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 }
        });
    }, 750);
}

// ===== GAMES SYSTEM =====
function initializeGames() {
    // Memory Game
    initializeMemoryGame();
    
    // Typing Game
    initializeTypingGame();
    
    // Reaction Game
    initializeReactionGame();
    
    // Click Game
    initializeClickGame();
}

// ===== MEMORY GAME =====
function initializeMemoryGame() {
    const startBtn = document.getElementById('start-memory');
    const resetBtn = document.getElementById('reset-memory');
    
    if (startBtn) {
        startBtn.addEventListener('click', startMemoryGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetMemoryGame);
    }
    
    // Create initial cards
    createMemoryCards();
}

function createMemoryCards() {
    const memoryBoard = document.getElementById('memory-board');
    if (!memoryBoard) return;
    
    // Emojis for memory cards
    const cardSymbols = ['🎂', '🎁', '🎈', '🎉', '🥳', '✨', '💝', '🎊'];
    const cards = [...cardSymbols, ...cardSymbols]; // Duplicate for pairs
    
    // Shuffle cards
    shuffleArray(cards);
    
    // Clear board
    memoryBoard.innerHTML = '';
    
    // Create card elements
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerHTML = '🎴'; // Back of card
        
        card.addEventListener('click', () => handleMemoryCardClick(card));
        memoryBoard.appendChild(card);
    });
    
    memoryGame.cards = Array.from(document.querySelectorAll('.memory-card'));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startMemoryGame() {
    if (memoryGame.gameActive) return;
    
    memoryGame.gameActive = true;
    memoryGame.moves = 0;
    memoryGame.matchedPairs = 0;
    memoryGame.time = 0;
    memoryGame.flippedCards = [];
    
    // Start timer
    memoryGame.timer = setInterval(() => {
        memoryGame.time++;
        document.getElementById('memory-time').textContent = memoryGame.time + 's';
    }, 1000);
    
    // Update UI
    document.getElementById('start-memory').disabled = true;
    document.getElementById('start-memory').innerHTML = '<i class="fas fa-play"></i> Game Active';
    
    // Flip all cards briefly to show symbols
    memoryGame.cards.forEach(card => {
        card.innerHTML = card.dataset.symbol;
        card.classList.add('flipped');
    });
    
    setTimeout(() => {
        memoryGame.cards.forEach(card => {
            card.innerHTML = '🎴';
            card.classList.remove('flipped');
        });
    }, 2000);
}

function handleMemoryCardClick(card) {
    if (!memoryGame.gameActive || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched') ||
        memoryGame.flippedCards.length >= 2) {
        return;
    }
    
    // Flip card
    card.innerHTML = card.dataset.symbol;
    card.classList.add('flipped');
    memoryGame.flippedCards.push(card);
    
    // Check for match
    if (memoryGame.flippedCards.length === 2) {
        memoryGame.moves++;
        document.getElementById('memory-moves').textContent = memoryGame.moves;
        
        const card1 = memoryGame.flippedCards[0];
        const card2 = memoryGame.flippedCards[1];
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            memoryGame.matchedPairs++;
            memoryGame.flippedCards = [];
            
            // Check if game is complete
            if (memoryGame.matchedPairs === 8) {
                endMemoryGame();
            }
        } else {
            // No match, flip back after delay
            setTimeout(() => {
                card1.innerHTML = '🎴';
                card2.innerHTML = '🎴';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                memoryGame.flippedCards = [];
            }, 1000);
        }
    }
}

function endMemoryGame() {
    clearInterval(memoryGame.timer);
    memoryGame.gameActive = false;
    
    // Calculate score
    const score = Math.max(0, 1000 - (memoryGame.moves * 10) - (memoryGame.time * 5));
    
    // Show celebration
    launchConfetti();
    
    // Update UI
    document.getElementById('start-memory').disabled = false;
    document.getElementById('start-memory').innerHTML = '<i class="fas fa-play"></i> Play Again';
    
    // Show success message
    showNotification(`Memory Game Complete! Score: ${score}`, 'success');
}

function resetMemoryGame() {
    clearInterval(memoryGame.timer);
    memoryGame.gameActive = false;
    
    // Reset UI
    document.getElementById('start-memory').disabled = false;
    document.getElementById('start-memory').innerHTML = '<i class="fas fa-play"></i> Start Game';
    document.getElementById('memory-time').textContent = '0s';
    document.getElementById('memory-moves').textContent = '0';
    
    // Create new cards
    createMemoryCards();
}

// ===== TYPING GAME =====
function initializeTypingGame() {
    const startBtn = document.getElementById('start-typing');
    const resetBtn = document.getElementById('reset-typing');
    const typingInput = document.getElementById('typing-input');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTypingGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTypingGame);
    }
    
    if (typingInput) {
        typingInput.addEventListener('input', handleTypingInput);
    }
    
    // Set initial text
    updateTypingText();
}

function updateTypingText() {
    const texts = [
        "Happy 18th birthday Fatima! May your code always compile on the first try.",
        "Birthdays are like software updates - they make you better with each version!",
        "Debugging life one birthday at a time. Wishing you infinite happiness!",
        "In the algorithm of life, you're the optimal solution. Happy birthday!",
        "May your special day be free of bugs and full of exceptional catches!"
    ];
    
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('text-to-type').textContent = randomText;
}

function startTypingGame() {
    if (typingGame.active) return;
    
    typingGame.active = true;
    typingGame.startTime = Date.now();
    typingGame.timeLeft = 60;
    typingGame.wordsTyped = 0;
    typingGame.totalWords = 0;
    typingGame.accuracy = 100;
    
    // Enable input
    const typingInput = document.getElementById('typing-input');
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();
    
    // Start timer
    typingGame.timer = setInterval(updateTypingTimer, 1000);
    
    // Update UI
    document.getElementById('start-typing').innerHTML = '<i class="fas fa-play"></i> Typing...';
    document.getElementById('reset-typing').innerHTML = '<i class="fas fa-stop"></i> Stop';
}

function updateTypingTimer() {
    typingGame.timeLeft--;
    document.getElementById('typing-time').textContent = typingGame.timeLeft;
    
    if (typingGame.timeLeft <= 0) {
        endTypingGame();
    }
}

function handleTypingInput(e) {
    if (!typingGame.active) return;
    
    const input = e.target.value;
    const targetText = document.getElementById('text-to-type').textContent;
    
    // Count words
    const words = input.trim().split(/\s+/).filter(word => word.length > 0);
    typingGame.wordsTyped = words.length;
    
    // Calculate accuracy
    let correctChars = 0;
    const minLength = Math.min(input.length, targetText.length);
    
    for (let i = 0; i < minLength; i++) {
        if (input[i] === targetText[i]) {
            correctChars++;
        }
    }
    
    typingGame.accuracy = minLength > 0 ? Math.round((correctChars / minLength) * 100) : 100;
    
    // Update UI
    document.getElementById('typing-words').textContent = typingGame.wordsTyped;
    document.getElementById('typing-accuracy').textContent = typingGame.accuracy + '%';
    
    // Calculate WPM (words per minute)
    const timeElapsed = (Date.now() - typingGame.startTime) / 1000 / 60; // in minutes
    const wpm = timeElapsed > 0 ? Math.round(typingGame.wordsTyped / timeElapsed) : 0;
    document.getElementById('typing-wpm').textContent = wpm;
    
    // Check if text is completed
    if (input === targetText) {
        endTypingGame();
        showNotification('Perfect typing! Text completed! 🎯', 'success');
    }
}

function endTypingGame() {
    if (!typingGame.active) return;
    
    typingGame.active = false;
    clearInterval(typingGame.timer);
    
    // Disable input
    document.getElementById('typing-input').disabled = true;
    
    // Calculate final WPM
    const timeElapsed = (Date.now() - typingGame.startTime) / 1000 / 60;
    const finalWPM = timeElapsed > 0 ? Math.round(typingGame.wordsTyped / timeElapsed) : 0;
    
    // Update UI
    document.getElementById('start-typing').innerHTML = '<i class="fas fa-play"></i> Start Typing';
    document.getElementById('reset-typing').innerHTML = '<i class="fas fa-redo"></i> Reset';
    
    // Show results
    showNotification(`Typing Complete! WPM: ${finalWPM}, Accuracy: ${typingGame.accuracy}%`, 'info');
    
    // Update text for next game
    updateTypingText();
}

function resetTypingGame() {
    endTypingGame();
    
    // Reset UI
    document.getElementById('typing-input').value = '';
    document.getElementById('typing-time').textContent = '60';
    document.getElementById('typing-words').textContent = '0';
    document.getElementById('typing-wpm').textContent = '0';
    document.getElementById('typing-accuracy').textContent = '100%';
}

// ===== REACTION GAME =====
function initializeReactionGame() {
    const startBtn = document.getElementById('start-reaction');
    const resetBtn = document.getElementById('reset-reaction');
    const reactionArea = document.getElementById('reaction-area');
    
    if (startBtn) {
        startBtn.addEventListener('click', startReactionTest);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetReactionStats);
    }
    
    if (reactionArea) {
        reactionArea.addEventListener('click', handleReactionClick);
    }
}

function startReactionTest() {
    if (reactionGame.waiting) return;
    
    const reactionArea = document.getElementById('reaction-area');
    const timerDisplay = document.querySelector('.reaction-timer');
    
    // Set to waiting state
    reactionGame.waiting = true;
    reactionArea.classList.add('waiting');
    timerDisplay.textContent = 'Wait...';
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
        if (!reactionGame.waiting) return;
        
        // Change to ready state
        reactionArea.classList.remove('waiting');
        reactionArea.classList.add('ready');
        timerDisplay.textContent = 'CLICK NOW!';
        reactionGame.startTime = Date.now();
    }, delay);
}

function handleReactionClick() {
    const reactionArea = document.getElementById('reaction-area');
    
    if (reactionArea.classList.contains('ready')) {
        // Calculate reaction time
        const reactionTime = (Date.now() - reactionGame.startTime) / 1000;
        
        // Store reaction time
        reactionGame.reactionTimes.push(reactionTime);
        reactionGame.attempts++;
        
        // Update best and average
        if (!reactionGame.bestTime || reactionTime < reactionGame.bestTime) {
            reactionGame.bestTime = reactionTime;
        }
        
        const sum = reactionGame.reactionTimes.reduce((a, b) => a + b, 0);
        reactionGame.averageTime = sum / reactionGame.reactionTimes.length;
        
        // Update UI
        document.getElementById('reaction-last').textContent = reactionTime.toFixed(2) + 's';
        document.getElementById('reaction-best').textContent = reactionGame.bestTime.toFixed(2) + 's';
        document.getElementById('reaction-avg').textContent = reactionGame.averageTime.toFixed(2) + 's';
        document.getElementById('reaction-attempts').textContent = reactionGame.attempts;
        
        // Reset for next attempt
        reactionGame.waiting = false;
        reactionArea.classList.remove('ready');
        document.querySelector('.reaction-timer').textContent = 'Click to Start';
        
        // Show feedback
        let feedback = '';
        if (reactionTime < 0.2) feedback = 'Superhuman! 🦸';
        else if (reactionTime < 0.3) feedback = 'Lightning fast! ⚡';
        else if (reactionTime < 0.4) feedback = 'Great reaction! 🎯';
        else if (reactionTime < 0.5) feedback = 'Good job! 👍';
        else feedback = 'Keep practicing! 💪';
        
        showNotification(`Reaction time: ${reactionTime.toFixed(2)}s - ${feedback}`, 'info');
        
    } else if (reactionArea.classList.contains('waiting')) {
        // Clicked too soon
        reactionGame.waiting = false;
        reactionArea.classList.remove('waiting');
        document.querySelector('.reaction-timer').textContent = 'Too Soon!';
        
        showNotification('Clicked too early! Wait for green.', 'warning');
        
        setTimeout(() => {
            document.querySelector('.reaction-timer').textContent = 'Click to Start';
        }, 1000);
    } else {
        // Start new test
        startReactionTest();
    }
}

function resetReactionStats() {
    reactionGame.reactionTimes = [];
    reactionGame.bestTime = null;
    reactionGame.averageTime = null;
    reactionGame.attempts = 0;
    
    // Update UI
    document.getElementById('reaction-last').textContent = '0.00s';
    document.getElementById('reaction-best').textContent = '0.00s';
    document.getElementById('reaction-avg').textContent = '0.00s';
    document.getElementById('reaction-attempts').textContent = '0';
    
    showNotification('Reaction stats cleared', 'info');
}

// ===== CLICK GAME =====
function initializeClickGame() {
    const startBtn = document.getElementById('start-click');
    const resetBtn = document.getElementById('reset-click');
    const clickArea = document.getElementById('click-area');
    
    if (startBtn) {
        startBtn.addEventListener('click', startClickGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetClickScores);
    }
    
    if (clickArea) {
        clickArea.addEventListener('click', handleClick);
    }
    
    // Load saved scores
    const savedScores = localStorage.getItem('clickHighScores');
    if (savedScores) {
        clickGame.highScores = JSON.parse(savedScores);
        updateClickLeaderboard();
    }
}

function startClickGame() {
    if (clickGame.active) return;
    
    clickGame.active = true;
    clickGame.clicks = 0;
    clickGame.timeLeft = 10;
    
    // Update UI
    document.getElementById('start-click').innerHTML = '<i class="fas fa-play"></i> Clicking...';
    document.getElementById('click-count').textContent = '0';
    document.getElementById('click-timer').textContent = '10';
    
    // Start timer
    clickGame.timer = setInterval(updateClickTimer, 1000);
    
    // Calculate CPS every second
    clickGame.clickTimer = setInterval(updateCPS, 1000);
}

function updateClickTimer() {
    clickGame.timeLeft--;
    document.getElementById('click-timer').textContent = clickGame.timeLeft;
    
    if (clickGame.timeLeft <= 0) {
        endClickGame();
    }
}

function updateCPS() {
    if (!clickGame.active) return;
    
    const cps = Math.round(clickGame.clicks / (10 - clickGame.timeLeft) * 10) / 10;
    document.getElementById('click-cps').textContent = cps;
}

function handleClick() {
    if (!clickGame.active) return;
    
    clickGame.clicks++;
    document.getElementById('click-count').textContent = clickGame.clicks;
    
    // Visual feedback
    const clickArea = document.getElementById('click-area');
    clickArea.style.transform = 'scale(0.98)';
    setTimeout(() => {
        clickArea.style.transform = 'scale(1)';
    }, 100);
}

function endClickGame() {
    if (!clickGame.active) return;
    
    clickGame.active = false;
    clearInterval(clickGame.timer);
    clearInterval(clickGame.clickTimer);
    
    // Update UI
    document.getElementById('start-click').innerHTML = '<i class="fas fa-play"></i> Start Clicking';
    document.getElementById('click-timer').textContent = '10';
    document.getElementById('click-cps').textContent = '0';
    
    // Calculate final CPS
    const finalCPS = Math.round(clickGame.clicks / 10 * 10) / 10;
    
    // Update high scores
    updateHighScores(clickGame.clicks);
    
    // Show results
    showNotification(`Click Challenge Complete! ${clickGame.clicks} clicks (${finalCPS} CPS)`, 'info');
    
    // Celebration for good scores
    if (clickGame.clicks > 50) {
        launchConfetti();
    }
}

function updateHighScores(score) {
    clickGame.highScores.push(score);
    clickGame.highScores.sort((a, b) => b - a);
    clickGame.highScores = clickGame.highScores.slice(0, 3);
    
    // Update high score display
    document.getElementById('click-highscore').textContent = clickGame.highScores[0];
    
    // Update leaderboard
    updateClickLeaderboard();
    
    // Save to localStorage
    localStorage.setItem('clickHighScores', JSON.stringify(clickGame.highScores));
}

function updateClickLeaderboard() {
    const scoresList = document.getElementById('click-scores');
    scoresList.innerHTML = '';
    
    clickGame.highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${score} clicks`;
        scoresList.appendChild(li);
    });
}

function resetClickScores() {
    clickGame.highScores = [0, 0, 0];
    updateClickLeaderboard();
    localStorage.removeItem('clickHighScores');
    
    showNotification('High scores cleared', 'info');
}

function resetGames() {
    resetMemoryGame();
    resetTypingGame();
    resetReactionStats();
}

// ===== QUIZ SYSTEM =====
function initializeQuiz() {
    // Quiz navigation buttons
    document.getElementById('prev-question')?.addEventListener('click', showPreviousQuestion);
    document.getElementById('next-question')?.addEventListener('click', showNextQuestion);
    document.getElementById('submit-quiz')?.addEventListener('click', submitQuiz);
    document.getElementById('restart-quiz')?.addEventListener('click', startNewQuiz);
    document.getElementById('share-quiz')?.addEventListener('click', shareQuizResults);
    
    // Initialize quiz database
    initializeQuizDatabase();
}

function initializeQuizDatabase() {
    // Python Basics (10 questions)
    const pythonBasics = [
        {
            topic: "Python Basics",
            question: "Which keyword is used to define a function in Python?",
            options: ["def", "function", "define", "func"],
            correct: 0,
            explanation: "The 'def' keyword is used to define functions. Example: def my_function():"
        },
        {
            topic: "Python Basics",
            question: "How do you create a list in Python?",
            options: ["[]", "()", "{}", "<>"],
            correct: 0,
            explanation: "Square brackets [] create lists. Example: my_list = [1, 2, 3]"
        },
        {
            topic: "Python Basics",
            question: "Which method removes whitespace from both ends of a string?",
            options: ["strip()", "trim()", "clean()", "remove()"],
            correct: 0,
            explanation: "strip() removes whitespace from both ends. lstrip() and rstrip() remove from left/right only."
        },
        {
            topic: "Python Basics",
            question: "What is the output of: print(2 ** 3)?",
            options: ["8", "6", "9", "23"],
            correct: 0,
            explanation: "** is the exponentiation operator. 2 ** 3 means 2 raised to the power of 3, which is 8."
        },
        {
            topic: "Python Basics",
            question: "Which loop goes through a sequence in Python?",
            options: ["for loop", "while loop", "do-while loop", "repeat loop"],
            correct: 0,
            explanation: "for loop iterates through sequences. Python doesn't have do-while or repeat loops."
        },
        {
            topic: "Python Basics",
            question: "How do you get the length of a list?",
            options: ["len(list)", "list.length", "list.size", "length(list)"],
            correct: 0,
            explanation: "len() is a built-in function that works with lists, strings, tuples, etc."
        },
        {
            topic: "Python Basics",
            question: "Which data type is mutable?",
            options: ["List", "Tuple", "String", "Integer"],
            correct: 0,
            explanation: "Lists are mutable (can be changed). Tuples and strings are immutable."
        },
        {
            topic: "Python Basics",
            question: "What does // operator do?",
            options: ["Integer division", "Float division", "Modulus", "Exponentiation"],
            correct: 0,
            explanation: "// performs floor division (integer division). / performs float division."
        },
        {
            topic: "Python Basics",
            question: "How do you convert to integer?",
            options: ["int()", "Integer()", "toInt()", "parseInt()"],
            correct: 0,
            explanation: "int() converts strings/floats to integers. float() and str() are similar."
        },
        {
            topic: "Python Basics",
            question: "What does range(5) generate?",
            options: ["0,1,2,3,4", "1,2,3,4,5", "0,1,2,3,4,5", "5 numbers starting from 1"],
            correct: 0,
            explanation: "range(5) generates 0-4. range(1,6) would generate 1-5."
        }
    ];
    
    // Python OOP (12 questions)
    const pythonOOP = [
        {
            topic: "Python OOP",
            question: "Which method is the constructor?",
            options: ["__init__", "__new__", "__start__", "__create__"],
            correct: 0,
            explanation: "__init__ initializes new objects. __new__ actually creates them (less common)."
        },
        {
            topic: "Python OOP",
            question: "What does 'self' represent?",
            options: ["Current instance", "The class", "Parent class", "Global object"],
            correct: 0,
            explanation: "'self' refers to the instance calling the method (like 'this' in other languages)."
        },
        {
            topic: "Python OOP",
            question: "How do you create a class?",
            options: ["class MyClass:", "class MyClass()", "class MyClass{}", "MyClass class"],
            correct: 0,
            explanation: "Syntax: 'class ClassName:' Parentheses only needed for inheritance."
        },
        {
            topic: "Python OOP",
            question: "Which is used for inheritance?",
            options: ["class Child(Parent):", "extends Parent", "inherits Parent", "Child : Parent"],
            correct: 0,
            explanation: "Python uses parentheses: class Child(Parent, AnotherParent):"
        },
        {
            topic: "Python OOP",
            question: "How do you call a parent method?",
            options: ["super().method()", "parent.method()", "self.parent()", "Parent.method()"],
            correct: 0,
            explanation: "super() gives access to parent class methods. Essential for method overriding."
        },
        {
            topic: "Python OOP",
            question: "What is encapsulation?",
            options: ["Bundling data/methods", "Multiple inheritance", "Method overloading", "Dynamic typing"],
            correct: 0,
            explanation: "Encapsulation hides implementation details and groups related code."
        },
        {
            topic: "Python OOP",
            question: "How to make a private attribute?",
            options: ["__attribute", "_attribute", "private attribute", "#attribute"],
            correct: 0,
            explanation: "Double underscore __ makes it name-mangled. Single underscore _ is convention."
        },
        {
            topic: "Python OOP",
            question: "What is polymorphism?",
            options: ["Same interface, different implementation", "Hiding complexity", "Inheritance chain", "Data binding"],
            correct: 0,
            explanation: "Polymorphism allows objects of different types to respond to same method."
        },
        {
            topic: "Python OOP",
            question: "Which is a magic method?",
            options: ["__str__", "__magic__", "__special__", "__method__"],
            correct: 0,
            explanation: "Magic methods have double underscores. __str__ defines string representation."
        },
        {
            topic: "Python OOP",
            question: "What does @staticmethod do?",
            options: ["Defines static method", "Defines class method", "Defines private method", "Defines abstract method"],
            correct: 0,
            explanation: "@staticmethod doesn't receive self or cls. Used for utility functions."
        },
        {
            topic: "Python OOP",
            question: "What is method overriding?",
            options: ["Redefining parent method", "Creating new method", "Hiding method", "Deleting method"],
            correct: 0,
            explanation: "Child class provides specific implementation of parent's method."
        },
        {
            topic: "Python OOP",
            question: "What is the purpose of __str__ method?",
            options: ["String representation", "Initialization", "Destruction", "Comparison"],
            correct: 0,
            explanation: "__str__ returns a string representation of the object, used by print() and str()."
        }
    ];
    
    // C++ Basics (11 questions)
    const cppBasics = [
        {
            topic: "C++ Basics",
            question: "Which operator declares a pointer?",
            options: ["*", "&", "->", "::"],
            correct: 0,
            explanation: "* declares a pointer. & gets address. -> accesses members through pointer."
        },
        {
            topic: "C++ Basics",
            question: "How to output in C++?",
            options: ["cout <<", "print()", "System.out.println", "console.log"],
            correct: 0,
            explanation: "cout with << operator. Requires #include <iostream> and using namespace std;"
        },
        {
            topic: "C++ Basics",
            question: "Which is correct main function?",
            options: ["int main()", "void main()", "main()", "function main()"],
            correct: 0,
            explanation: "int main() is standard. Returns 0 for success, non-zero for error."
        },
        {
            topic: "C++ Basics",
            question: "What does #include do?",
            options: ["Includes header file", "Imports library", "Links library", "Defines macro"],
            correct: 0,
            explanation: "#include copies header file contents. Example: #include <iostream>"
        },
        {
            topic: "C++ Basics",
            question: "How to allocate memory dynamically?",
            options: ["new", "malloc", "alloc", "create"],
            correct: 0,
            explanation: "new allocates memory, returns pointer. delete frees it. C++ style, not malloc."
        },
        {
            topic: "C++ Basics",
            question: "Which is a reference?",
            options: ["int& x", "int* x", "int x", "ref int x"],
            correct: 0,
            explanation: "& after type creates reference (alias for variable). Must be initialized."
        },
        {
            topic: "C++ Basics",
            question: "What is :: operator?",
            options: ["Scope resolution", "Pointer access", "Reference", "Namespace"],
            correct: 0,
            explanation: ":: accesses global scope or class members. Example: std::cout, Class::method()"
        },
        {
            topic: "C++ Basics",
            question: "How to create a class?",
            options: ["class MyClass {}", "class MyClass:", "MyClass class {}", "class: MyClass"],
            correct: 0,
            explanation: "C++ uses braces {} and semicolon after class definition."
        },
        {
            topic: "C++ Basics",
            question: "What is cin?",
            options: ["Standard input", "Standard output", "Console input", "Character input"],
            correct: 0,
            explanation: "cin with >> operator reads input. Example: cin >> variable;"
        },
        {
            topic: "C++ Basics",
            question: "Which loop is NOT in C++?",
            options: ["for...in", "for", "while", "do...while"],
            correct: 0,
            explanation: "C++ has for, while, do...while. for...in is from Python/JavaScript."
        },
        {
            topic: "C++ Basics",
            question: "What does const do?",
            options: ["Makes variable immutable", "Declares constant", "Defines function", "Creates reference"],
            correct: 0,
            explanation: "const makes variable read-only. Must be initialized. Example: const int x = 5;"
        }
    ];
    
    // Combine all questions
    quizQuestions = [...pythonBasics, ...pythonOOP, ...cppBasics];
}

function startNewQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    quizStarted = true;
    
    // Shuffle questions
    shuffleArray(quizQuestions);
    
    // Update UI
    document.getElementById('quiz-results').style.display = 'none';
    document.querySelector('.quiz-body').style.display = 'block';
    document.querySelector('.quiz-footer').style.display = 'flex';
    
    // Display first question
    displayQuestion();
    
    // Reset stats
    updateQuizStats();
    
    showNotification('New quiz started! 33 questions await!', 'info');
}

function displayQuestion() {
    if (quizQuestions.length === 0 || currentQuestionIndex >= quizQuestions.length) {
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    
    // Update UI elements
    document.getElementById('topic-badge').textContent = question.topic;
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('total-q').textContent = quizQuestions.length;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('quiz-score').textContent = userScore;
    
    // Display options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'quiz-option';
        optionBtn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${option}`;
        optionBtn.dataset.index = index;
        
        // Mark if previously answered
        if (userAnswers[currentQuestionIndex] === index) {
            optionBtn.classList.add('selected');
            if (index === question.correct) {
                optionBtn.classList.add('correct');
            } else {
                optionBtn.classList.add('incorrect');
            }
        }
        
        optionBtn.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionBtn);
    });
    
    // Update explanation
    if (userAnswers[currentQuestionIndex] !== null) {
        document.getElementById('explanation-text').textContent = question.explanation;
    } else {
        document.getElementById('explanation-text').textContent = "Select an answer to see explanation";
    }
    
    // Update button states
    updateQuizButtons();
}

function selectAnswer(selectedIndex) {
    if (userAnswers[currentQuestionIndex] !== null) return; // Already answered
    
    const question = quizQuestions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Update score if correct
    if (selectedIndex === question.correct) {
        userScore++;
    }
    
    // Update UI
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, index) => {
        if (index === selectedIndex) {
            opt.classList.add('selected');
        }
        if (index === question.correct) {
            opt.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            opt.classList.add('incorrect');
        }
    });
    
    // Show explanation
    document.getElementById('explanation-text').textContent = question.explanation;
    document.getElementById('quiz-score').textContent = userScore;
    
    // Update stats
    updateQuizStats();
    
    // Auto-advance after delay
    setTimeout(showNextQuestion, 1500);
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        // Last question - suggest submission
        showNotification('Last question! Click "Submit Quiz" to finish.', 'info');
    }
}

function updateQuizButtons() {
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
        prevBtn.style.opacity = currentQuestionIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
        nextBtn.textContent = isLastQuestion ? 'Last Question' : 'Next';
        nextBtn.innerHTML = isLastQuestion ? 
            'Last Question <i class="fas fa-flag-checkered"></i>' : 
            'Next <i class="fas fa-arrow-right"></i>';
    }
}

function updateQuizStats() {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    
    userAnswers.forEach((answer, index) => {
        if (answer === null) {
            skipped++;
        } else if (answer === quizQuestions[index]?.correct) {
            correct++;
        } else {
            wrong++;
        }
    });
    
    document.getElementById('stat-correct').textContent = correct;
    document.getElementById('stat-wrong').textContent = wrong;
    document.getElementById('stat-skipped').textContent = skipped;
}

function submitQuiz() {
    // Calculate final score
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    
    // Calculate breakdown by topic
    let pythonBasicsScore = 0;
    let pythonOOPScore = 0;
    let cppBasicsScore = 0;
    let pythonBasicsTotal = 0;
    let pythonOOPTotal = 0;
    let cppBasicsTotal = 0;
    
    userAnswers.forEach((answer, index) => {
        const question = quizQuestions[index];
        if (!question) return;
        
        // Count by topic
        if (question.topic === "Python Basics") {
            pythonBasicsTotal++;
            if (answer === question.correct) pythonBasicsScore++;
        } else if (question.topic === "Python OOP") {
            pythonOOPTotal++;
            if (answer === question.correct) pythonOOPScore++;
        } else if (question.topic === "C++ Basics") {
            cppBasicsTotal++;
            if (answer === question.correct) cppBasicsScore++;
        }
        
        // Overall counts
        if (answer === null) {
            skipped++;
        } else if (answer === question.correct) {
            correct++;
        } else {
            wrong++;
        }
    });
    
    userScore = correct;
    
    // Show results
    document.getElementById('final-score').textContent = userScore;
    document.getElementById('max-score').textContent = quizQuestions.length;
    document.getElementById('breakdown-python').textContent = `${pythonBasicsScore}/${pythonBasicsTotal}`;
    document.getElementById('breakdown-oop').textContent = `${pythonOOPScore}/${pythonOOPTotal}`;
    document.getElementById('breakdown-cpp').textContent = `${cppBasicsScore}/${cppBasicsTotal}`;
    
    // Generate result message
    let message = "";
    const percentage = (userScore / quizQuestions.length) * 100;
    
    if (percentage >= 90) {
        message = "🏆 OUTSTANDING! You're a programming genius! Fatima would be so impressed!";
    } else if (percentage >= 80) {
        message = "🎯 EXCELLENT! Strong CS fundamentals! You really know your stuff!";
    } else if (percentage >= 70) {
        message = "👍 GREAT JOB! Solid understanding of programming concepts!";
    } else if (percentage >= 60) {
        message = "💡 GOOD EFFORT! Keep practicing and you'll master it!";
    } else if (percentage >= 50) {
        message = "🌟 NOT BAD! The journey of a thousand codes begins with a single variable!";
    } else {
        message = "📚 KEEP LEARNING! Every expert was once a beginner. Don't give up!";
    }
    
    document.getElementById('result-message').textContent = message;
    
    // Show results container
    document.getElementById('quiz-results').style.display = 'block';
    document.querySelector('.quiz-body').style.display = 'none';
    document.querySelector('.quiz-footer').style.display = 'none';
    
    // Launch confetti for good scores
    if (percentage >= 70) {
        setTimeout(() => {
            launchConfetti();
        }, 500);
    }
    
    // Play celebration sound for high scores
    if (percentage >= 80 && audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log("Audio play blocked"));
    }
    
    showNotification(`Quiz submitted! Score: ${userScore}/${quizQuestions.length} (${percentage.toFixed(1)}%)`, 'success');
}

function shareQuizResults() {
    const percentage = (userScore / quizQuestions.length) * 100;
    const shareText = `I scored ${userScore}/${quizQuestions.length} (${percentage.toFixed(1)}%) on Fatima's CS Birthday Quiz! 🎂💻`;
    
    if (navigator.share) {
        navigator.share({
            title: 'CS Birthday Quiz Results',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText)
            .then(() => showNotification('Results copied to clipboard! 📋', 'success'))
            .catch(() => showNotification('Failed to copy results', 'warning'));
    }
}

// ===== WISH SYSTEM =====
function initializeWishSystem() {
    const wishBtn = document.getElementById('submit-wish');
    const wishInput = document.getElementById('wish-input');
    
    if (wishBtn && wishInput) {
        wishBtn.addEventListener('click', submitWish);
        wishInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitWish();
            }
        });
    }
    
    // Birthday wish button
    document.getElementById('wish-btn')?.addEventListener('click', function() {
        showSection('message');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('a[href="#message"]').classList.add('active');
        
        // Focus on wish input
        setTimeout(() => {
            const wishInput = document.getElementById('wish-input');
            if (wishInput) {
                wishInput.focus();
            }
        }, 500);
    });
}

function submitWish() {
    const wishInput = document.getElementById('wish-input');
    const wishText = wishInput.value.trim();
    
    if (!wishText) {
        showNotification('Please enter a birthday wish!', 'warning');
        return;
    }
    
    // Create wish item
    const wishWall = document.getElementById('wish-wall');
    const wishItem = document.createElement('div');
    wishItem.className = 'wish-item';
    wishItem.innerHTML = `
        <p>${wishText}</p>
        <span class="wish-author">– Ali Madad</span>
    `;
    
    // Add to top of wish wall
    wishWall.insertBefore(wishItem, wishWall.firstChild);
    
    // Clear input
    wishInput.value = '';
    
    // Show success message
    showNotification('Birthday wish added! 🎉', 'success');
    
    // Launch confetti
    launchConfetti();
}

// ===== UTILITY FUNCTIONS =====
function loadPreferences() {
    // Load theme preference
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        enableDarkTheme();
    }
    
    // Load music preference
    const music = localStorage.getItem('musicEnabled');
    if (music === 'true') {
        musicEnabled = true;
    }
    
    // Load click game scores
    const scores = localStorage.getItem('clickHighScores');
    if (scores) {
        clickGame.highScores = JSON.parse(scores);
        updateClickLeaderboard();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        max-width: 400px;
    `;
    
    // Add styles for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'warning': return '#FF9800';
        case 'error': return '#F44336';
        default: return '#2196F3';
    }
}

// ===== GALLERY CONTROLS =====
document.getElementById('prev-img')?.addEventListener('click', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const firstItem = galleryItems[0];
    const lastItem = galleryItems[galleryItems.length - 1];
    
    // Move last item to beginning
    firstItem.parentNode.insertBefore(lastItem, firstItem);
    
    // Add animation
    lastItem.style.animation = 'slideInRight 0.5s ease';
    setTimeout(() => {
        lastItem.style.animation = '';
    }, 500);
});

document.getElementById('next-img')?.addEventListener('click', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const firstItem = galleryItems[0];
    
    // Move first item to end
    firstItem.parentNode.appendChild(firstItem);
    
    // Add animation
    firstItem.style.animation = 'slideInLeft 0.5s ease';
    setTimeout(() => {
        firstItem.style.animation = '';
    }, 500);
});

// Add slide animations to CSS
const slideAnimations = document.createElement('style');
slideAnimations.textContent = `
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(slideAnimations);

// ===== FINAL INITIALIZATION =====
console.log("All systems initialized! 🚀");
console.log("🎂 Happy Birthday Fatima! 🎉");
