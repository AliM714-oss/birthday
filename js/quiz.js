// ===== QUIZ SYSTEM =====
const Quiz = {
    // Quiz State
    state: {
        questions: [],
        currentIndex: 0,
        score: 0,
        answers: [],
        started: false,
        loaded: false
    },
    
    // Initialize quiz
    async init() {
        await this.loadQuizData();
        this.setupEventListeners();
        console.log("✅ Quiz system initialized");
    },
    
    // Load quiz questions from JSON
    async loadQuizData() {
        try {
            console.log("📥 Loading quiz questions...");
            const response = await fetch('data/quiz-questions.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            this.state.questions = await response.json();
            this.randomizeQuestions();
            this.state.loaded = true;
            
            console.log(`✅ Loaded ${this.state.questions.length} questions`);
            
            // If we're already on the quiz section, show first question
            if (document.getElementById('quiz').classList.contains('active')) {
                this.startNewQuiz();
            }
            
        } catch (error) {
            console.error('❌ Failed to load quiz questions:', error);
            
            // Fallback questions
            this.state.questions = [{
                topic: "CS Basics",
                question: "Questions couldn't load. Try refreshing the page.",
                options: ["Refresh page", "Check console", "Contact Ali", "Try later"],
                correct: 0,
                explanation: "The quiz data failed to load from the server."
            }];
            this.state.loaded = true;
        }
    },
    
    // Randomize question and answer order
    randomizeQuestions() {
        // Shuffle questions
        for (let i = this.state.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.state.questions[i], this.state.questions[j]] = [this.state.questions[j], this.state.questions[i]];
        }
        
        // Shuffle options for each question
        this.state.questions.forEach(question => {
            const correctAnswer = question.options[question.correct];
            
            // Shuffle options
            for (let i = question.options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [question.options[i], question.options[j]] = [question.options[j], question.options[i]];
            }
            
            // Update correct index
            question.correct = question.options.indexOf(correctAnswer);
        });
        
        console.log('🎲 Questions randomized');
    },
    
    // Setup event listeners
    setupEventListeners() {
        document.getElementById('prev-question')?.addEventListener('click', () => this.showPreviousQuestion());
        document.getElementById('next-question')?.addEventListener('click', () => this.showNextQuestion());
        document.getElementById('submit-quiz')?.addEventListener('click', () => this.submitQuiz());
        document.getElementById('restart-quiz')?.addEventListener('click', () => this.startNewQuiz());
    },
    
    // Start new quiz
    startNewQuiz() {
        if (!this.state.loaded) {
            console.log("⚠️ Quiz data not loaded yet");
            document.getElementById('question-text').textContent = "Loading questions...";
            return;
        }
        
        console.log("🎯 Starting new quiz");
        
        this.state.currentIndex = 0;
        this.state.score = 0;
        this.state.answers = new Array(this.state.questions.length).fill(null);
        this.state.started = true;
        
        // Update UI
        document.getElementById('quiz-results').style.display = 'none';
        document.querySelector('.quiz-body').style.display = 'block';
        document.querySelector('.quiz-footer').style.display = 'flex';
        
        // Display first question
        this.displayQuestion();
    },
    
    // Display current question
    displayQuestion() {
        if (!this.state.loaded || this.state.questions.length === 0) {
            document.getElementById('question-text').textContent = "Loading questions...";
            return;
        }
        
        if (this.state.currentIndex >= this.state.questions.length) {
            document.getElementById('question-text').textContent = "Quiz completed!";
            return;
        }
        
        const question = this.state.questions[this.state.currentIndex];
        
        // Update UI elements
        document.getElementById('topic-badge').textContent = question.topic;
        document.getElementById('current-q').textContent = this.state.currentIndex + 1;
        document.getElementById('total-q').textContent = this.state.questions.length;
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('quiz-score').textContent = this.state.score;
        
        // Display options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'quiz-option';
            optionBtn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${option}`;
            optionBtn.dataset.index = index;
            
            // Mark if previously answered
            if (this.state.answers[this.state.currentIndex] === index) {
                optionBtn.classList.add('selected');
                if (index === question.correct) {
                    optionBtn.classList.add('correct');
                } else {
                    optionBtn.classList.add('incorrect');
                }
            }
            
            optionBtn.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionBtn);
        });
        
        // Update explanation
        document.getElementById('explanation-text').textContent = 
            this.state.answers[this.state.currentIndex] !== null ? 
            question.explanation : "Select an answer to see explanation";
        
        // Update button states
        this.updateQuizButtons();
    },
    
    // Select an answer
    selectAnswer(selectedIndex) {
        if (this.state.answers[this.state.currentIndex] !== null) return;
        
        const question = this.state.questions[this.state.currentIndex];
        this.state.answers[this.state.currentIndex] = selectedIndex;
        
        // Update score if correct
        if (selectedIndex === question.correct) {
            this.state.score++;
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
        document.getElementById('quiz-score').textContent = this.state.score;
        
        // Auto-advance after delay
        setTimeout(() => this.showNextQuestion(), 1500);
    },
    
    // Show previous question
    showPreviousQuestion() {
        if (this.state.currentIndex > 0) {
            this.state.currentIndex--;
            this.displayQuestion();
        }
    },
    
    // Show next question
    showNextQuestion() {
        if (this.state.currentIndex < this.state.questions.length - 1) {
            this.state.currentIndex++;
            this.displayQuestion();
        } else {
            alert('Last question! Click "Submit Quiz" to finish.');
        }
    },
    
    // Update quiz buttons
    updateQuizButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        
        if (prevBtn) {
            prevBtn.disabled = this.state.currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.textContent = this.state.currentIndex === this.state.questions.length - 1 ? 'Last Question' : 'Next';
        }
    },
    
    // Submit quiz
    submitQuiz() {
        // Calculate results
        let correct = 0;
        
        this.state.answers.forEach((answer, index) => {
            const question = this.state.questions[index];
            if (answer === question.correct) {
                correct++;
            }
        });
        
        this.state.score = correct;
        const percentage = (correct / this.state.questions.length) * 100;
        
        // Display results
        document.getElementById('final-score').textContent = correct;
        document.getElementById('max-score').textContent = this.state.questions.length;
        
        // Generate result message
        let message = "";
        if (percentage >= 90) {
            message = "🏆 OUTSTANDING! You're a programming genius!";
        } else if (percentage >= 80) {
            message = "🎯 EXCELLENT! Strong CS fundamentals!";
        } else if (percentage >= 70) {
            message = "👍 GREAT JOB! Solid understanding!";
        } else if (percentage >= 60) {
            message = "💡 GOOD EFFORT! Keep practicing!";
        } else if (percentage >= 50) {
            message = "🌟 NOT BAD! The journey begins with a single variable!";
        } else {
            message = "📚 KEEP LEARNING! Every expert was once a beginner!";
        }
        
        document.getElementById('result-message').textContent = message;
        
        // Show results container
        document.getElementById('quiz-results').style.display = 'block';
        document.querySelector('.quiz-body').style.display = 'none';
        document.querySelector('.quiz-footer').style.display = 'none';
        
        // Celebration for good scores
        if (percentage >= 70) {
            setTimeout(() => {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }, 500);
        }
    }
};

// Make Quiz available globally
window.Quiz = Quiz;
console.log("📚 Quiz module loaded");
