<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <h1 class="text-h4 font-weight-bold">Terms & Conditions</h1>
          <v-btn
            color="success"
            variant="flat"
            size="large"
            class="action-btn"
            @click="openAddDialog"
          >
            <svg id="fi_2910769" enable-background="new 0 0 24 24" height="23" viewBox="0 0 24 24" width="23" xmlns="http://www.w3.org/2000/svg"><path d="m9.5 21h-7c-1.378 0-2.5-1.121-2.5-2.5v-13c0-1.379 1.122-2.5 2.5-2.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-2c-.827 0-1.5.673-1.5 1.5v13c0 .827.673 1.5 1.5 1.5h7c.276 0 .5.224.5.5s-.224.5-.5.5z"></path><path d="m16.5 9c-.276 0-.5-.224-.5-.5v-3c0-.827-.673-1.5-1.5-1.5h-2c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c1.378 0 2.5 1.121 2.5 2.5v3c0 .276-.224.5-.5.5z"></path><path d="m11.5 6h-6c-.827 0-1.5-.673-1.5-1.5v-2c0-.276.224-.5.5-.5h1.55c.233-1.14 1.242-2 2.45-2s2.217.86 2.45 2h1.55c.276 0 .5.224.5.5v2c0 .827-.673 1.5-1.5 1.5zm-6.5-3v1.5c0 .275.224.5.5.5h6c.276 0 .5-.225.5-.5v-1.5h-1.5c-.276 0-.5-.224-.5-.5 0-.827-.673-1.5-1.5-1.5s-1.5.673-1.5 1.5c0 .276-.224.5-.5.5z"></path><path d="m17.5 24c-3.584 0-6.5-2.916-6.5-6.5s2.916-6.5 6.5-6.5 6.5 2.916 6.5 6.5-2.916 6.5-6.5 6.5zm0-12c-3.033 0-5.5 2.468-5.5 5.5s2.467 5.5 5.5 5.5 5.5-2.468 5.5-5.5-2.467-5.5-5.5-5.5z"></path><path d="m17.5 21c-.276 0-.5-.224-.5-.5v-6c0-.276.224-.5.5-.5s.5.224.5.5v6c0 .276-.224.5-.5.5z"></path><path d="m20.5 18h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path><path d="m13.5 9h-10c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h10c.276 0 .5.224.5.5s-.224.5-.5.5z"></path><path d="m10.5 12h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5z"></path><path d="m8.5 15h-5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h5c.276 0 .5.224.5.5s-.224.5-.5.5z"></path></svg>
            Add
          </v-btn>
        </div>

        <v-card class="terms-card" elevation="2" v-if="hasTerms">
          <v-card-item>
            <div class="d-flex justify-space-between align-center mb-6">
              <div class="text-h6">Current Terms & Conditions</div>
              <v-btn
                color="success"
                variant="outlined"
                class="edit-btn"
                @click="openEditDialog"
              >
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" 
                  alt="Edit" 
                  class="flaticon me-2"
                />
                Edit Terms
              </v-btn>
            </div>

            <v-card-text class="terms-content pa-4" v-html="termsContent"></v-card-text>
          </v-card-item>
        </v-card>

        <v-card v-else class="empty-state pa-8 text-center">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" 
            alt="Terms" 
            class="empty-icon mb-4"
          />
          <h3 class="text-h6 text-grey-darken-1 mb-2">No Terms & Conditions Added</h3>
          <p class="text-body-1 text-grey-darken-1">Click the button above to add terms and conditions.</p>
        </v-card>

        <v-dialog v-model="showDialog" max-width="800px" persistent>
          <v-card class="edit-dialog">
            <v-card-title class="text-h5 pa-4">
              {{ isEditing ? 'Edit' : 'Add' }} Terms & Conditions
            </v-card-title>

            <v-card-text class="pa-4">
              <QuillEditor
                v-model:content="termsContent"
                contentType="html"
                theme="snow"
                toolbar="full"
                :options="editorOptions"
                class="editor"
              />
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="closeDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                color="success"
                variant="flat"
                @click="saveTerms"
                :loading="isSaving"
                class="save-btn"
              >
                {{ isEditing ? 'Save Changes' : 'Save Terms' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// NOTE: Replace with your actual toast notification plugin, e.g., from 'vue-toastification'
const toast = {
  success: (msg) => console.log(`SUCCESS: ${msg}`),
  error: (msg) => console.error(`ERROR: ${msg}`),
};

// --- State (Replaces data()) ---
const showDialog = ref(false);
const termsContent = ref('');
const isSaving = ref(false);
const isEditing = ref(false);
const hasTerms = ref(false);

const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }], [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }], [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }], [{ 'align': [] }],
      ['clean'], ['link', 'image', 'video']
    ]
  },
  placeholder: 'Write your terms and conditions here...'
};

// --- Methods (Replaces methods()) ---
const loadTerms = () => {
  const savedTerms = sessionStorage.getItem('termsAndConditions');
  if (savedTerms) {
    termsContent.value = savedTerms;
    hasTerms.value = true;
  }
};

const openAddDialog = () => {
  isEditing.value = false;
  termsContent.value = ''; // Clear for new entry
  showDialog.value = true;
};

const openEditDialog = () => {
  isEditing.value = true;
  // Ensure the latest version is loaded from storage for editing
  termsContent.value = sessionStorage.getItem('termsAndConditions') || '';
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  // On close, reload the original terms to discard any unsaved changes
  loadTerms();
};

const saveTerms = async () => {
  try {
    isSaving.value = true;
    sessionStorage.setItem('termsAndConditions', termsContent.value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showDialog.value = false; // Close dialog
    hasTerms.value = !!termsContent.value;
    toast.success(`Terms & Conditions ${isEditing.value ? 'updated' : 'added'} successfully`);
  } catch (error) {
    console.error('Error saving terms:', error);
    toast.error(`Failed to ${isEditing.value ? 'update' : 'add'} terms. Please try again.`);
  } finally {
    isSaving.value = false;
  }
};

// --- Lifecycle Hook (Replaces created()) ---
loadTerms();
</script>

<style>
.ql-editor {
  min-height: 400px;
  max-height: calc(100vh - 350px);
  font-family: 'Roboto', sans-serif;
}

.ql-snow .ql-toolbar {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.ql-container.ql-snow {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-color: #e0e0e0;
}

.ql-toolbar.ql-snow .ql-picker-label:hover,
.ql-toolbar.ql-snow .ql-picker-label.ql-active,
.ql-toolbar.ql-snow .ql-picker-item:hover,
.ql-toolbar.ql-snow .ql-picker-item.ql-selected,
.ql-toolbar.ql-snow button:hover,
.ql-toolbar.ql-snow button.ql-active {
  color: #4CAF50;
}

.ql-toolbar.ql-snow .ql-picker-label:hover .ql-stroke,
.ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-stroke,
.ql-toolbar.ql-snow button:hover .ql-stroke,
.ql-toolbar.ql-snow button.ql-active .ql-stroke {
  stroke: #4CAF50;
}

.ql-toolbar.ql-snow .ql-picker-label:hover .ql-fill,
.ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-fill,
.ql-toolbar.ql-snow button:hover .ql-fill,
.ql-toolbar.ql-snow button.ql-active .ql-fill {
  fill: #4CAF50;
}
</style>

<style scoped>
.terms-card {
  border-radius: 15px;
  background: white;
  max-height: calc(100vh - 180px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-state {
  border-radius: 15px;
  border: 2px dashed #e0e0e0;
  background-color: #fafafa;
}

.terms-content {
  line-height: 1.6;
  color: #333;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
}

.flaticon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.empty-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  opacity: 0.6;
}

.action-btn {
  min-width: 200px;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  color: #4CAF50 !important;
  border: 1px solid #4CAF50 !important;
}

.action-btn svg path {
  fill: #fff !important;
}

.action-btn:hover svg path {
  fill: #4CAF50 !important;
}

.edit-btn {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.save-btn {
  transition: all 0.2s ease;

  &:hover {
    color: #4CAF50 !important;
    border: 1px solid #4CAF50 !important;
    background-color: transparent !important;
  }
}

.edit-dialog {
  border-radius: 15px;
}
</style>