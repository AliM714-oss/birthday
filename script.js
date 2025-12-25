// ===== WEBSITE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎂 Birthday website loaded! Happy 18th Fatima!");
    
    // Initialize all components
    initNavigation();
    initConfetti();
    initGallery();
    initQuiz();
    initMusic();
    initTheme();
    initSmoothScrolling();
    
    // Show first section
    showSection('home');
});

// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active navigation
            navLinks.forEach(l => l.classList.remove('active'));
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
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Smooth scroll to section
        setTimeout(() => {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
}

// ===== CONFETTI =====
function initConfetti() {
    const confettiBtn = document.getElementById('confetti-btn');
    
    if (!confettiBtn) return;
    
    confettiBtn.addEventListener('click', function() {
        // Create multiple confetti bursts
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
        }, 150);
        
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 80,
                origin: { x: 1 }
            });
        }, 300);
        
        // Add more bursts for celebration
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 }
            });
        }, 450);
        
        // Button animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

// ===== GALLERY =====
function initGallery() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Create modal for image view
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                cursor: pointer;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Close modal on click
            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Close on ESC key
            document.addEventListener('keydown', function closeModal(e) {
                if (e.key === 'Escape') {
                    document.body.removeChild(modal);
                    document.removeEventListener('keydown', closeModal);
                }
            });
        });
    });
}

// ===== QUIZ SYSTEM =====
const quizData = [
    {
        category: "Python Basics",
        question: "Which of these is used to define a function in Python?",
        options: ["def", "function", "define", "func"],
        correct: 0,
        explanation: "In Python, the 'def' keyword is used to define a function. Example: def my_function():"
    },
    {
        category: "Python OOP",
        question: "What is the correct way to create a class in Python?",
        options: [
            "class MyClass:",
            "class MyClass()",
            "class MyClass{}",
            "MyClass class:"
        ],
        correct: 0,
        explanation: "Python uses 'class ClassName:' syntax. Parentheses are only needed for inheritance."
    },
    {
        category: "Python OOP",
        question: "Which method is called when an object is created?",
        options: ["__init__", "__start__", "__new__", "__create__"],
        correct: 0,
        explanation: "__init__ is the constructor method that initializes new objects in Python."
    },
    {
        category: "Python Basics",
        question: "How do you create a list in Python?",
        options: [
            "list = [1, 2, 3]",
            "list = (1, 2, 3)",
            "list = {1, 2, 3}",
            "list = <1, 2, 3>"
        ],
        correct: 0,
        explanation: "Square brackets [] are used for lists. Parentheses () are for tuples, curly braces {} for sets/dictionaries."
    },
    {
        category: "C++ Basics",
        question: "Which operator is used for pointer declaration in C++?",
        options: ["*", "&", "->", "<<"],
        correct: 0,
        explanation: "Asterisk (*) is used to declare pointers. Ampersand (&) gets memory address."
    },
    {
        category: "C++ Basics",
        question: "What is the correct way to output 'Hello World' in C++?",
        options: [
            "cout << 'Hello World';",
            "print('Hello World');",
            "System.out.println('Hello World');",
            "console.log('Hello World');"
        ],
        correct: 0,
        explanation: "C++ uses cout with << operator. Other options are from Python, Java, and JavaScript."
    },
    {
        category: "Python OOP",
        question: "What does 'self' represent in Python class methods?",
        options: [
            "Instance of the class",
            "The class itself",
            "Parent class",
            "Global object"
        ],
        correct: 0,
        explanation: "'self' refers to the instance calling the method. It's Python's equivalent of 'this' in other languages."
    },
    {
        category: "Python Basics",
        question: "Which loop goes through a sequence in Python?",
        options: ["for loop", "while loop", "do-while loop", "repeat loop"],
        correct: 0,
        explanation: "for loop is used to iterate through sequences. Python doesn't have do-while or repeat loops."
    },
    {
        category: "C++ Basics",
        question: "Which data type is used for true/false values in C++?",
        options: ["bool", "boolean", "bit", "flag"],
        correct: 0,
        explanation: "C++ uses 'bool' for boolean values (true/false). 'boolean' is from Java."
    },
    {
        category: "Python OOP",
        question: "Which keyword is used for inheritance in Python?",
        options: ["class Child(Parent):", "extends", "inherits", "derive"],
        correct: 0,
        explanation: "Python uses parentheses after class name for inheritance. Example: class Child(Parent):"
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = new Array(quizData.length).fill(null);

function initQuiz() {
    updateQuizDisplay();
    setupQuizEvents();
}

function updateQuizDisplay() {
    const question = quizData[currentQuestion];
    
    // Update question elements
    document.getElementById('quiz-category').textContent = question.category;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('explanation-text').textContent = question.explanation;
    document.getElementById('total-questions').textContent = quizData.length;
    
    // Update options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option';
        optionBtn.dataset.index = index;
        optionBtn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${option}`;
        
        // Mark selected option
        if (userAnswers[currentQuestion] === index) {
            optionBtn.classList.add('selected');
        }
        
        optionBtn.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionBtn);
    });
    
    // Update score
    calculateScore();
    document.getElementById('score').textContent = score;
    
    // Update button states
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').disabled = currentQuestion === quizData.length - 1;
}

function setupQuizEvents() {
    // Previous button
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            updateQuizDisplay();
        }
    });
    
    // Next button
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            updateQuizDisplay();
        }
    });
    
    // Submit button
    document.getElementById('submit-btn').addEventListener('click', showQuizResults);
    
    // Restart button
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
}

function selectOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    
    // Update UI
    document.querySelectorAll('.option').forEach((opt, idx) => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        
        if (idx === optionIndex) {
            opt.classList.add('selected');
        }
        
        // Show correct answer (for learning)
        if (idx === quizData[currentQuestion].correct) {
            opt.classList.add('correct');
        }
    });
    
    // Auto-advance after short delay (for smooth experience)
    setTimeout(() => {
        calculateScore();
        document.getElementById('score').textContent = score;
        
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            updateQuizDisplay();
        }
    }, 1000);
}

function calculateScore() {
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });
}

function showQuizResults() {
    calculateScore();
    
    // Update result display
    document.getElementById('final-score').textContent = score;
    
    // Custom message based on score
    let message = "";
    if (score === 10) {
        message = "🏆 PERFECT SCORE! You're a programming genius! Fatima would be so impressed!";
    } else if (score >= 8) {
        message = "🎯 Excellent! You really know your CS fundamentals!";
    } else if (score >= 6) {
        message = "👍 Great job! Solid understanding of programming concepts!";
    } else if (score >= 4) {
        message = "💡 Good effort! Keep practicing and you'll master it!";
    } else {
        message = "🌟 The journey begins! Every expert was once a beginner. Keep coding!";
    }
    
    document.getElementById('result-message').textContent = message;
    
    // Show result box, hide quiz controls
    document.getElementById('result-box').style.display = 'block';
    document.querySelector('.quiz-controls').style.display = 'none';
    document.getElementById('explanation-box').style.display = 'none';
    
    // Launch confetti for good scores
    if (score >= 7) {
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
        }, 500);
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(quizData.length).fill(null);
    
    // Reset UI
    document.getElementById('result-box').style.display = 'none';
    document.querySelector('.quiz-controls').style.display = 'flex';
    document.getElementById('explanation-box').style.display = 'block';
    
    updateQuizDisplay();
}

// ===== MUSIC PLAYER =====
function initMusic() {
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    
    if (!musicToggle || !bgMusic) return;
    
    const musicIcon = musicToggle.querySelector('i');
    const musicText = musicToggle.querySelector('.btn-text');
    
    // Load music preference
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
        bgMusic.volume = parseFloat(savedVolume);
    }
    
    musicToggle.addEventListener('click', function() {
        if (bgMusic.paused) {
            // Play music
            bgMusic.play()
                .then(() => {
                    musicIcon.className = 'fas fa-volume-up';
                    musicText.textContent = 'Pause Music';
                    localStorage.setItem('musicPlaying', 'true');
                })
                .catch(error => {
                    console.log("Audio play failed:", error);
                    // Show user-friendly message
                    musicText.textContent = 'Click to Enable';
                    setTimeout(() => {
                        musicText.textContent = 'Play Music';
                    }, 2000);
                });
        } else {
            // Pause music
            bgMusic.pause();
            musicIcon.className = 'fas fa-music';
            musicText.textContent = 'Play Music';
            localStorage.setItem('musicPlaying', 'false');
        }
        
        // Save volume when changed
        bgMusic.addEventListener('volumechange', () => {
            localStorage.setItem('musicVolume', bgMusic.volume);
        });
    });
    
    // Auto-play on first interaction (browser policy)
    document.addEventListener('click', function initAutoPlay() {
        if (localStorage.getItem('musicPlaying') === 'true') {
            bgMusic.play().catch(() => {
                // Silent fail if autoplay blocked
            });
        }
        document.removeEventListener('click', initAutoPlay);
    }, { once: true });
}

// ===== THEME TOGGLE =====
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('.btn-text');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            // Switch to dark mode
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            // Switch to light mode
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
