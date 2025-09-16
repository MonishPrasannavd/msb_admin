<template>
  <div class="edit-quiz-container pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Edit Questions<span class="text-success">(Active)</span></h1>
      <v-btn
        color="success"
        variant="text"
        size="large"
        class="back-btn"
        @click="router.push('/quizzes')"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-left" class="mr-2" />
        Back to Quiz List
      </v-btn>
    </div>

    <div class="edit-form-container">
      <v-row class="mb-6">
        <v-col cols="4">
          <v-text-field
            v-model="quizData.name"
            label="Test Name"
            variant="outlined"
            density="comfortable"
            bg-color="white"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-select
            v-model="quizData.category"
            :items="subjects"
            label="Category"
            variant="outlined"
            density="comfortable"
            bg-color="white"
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            v-model="quizData.grade"
            :items="grades"
            label="Grade"
            variant="outlined"
            density="comfortable"
            bg-color="white"
            hide-details
          ></v-select>
        </v-col>
      </v-row>

      <div class="d-flex justify-space-between align-center mb-4">
        <div class="text-h6">Questions List</div>
        <div class="text-success">{{ quizData.duration }} Mins({{ quizData.questions.length }} Questions)</div>
      </div>

      <div class="questions-container">
        <div v-for="(question, index) in quizData.questions" 
             :key="index" 
             class="question-item pa-4 mb-4"
        >
          <div class="d-flex align-center mb-4">
            <v-text-field
              v-model="question.text"
              class="question-input"
              variant="outlined"
              density="comfortable"
              hide-details
              placeholder="Enter your question"
            >
              <template v-slot:prepend-inner>
                <div class="question-number">{{ String(index + 1).padStart(2, '0') }}</div>
              </template>
            </v-text-field>
          </div>

          <div class="options-grid">
            <div v-for="(option, optIndex) in question.options" 
                 :key="optIndex"
                 class="option-item"
                 :class="{ 'correct': String.fromCharCode(65 + optIndex) === question.correct }"
                 @click="setCorrectAnswer(index, String.fromCharCode(65 + optIndex))"
            >
              <span class="option-key">{{ String.fromCharCode(65 + optIndex) }}</span>
              <v-text-field
                v-model="question.options[optIndex]"
                variant="plain"
                density="comfortable"
                hide-details
                placeholder="Enter option"
                class="option-input"
              ></v-text-field>
            </div>
          </div>

          <div class="d-flex justify-end mt-2">
            <v-btn
              color="error"
              variant="text"
              size="small"
              @click="removeQuestion(index)"
              class="delete-btn"
            >
              <font-awesome-icon icon="fa-solid fa-trash" class="mr-2" />
              Delete
            </v-btn>
          </div>
        </div>
      </div>

      <div class="d-flex justify-center mt-6 gap-4">
        <v-btn
          color="success"
          variant="outlined"
          size="large"
          @click="addNewQuestion"
          class="action-btn"
        >
          <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
          Add Question
        </v-btn>
        
        <v-btn
          color="success"
          size="large"
          class="save-btn"
          @click="saveChanges"
          :loading="isSaving"
        >
          <font-awesome-icon icon="fa-solid fa-save" class="mr-2" />
          Save Changes
        </v-btn>
      </div>
    </div>

    <v-dialog v-model="showAddDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Add New Question
        </v-card-title>

        <v-card-text class="pa-4">
          <v-text-field
            v-model="newQuestion.text"
            label="Question"
            variant="outlined"
            density="comfortable"
            placeholder="Enter your question"
            class="mb-4"
          ></v-text-field>

          <div class="options-section mb-4">
            <div class="text-subtitle-1 mb-2">Options</div>
            <div class="options-grid">
              <div v-for="(option, index) in newQuestion.options" 
                   :key="index"
                   class="option-item"
                   :class="{ 'correct': String.fromCharCode(65 + index) === newQuestion.correct }"
                   @click="setNewQuestionCorrect(String.fromCharCode(65 + index))"
              >
                <span class="option-key">{{ String.fromCharCode(65 + index) }}</span>
                <v-text-field
                  v-model="newQuestion.options[index]"
                  :placeholder="'Option ' + String.fromCharCode(65 + index)"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-text-field>
              </div>
            </div>
          </div>

          <div class="text-caption text-grey">Click on an option to mark it as correct answer</div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeAddDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="saveNewQuestion"
            :disabled="!isNewQuestionValid"
            class="save-btn"
          >
            Add Question
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// --- Composables ---
const router = useRouter();

// --- State ---
const isSaving = ref(false);
const subjects = ['Maths', 'Science', 'GK', 'History', 'Social Studies'];
const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
const showAddDialog = ref(false);

// Using 'reactive' for objects is often cleaner
const newQuestion = reactive({
  text: '',
  options: ['', '', '', ''],
  correct: null
});

const quizData = reactive({
  id: null,
  name: '',
  category: '',
  grade: '',
  duration: 45,
  questions: []
});

// --- Computed ---
const isNewQuestionValid = computed(() => {
  return (
    newQuestion.text.trim() !== '' &&
    newQuestion.options.every(opt => opt.trim() !== '') &&
    newQuestion.correct !== null
  );
});

// --- Methods ---
const loadQuizData = () => {
  try {
    const savedQuizData = sessionStorage.getItem('editQuizData');
    if (savedQuizData) {
      const parsedData = JSON.parse(savedQuizData);
      
      // Assign properties to the reactive quizData object
      quizData.id = parsedData.id;
      quizData.name = parsedData.name || '';
      quizData.category = parsedData.category || '';
      quizData.grade = parsedData.grade || '';
      quizData.duration = parsedData.duration || 45;
      quizData.questions = (parsedData.savedQuestions || []).map(q => ({
        text: q.question || q.text || '',
        options: q.options || ['', '', '', ''],
        correct: q.correct || null
      }));
      
      sessionStorage.removeItem('editQuizData');
    } else {
      alert('No quiz data found. Redirecting...');
      router.push('/quizzes');
    }
  } catch (error) {
    console.error('Error loading quiz:', error);
    alert('Failed to load quiz data. Redirecting...');
    router.push('/quizzes');
  }
};

const saveChanges = async () => {
  try {
    isSaving.value = true;
    
    if (!quizData.name || !quizData.category || !quizData.grade || quizData.questions.length === 0) {
      alert('Please fill in all quiz details and add at least one question.');
      return;
    }
    
    const invalidQuestion = quizData.questions.find(q => !q.text || q.options.some(opt => !opt) || !q.correct);
    if (invalidQuestion) {
      alert('Please complete all questions with text, four options, and a correct answer.');
      return;
    }

    const existingQuizzes = JSON.parse(sessionStorage.getItem('quizzes') || '[]');
    const quizIndex = existingQuizzes.findIndex(q => q.id === quizData.id);

    if (quizIndex !== -1) {
      const formattedQuestions = quizData.questions.map(q => ({
        question: q.text,
        options: q.options,
        correct: q.correct
      }));

      const updatedQuiz = {
        ...existingQuizzes[quizIndex],
        name: quizData.name,
        category: quizData.category,
        grade: quizData.grade,
        duration: quizData.duration,
        questions: formattedQuestions.length,
        savedQuestions: formattedQuestions,
        lastModified: new Date().toISOString()
      };

      existingQuizzes[quizIndex] = updatedQuiz;
      sessionStorage.setItem('quizzes', JSON.stringify(existingQuizzes));
      
      const categoryQuestions = JSON.parse(sessionStorage.getItem('categoryQuestions') || '{}');
      categoryQuestions[quizData.category] = formattedQuestions;
      sessionStorage.setItem('categoryQuestions', JSON.stringify(categoryQuestions));
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Quiz saved successfully');
    router.push('/quizzes');

  } catch (error) {
    console.error('Error saving quiz:', error);
    alert('Failed to save quiz.');
  } finally {
    isSaving.value = false;
  }
};

const setCorrectAnswer = (questionIndex, option) => {
  quizData.questions[questionIndex].correct = option;
};

const addNewQuestion = () => {
  // Reset the reactive newQuestion object
  Object.assign(newQuestion, {
    text: '',
    options: ['', '', '', ''],
    correct: null
  });
  showAddDialog.value = true;
};

const setNewQuestionCorrect = (option) => {
  newQuestion.correct = option;
};

const closeAddDialog = () => {
  showAddDialog.value = false;
};

const saveNewQuestion = () => {
  if (isNewQuestionValid.value) {
    // Push a copy of the newQuestion object
    quizData.questions.push({ ...newQuestion });
    closeAddDialog();
  }
};

const removeQuestion = (index) => {
  quizData.questions.splice(index, 1);
};

// --- Lifecycle Hook ---
onMounted(() => {
  loadQuizData();
});
</script>


<style scoped>
.edit-quiz-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 24px;
  width: 100%;
}

.edit-form-container {
  background: white;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 1px 1px 7px 1px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0 auto;
}

.question-number {
  background: #4CAF50;
  color: white;
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 12px;
}

.questions-container {
  height: calc(100vh - 420px);
  min-height: 200px;
  overflow-y: auto;
  padding: 10px;
}

.question-item {
  background: #F1F1F1;
  border-radius: 12px;
  margin-bottom: 30px !important;
  box-shadow: 1px 1px 7px 1px rgba(0, 0, 0, 0.1);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.option-item {
  background: #FFF;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: #4CAF50;
}

.option-item.correct {
  background: #E8F5E9;
  border-color: #4CAF50;
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
}

.correct .option-key {
  background: #4CAF50;
  color: white;
}

.option-input {
  width: 100%;
}

.delete-btn {
  color: #FF5252;
}

.add-question-btn {
  min-width: 200px;
  border: 2px solid #4CAF50;
}

/* Custom scrollbar */
.questions-container::-webkit-scrollbar {
  width: 6px;
}

.questions-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.questions-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.questions-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

:deep(.v-field) {
  border-radius: 8px !important;
}

:deep(.v-field.v-field--variant-plain) {
  padding: 0 !important;
}

:deep(.v-field.v-field--variant-plain .v-field__input) {
  padding: 0 !important;
}

.save-btn {
  min-width: 150px;
}
.save-btn:hover {
  background-color: #FFF !important;
  color: #4CAF50 !important;
  border: 1px solid #4CAF50 !important;
}
.question-input{
  background-color: #FFF !important;
  outline: none !important;
}

.gap-4 {
  gap: 16px;
}

.action-btn {
  min-width: 180px;
}

.back-btn {
  min-width: 180px;
  border: 1px solid #4CAF50;
}

.back-btn:hover {
  background-color: #4CAF50 !important;
  color: white !important;
}
</style>