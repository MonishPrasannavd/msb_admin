<template>
  <div class="talent-view-container">
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular indeterminate color="success" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading talent data...</p>
    </div>

    <v-row no-gutters class="px-2" style="height: 100vh">
      <v-col cols="3" class="talent-info-section d-flex flex-column nav-border">
        <div class="d-flex justify-space-between align-center px-4 py-3">
          <span class="text-h5 font-weight-bold">{{ talent?.name || 'Talent' }}</span>
          <v-btn color="success" variant="text" size="small" @click="router.push('/categories')">
            <font-awesome-icon icon="fa-solid fa-arrow-left" class="mr-2" />
            Back
          </v-btn>
        </div>

        <div class="talent-details pa-4">
          <div class="talent-avatar-container text-center mb-4">
            <v-avatar size="120" class="mb-3">
              <v-img v-if="talentIconPath" :src="talentIconPath" :alt="talentIconPath" cover></v-img>
              <v-icon v-else icon="mdi-account" size="60" color="grey"></v-icon>
            </v-avatar>
            <h3 class="text-h6">{{ talent?.name }}</h3>
            <!-- <p class="text-caption text-grey">Added: {{ talent?.addedDate }}</p> -->
          </div>

          <v-divider class="mb-4"></v-divider>


          <div class="talent-stats">
            <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Media Type:</span>
              <v-chip color="info" size="small">{{ talent?.category_type.name || 'N/A' }}</v-chip>
            </div>
            <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Total Sub-talents:</span>
              <v-chip color="success" size="small">{{ subTalents.length || "subtalent lengths" }}</v-chip>
            </div>
            <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Total Submissions</span>
              <v-chip color="success" size="small">
                <!-- This will now automatically show '...' while loading, and then the number! -->
                {{ submissionCount }}
              </v-chip>
            </div>
            <!-- <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Active:</span>
              <v-chip color="success" size="small">{{ activeSubTalentsCount }}</v-chip>
            </div>
            <div class="stat-item d-flex justify-space-between align-center">
              <span class="text-body-2">Inactive:</span>
              <v-chip color="warning" size="small">{{ inactiveSubTalentsCount }}</v-chip>
            </div> -->
          </div>
        </div>

        <div class="px-4 py-3">
          <v-btn color="success" class="text-none add-sub-talent-btn" @click="openAddSubTalentDialog" size="large"
            block>
            <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
            Add Sub-talent
          </v-btn>
        </div>
      </v-col>

      <v-col cols="9" class="content-section px-5">
        <div class="py-3 d-flex align-center">
          <v-text-field v-model="search" placeholder="Search sub-talents..." variant="solo" rounded="lg"
            density="compact" hide-details class="mr-4 border-0 input-search" bg-color="white" style="max-width: 450px">
            <template v-slot:prepend-inner>
              <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
            </template>
          </v-text-field>

          <div class="filter-buttons d-flex align-center mr-4">
            <font-awesome-icon icon="fa-solid fa-filter" class="filter-icon mr-2" />

            <v-btn :variant="statusFilter === 'all' ? 'flat' : 'outlined'"
              :color="statusFilter === 'all' ? 'success' : 'grey'" size="small" class="mr-2"
              @click="setStatusFilter('all')">
              All
            </v-btn>
            <v-btn :variant="statusFilter === 'active' ? 'flat' : 'outlined'"
              :color="statusFilter === 'active' ? 'success' : 'grey'" size="small" class="mr-2"
              @click="setStatusFilter('active')">
              Active
            </v-btn>
            <v-btn :variant="statusFilter === 'inactive' ? 'flat' : 'outlined'"
              :color="statusFilter === 'inactive' ? 'success' : 'grey'" size="small"
              @click="setStatusFilter('inactive')">
              Inactive
            </v-btn>
          </div>

          <v-spacer></v-spacer>

          <div class="d-flex align-center mr-4">
            <div class="d-flex align-center mr-4">
              <font-awesome-icon icon="fa-solid fa-circle" class="mr-1 text-success" />
              <span class="text-caption status-text">Active({{ activeSubTalentsCount }})</span>
            </div>
            <div class="d-flex align-center">
              <font-awesome-icon icon="fa-solid fa-circle" class="mr-1 text-warning" />
              <span class="text-caption status-text">Inactive({{ inactiveSubTalentsCount }})</span>
            </div>
          </div>
        </div>

        <div class="sub-talents-cards pa-6" style="overflow-y: auto">
          <v-row>
            <v-col v-for="subTalent in filteredSubTalents" :key="subTalent.id" cols="12" md="6">
              <v-card flat class="pa-4 rounded-lg sub-talent-card">
                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="d-flex align-center">
                    <v-switch :model-value="subTalent.isActive" color="success" hide-details density="compact" inset
                      class="compact-switch mr-3" style="transform: scale(0.8); transform-origin: left center;"
                      @update:model-value="toggleSubTalentStatus(subTalent.id)"></v-switch>
                    <div class="d-flex align-center status-chip">
                      <font-awesome-icon :icon="['fas', 'circle']"
                        :class="subTalent.isActive ? 'text-success' : 'text-warning'" class="mr-1" size="sm" />
                      <span class="text-caption">{{
                        subTalent.isActive ? "Active" : "Inactive"
                        }}</span>
                    </div>
                  </div>
                </div>

                <div class="text-subtitle-1 font-weight-bold mb-2">
                  {{ subTalent.name }}
                </div>

                <div class="d-flex align-center text-caption text-grey mb-2">
                  <span class="mr-3">
                    <font-awesome-icon icon="fa-solid fa-user" class="mr-1" />
                    {{ getTalentName(subTalent.talentName) }}
                  </span>
                  <v-divider vertical class="mx-2"></v-divider>
                  <span class="mr-3">
                    <font-awesome-icon icon="fa-solid fa-graduation-cap" class="mr-1" />
                    {{ subTalent.grade }}
                  </span>
                </div>

                <div class="timer-section mb-3 pa-2 rounded" :class="getTimerClass(subTalent)">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <font-awesome-icon :icon="getTimerIcon(subTalent)" :class="getTimerIconClass(subTalent)"
                        class="mr-2" size="sm" />
                      <span class="text-caption font-weight-medium" :class="getTimerTextClass(subTalent)">
                        {{ getTimerText(subTalent) }}
                      </span>
                    </div>
                    <div class="timer-display" v-if="getTimerDisplay(subTalent)">
                      <span class="text-caption font-weight-bold" :class="getTimerTextClass(subTalent)">
                        {{ getTimerDisplay(subTalent) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center text-caption text-grey mb-4">
                  <span>{{ subTalent.addedDate }}</span>
                </div>

                <div class="d-flex justify-end align-center">
                  <div class="d-flex align-center gap-2">
                    <v-btn variant="text" class="action-btn view-btn" size="small" @click="viewSubTalent(subTalent)">
                      <font-awesome-icon icon="fa-solid fa-eye" class="mr-2" />
                      View
                    </v-btn>
                    <v-btn variant="text" class="action-btn edit-btn" size="small" @click="editSubTalent(subTalent)">
                      <font-awesome-icon icon="fa-solid fa-pencil" class="mr-2" />
                      Edit
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="filteredSubTalents.length === 0" class="text-center pa-8">
            <v-icon icon="mdi-account-group-outline" size="64" color="grey" class="mb-4"></v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">No Sub-talents Found</h3>
            <p class="text-body-1 text-grey">Click "Add Sub-talent" to get started</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="showSubTalentDialog" max-width="600" persistent>
      <v-card class="sub-talent-dialog">
        <v-card-title class="text-h5 pa-4">
          {{ isEditing ? 'Edit' : 'Add' }} Sub-talent
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="subTalentFormRef">
            <v-text-field v-model="subTalentForm.name" label="Sub-talent Name" variant="outlined" density="comfortable"
              placeholder="Enter sub-talent name" class="mb-4" required></v-text-field>

            <v-text-field v-model="talent.name" label="Talent Name" variant="outlined" density="comfortable" readonly
              class="mb-4"></v-text-field>

            <v-select v-model="subTalentForm.grade" :items="grades" label="Grade" variant="outlined"
              density="comfortable" placeholder="Select grade" class="mb-4" required></v-select>

            <v-row>
              <v-col cols="6">
                <v-text-field v-model="subTalentForm.startDate" label="Start Date" variant="outlined"
                  density="comfortable" type="datetime-local" placeholder="Select start date" class="mb-4"
                  required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="subTalentForm.endDate" label="End Date" variant="outlined" density="comfortable"
                  type="datetime-local" placeholder="Select end date" class="mb-4" required></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeSubTalentDialog">
            Cancel
          </v-btn>
          <v-btn color="success" variant="flat" @click="saveSubTalent" :loading="isSaving"
            :disabled="!isSubTalentFormValid" class="add-sub-talent-btn-dialog">
            {{ isEditing ? 'Update' : 'Add' }} Sub-talent
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showViewDialog" width="700">
      <v-card class="sub-talent-view-dialog">
        <v-card-title class="d-flex flex-column align-start pa-6">
          <div class="text-h5 font-weight-bold mb-4">{{ selectedSubTalent?.name }}</div>

          <div class="d-flex flex-wrap gap-6">
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Talent</div>
              <div class="text-subtitle-1">{{ getTalentName(selectedSubTalent?.talentName) }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Grade</div>
              <div class="text-subtitle-1">{{ selectedSubTalent?.grade }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Start Date</div>
              <div class="text-subtitle-1">{{ formatDateTime(selectedSubTalent?.startDate) }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">End Date</div>
              <div class="text-subtitle-1">{{ formatDateTime(selectedSubTalent?.endDate) }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Added Date</div>
              <div class="text-subtitle-1">{{ selectedSubTalent?.addedDate }}</div>
            </div>
            <div class="info-item">
              <div class="text-caption text-medium-emphasis">Status</div>
              <div class="text-subtitle-1 d-flex align-center">
                <font-awesome-icon :icon="['fas', 'circle']"
                  :class="selectedSubTalent?.isActive ? 'text-success' : 'text-warning'" class="mr-2" size="sm" />
                {{ selectedSubTalent?.isActive ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </div>
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <div class="timer-section mb-4 pa-3 rounded" :class="getTimerClass(selectedSubTalent)">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <font-awesome-icon :icon="getTimerIcon(selectedSubTalent)" :class="getTimerIconClass(selectedSubTalent)"
                  class="mr-2" size="sm" />
                <span class="text-subtitle-2 font-weight-medium" :class="getTimerTextClass(selectedSubTalent)">
                  {{ getTimerText(selectedSubTalent) }}
                </span>
              </div>
              <div class="timer-display" v-if="getTimerDisplay(selectedSubTalent)">
                <span class="text-subtitle-2 font-weight-bold" :class="getTimerTextClass(selectedSubTalent)">
                  {{ getTimerDisplay(selectedSubTalent) }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="success" variant="text" @click="showViewDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useCategoryStore } from "@/stores/category";

const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categories);



// NOTE: Replace with your actual toast notification plugin, e.g., from 'vue-toastification'
// import { useToast } from 'vue-toastification';
// const toast = useToast();
// Using a placeholder for demonstration:
const toast = {
  success: (msg) => console.log(`SUCCESS: ${msg}`),
  error: (msg) => console.error(`ERROR: ${msg}`),
};

// COMPONENT SETUP
const route = useRoute();
const router = useRouter();

// REACTIVE STATE
const talent = ref(null);
const talentIconPath = computed(() => {
  // Simply return the full URL provided by the backend.
  // The optional chaining (?.) is good practice in case talent or icon_url is null/undefined initially.
  return talent.value?.icon_url || null;
});
const subTalents = ref([]);
// const submissionCount = ref(0);
// ADD THIS COMPUTED PROPERTY INSTEAD:
const submissionCount = computed(() => {
  // Find our current talent again in the store's reactive categories array
  const currentTalent = categoryStore.categories.find(c => c.id == route.params.id);

  // Use the optional chaining (?.) and nullish coalescing (??) operators.
  // This means: "Try to get submission_count. If it doesn't exist yet, show '...' as a placeholder."
  return currentTalent?.submission_count ?? '...';
});
const isLoadingCount = ref(false); // Optional: for a nice loading state
const search = ref("");
const showSubTalentDialog = ref(false);
const showViewDialog = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const selectedSubTalent = ref(null);
const grades = ref(['Grade 1-4', 'Grade 5-7', 'Grade 7-12']);
const availableTalents = ref([]);
const subTalentForm = reactive({
  name: '',
  grade: '',
  startDate: '',
  endDate: '',
});
const subTalentFormRef = ref(null); // For v-form ref
const timerInterval = ref(null);
const isLoading = ref(false);
const statusFilter = ref('all');
const renderTrigger = ref(0); // Used to force re-render for timers

// COMPUTED PROPERTIES
const filteredSubTalents = computed(() => {
  let filtered = subTalents.value;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (subTalent) =>
        subTalent.name.toLowerCase().includes(searchLower) ||
        subTalent.category?.toLowerCase().includes(searchLower) ||
        subTalent.description?.toLowerCase().includes(searchLower)
    );
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(subTalent => {
      return statusFilter.value === 'active' ? subTalent.isActive : !subTalent.isActive;
    });
  }

  return filtered;
});

const activeSubTalentsCount = computed(() => {
  return subTalents.value.filter((subTalent) => subTalent.isActive).length;
});

const inactiveSubTalentsCount = computed(() => {
  return subTalents.value.filter((subTalent) => !subTalent.isActive).length;
});

const isSubTalentFormValid = computed(() => {
  return subTalentForm.name.trim() &&
    subTalentForm.grade &&
    subTalentForm.startDate &&
    subTalentForm.endDate;
});

// METHODS
const loadTalentData = () => {
  isLoading.value = true;
  const talentId = route.params.id;

  if (!talentId) {
    toast.error('No talent ID provided. Please select a talent.');
    router.push('/');
    isLoading.value = false;
    return;
  }

  const allTalents = JSON.parse(localStorage.getItem('talents') || '[]');
  const foundTalent = categories.value.find(t => t.id == talentId);


  if (!foundTalent) {
    toast.error('Talent not found.');
    router.push('/');
    isLoading.value = false;
    return;
  }

  talent.value = foundTalent;
  console.log('Talent Data icon:', talent.value.icon_url);
  console.log('Talent Data:', talent.value);
  // subTalents.value = JSON.parse(localStorage.getItem(`subTalents_${talent.value.id}`) || '[]');
  subTalents.value = foundTalent.subcategories || [];
  availableTalents.value = allTalents.map(t => ({ title: t.name, value: t.id }));
  categoryStore.fetchSubmissionCountForCategory(talent.value.id);
  isLoading.value = false;
};

const openAddSubTalentDialog = () => {
  isEditing.value = false;
  Object.assign(subTalentForm, { name: '', grade: '', startDate: '', endDate: '' });
  showSubTalentDialog.value = true;
};

const editSubTalent = (subTalentToEdit) => {
  isEditing.value = true;
  selectedSubTalent.value = subTalentToEdit;
  Object.assign(subTalentForm, {
    name: subTalentToEdit.name,
    grade: subTalentToEdit.grade,
    startDate: subTalentToEdit.startDate,
    endDate: subTalentToEdit.endDate
  });
  showSubTalentDialog.value = true;
};

const viewSubTalent = (subTalent) => {
  router.push({
    name: 'SubTalentView',
    params: {
      talentId: talent.value.id,
      subTalentId: subTalent.id
    }
  });
};

const closeSubTalentDialog = () => {
  showSubTalentDialog.value = false;
  selectedSubTalent.value = null;
};

const saveSubTalent = async () => {
  if (!isSubTalentFormValid.value) return;

  isSaving.value = true;

  try {
    const subTalentData = {
      id: isEditing.value ? selectedSubTalent.value.id : Date.now(),
      name: subTalentForm.name.trim(),
      talentName: talent.value.id,
      grade: subTalentForm.grade,
      startDate: subTalentForm.startDate,
      endDate: subTalentForm.endDate,
      isActive: isEditing.value ? selectedSubTalent.value.isActive : true,
      addedDate: isEditing.value ? selectedSubTalent.value.addedDate : new Date().toLocaleDateString(),
      talentId: talent.value.id
    };

    if (isEditing.value) {
      const index = subTalents.value.findIndex(st => st.id === subTalentData.id);
      if (index !== -1) {
        subTalents.value[index] = subTalentData;
      }
    } else {
      subTalents.value.push(subTalentData);
    }

    localStorage.setItem(`subTalents_${talent.value.id}`, JSON.stringify(subTalents.value));

    closeSubTalentDialog();
    toast.success(`Sub-talent ${isEditing.value ? 'updated' : 'added'} successfully!`);
  } catch (error) {
    console.error('Error saving sub-talent:', error);
    toast.error('Failed to save sub-talent. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

const toggleSubTalentStatus = (subTalentId) => {
  const subTalent = subTalents.value.find(st => st.id === subTalentId);
  if (subTalent) {
    subTalent.isActive = !subTalent.isActive;
    localStorage.setItem(`subTalents_${talent.value.id}`, JSON.stringify(subTalents.value));
    toast.success(`Sub-talent ${subTalent.isActive ? 'activated' : 'deactivated'} successfully!`);
  }
};

const getTalentName = (talentId) => {
  const foundTalent = availableTalents.value.find(t => t.value === talentId);
  return foundTalent ? foundTalent.title : 'N/A';
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const setStatusFilter = (filter) => {
  statusFilter.value = filter;
};

// TIMER UTILITY FUNCTIONS
const getTimerClass = (subTalent) => {
  if (!subTalent?.startDate || !subTalent?.endDate) return 'inactive';
  const now = new Date();
  const start = new Date(subTalent.startDate);
  const end = new Date(subTalent.endDate);
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'active';
  return 'inactive';
};

const getTimerIcon = (subTalent) => {
  if (!subTalent?.startDate || !subTalent?.endDate) return 'fa-solid fa-clock';
  const now = new Date();
  const start = new Date(subTalent.startDate);
  const end = new Date(subTalent.endDate);
  if (now < start) return 'fa-solid fa-arrow-up';
  if (now >= start && now <= end) return 'fa-solid fa-check-circle';
  return 'fa-solid fa-arrow-down';
};

const getTimerIconClass = (subTalent) => {
  const status = getTimerClass(subTalent);
  if (status === 'upcoming' || status === 'active') return 'text-success';
  if (status === 'inactive') return 'text-warning';
  return 'text-grey';
};

const getTimerText = (subTalent) => {
  const status = getTimerClass(subTalent);
  if (!subTalent?.startDate || !subTalent?.endDate) return 'Not Scheduled';
  if (status === 'upcoming') return 'Upcoming';
  if (status === 'active') return 'Active';
  return 'Inactive';
};

const getTimerTextClass = (subTalent) => getTimerIconClass(subTalent);

const formatTime = (milliseconds) => {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const getTimerDisplay = (subTalent) => {
  if (!subTalent?.startDate || !subTalent?.endDate) return null;

  // This line ensures the computed property is re-evaluated when renderTrigger changes
  const _ = renderTrigger.value;

  const now = new Date();
  const start = new Date(subTalent.startDate);
  const end = new Date(subTalent.endDate);

  if (now < start) {
    return formatTime(start - now);
  } else if (now >= start && now <= end) {
    return formatTime(end - now);
  } else {
    return formatTime(now - end);
  }
};

// LIFECYCLE HOOKS & WATCHERS
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadTalentData();
  }
});

onMounted(() => {
  loadTalentData();
  // Set an interval to trigger re-renders for the countdown timers
  timerInterval.value = setInterval(() => {
    renderTrigger.value++;
  }, 1000);
});

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
.talent-view-container {
  background-color: #f8f9fa;
  overflow-y: hidden !important;
}

.talent-info-section {
  border-right: 1px solid #eeeeee;
  background-color: transparent;
  height: 100vh;
  transition: all 0.3s ease;
}

.talent-details {
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #DDD !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.talent-avatar-container {
  padding: 20px;
}

.stat-item {
  padding: 8px 0;
}

.add-sub-talent-btn {
  padding: 20px 15px !important;
  font-size: 16px !important;
  border: 1px solid #4caf50 !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-sub-talent-btn:hover {
  color: #4caf50 !important;
  border: 1px solid #4caf50 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.filter-buttons {
  .v-btn {
    border-radius: 8px !important;
    font-weight: 500 !important;
    text-transform: none !important;
    transition: all 0.3s ease !important;
  }

  .v-btn:hover {
    color: #4caf50 !important;
    border: 1px solid #4caf50 !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .filter-icon {
    color: #4caf50;
    font-size: 16px;
    transition: all 0.3s ease;
  }
}

.content-section {
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
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

.status-text {
  font-size: 16px !important;
  margin-left: 5px !important;
  color: #151313 !important;
}

.sub-talents-cards {
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #DDD !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  padding: 24px;
}

.sub-talent-card {
  border: 1px solid #DDD !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: white;
}

.sub-talent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.status-chip {
  background-color: #FFF !important;
  border-radius: 8px !important;
  padding: 4px 12px !important;
  transition: all 0.3s ease;
  border: 1px solid #E0E0E0;
}

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

.sub-talent-dialog,
.sub-talent-view-dialog {
  border-radius: 16px !important;
}

.info-item {
  min-width: 120px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.gap-2 {
  gap: 8px;
}

.timer-section {
  background-color: transparent !important;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.timer-section.upcoming {
  background-color: #e8f5e9;
  border-color: #a5d6a7;
}

.timer-section.active {
  background-color: #e0f2f7;
  border-color: #64b5f6;
}

.timer-section.inactive {
  background-color: #ffebee;
  border-color: #ef9a9a;
}

.timer-display {
  background-color: rgba(25, 118, 210, 0.1);
  color: white !important;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.8em;
  margin-left: 10px;
}

.add-sub-talent-btn-dialog:hover {
  color: #4caf50 !important;
  border: 2px solid #4caf50 !important;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>