<template>
  <div class="quiz-list-container">
    <v-row no-gutters class="px-2" style="height: 100vh">
      <v-col
        cols="3"
        class="categories-section d-flex flex-column nav-border"
        color="green"
      >
        <div class="d-flex justify-space-between align-center px-4 py-3">
          <span class="text-h5 font-weight-bold">Quizzes</span>
    </div>
    
        <div class="categories-inner-section px-2">
          <div class="categories-list pa-2">
            <v-card
              class="mb-2 rounded-lg"
              :class="[!selectedSubject ? 'bg-grey-lighten-4' : '']"
              flat
              @click="selectedSubject = null"
              style="cursor: pointer"
            >
              <v-list-item
                title="All"
                :class="[!selectedSubject ? 'bg-grey-lighten-4' : '']"
              >
                <template v-slot:append>
                  <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </template>
              </v-list-item>
            </v-card>
            <v-card
              v-for="subject in subjects"
              :key="subject"
              :class="[
                'mb-2 rounded-lg',
                subject === selectedSubject ? 'bg-grey-lighten-4' : '',
              ]"
              flat
              @click="selectedSubject = subject"
              style="cursor: pointer"
            >
              <v-list-item
                :title="subject"
                :class="[
                  subject === selectedSubject ? 'bg-grey-lighten-4' : '',
                ]"
                style="cursor: pointer"
                @click="selectedSubject = subject"
              >
                <template v-slot:append>
                  <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </template>
              </v-list-item>
            </v-card>
          </div>
          <div class="px-2 py-3">
            <v-btn
              color="success"
              class="text-none mb-1 add-question-btn"
              @click="router.push('/quizzes/add')"
              size="small"
              block
            >
              <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
              Add Quiz
            </v-btn>
          </div>
        </div>
      </v-col>

      <v-col cols="9" class="content-section px-5">
        <div class="py-3 d-flex align-center">
          <v-text-field
              v-model="search" 
            placeholder="Search..."
            variant="solo"
            rounded="lg"
            density="compact"
            hide-details
            class="mr-4 border-0 input-search"
            bg-color="white"
            style="max-width: 450px"
          >
            <template v-slot:prepend-inner>
              <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
            </template>
          </v-text-field>

          <v-spacer></v-spacer>

          <div class="d-flex align-center mr-4">
            <div class="d-flex align-center mr-4">
              <font-awesome-icon
                icon="fa-solid fa-circle"
                class="mr-1 text-success"
              />
              <span class="text-caption status-text"
                >Active({{ activeQuizCount }})</span
              >
          </div>
            <div class="d-flex align-center">
              <font-awesome-icon
                icon="fa-solid fa-circle"
                class="mr-1 text-warning"
              />
              <span class="text-caption status-text"
                >Disabled({{ disabledQuizCount }})</span
              >
        </div>
          </div>
          </div>
          
        <div 
          class="quiz-cards pa-6"
          style="height: calc(100vh - 146px); overflow-y: auto"
        >
          <v-row>
            <v-col
              v-for="quiz in filteredQuizzes" 
              :key="quiz.id" 
              cols="12"
              md="6"
            >
              <v-card flat class="pa-4 rounded-lg quiz-card">
                <div class="d-flex justify-space-between align-center mb-2">
                  <v-chip
                    color="#F1F1F1"
                    variant="flat"
                    size="small"
                    class="font-weight-medium text-success rounded-lg"
                  >
                    {{ quiz.category }}
                  </v-chip>
                  <div class="d-flex align-center status-chip">
                    <font-awesome-icon 
                      :icon="['fas', 'circle']" 
                      :class="quiz.isActive ? 'text-success' : 'text-warning'" 
                      class="mr-1" 
                      size="sm"
                    />
                    <span class="text-caption">{{
                      quiz.isActive ? "Active" : "Disabled"
                    }}</span>
                </div>
              </div>
              
                <div class="text-subtitle-1 font-weight-bold mb-2">
                  {{ quiz.name }}
                </div>

                <div class="d-flex align-center text-caption text-grey mb-4">
                  <span>{{ quiz.date }}</span>
                  <v-divider vertical class="mx-2 "></v-divider>
                  <span>{{ quiz.grade }}</span>
                  <v-divider vertical class="mx-2"></v-divider>
                  <span>{{ quiz.questions }} Questions</span>
                  <v-divider vertical class="mx-2"></v-divider>
                  <span>{{ quiz.duration }} Mins</span>
              </div>
              
                <div class="d-flex justify-space-between align-center">
                  <v-switch
                    :model-value="quiz.isActive"
                    color="success"
                    hide-details
                    density="compact"
                    inset
                    class="compact-switch"
                    style="transform: scale(0.6); transform-origin: left center;"
                  ></v-switch>
                  <div class="d-flex align-center gap-2">
                <v-btn
                  variant="text"
                      class="action-btn view-btn"
                  size="small"
                      @click="openViewDialog(quiz)"
                >
                      <font-awesome-icon icon="fa-solid fa-eye" class="mr-2" />
                  View
                </v-btn>
                <v-btn
                  variant="text"
                      class="action-btn edit-btn"
                  size="small"
                      @click="editQuiz(quiz)"
                >
                      <font-awesome-icon icon="fa-solid fa-pencil" class="mr-2" />
                  Edit
                </v-btn>
              </div>
            </div>
              </v-card>
            </v-col>
          </v-row>
          </div>
      </v-col>
    </v-row>
    
    <v-dialog v-model="viewDialog" width="700">
      <v-card class="quiz-modal rounded-lg">
        <v-card-title class="d-flex flex-column align-start pa-6">
          <div class="text-h5 font-weight-bold mb-4">{{ selectedQuiz?.name }}</div>
          
          <div class="d-flex flex-wrap gap-6">
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Category</div>
              <div class="text-subtitle-1">{{ selectedQuiz?.category }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Grade</div>
              <div class="text-subtitle-1">{{ selectedQuiz?.grade }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Published Date</div>
              <div class="text-subtitle-1">{{ selectedQuiz?.date }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Status</div>
              <div class="text-subtitle-1 d-flex align-center">
                <font-awesome-icon 
                  :icon="['fas', 'circle']" 
                  :class="selectedQuiz?.isActive ? 'text-success' : 'text-warning'" 
                  class="mr-2" 
                  size="sm"
                />
                {{ selectedQuiz?.isActive ? 'Active' : 'Disabled' }}
              </div>
            </div>
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6 pt-0">
          <div class="text-subtitle-1 font-weight-medium mb-4 text-success">
            {{ selectedQuiz?.questions?.length || 0 }} Questions • {{ selectedQuiz?.duration }} Mins
          </div>
          
          <div class="questions-list">
            <template v-if="getQuizQuestions(selectedQuiz?.category).length > 0">
              <div v-for="(question, index) in getQuizQuestions(selectedQuiz?.category)" 
                   :key="index" 
                   class="question-item pa-4 mb-4"
              >
                <div class="d-flex align-center mb-2">
                  <div class="question-number">{{ String(index + 1).padStart(2, '0') }}</div>
                  <div class="text-subtitle-1 ml-3">{{ question.question }}</div>
                </div>
                
                <div class="options-grid mt-4">
                  <div 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    class="option-item"
                    :class="{ 'correct': String.fromCharCode(65 + optIndex) === question.correct }"
                  >
                    <span class="option-key">{{ String.fromCharCode(65 + optIndex) }}</span>
                    <span>{{ option }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="text-center pa-4">
              <font-awesome-icon icon="fa-solid fa-exclamation-circle" class="text-warning mb-2" size="2x" />
              <div class="text-subtitle-1">No questions available for this quiz</div>
              <div class="text-caption text-medium-emphasis">Please add questions to view them here</div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="text"
            @click="viewDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// --- Composables ---
const router = useRouter();

// --- State ---
const search = ref("");
const subjects = ["Maths", "Science", "GK", "History", "Social Studies"];
const selectedSubject = ref(null);
const viewDialog = ref(false);
const selectedQuiz = ref(null);
const quizzes = ref([]);
const categoryQuestions = ref({
  Maths: [ { question: "What is the value of x in the equation 2x + 5 = 15?", options: ["4", "5", "6", "7"], correct: "B" } /* ... */ ],
  Science: [ { question: "What is the unit of force in the SI system?", options: ["Watt", "Newton", "Joule", "Pascal"], correct: "B" } /* ... */ ],
  GK: [ { question: "Which is the largest planet in our solar system?", options: ["Mars", "Saturn", "Jupiter", "Neptune"], correct: "C" } /* ... */ ],
  History: [ { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correct: "C" } /* ... */ ],
  "Social Studies": [ { question: "What is the study of population patterns called?", options: ["Geography", "Demographics", "Sociology", "Economics"], correct: "B" } /* ... */ ]
});

// --- Computed ---
const filteredQuizzes = computed(() => {
  let filtered = quizzes.value;

  if (selectedSubject.value) {
    filtered = filtered.filter(quiz => quiz.category === selectedSubject.value);
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(quiz =>
      quiz.name.toLowerCase().includes(searchLower) ||
      quiz.category.toLowerCase().includes(searchLower) ||
      quiz.grade.toLowerCase().includes(searchLower)
    );
  }
  return filtered;
});

const activeQuizCount = computed(() => quizzes.value.filter(q => q.isActive).length);
const disabledQuizCount = computed(() => quizzes.value.filter(q => !q.isActive).length);

// --- Methods ---
const loadQuizzes = () => {
  try {
    const savedCategoryQuestions = sessionStorage.getItem('categoryQuestions');
    if (!savedCategoryQuestions) {
      sessionStorage.setItem('categoryQuestions', JSON.stringify(categoryQuestions.value));
    } else {
      categoryQuestions.value = JSON.parse(savedCategoryQuestions);
    }

    const savedQuizzes = sessionStorage.getItem('quizzes');
    if (savedQuizzes) {
      quizzes.value = JSON.parse(savedQuizzes);
    } else {
      const defaultQuizzes = [
        { id: 1, name: "Basic Mathematics Quiz", category: "Maths", isActive: true, date: "01-03-2025", grade: "Grade 7", questions: categoryQuestions.value['Maths'].length, duration: 20, savedQuestions: categoryQuestions.value['Maths'] },
        { id: 2, name: "Advanced Physics Test", category: "Science", isActive: false, date: "05-03-2025", grade: "Grade 9", questions: categoryQuestions.value['Science'].length, duration: 30, savedQuestions: categoryQuestions.value['Science'] },
        { id: 3, name: "World History Quiz", category: "History", isActive: true, date: "10-03-2025", grade: "Grade 8", questions: categoryQuestions.value['History'].length, duration: 35, savedQuestions: categoryQuestions.value['History'] },
        { id: 4, name: "Current Affairs Test", category: "GK", isActive: true, date: "15-03-2025", grade: "Grade 6", questions: categoryQuestions.value['GK'].length, duration: 40, savedQuestions: categoryQuestions.value['GK'] },
        { id: 5, name: "Civics and Society", category: "Social Studies", isActive: false, date: "20-03-2025", grade: "Grade 7", questions: categoryQuestions.value['Social Studies'].length, duration: 25, savedQuestions: categoryQuestions.value['Social Studies'] }
      ];
      sessionStorage.setItem('quizzes', JSON.stringify(defaultQuizzes));
      quizzes.value = defaultQuizzes;
    }
  } catch (error) {
    console.error('Error loading quizzes:', error);
  }
};

const openViewDialog = (quiz) => {
  selectedQuiz.value = quiz;
  viewDialog.value = true;
};

const editQuiz = (quiz) => {
  try {
    sessionStorage.setItem('editQuizData', JSON.stringify(quiz));
    router.push(`/quizzes/${quiz.id}/edit`);
  } catch (error) {
    console.error('Error preparing quiz for edit:', error);
    alert('Failed to prepare quiz for editing.');
  }
};

const getQuizQuestions = (category) => {
  try {
    if (selectedQuiz.value && selectedQuiz.value.savedQuestions) {
      return selectedQuiz.value.savedQuestions.map(q => ({
        question: q.question || q.text || '',
        options: q.options || [],
        correct: q.correct
      }));
    }
    return categoryQuestions.value[category] || [];
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    return [];
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
  loadQuizzes();
});
</script>


<style scoped>
.quiz-list-container {
  background-color: #f8f9fa;
  overflow-y: hidden !important;
}

.navigation-section {
  border-right: 1px solid #eeeeee;
  background-color: white;
  height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.categories-section {
  border-right: 1px solid #eeeeee;
  background-color: transparent;
  height: 100vh;
  transition: all 0.3s ease;
}

.categories-section .categories-inner-section {
  background-color: #fff;
  padding-top: 20px !important;
  border-radius: 15px;
  border: 1px solid #DDD !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.categories-section .categories-list {
  background-color: #fff;
  padding-top: 20px !important;
  border-radius: 15px;
  height: calc(100vh - 233px);
  overflow-y: auto !important;
}

.categories-section .add-question-btn {
  padding: 20px 15px !important;
  font-size: 16px !important;
  border: 1px solid #4caf50 !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.categories-section .add-question-btn:hover {
  color: #4caf50 !important;
  border: 1px solid #4caf50 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.categories-section .add-question-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.categories-section .add-question-btn:hover::after {
  width: 300px;
  height: 300px;
}

.content-section {
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Search and Status Bar */
.search-status-bar {
  background: white;
  border-radius: 15px;
  padding: 16px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.input-search {
  :deep(.v-field__input::placeholder) {
    color: #4caf50 !important;
    opacity: 1;
  }

  :deep(.v-field) {
    border-radius: 15px !important;
    transition: all 0.3s ease;
    background: #f8f9fa !important;
  }

  :deep(.v-field:hover) {
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  }
}

.search-icon {
  color: #4caf50;
  transition: all 0.3s ease;
}

/* Status Indicators */
.status-indicators {
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 12px;
  display: flex;
  gap: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Quiz Cards */
.quiz-cards {
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #DDD !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  padding: 24px;
}

.quiz-card {
  border: 1px solid #DDD !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: white;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.quiz-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4caf50, #81c784);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quiz-card:hover::before {
  opacity: 1;
}

/* Category Chip */
.category-chip {
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9) !important;
  color: #2E7D32 !important;
  font-weight: 500 !important;
  border-radius: 8px !important;
  padding: 4px 12px !important;
}

/* Status Chip */
.status-chip {
  background-color: #FFF !important;
  border-radius: 8px !important;
  padding: 4px 12px !important;
  transition: all 0.3s ease;
  border: 1px solid #E0E0E0;
}

.status-chip:hover {
  transform: scale(1.05);
}

/* Quiz Info */
.quiz-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666;
  font-size: 0.875rem;
}

.info-divider {
  width: 4px;
  height: 4px;
  background: #4caf50;
  border-radius: 50%;
}

/* Action Buttons */
.action-btn {
  padding: 6px 16px !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
}

.view-btn {
  color: #4caf50 !important;
  background: rgba(76, 175, 80, 0.1) !important;
}

.view-btn:hover {
  background: rgba(76, 175, 80, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.edit-btn {
  color: #1976d2 !important;
  background: rgba(25, 118, 210, 0.1) !important;
}

.edit-btn:hover {
  background: rgba(25, 118, 210, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

/* Compact Switch */
.compact-switch {
  :deep(.v-selection-control) {
    min-height: 20px !important;
    margin-inline-start: 0 !important;
  }

  :deep(.v-switch__track) {
    height: 10px !important;
    width: 18px !important;
  }

  :deep(.v-switch__thumb) {
    height: 6px !important;
    width: 6px !important;
  }

  :deep(.v-switch__thumb-container) {
    top: 2px !important;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quiz-card {
  animation: fadeIn 0.5s ease;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.status-text {
  font-size: 16px !important;
  margin-left: 5px !important;
  color: #151313 !important;
  font-weight: 500;
}

.gap-6 {
  gap: 24px;
}

.info-item {
  min-width: 120px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
}

.question-number {
  background: linear-gradient(135deg, #4CAF50, #81c784);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.question-item {
  background: #F9FAFC;
  border-radius: 12px;
  border: none !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.question-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.option-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.option-item.correct {
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  border-color: #4CAF50;
  color: #2E7D32;
  animation: correctPulse 1s ease;
}

@keyframes correctPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.option-key {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.correct .option-key {
  background: linear-gradient(135deg, #4CAF50, #81c784);
  color: white;
  transform: scale(1.1);
}

/* Add smooth transitions for all interactive elements */
.v-btn,
.v-card,
.v-list-item,
.v-text-field,
.v-switch {
  transition: all 0.3s ease !important;
}

/* Add hover effects for interactive elements */
.v-btn:hover,
.v-card:hover,
.v-list-item:hover {
  transform: translateY(-2px);
}

/* Add ripple effect for buttons */
.v-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.v-btn:hover::after {
  width: 300px;
  height: 300px;
}

.action-btn:hover::after {
  width: 300px;
  height: 300px;
}

.gap-2 {
  gap: 8px;
}
</style>
<!-- I have converted all of them from Options API to Composition API. Please verify if I have done it correctly. If I have done it correctly, then tell me what should I do next? -->