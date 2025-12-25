// ===== QUIZ DATABASE - 30+ QUESTIONS =====
const quizDatabase = [
    // Python Basics (10 questions)
    {
        topic: "Python Basics",
        question: "Which keyword is used to define a function in Python?",
        options: ["def", "function", "define", "func"],
        correct: 0,
        explanation: "The 'def' keyword is used to define functions in Python. Example: def my_function():"
    },
    {
        topic: "Python Basics",
        question: "How do you create a list in Python?",
        options: ["[]", "()", "{}", "<>"],
        correct: 0,
        explanation: "Square brackets [] are used for lists. Example: my_list = [1, 2, 3]"
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
        question: "How do you start a for loop in Python?",
        options: ["for x in y:", "for (x in y)", "for x = 0; x < y; x++", "loop x in y:"],
        correct: 0,
        explanation: "Python uses 'for item in sequence:' syntax. No parentheses needed."
    },
    {
        topic: "Python Basics",
        question: "Which operator performs integer division?",
        options: ["//", "/", "%", "div"],
        correct: 0,
        explanation: "// performs floor division (integer division). / performs float division."
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
        question: "How do you convert to integer?",
        options: ["int()", "Integer()", "toInt()", "parseInt()"],
        correct: 0,
        explanation: "int() converts strings/floats to integers. float() and str() are similar."
    },
    {
        topic: "Python Basics",
        question: "Which is NOT a Python data type?",
        options: ["double", "int", "str", "bool"],
        correct: 0,
        explanation: "Python has int, float, str, bool, list, tuple, dict, set. No 'double' type."
    },
    {
        topic: "Python Basics",
        question: "What does range(5) generate?",
        options: ["0,1,2,3,4", "1,2,3,4,5", "0,1,2,3,4,5", "5 numbers starting from 1"],
        correct: 0,
        explanation: "range(5) generates 0-4. range(1,6) would generate 1-5."
    },
    
    // Python OOP (12 questions)
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
        question: "Which is a class variable?",
        options: ["Variable inside class", "Variable inside __init__", "Global variable", "Local variable"],
        correct: 0,
        explanation: "Class variables are shared by all instances. Instance variables are in __init__."
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
    
    // C++ Basics (11 questions)
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

// ===== QUIZ STATE =====
let quizQuestions = [];
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎂 Birthday website loaded for Fatima!");
    
    initNavigation();
    initConfetti();
    initQuiz();
    initMusic();
    initTheme();
    
    // Show home section first
    showSection('home');
});

// ===== NAVIGATION =====
function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show section
            showSection(targetId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        // Reset quiz if showing quiz section
        if (sectionId === 'quiz' && quizQuestions.length === 0) {
            startNewQuiz();
        }
    }
}

// ===== CONFETTI =====
function initConfetti() {
    const btn = document.getElementById('confetti-btn');
    if (btn) {
        btn.addEventListener('click', function() {
            // Multiple confetti bursts
            confetti({ particleCount: 150, spread: 70 });
            setTimeout(() => confetti({ angle: 60, spread: 80 }), 150);
            setTimeout(() => confetti({ angle: 120, spread: 80 }), 300);
            
            // Button feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 200);
        });
    }
}

// ===== QUIZ SYSTEM =====
function initQuiz() {
    // Event listeners for quiz buttons
    document.getElementById('prev-btn')?.addEventListener('click', showPreviousQuestion);
    document.getElementById('next-btn')?.addEventListener('click', showNextQuestion);
}

function startNewQuiz() {
    // Reset state
    quizQuestions = [...quizDatabase];
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    
    // Shuffle questions (random order)
    shuffleArray(quizQuestions);
    
    // Display first question
    displayQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    if (quizQuestions.length === 0) return;
    
    const question = quizQuestions[currentQuestionIndex];
    
    // Update UI elements
    document.getElementById('topic-badge').textContent = question.topic;
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('total-q').textContent = quizQuestions.length;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('score-value').textContent = userScore;
    
    // Display options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'quiz-option';
        optionBtn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        
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
    document.getElementById('score-value').textContent = userScore;
    
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
        // End of quiz - show completion message
        alert(`🎉 Quiz Complete!\n\nYour score: ${userScore}/${quizQuestions.length}\n\nGreat job! Refresh page to try again with new random questions.`);
        
        // Launch celebration confetti
        if (userScore >= quizQuestions.length * 0.7) { // 70% or more
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        angle: Math.random() * 180,
                        spread: 70,
                        origin: { x: Math.random(), y: Math.random() * 0.5 }
                    });
                }, i * 300);
            }
        }
    }
}

function updateQuizButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
        prevBtn.style.opacity = currentQuestionIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
        nextBtn.textContent = isLastQuestion ? 'Finish Quiz' : 'Next';
        nextBtn.innerHTML = isLastQuestion ? 
            'Finish Quiz <i class="fas fa-flag-checkered"></i>' : 
            'Next <i class="fas fa-arrow-right"></i>';
    }
}

// ===== MUSIC PLAYER =====
function initMusic() {
    const musicBtn = document.getElementById('music-toggle');
    const audio = new Audio('assets/birthday-music.mp3');
    audio.loop = true;
    
    let playing = false;
    
    musicBtn.addEventListener('click', function() {
        if (!playing) {
            // IMPORTANT: Must be in click handler for browsers to allow
            audio.play()
                .then(() => {
                    playing = true;
                    this.innerHTML = '<i class="fas fa-volume-up"></i> Pause Music';
                })
                .catch(e => {
                    console.log("Browser blocked audio:", e);
                    // Try one more time with user gesture
                    this.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Click Again';
                });
        } else {
            audio.pause();
            playing = false;
            this.innerHTML = '<i class="fas fa-music"></i> Play Music';
        }
    });
}

// ===== THEME TOGGLE =====
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const text = themeBtn.querySelector('span');
        
        // Load saved theme
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        }
        
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Light Mode';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'light');
            }
        });
    }
}
