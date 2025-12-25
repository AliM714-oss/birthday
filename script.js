// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎂 Birthday website loaded!");
    
    // Initialize all systems
    initNavigation();
    initMusic();
    initTheme();
    initConfetti();
    initGames();
    initQuiz();
    
    // Show home section
    showSection('home');
});

// ===== NAVIGATION =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            showSection(targetId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        // Scroll to section
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// ===== MUSIC PLAYER (FIXED) =====
function initMusic() {
    const musicBtn = document.getElementById('music-toggle');
    
    if (!musicBtn) return;
    
    // Create audio element
    const audio = new Audio('assets/birthday-music.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    
    let isPlaying = false;
    
    // Load saved preference
    const savedState = localStorage.getItem('musicEnabled');
    if (savedState === 'true') {
        isPlaying = true;
        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Music</span>';
    }
    
    musicBtn.addEventListener('click', function() {
        if (!isPlaying) {
            // User clicked - browser allows playback now
            audio.play()
                .then(() => {
                    isPlaying = true;
                    this.innerHTML = '<i class="fas fa-volume-up"></i><span>Music</span>';
                    localStorage.setItem('musicEnabled', 'true');
                    console.log("🎵 Music started successfully!");
                })
                .catch(error => {
                    console.error("Music play failed:", error);
                    this.innerHTML = '<i class="fas fa-music"></i><span>Click Again</span>';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-music"></i><span>Music</span>';
                    }, 2000);
                });
        } else {
            audio.pause();
            isPlaying = false;
            this.innerHTML = '<i class="fas fa-music"></i><span>Music</span>';
            localStorage.setItem('musicEnabled', 'false');
        }
    });
}

// ===== THEME TOGGLE =====
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    
    if (!themeBtn) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i><span>Light</span>';
    }
    
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            this.innerHTML = '<i class="fas fa-sun"></i><span>Light</span>';
            localStorage.setItem('theme', 'dark');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i><span>Dark</span>';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== CONFETTI =====
function initConfetti() {
    const confettiBtn = document.getElementById('confetti-btn');
    
    if (confettiBtn) {
        confettiBtn.addEventListener('click', function() {
            // Multiple confetti bursts
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
            
            // Button feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// ===== GAMES =====
function initGames() {
    // Click Game
    initClickGame();
    
    // Reaction Game
    initReactionGame();
}

// Click Game Variables
let clickGame = {
    active: false,
    clicks: 0,
    timeLeft: 10,
    timer: null,
    bestScore: 0,
    cps: 0
};

function initClickGame() {
    const startBtn = document.getElementById('start-click');
    const resetBtn = document.getElementById('reset-click');
    const clickArea = document.querySelector('.game-display');
    
    // Load best score
    const savedBest = localStorage.getItem('clickBestScore');
    if (savedBest) {
        clickGame.bestScore = parseInt(savedBest);
        document.getElementById('click-best').textContent = savedBest;
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startClickGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetClickGame);
    }
    
    if (clickArea) {
        clickArea.addEventListener('click', handleClick);
    }
}

function startClickGame() {
    if (clickGame.active) return;
    
    clickGame.active = true;
    clickGame.clicks = 0;
    clickGame.timeLeft = 10;
    clickGame.cps = 0;
    
    // Update UI
    document.getElementById('start-click').innerHTML = '<i class="fas fa-play"></i> Clicking...';
    document.getElementById('click-count').textContent = '0';
    document.getElementById('click-timer').textContent = '10';
    document.getElementById('click-cps').textContent = '0';
    
    // Start timer
    clickGame.timer = setInterval(updateClickTimer, 1000);
}

function updateClickTimer() {
    clickGame.timeLeft--;
    document.getElementById('click-timer').textContent = clickGame.timeLeft;
    
    // Calculate CPS
    if (clickGame.timeLeft < 10) {
        const secondsPassed = 10 - clickGame.timeLeft;
        clickGame.cps = (clickGame.clicks / secondsPassed).toFixed(1);
        document.getElementById('click-cps').textContent = clickGame.cps;
    }
    
    if (clickGame.timeLeft <= 0) {
        endClickGame();
    }
}

function handleClick() {
    if (!clickGame.active) return;
    
    clickGame.clicks++;
    document.getElementById('click-count').textContent = clickGame.clicks;
    
    // Visual feedback
    const clickCounter = document.querySelector('.click-counter h2');
    clickCounter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        clickCounter.style.transform = 'scale(1)';
    }, 100);
}

function endClickGame() {
    clearInterval(clickGame.timer);
    clickGame.active = false;
    
    // Update UI
    document.getElementById('start-click').innerHTML = '<i class="fas fa-play"></i> Start';
    
    // Update best score
    if (clickGame.clicks > clickGame.bestScore) {
        clickGame.bestScore = clickGame.clicks;
        document.getElementById('click-best').textContent = clickGame.bestScore;
        localStorage.setItem('clickBestScore', clickGame.bestScore);
        
        // Celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    // Show result
    alert(`Click Challenge Complete!\n\nClicks: ${clickGame.clicks}\nCPS: ${clickGame.cps}\nBest: ${clickGame.bestScore}`);
}

function resetClickGame() {
    clickGame.bestScore = 0;
    document.getElementById('click-best').textContent = '0';
    localStorage.removeItem('clickBestScore');
}

// Reaction Game Variables
let reactionGame = {
    waiting: false,
    startTime: null,
    reactionTimes: [],
    bestTime: null,
    averageTime: null
};

function initReactionGame() {
    const startBtn = document.getElementById('start-reaction');
    const resetBtn = document.getElementById('reset-reaction');
    const reactionArea = document.getElementById('reaction-area');
    
    // Load saved stats
    const savedStats = localStorage.getItem('reactionStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        reactionGame.bestTime = stats.bestTime;
        reactionGame.averageTime = stats.averageTime;
        reactionGame.reactionTimes = stats.reactionTimes || [];
        
        if (reactionGame.bestTime) {
            document.getElementById('reaction-best').textContent = reactionGame.bestTime.toFixed(2) + 's';
        }
        if (reactionGame.averageTime) {
            document.getElementById('reaction-avg').textContent = reactionGame.averageTime.toFixed(2) + 's';
        }
    }
    
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
    const reactionText = document.getElementById('reaction-text');
    
    // Set to waiting state
    reactionGame.waiting = true;
    reactionArea.classList.add('waiting');
    reactionText.textContent = 'Wait for green...';
    document.getElementById('reaction-time').textContent = '0.00s';
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
        if (!reactionGame.waiting) return;
        
        // Change to ready state
        reactionArea.classList.remove('waiting');
        reactionArea.classList.add('ready');
        reactionText.textContent = 'CLICK NOW!';
        reactionGame.startTime = Date.now();
    }, delay);
}

function handleReactionClick() {
    const reactionArea = document.getElementById('reaction-area');
    
    if (reactionArea.classList.contains('ready')) {
        // Calculate reaction time
        const reactionTime = (Date.now() - reactionGame.startTime) / 1000;
        
        // Update display
        document.getElementById('reaction-time').textContent = reactionTime.toFixed(2) + 's';
        
        // Store reaction time
        reactionGame.reactionTimes.push(reactionTime);
        
        // Update best time
        if (!reactionGame.bestTime || reactionTime < reactionGame.bestTime) {
            reactionGame.bestTime = reactionTime;
            document.getElementById('reaction-best').textContent = reactionGame.bestTime.toFixed(2) + 's';
        }
        
        // Calculate average
        const sum = reactionGame.reactionTimes.reduce((a, b) => a + b, 0);
        reactionGame.averageTime = sum / reactionGame.reactionTimes.length;
        document.getElementById('reaction-avg').textContent = reactionGame.averageTime.toFixed(2) + 's';
        
        // Save stats
        localStorage.setItem('reactionStats', JSON.stringify({
            bestTime: reactionGame.bestTime,
            averageTime: reactionGame.averageTime,
            reactionTimes: reactionGame.reactionTimes.slice(-20) // Keep last 20 attempts
        }));
        
        // Reset for next attempt
        reactionGame.waiting = false;
        reactionArea.classList.remove('ready');
        document.getElementById('reaction-text').textContent = 'Click to Start';
        
        // Show feedback
        let feedback = '';
        if (reactionTime < 0.2) feedback = 'Superhuman! 🦸';
        else if (reactionTime < 0.3) feedback = 'Lightning fast! ⚡';
        else if (reactionTime < 0.4) feedback = 'Great reaction! 🎯';
        else if (reactionTime < 0.5) feedback = 'Good job! 👍';
        else feedback = 'Keep practicing! 💪';
        
        alert(`Reaction time: ${reactionTime.toFixed(2)}s\n${feedback}`);
        
    } else if (reactionArea.classList.contains('waiting')) {
        // Clicked too soon
        reactionGame.waiting = false;
        reactionArea.classList.remove('waiting');
        document.getElementById('reaction-text').textContent = 'Too Soon!';
        
        setTimeout(() => {
            document.getElementById('reaction-text').textContent = 'Click to Start';
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
    
    document.getElementById('reaction-best').textContent = '0.00s';
    document.getElementById('reaction-avg').textContent = '0.00s';
    document.getElementById('reaction-time').textContent = '0.00s';
    
    localStorage.removeItem('reactionStats');
    
    alert('Reaction stats cleared!');
}

// ===== QUIZ SYSTEM =====
const quizQuestions = [
    // Python Basics
    {
        topic: "Python Basics",
        question: "Which keyword defines a function in Python?",
        options: ["def", "function", "define", "func"],
        correct: 0,
        explanation: "The 'def' keyword is used to define functions."
    },
    {
        topic: "Python Basics",
        question: "How do you create a list?",
        options: ["[]", "()", "{}", "<>"],
        correct: 0,
        explanation: "Square brackets [] create lists."
    },
    {
        topic: "Python Basics",
        question: "Which method removes string whitespace?",
        options: ["strip()", "trim()", "clean()", "remove()"],
        correct: 0,
        explanation: "strip() removes whitespace from both ends."
    },
    {
        topic: "Python Basics",
        question: "What does ** operator do?",
        options: ["Exponentiation", "Multiplication", "Comment", "Division"],
        correct: 0,
        explanation: "** is the exponentiation operator."
    },
    // Python OOP
    {
        topic: "Python OOP",
        question: "Which method is the constructor?",
        options: ["__init__", "__new__", "__start__", "__create__"],
        correct: 0,
        explanation: "__init__ initializes new objects."
    },
    {
        topic: "Python OOP",
        question: "What does 'self' represent?",
        options: ["Current instance", "The class", "Parent class", "Global object"],
        correct: 0,
        explanation: "'self' refers to the instance."
    },
    {
        topic: "Python OOP",
        question: "How do you create a class?",
        options: ["class MyClass:", "class MyClass()", "class MyClass{}", "MyClass class"],
        correct: 0,
        explanation: "Syntax: 'class ClassName:'"
    },
    // C++ Basics
    {
        topic: "C++ Basics",
        question: "Which operator declares a pointer?",
        options: ["*", "&", "->", "::"],
        correct: 0,
        explanation: "* declares a pointer."
    },
    {
        topic: "C++ Basics",
        question: "How to output in C++?",
        options: ["cout <<", "print()", "System.out.println", "console.log"],
        correct: 0,
        explanation: "cout with << operator."
    },
    {
        topic: "C++ Basics",
        question: "Which is correct main function?",
        options: ["int main()", "void main()", "main()", "function main()"],
        correct: 0,
        explanation: "int main() is standard."
    }
];

let currentQuestionIndex = 0;
let quizScore = 0;
let userAnswers = [];

function initQuiz() {
    // Initialize quiz
    shuffleQuestions();
    displayQuestion();
    
    // Setup navigation
    document.getElementById('prev-btn')?.addEventListener('click', showPreviousQuestion);
    document.getElementById('next-btn')?.addEventListener('click', showNextQuestion);
}

function shuffleQuestions() {
    // Create a copy and shuffle
    const shuffled = [...quizQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Use first 10 questions
    return shuffled.slice(0, 10);
}

function displayQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) return;
    
    const question = quizQuestions[currentQuestionIndex];
    
    // Update UI
    document.getElementById('topic-badge').textContent = question.topic;
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('total-q').textContent = quizQuestions.length;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('quiz-score').textContent = quizScore;
    
    // Display options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'quiz-option';
        optionBtn.innerHTML = `${String.fromCharCode(65 + index)}. ${option}`;
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
    
    // Update button states
    updateQuizButtons();
}

function selectAnswer(selectedIndex) {
    if (userAnswers[currentQuestionIndex] !== undefined) return;
    
    const question = quizQuestions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Update score
    if (selectedIndex === question.correct) {
        quizScore++;
    }
    
    // Update UI
    document.getElementById('quiz-score').textContent = quizScore;
    
    // Mark options
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
    
    // Auto-advance after delay
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 1000);
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
        endQuiz();
    }
}

function updateQuizButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next';
    }
}

function endQuiz() {
    const percentage = (quizScore / quizQuestions.length) * 100;
    
    let message = "";
    if (percentage >= 90) message = "🏆 Outstanding! Programming genius!";
    else if (percentage >= 80) message = "🎯 Excellent! Strong CS fundamentals!";
    else if (percentage >= 70) message = "👍 Great job! Solid understanding!";
    else if (percentage >= 60) message = "💡 Good effort! Keep practicing!";
    else message = "🌟 The learning journey continues!";
    
    alert(`Quiz Complete!\n\nScore: ${quizScore}/${quizQuestions.length} (${percentage.toFixed(1)}%)\n\n${message}`);
    
    // Celebration for good scores
    if (percentage >= 70) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}
