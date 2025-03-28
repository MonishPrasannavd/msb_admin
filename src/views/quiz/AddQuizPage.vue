<template>
  <div class="add-quiz-container">
    <v-card class="add-quiz-card mx-auto" elevation="1">
      <v-card-title class="text-center pt-6 pb-4">Add Questions</v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" class="add-quiz-form">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="quizTitle"
                placeholder="Enter Quiz Title"
                variant="outlined"
                color="success"
                class="quiz-input"
                density="comfortable"
                bg-color="white"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                placeholder="Select Category"
                variant="outlined"
                color="success"
                class="quiz-input"
                density="comfortable"
                bg-color="white"
                hide-details="auto"
                @update:model-value="handleCategoryChange"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="selectedGrade"
                :items="grades"
                placeholder="Select Grade"
                variant="outlined"
                color="success"
                class="quiz-input"
                density="comfortable"
                bg-color="white"
                hide-details="auto"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <div class="upload-section text-center py-8" @click="$refs.fileInput.click()">
                <div class="text-subtitle-1 text-success mb-2">Click to upload Questions CSV</div>
                <div class="text-caption text-grey">
                  The CSV should have columns for question text, options and correct answers*
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  accept=".csv"
                  style="display: none"
                  @change="handleFileUpload"
                />
              </div>
            </v-col>

            <v-col cols="12" class="d-flex justify-space-between pt-4">
              <v-btn
                color="grey-darken-1"
                variant="text"
                class="text-none px-6"
                @click="$router.push('/quizzes')"
              >
                Cancel
              </v-btn>
              <v-btn
                color="success"
                class="text-none px-6"
                :loading="loading"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Dialog for adding new category -->
    <v-dialog v-model="showNewCategoryDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center pt-6 pb-2">Add New Category</v-card-title>
        
        <v-card-text>
          <v-text-field
            v-model="newCategory"
            placeholder="Enter Category Name"
            variant="outlined"
            color="success"
            class="quiz-input mt-4"
            density="comfortable"
            bg-color="white"
            hide-details="auto"
            autofocus
            @keyup.enter="addNewCategory"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            class="text-none"
            @click="cancelNewCategory"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            class="text-none"
            :disabled="!newCategory"
            @click="addNewCategory"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddQuizPage',
  data() {
    return {
      quizTitle: '',
      selectedCategory: null,
      selectedGrade: null,
      categories: ['Maths', 'Science', 'GK', 'History', 'Social Studies', 'Others'],
      grades: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
      loading: false,
      file: null,
      showNewCategoryDialog: false,
      newCategory: '',
      previousCategory: null,
      defaultQuestions: {
        Science: [
          {
            question: "What is the chemical symbol for gold?",
            options: ["Au", "Ag", "Fe", "Cu"],
            correct: "A"
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct: "B"
          },
          {
            question: "What is the process by which plants make their food?",
            options: ["Photosynthesis", "Respiration", "Digestion", "Absorption"],
            correct: "A"
          },
          {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Platinum"],
            correct: "C"
          },
          {
            question: "Which gas do plants absorb from the air for photosynthesis?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            correct: "B"
          }
        ],
        History: [
          {
            question: "Who was the first President of the United States?",
            options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
            correct: "C"
          },
          {
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correct: "C"
          },
          {
            question: "Who wrote the 'Declaration of Independence'?",
            options: ["Thomas Jefferson", "John Adams", "Benjamin Franklin", "George Washington"],
            correct: "A"
          },
          {
            question: "Which empire was ruled by Julius Caesar?",
            options: ["Greek", "Roman", "Persian", "Ottoman"],
            correct: "B"
          },
          {
            question: "When did World War I begin?",
            options: ["1913", "1914", "1915", "1916"],
            correct: "B"
          }
        ],
        GK: [
          {
            question: "Which is the largest planet in our solar system?",
            options: ["Mars", "Saturn", "Jupiter", "Neptune"],
            correct: "C"
          },
          {
            question: "What is the capital of Japan?",
            options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
            correct: "C"
          },
          {
            question: "Who painted the Mona Lisa?",
            options: ["Van Gogh", "Da Vinci", "Picasso", "Michelangelo"],
            correct: "B"
          },
          {
            question: "Which is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: "D"
          },
          {
            question: "Which is the longest river in the world?",
            options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
            correct: "B"
          }
        ],
        Maths: [
          {
            question: "What is the value of π (pi) to two decimal places?",
            options: ["3.14", "3.16", "3.12", "3.18"],
            correct: "A"
          },
          {
            question: "What is the square root of 144?",
            options: ["10", "12", "14", "16"],
            correct: "B"
          },
          {
            question: "What is the sum of angles in a triangle?",
            options: ["90°", "180°", "270°", "360°"],
            correct: "B"
          },
          {
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correct: "B"
          },
          {
            question: "Solve: 3x + 5 = 20",
            options: ["3", "5", "7", "8"],
            correct: "B"
          }
        ],
        "Social Studies": [
          {
            question: "What is the study of population patterns called?",
            options: ["Geography", "Demographics", "Sociology", "Economics"],
            correct: "B"
          },
          {
            question: "Which branch of government makes laws?",
            options: ["Executive", "Legislative", "Judicial", "Administrative"],
            correct: "B"
          },
          {
            question: "What is the basic unit of society?",
            options: ["Individual", "Family", "Community", "Nation"],
            correct: "B"
          },
          {
            question: "What type of government is ruled by the people?",
            options: ["Monarchy", "Democracy", "Dictatorship", "Oligarchy"],
            correct: "B"
          },
          {
            question: "What is GDP?",
            options: ["Gross Domestic Product", "Global Development Plan", "General Domestic Policy", "Geographic Data Point"],
            correct: "A"
          }
        ]
      }
    }
  },
  created() {
    this.initializeCategoryQuestions();
  },
  computed: {
    isFormValid() {
      return this.quizTitle && this.selectedCategory && this.selectedGrade
    }
  },
  methods: {
    initializeCategoryQuestions() {
      // Get existing category questions from sessionStorage
      const categoryQuestions = JSON.parse(sessionStorage.getItem('categoryQuestions') || '{}');
      
      // For each category, check if questions exist, if not, add default questions
      Object.keys(this.defaultQuestions).forEach(category => {
        if (!categoryQuestions[category] || categoryQuestions[category].length === 0) {
          categoryQuestions[category] = this.defaultQuestions[category];
        }
      });
      
      // Save updated category questions back to sessionStorage
      sessionStorage.setItem('categoryQuestions', JSON.stringify(categoryQuestions));
    },
    handleCategoryChange(value) {
      if (value === 'Others') {
        this.previousCategory = this.selectedCategory
        this.showNewCategoryDialog = true
      }
    },
    addNewCategory() {
      if (this.newCategory) {
        // Add the new category to the list
        this.categories.splice(this.categories.length - 1, 0, this.newCategory)
        // Select the new category
        this.selectedCategory = this.newCategory
        // Reset and close dialog
        this.newCategory = ''
        this.showNewCategoryDialog = false
      }
    },
    cancelNewCategory() {
      // Revert to previous selection
      this.selectedCategory = this.previousCategory
      this.newCategory = ''
      this.showNewCategoryDialog = false
    },
    handleFileUpload(event) {
      this.file = event.target.files[0]
    },
    handleSubmit() {
      if (this.isFormValid) {
        this.loading = true;
        
        // Get existing quizzes from sessionStorage
        const existingQuizzes = JSON.parse(sessionStorage.getItem('quizzes') || '[]');
        
        // Get category questions
        const categoryQuestions = JSON.parse(sessionStorage.getItem('categoryQuestions') || '{}');
        const questionsCount = categoryQuestions[this.selectedCategory]?.length || 0;
        
        // Create new quiz object
        const newQuiz = {
          id: existingQuizzes.length + 1,
          name: this.quizTitle,
          category: this.selectedCategory,
          isActive: true,
          date: new Date().toLocaleDateString('en-GB'),
          grade: this.selectedGrade,
          questions: questionsCount,
          duration: 30,
          savedQuestions: categoryQuestions[this.selectedCategory] || []
        };
        
        // Add to existing quizzes
        existingQuizzes.push(newQuiz);
        
        // Save back to sessionStorage
        sessionStorage.setItem('quizzes', JSON.stringify(existingQuizzes));
        
        setTimeout(() => {
          this.loading = false;
          this.$router.push('/quizzes');
        }, 1500);
      }
    }
  }
}
</script>

<style scoped>
.add-quiz-container {
  min-height: 100vh;
  background: white;
  padding: 40px 20px;
}

.add-quiz-card {
  max-width: 900px;
  border-radius: 16px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05) !important;
}

/* Input Fields Styling */
.quiz-input {
  transition: all 0.3s ease;
}

.quiz-input :deep(.v-field) {
  border-radius: 12px !important;
  background: white !important;
  transition: all 0.3s ease;
}

.quiz-input :deep(.v-field__input) {
  padding: 10px 16px !important;
  font-size: 14px !important;
  color: #2c3e50 !important;
  font-weight: 400 !important;
}

.quiz-input :deep(.v-field__outline) {
  border-width: 1.5px !important;
  border-color: #e0e0e0 !important;
  transition: all 0.3s ease;
}

.quiz-input :deep(.v-field--focused .v-field__outline) {
  border-color: #4caf50 !important;
  border-width: 2px !important;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.quiz-input :deep(.v-field:hover .v-field__outline) {
  border-color: #4caf50 !important;
}

.quiz-input :deep(.v-field__prepend-inner) {
  padding-inline-start: 16px !important;
}

.quiz-input :deep(.v-select__selection-text) {
  color: #2c3e50 !important;
  font-weight: 400 !important;
}

.quiz-input :deep(.v-field__placeholder) {
  color: #94a3b8 !important;
  font-weight: 400 !important;
}

/* Upload Section Styling */
.upload-section {
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 32px !important;
}

.upload-section:hover {
  border-color: #4caf50;
  background: #f0fdf4;
}

.upload-section .text-subtitle-1 {
  font-weight: 500 !important;
  letter-spacing: 0.3px;
}

/* Button Styling */
.v-btn {
  text-transform: none !important;
  letter-spacing: 0.3px !important;
  font-weight: 500 !important;
  border-radius: 12px !important;
  height: 44px !important;
  min-width: 120px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

/* Text Button Animation */
.v-btn.v-btn--variant-text {
  opacity: 0.9;
  transition: all 0.3s ease !important;
}

.v-btn.v-btn--variant-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: -1;
}

.v-btn.v-btn--variant-text:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.v-btn.v-btn--variant-text:hover::before {
  width: 300px;
  height: 300px;
}

.v-btn.v-btn--variant-text:active {
  transform: translateY(1px);
}

/* Success Button Animation */
.v-btn.success {
  background: linear-gradient(45deg, #4caf50, #66bb6a) !important;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2) !important;
}

.v-btn.success::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  transition: transform 0.6s ease;
}

.v-btn.success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.25) !important;
}

.v-btn.success:hover::after {
  transform: rotate(45deg) translate(50%, 50%);
}

.v-btn.success:active {
  transform: translateY(0);
}

/* Disabled State */
.v-btn:disabled {
  opacity: 0.7 !important;
  box-shadow: none !important;
  transform: none !important;
  cursor: not-allowed;
}

/* Loading Animation */
.v-btn.v-btn--loading {
  transform: none !important;
}

.v-btn.v-btn--loading .v-btn__loader {
  border-color: white !important;
  border-right-color: transparent !important;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse Animation for Success Button */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
  }
  100% {
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }
}

.v-btn.success:not(:disabled):not(.v-btn--loading):hover {
  animation: pulse 2s infinite;
}

/* Click Effect */
.v-btn:active::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: clickEffect 0.5s ease-out;
}

@keyframes clickEffect {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* Dialog Styling */
.v-dialog .v-card {
  border-radius: 16px !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
}

.v-dialog .v-card-title {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #2c3e50 !important;
}

.v-dialog .v-card-actions {
  padding: 16px 24px 24px !important;
}

/* Form Animation */
.add-quiz-form {
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 