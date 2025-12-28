// ===== QUIZ SYSTEM =====
const Quiz = {
    // Quiz State
    state: {
        questions: [],
        currentIndex: 0,
        score: 0,
        answers: [],
        started: false
    },
    
    // Initialize quiz
    async init() {
        await this.loadQuizData();
        this.setupEventListeners();
    },
    
    // Load quiz questions from JSON
    async loadQuizData() {
        try {
            const response = await fetch('data/quiz-questions.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            this.state.questions = await response.json();
            this.randomizeQuestions();
            
            console.log(`✅ Loaded ${this.state.questions.length} questions`);
            Utils.announceToScreenReader(`Quiz loaded with ${this.state.questions.length} questions`);
        } catch (error) {
            console.error('❌ Failed to load quiz questions:', error);
            
            // Fallback questions
            this.state.questions = [{
                topic: "Error",
                question: "Questions could not be loaded.",
                options: ["Please try refreshing the page"],
                correct: 0,
                explanation: "Check the console for errors."
            }];
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
        Utils.$('#prev-question')?.addEventListener('click', () => this.showPreviousQuestion());
        Utils.$('#next-question')?.addEventListener('click', () => this.showNextQuestion());
        Utils.$('#submit-quiz')?.addEventListener('click', () => this.submitQuiz());
        Utils.$('#restart-quiz')?.addEventListener('click', () => this.startNewQuiz());
    },
    
    // Start new quiz
    startNewQuiz() {
        this.state.currentIndex = 0;
        this.state.score = 0;
        this.state.answers = new Array(this.state.questions.length).fill(null);
        this.state.started = true;
        
        // Update UI
        Utils.$('#quiz-results').hidden = true;
        Utils.$('.quiz-body').style.display = 'block';
        Utils.$('.quiz-footer').style.display = 'flex';
        
        // Display first question
        this.displayQuestion();
        Utils.announceToScreenReader('New quiz started!');
    },
    
    // Display current question
    displayQuestion() {
        if (this.state.questions.length === 0 || this.state.currentIndex >= this.state.questions.length) {
            return;
        }
        
        const question = this.state.questions[this.state.currentIndex];
        
        // Update UI elements
        Utils.$('#topic-badge').textContent = question.topic;
        Utils.$('#current-q').textContent = this.state.currentIndex + 1;
        Utils.$('#total-q').textContent = this.state.questions.length;
        Utils.$('#question-text').textContent = question.question;
        Utils.$('#quiz-score').textContent = this.state.score;
        
        // Display options
        const optionsContainer = Utils.$('#options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'quiz-option';
            optionBtn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${option}`;
            optionBtn.dataset.index = index;
            optionBtn.setAttribute('aria-label', `Option ${String.fromCharCode(65 + index)}: ${option}`);
            
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
        Utils.$('#explanation-text').textContent = 
            this.state.answers[this.state.currentIndex] !== null ? 
            question.explanation : "Select an answer to see explanation";
        
        // Update button states
        this.updateQuizButtons();
        
        // Announce question to screen readers
        Utils.announceToScreenReader(`Question ${this.state.currentIndex + 1}: ${question.question}`);
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
        const options = Utils.$$('#options-container .quiz-option');
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
        Utils.$('#explanation-text').textContent = question.explanation;
        Utils.$('#quiz-score').textContent = this.state.score;
        
        // Announce result
        const isCorrect = selectedIndex === question.correct;
        Utils.announceToScreenReader(`${isCorrect ? 'Correct' : 'Incorrect'}! ${question.explanation}`);
        
        // Auto-advance after delay
        Utils.safeSetTimeout(() => this.showNextQuestion(), 1500);
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
            Utils.announceToScreenReader('Last question. Click submit quiz to finish.');
        }
    },
    
    // Update quiz navigation buttons
    updateQuizButtons() {
        const prevBtn = Utils.$('#prev-question');
        const nextBtn = Utils.$('#next-question');
        
        if (prevBtn) {
            prevBtn.disabled = this.state.currentIndex === 0;
            prevBtn.setAttribute('aria-disabled', this.state.currentIndex === 0);
        }
        
        if (nextBtn) {
            nextBtn.textContent = this.state.currentIndex === this.state.questions.length - 1 ? 'Last Question' : 'Next';
        }
    },
    
    // Submit quiz and show results
    submitQuiz() {
        // Calculate results
        let correct = 0;
        let wrong = 0;
        let skipped = 0;
        
        this.state.answers.forEach((answer, index) => {
            const question = this.state.questions[index];
            if (!question) return;
            
            if (answer === null) {
                skipped++;
            } else if (answer === question.correct) {
                correct++;
            } else {
                wrong++;
            }
        });
        
        this.state.score = correct;
        const percentage = (correct / this.state.questions.length) * 100;
        
        // Display results
        Utils.$('#final-score').textContent = correct;
        Utils.$('#max-score').textContent = this.state.questions.length;
        
        // Generate result message
        let message = "";
        const messages = [
            ["🏆 OUTSTANDING! You're a programming genius!", 90],
            ["🎯 EXCELLENT! Strong CS fundamentals!", 80],
            ["👍 GREAT JOB! Solid understanding!", 70],
            ["💡 GOOD EFFORT! Keep practicing!", 60],
            ["🌟 NOT BAD! The journey begins with a single variable!", 50],
            ["📚 KEEP LEARNING! Every expert was once a beginner!", 0]
        ];
        
        message = messages.find(([_, min]) => percentage >= min)[0];
        Utils.$('#result-message').textContent = message;
        
        // Show results container
        Utils.$('#quiz-results').hidden = false;
        Utils.$('.quiz-body').style.display = 'none';
        Utils.$('.quiz-footer').style.display = 'none';
        
        // Add share score section
        this.addShareScoreSection(correct, this.state.questions.length, percentage);
        
        // Celebration for good scores
        if (percentage >= 70) {
            Utils.safeSetTimeout(() => Utils.launchConfetti(), 500);
        }
        
        // Announce results
        Utils.announceToScreenReader(`Quiz complete! Score: ${correct} out of ${this.state.questions.length}. ${message}`);
    },
    
    // Add share score section to results
    addShareScoreSection(correct, total, percentage) {
        const shareHTML = `
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
        
        // Insert the share section
        Utils.$('.results-footer').insertAdjacentHTML('beforebegin', shareHTML);
        
        // Add event listeners
        Utils.$('#share-score-btn').addEventListener('click', () => this.shareScoreWithAli(correct, total, percentage));
        Utils.$('#copy-score-btn').addEventListener('click', () => this.copyScoreToClipboard(correct, total, percentage));
    },
    
    // Share score with Ali (add to message form)
    shareScoreWithAli(correct, total, percentage) {
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

🎯 **Score:** ${correct}/${total} (${percentage}%)
⏰ **Completed:** ${new Date().toLocaleString()}
${performanceEmoji} **Difficulty:** ${percentage >= 80 ? "Challenging but fun!" : "Tricky but interesting!"}

I especially liked the questions about: [What topic did you like?]`;
        
        // Fill the message form
        const messageInput = Utils.$('#sender-message');
        const nameInput = Utils.$('#sender-name');
        
        if (messageInput && nameInput) {
            // Auto-fill name
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
            
            // Focus on message area
            messageInput.focus();
            messageInput.setSelectionRange(0, 0);
            
            // Navigate to the Write Back section
            Navigation.showSection('write-back');
            
            // Smooth scroll to the form
            Utils.safeSetTimeout(() => {
                Utils.$('#message-form').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);
            
            // Show success feedback
            const feedback = Utils.$('#share-feedback');
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
            Utils.safeSetTimeout(() => {
                Utils.launchConfetti();
            }, 500);
            
            Utils.announceToScreenReader('Score added to message form. You can now write a message to Ali.');
            
        } else {
            // Fallback if form elements not found
            this.copyScoreToClipboard(correct, total, percentage);
        }
    },
    
    // Copy score to clipboard
    copyScoreToClipboard(correct, total, percentage) {
        const scoreText = `🎯 CS Quiz Score: ${correct}/${total} (${percentage}%)
Taken on: ${new Date().toLocaleDateString()}
From: Fatima's 18th Birthday Website 🎂`;
        
        navigator.clipboard.writeText(scoreText)
            .then(() => {
                // Show feedback
                const feedback = Utils.$('#share-feedback');
                if (feedback) {
                    feedback.innerHTML = `
                        <div class="share-success">
                            <i class="fas fa-check-circle"></i>
                            <strong>Copied!</strong> Score is ready to paste anywhere.
                        </div>
                    `;
                    feedback.style.display = 'block';
                }
                Utils.announceToScreenReader('Score copied to clipboard');
            })
            .catch(() => {
                // Fallback for older browsers
                prompt("Copy this score:", scoreText);
            });
    }
};

// Make Quiz available globally
window.Quiz = Quiz;
