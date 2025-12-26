// ===== GLOBAL VARIABLES =====
let currentSection = 'home';
let isDarkTheme = false;
let audioElement = null;
let isMusicPlaying = false;

// Quiz variables
let quizQuestions = [];
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];
let quizStarted = false;

// Game variables
let clickGame = {
    active: false,
    clicks: 0,
    timeLeft: 10,
    timer: null,
    highScores: [0, 0, 0],
    clickTimer: null
};

let reactionGame = {
    waiting: false,
    startTime: null,
    reactionTimes: [],
    bestTime: null,
    averageTime: null,
    attempts: 0
};

// ===== WELCOME SYSTEM =====
// ===== SIMPLE WELCOME POPUP =====
function initializeWelcomeSystem() {
    console.log("🎉 Welcome system initializing...");
    
    // Wait 1 second for page to load
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
            popup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Launch gentle confetti
            setTimeout(() => {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 80,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#6c63ff', '#ff6584', '#36d1dc']
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
                        spread: 60,
                        origin: { y: 0.6 }
                    });
                }
            }, 800);
        }
        
        // Setup close buttons
        document.querySelectorAll('.close-popup, .close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                popup.classList.remove('active');
                document.body.style.overflow = '';
                
                // Launch confetti when exploring
                confetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.5 }
                });
            });
        });
        
        // Confetti button in popup
        const confettiBtn = document.querySelector('.start-confetti');
        if (confettiBtn) {
            confettiBtn.addEventListener('click', () => {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.5 }
                });
                
                confetti({
                    particleCount: 100,
                    angle: 60,
                    spread: 80,
                    origin: { x: 0 }
                });
            });
        }
        
    }, 1000); // 1 second delay
}

// ===== RANDOMIZE ALL QUESTIONS =====
function randomizeAllQuestions() {
    console.log("🎲 Randomizing correct answer positions...");
    
    quizQuestions.forEach((question, index) => {
        const correctAnswer = question.options[question.correct];
        
        // Shuffle options
        for (let i = question.options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
        }
        
        // Update correct index
        question.correct = question.options.indexOf(correctAnswer);
    });
    
    console.log(`✅ Randomized ${quizQuestions.length} questions!`);
    console.log("📋 New questions array:", JSON.stringify(quizQuestions, null, 2));
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎂 Birthday website for Fatima loaded!");
    
    initializeNavigation();
    initializeTheme();
    initializeMusic();
    initializeConfetti();
    initializeGames();
    initializeQuiz();
    
    // ===== CALL IT HERE =====
    randomizeAllQuestions();  // This overrides correct:0
    
    initializeWelcomeSystem();
    showSection('home');
    loadPreferences();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show section
            showSection(targetSection);
        });
    });
}

function showSection(sectionId) {
    // 1. Hide all content sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 2. Show target content section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        currentSection = sectionId;
        
        // 3. Update navigation buttons (CRITICAL FIX)
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active'); // Remove from all
            if (btn.getAttribute('href') === `#${sectionId}`) {
                btn.classList.add('active'); // Add to current
            }
        });
        
        // 4. Smooth scroll
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // 5. Special section initialization
        if (sectionId === 'quiz' && !quizStarted) {
            startNewQuiz();
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
    if (themeLabel) themeLabel.textContent = 'Light';
    
    localStorage.setItem('theme', 'dark');
}

function disableDarkTheme() {
    document.body.classList.remove('dark-theme');
    isDarkTheme = false;
    
    const themeIcon = document.querySelector('#theme-toggle i');
    const themeLabel = document.querySelector('#theme-toggle .btn-label');
    
    if (themeIcon) themeIcon.className = 'fas fa-moon';
    if (themeLabel) themeLabel.textContent = 'Dark';
    
    localStorage.setItem('theme', 'light');
}

// ===== MUSIC PLAYER (FIXED) =====
function initializeMusic() {
    const musicToggle = document.getElementById('music-toggle');
    
    if (!musicToggle) return;
    
    // Create audio element
    audioElement = new Audio('assets/birthday-music.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.5;
    
    // Load music preference
    const musicPreference = localStorage.getItem('musicEnabled');
    if (musicPreference === 'true') {
        isMusicPlaying = true;
        const musicIcon = musicToggle.querySelector('i');
        const musicLabel = musicToggle.querySelector('.btn-label');
        if (musicIcon) musicIcon.className = 'fas fa-volume-up';
        if (musicLabel) musicLabel.textContent = 'Music';
    }
    
    musicToggle.addEventListener('click', function() {
        if (!isMusicPlaying) {
            // User clicked - now we can play audio
            isMusicPlaying = true;
            audioElement.play()
                .then(() => {
                    const musicIcon = this.querySelector('i');
                    const musicLabel = this.querySelector('.btn-label');
                    if (musicIcon) musicIcon.className = 'fas fa-volume-up';
                    if (musicLabel) musicLabel.textContent = 'Music';
                    localStorage.setItem('musicEnabled', 'true');
                    console.log("🎵 Music started successfully!");
                })
                .catch(error => {
                    console.error("Music play failed:", error);
                    // Show user-friendly message
                    const musicLabel = this.querySelector('.btn-label');
                    if (musicLabel) musicLabel.textContent = 'Click Again';
                    setTimeout(() => {
                        if (musicLabel) musicLabel.textContent = 'Music';
                    }, 2000);
                });
        } else {
            audioElement.pause();
            isMusicPlaying = false;
            const musicIcon = this.querySelector('i');
            const musicLabel = this.querySelector('.btn-label');
            if (musicIcon) musicIcon.className = 'fas fa-music';
            if (musicLabel) musicLabel.textContent = 'Music';
            localStorage.setItem('musicEnabled', 'false');
        }
    });
    
    // Auto-play after user interaction if previously enabled
    if (musicPreference === 'true') {
        document.addEventListener('click', function enableMusicOnce() {
            if (audioElement.paused) {
                audioElement.play().catch(e => {
                    console.log("Autoplay after interaction failed:", e);
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
    // Click Game
    initializeClickGame();
    
    // Reaction Game
    initializeReactionGame();
}

// ===== CLICK GAME =====
function initializeClickGame() {
    const startBtn = document.getElementById('start-click');
    const resetBtn = document.getElementById('reset-click');
    const clickArea = document.getElementById('click-area');
    
    // Load saved scores
    const savedScores = localStorage.getItem('clickHighScores');
    if (savedScores) {
        clickGame.highScores = JSON.parse(savedScores);
        document.getElementById('click-highscore').textContent = clickGame.highScores[0];
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', startClickGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetClickScores);
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
    
    // Update UI
    document.getElementById('start-click').innerHTML = '<i class="fas fa-play"></i> Clicking...';
    document.getElementById('click-count').textContent = '0';
    document.getElementById('click-timer').textContent = '10';
    document.getElementById('click-cps').textContent = '0';
    
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
    alert(`Click Challenge Complete!\n\nClicks: ${clickGame.clicks}\nCPS: ${finalCPS}\nBest: ${clickGame.highScores[0]}`);
    
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
    
    // Save to localStorage
    localStorage.setItem('clickHighScores', JSON.stringify(clickGame.highScores));
}

function resetClickScores() {
    clickGame.highScores = [0, 0, 0];
    document.getElementById('click-highscore').textContent = '0';
    localStorage.removeItem('clickHighScores');
    
    alert('High scores cleared!');
}

// ===== REACTION GAME =====
function initializeReactionGame() {
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
    const reactionText = document.querySelector('.reaction-timer');
    
    // Set to waiting state
    reactionGame.waiting = true;
    reactionArea.classList.add('waiting');
    reactionText.textContent = 'Wait for green...';
    
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
        document.getElementById('reaction-last').textContent = reactionTime.toFixed(2) + 's';
        
        // Store reaction time
        reactionGame.reactionTimes.push(reactionTime);
        reactionGame.attempts++;
        
        // Update best time
        if (!reactionGame.bestTime || reactionTime < reactionGame.bestTime) {
            reactionGame.bestTime = reactionTime;
            document.getElementById('reaction-best').textContent = reactionGame.bestTime.toFixed(2) + 's';
        }
        
        // Calculate average
        const sum = reactionGame.reactionTimes.reduce((a, b) => a + b, 0);
        reactionGame.averageTime = sum / reactionGame.reactionTimes.length;
        document.getElementById('reaction-avg').textContent = reactionGame.averageTime.toFixed(2) + 's';
        document.getElementById('reaction-attempts').textContent = reactionGame.attempts;
        
        // Save stats
        localStorage.setItem('reactionStats', JSON.stringify({
            bestTime: reactionGame.bestTime,
            averageTime: reactionGame.averageTime,
            reactionTimes: reactionGame.reactionTimes.slice(-20), // Keep last 20 attempts
            attempts: reactionGame.attempts
        }));
        
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
        
        alert(`Reaction time: ${reactionTime.toFixed(2)}s\n${feedback}`);
        
    } else if (reactionArea.classList.contains('waiting')) {
        // Clicked too soon
        reactionGame.waiting = false;
        reactionArea.classList.remove('waiting');
        document.querySelector('.reaction-timer').textContent = 'Too Soon!';
        
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
    
    document.getElementById('reaction-last').textContent = '0.00s';
    document.getElementById('reaction-best').textContent = '0.00s';
    document.getElementById('reaction-avg').textContent = '0.00s';
    document.getElementById('reaction-attempts').textContent = '0';
    
    localStorage.removeItem('reactionStats');
    
    alert('Reaction stats cleared!');
}

// ===== QUIZ SYSTEM =====
function initializeQuiz() {
    // Initialize quiz database
    initializeQuizDatabase();
    
    // Quiz navigation buttons
    document.getElementById('prev-question')?.addEventListener('click', showPreviousQuestion);
    document.getElementById('next-question')?.addEventListener('click', showNextQuestion);
    document.getElementById('submit-quiz')?.addEventListener('click', submitQuiz);
    document.getElementById('restart-quiz')?.addEventListener('click', startNewQuiz);
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
            question: "Which method removes whitespace from both ends of a string in Python?",
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
            question: "Which data type is mutable(modify) in Python?",
            options: ["List", "Tuple", "String", "Integer"],
            correct: 0,
            explanation: "Lists are mutable (can be changed). Tuples and strings are immutable."
        },
        {
            topic: "Python Basics",
            question: "What does // operator do in Python?",
            options: ["Integer division", "Float division", "Modulus", "Exponentiation"],
            correct: 0,
            explanation: "// performs floor division (integer division). / performs float division."
        },
        {
            topic: "Python Basics",
            question: "How do you convert to integer in Python?",
            options: ["int()", "Integer()", "toInt()", "parseInt()"],
            correct: 0,
            explanation: "int() converts strings/floats to integers. float() and str() are similar."
        },
        {
            topic: "Python Basics",
            question: "What does range(5) generate in Python?",
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
            question: "Which operator declares a pointer in C++?",
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
            question: "Which is correct main function in C++?",
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
            question: "How to allocate memory dynamically in C++?",
            options: ["new", "malloc", "alloc", "create"],
            correct: 0,
            explanation: "new allocates memory, returns pointer. delete frees it. C++ style, not malloc."
        },
        {
            topic: "C++ Basics",
            question: "Which is a reference in C++?",
            options: ["int& x", "int* x", "int x", "ref int x"],
            correct: 0,
            explanation: "& after type creates reference (alias for variable). Must be initialized."
        },
        {
            topic: "C++ Basics",
            question: "What is :: operator in C++?",
            options: ["Scope resolution", "Pointer access", "Reference", "Namespace"],
            correct: 0,
            explanation: ":: accesses global scope or class members. Example: std::cout, Class::method()"
        },
        {
            topic: "C++ Basics",
            question: "How to create a class in C++?",
            options: ["class MyClass {}", "class MyClass:", "MyClass class {}", "class: MyClass"],
            correct: 0,
            explanation: "C++ uses braces {} and semicolon after class definition."
        },
        {
            topic: "C++ Basics",
            question: "What is cin in C++?",
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
            question: "What does const do in C++?",
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
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
        alert('Last question! Click "Submit Quiz" to finish.');
    }
}

function updateQuizButtons() {
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.textContent = currentQuestionIndex === quizQuestions.length - 1 ? 'Last Question' : 'Next';
    }
}

function submitQuiz() {
    // Calculate final score
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    
    userAnswers.forEach((answer, index) => {
        const question = quizQuestions[index];
        if (!question) return;
        
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
    
    // ===== ADD SHARE SCORE SECTION =====
    const shareScoreHTML = `
        <div class="share-score-section">
            <div class="share-header">
                <i class="fas fa-share-alt"></i>
                <h3>Share Your Score with Ali!</h3>
            </div>
            <p class="share-description">Let Ali know how you did on his CS quiz!</p>
            <div class="share-actions">
                <button id="share-score-btn" class="btn-primary share-btn">
                    <i class="fas fa-paper-plane"></i> Add Score to Message
                </button>
                <button id="copy-score-btn" class="game-btn secondary share-btn">
                    <i class="far fa-copy"></i> Copy Score
                </button>
            </div>
            <div id="share-feedback" class="share-feedback"></div>
        </div>
    `;
    
    // Insert the share section into results
    document.querySelector('.results-footer').insertAdjacentHTML('beforebegin', shareScoreHTML);
    
    // Add event listeners
    document.getElementById('share-score-btn').addEventListener('click', shareScoreWithAli);
    document.getElementById('copy-score-btn').addEventListener('click', copyScoreToClipboard);
    // ===== END SHARE SCORE SECTION =====
    
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
}

// ===== SHARE SCORE FUNCTION =====
function shareScoreWithAli() {
    const finalScore = userScore;
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    const timestamp = new Date().toLocaleString();
    
    // Create performance message based on score
    let performanceMessage = "";
    let performanceEmoji = "";
    
    if (percentage >= 90) {
        performanceMessage = "I aced your CS quiz! 🏆";
        performanceEmoji = "🏆";
    } else if (percentage >= 80) {
        performanceMessage = "I did really well on your CS quiz! 💻";
        performanceEmoji = "💻";
    } else if (percentage >= 70) {
        performanceMessage = "I passed your CS quiz! 👍";
        performanceEmoji = "👍";
    } else if (percentage >= 60) {
        performanceMessage = "I tried your CS quiz! 📚";
        performanceEmoji = "📚";
    } else {
        performanceMessage = "I attempted your CS quiz! 😅";
        performanceEmoji = "😅";
    }
    
    // Build the message
    const scoreMessage = `${performanceMessage}

🎯 **Score:** ${finalScore}/${totalQuestions} (${percentage}%)
⏰ **Completed:** ${timestamp}
${performanceEmoji} **Difficulty:** ${percentage >= 80 ? "Challenging but fun!" : "Tricky but interesting!"}

I especially liked the questions about: [What topic did you like?]
`;

    // Fill the message form
    const messageInput = document.getElementById('sender-message');
    const nameInput = document.getElementById('sender-name');
    
    if (messageInput && nameInput) {
        // Auto-fill name (she can change it)
        if (!nameInput.value.trim()) {
            nameInput.value = "Fatima";
        }
        
        // Auto-fill message with score
        messageInput.value = scoreMessage;
        
        // Add visual highlight
        messageInput.classList.add('auto-filled');
        setTimeout(() => {
            messageInput.classList.remove('auto-filled');
        }, 3000);
        
        // Focus on message area so she can edit
        messageInput.focus();
        messageInput.setSelectionRange(0, 0); // Cursor at start
        
        // Navigate to the Write Back section
        showSection('write-back');
        
        // Smooth scroll to the form
        setTimeout(() => {
            document.getElementById('message-form').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 300);
        
        // Show success feedback
        const feedback = document.getElementById('share-feedback');
        if (feedback) {
            feedback.innerHTML = `
                <div class="share-success">
                    <i class="fas fa-check-circle"></i>
                    <strong>Ready to send!</strong> Your score has been added to the message form.
                </div>
            `;
            feedback.style.display = 'block';
        }
        
        // Add confetti celebration
        setTimeout(() => {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 60,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }, 500);
        
    } else {
        // Fallback if form elements not found
        alert("Score added to clipboard! Paste it in your message to Ali.");
        copyScoreToClipboard();
    }
}

// ===== COPY SCORE TO CLIPBOARD =====
function copyScoreToClipboard() {
    const finalScore = userScore;
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    
    const scoreText = `🎯 CS Quiz Score: ${finalScore}/${totalQuestions} (${percentage}%)
Taken on: ${new Date().toLocaleDateString()}
From: Fatima's 18th Birthday Website 🎂`;
    
    navigator.clipboard.writeText(scoreText)
        .then(() => {
            // Show feedback
            const feedback = document.getElementById('share-feedback');
            if (feedback) {
                feedback.innerHTML = `
                    <div class="share-success">
                        <i class="fas fa-check-circle"></i>
                        <strong>Copied!</strong> Score is ready to paste anywhere.
                    </div>
                `;
                feedback.style.display = 'block';
            }
        })
        .catch(() => {
            // Fallback for older browsers
            prompt("Copy this score:", scoreText);
        });
}


// 2. Add this JavaScript to your script.js for instant feedback
// Enhanced Form Submission
const messageForm = document.getElementById('message-form');
const formFeedback = document.getElementById('form-feedback');

if (messageForm && formFeedback) {
    messageForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        const name = document.getElementById('sender-name').value.trim();
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        formFeedback.textContent = '';
        formFeedback.className = 'loading';
        formFeedback.textContent = 'Sending your message...';
        formFeedback.classList.add('show');
        
        try {
            const formData = new FormData(this);
            
            // Add timestamp to form data
            formData.append('timestamp', new Date().toLocaleString());
            
            const response = await fetch(this.action, {
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
                this.reset();
                
                // Celebration!
                setTimeout(() => {
                    if (typeof launchConfetti === 'function') {
                        launchConfetti();
                    }
                }, 300);
                
                // Play success sound if music is enabled
                if (audioElement && isMusicPlaying) {
                    const successSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
                    successSound.volume = 0.3;
                    successSound.play().catch(() => {});
                }
                
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
        } finally {
            // Reset button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Auto-hide feedback after 5 seconds
            setTimeout(() => {
                formFeedback.classList.remove('show');
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = '';
                }, 300);
            }, 5000);
        }
    });
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
        isMusicPlaying = true;
    }
    
    // Load click game scores
    const scores = localStorage.getItem('clickHighScores');
    if (scores) {
        clickGame.highScores = JSON.parse(scores);
        document.getElementById('click-highscore').textContent = clickGame.highScores[0];
    }
}

// ===== FINAL INITIALIZATION =====
console.log("All systems initialized! 🚀");
console.log("🎂 Happy Birthday Fatima! 🎉");
