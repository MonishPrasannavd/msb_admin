<template>
  <div class="sub-talent-view-container">
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular indeterminate color="success" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading sub-talent data...</p>
    </div>

    <v-container fluid class="pa-6" style="min-height: 100vh">
      <div class="header-section mb-6">
        <div class="d-flex align-center mb-4">
          <v-btn color="success" variant="text" size="small" @click="goBack" class="mr-4">
            <font-awesome-icon icon="fa-solid fa-arrow-left" class="mr-2" />
            Back to {{ talent?.name }}
          </v-btn>
          <v-divider vertical class="mx-4"></v-divider>
          <h1 class="text-h4 font-weight-bold">{{ subTalent?.name }}</h1>
        </div>

        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-switch :model-value="subTalent?.isActive" color="success" hide-details density="compact" inset
              class="compact-switch mr-3" style="transform: scale(0.8); transform-origin: left center;"
              @update:model-value="toggleSubTalentStatus"></v-switch>
            <div class="d-flex align-center status-chip">
              <font-awesome-icon :icon="['fas', 'circle']"
                :class="subTalent?.isActive ? 'text-success' : 'text-warning'" class="mr-1" size="sm" />
              <span class="text-caption">{{
                subTalent?.isActive ? "Active" : "Inactive"
              }}</span>
            </div>
          </div>

          <div class="timer-section pa-3 rounded" :class="getTimerClass(subTalent)">
            <div class="d-flex align-center">
              <font-awesome-icon :icon="getTimerIcon(subTalent)" :class="getTimerIconClass(subTalent)" class="mr-2"
                size="sm" />
              <span class="text-subtitle-2 font-weight-medium" :class="getTimerTextClass(subTalent)">
                {{ getTimerText(subTalent) }}
              </span>
              <div class="timer-display ml-3" v-if="getTimerDisplay(subTalent)">
                <span class="text-subtitle-2 font-weight-bold" :class="getTimerTextClass(subTalent)">
                  {{ getTimerDisplay(subTalent) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-row>
        <v-col cols="12" md="8">
          <v-card class="details-card mb-6">
            <v-card-title class="text-h5 pa-6 pb-4">
              Sub-talent Details
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row>
                <v-col cols="6">
                  <div class="detail-item mb-4">
                    <div class="text-caption text-medium-emphasis">Talent</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ talent?.name }}</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="detail-item mb-4">
                    <div class="text-caption text-medium-emphasis">Grade</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ subTalent?.grade }}</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="detail-item mb-4">
                    <div class="text-caption text-medium-emphasis">Start Date</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ formatDateTime(subTalent?.startDate) }}</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="detail-item mb-4">
                    <div class="text-caption text-medium-emphasis">End Date</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ formatDateTime(subTalent?.endDate) }}</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="detail-item mb-4">
                    <div class="text-caption text-medium-emphasis">Added Date</div>
                    <div class="text-subtitle-1 font-weight-medium">{{ subTalent?.addedDate }}</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="detail-item mb-4">
                    <div class="text-caption text-medium-emphasis">Total Participants</div>
                    <div class="text-subtitle-1 font-weight-medium text-success">{{ participants.length }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="participants-card">
            <v-card-title class="d-flex justify-space-between align-center pa-6 pb-4">
              <span class="text-h5">All Participants</span>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <div v-if="participants.length === 0" class="text-center pa-8">
                <v-icon icon="mdi-account-group-outline" size="64" color="grey" class="mb-4"></v-icon>
                <h3 class="text-h6 text-grey-darken-1 mb-2">No Participants Yet</h3>
                <p class="text-body-1 text-grey">Be the first to participate!</p>
              </div>

              <v-list v-else>
                <v-list-item v-for="(participant, index) in participants" :key="participant.id"
                  class="participant-item mb-2">
                  <template v-slot:prepend>
                    <v-avatar size="40" class="mr-3">
                      <v-img v-if="participant.avatar" :src="participant.avatar" cover></v-img>
                      <v-icon v-else icon="mdi-account" color="grey"></v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ participant.name }}
                    <v-chip v-if="index < 3" :color="getTopParticipantColor(index)" size="small" class="ml-2">
                      #{{ index + 1 }}
                    </v-chip>
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-grey">
                    {{ participant.email }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-thumb-up" color="success" size="small" class="mr-1"></v-icon>
                      <span class="text-subtitle-2 font-weight-medium">{{ participant.likes }}</span>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="top-participants-card mb-6">
            <v-card-title class="text-h5 pa-6 pb-4">
              <font-awesome-icon icon="fa-solid fa-trophy" class="mr-2 text-warning" />
              Top 3 Participants
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <div v-if="topParticipants.length === 0" class="text-center pa-4">
                <v-icon icon="mdi-trophy-outline" size="48" color="grey" class="mb-2"></v-icon>
                <p class="text-grey">No participants yet</p>
              </div>

              <div v-else>
                <div v-for="(participant, index) in topParticipants" :key="participant.id"
                  class="top-participant-item mb-4">
                  <div class="d-flex align-center">
                    <div class="rank-badge mr-3" :class="getRankClass(index)">
                      {{ index + 1 }}
                    </div>
                    <v-avatar size="50" class="mr-3">
                      <v-img v-if="participant.avatar" :src="participant.avatar" cover></v-img>
                      <v-icon v-else icon="mdi-account" color="grey"></v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-subtitle-1 font-weight-medium">{{ participant.name }}</div>
                      <div class="text-caption text-grey">{{ participant.email }}</div>
                    </div>
                    <div class="likes-count">
                      <v-icon icon="mdi-thumb-up" color="success" size="small" class="mr-1"></v-icon>
                      <span class="text-h6 font-weight-bold">{{ participant.likes }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="stats-card">
            <v-card-title class="text-h5 pa-6 pb-4">
              <font-awesome-icon icon="fa-solid fa-chart-bar" class="mr-2 text-info" />
              Statistics
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <div class="stat-item d-flex justify-space-between align-center mb-4">
                <span class="text-body-1">Total Participants</span>
                <v-chip color="success" size="small">{{ participants.length }}</v-chip>
              </div>
              <div class="stat-item d-flex justify-space-between align-center mb-4">
                <span class="text-body-1">Total Likes</span>
                <v-chip color="info" size="small">{{ totalLikes }}</v-chip>
              </div>
              <div class="stat-item d-flex justify-space-between align-center mb-4">
                <span class="text-body-1">Average Likes</span>
                <v-chip color="warning" size="small">{{ averageLikes }}</v-chip>
              </div>
              <div class="stat-item d-flex justify-space-between align-center">
                <span class="text-body-1">Competition Status</span>
                <v-chip :color="getStatusColor()" size="small">{{ getStatusText() }}</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category'; 

// NOTE: Replace with your actual toast notification plugin
const toast = {
  success: (msg) => console.log(`SUCCESS: ${msg}`),
  error: (msg) => console.error(`ERROR: ${msg}`),
};

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const talent = ref(null);
const subTalent = ref(null);
const participants = ref([]);
const isLoading = ref(false);
const timerInterval = ref(null);
const renderTrigger = ref(0); // Used to force re-render for timers

const topParticipants = computed(() => {
  // Create a new array to avoid sorting the original
  return [...participants.value]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);
});

const totalLikes = computed(() => {
  return participants.value.reduce((sum, p) => sum + p.likes, 0);
});

const averageLikes = computed(() => {
  if (participants.value.length === 0) return 0;
  return Math.round(totalLikes.value / participants.value.length);
});


const loadSubTalentData = () => {
  isLoading.value = true;
  const talentId = route.params.talentId;
  const subTalentId = parseInt(route.params.subTalentId, 10);
  const foundTalent = categoryStore.categories.find(t => t.id == talentId);
  

  if (!foundTalent) {
    toast.error('Talent not found');
    router.push('/');
    isLoading.value = false;
    return;
  }
  talent.value = foundTalent;
  const foundSubTalent = foundTalent.subcategories?.find(st => st.id == subTalentId);

  if (!foundSubTalent) {
    toast.error('Sub-talent not found');
    router.push(`/talents/${talentId}`);
    isLoading.value = false;
    return;
  }
  subTalent.value = foundSubTalent;
  
  loadParticipants();
  isLoading.value = false;
};

const loadParticipants = () => {
  const mockParticipants = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', likes: 45, avatar: null },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', likes: 38, avatar: null },
    { id: 3, name: 'Mike Davis', email: 'mike.davis@example.com', likes: 32, avatar: null },
    { id: 4, name: 'Emily Wilson', email: 'emily.w@example.com', likes: 28, avatar: null },
    { id: 5, name: 'Alex Brown', email: 'alex.brown@example.com', likes: 25, avatar: null }
  ];
  const stored = localStorage.getItem(`participants_${subTalent.value.id}`);
  participants.value = stored ? JSON.parse(stored) : mockParticipants;
  if (!stored) {
    localStorage.setItem(`participants_${subTalent.value.id}`, JSON.stringify(mockParticipants));
  }
};

const goBack = () => {
  if (talent.value) {
    router.push(`/talents/${talent.value.id}`);
  }
};

const toggleSubTalentStatus = () => {
  if (subTalent.value) {
    subTalent.value.isActive = !subTalent.value.isActive;
    const subTalents = JSON.parse(localStorage.getItem(`subTalents_${talent.value.id}`) || '[]');
    const index = subTalents.findIndex(st => st.id === subTalent.value.id);
    if (index !== -1) {
      subTalents[index] = subTalent.value;
      localStorage.setItem(`subTalents_${talent.value.id}`, JSON.stringify(subTalents));
    }
    toast.success(`Sub-talent ${subTalent.value.isActive ? 'activated' : 'deactivated'} successfully!`);
  }
};

const getTopParticipantColor = (index) => {
  const colors = ['warning', 'grey', 'brown'];
  return colors[index] || 'grey';
};

const getRankClass = (index) => {
  const classes = ['gold', 'silver', 'bronze'];
  return classes[index] || 'grey';
};

const getStatusColor = () => {
  if (!subTalent.value?.startDate || !subTalent.value?.endDate) return 'grey';
  const now = new Date();
  const start = new Date(subTalent.value.startDate);
  const end = new Date(subTalent.value.endDate);
  if (now < start) return 'warning';
  if (now >= start && now <= end) return 'success';
  return 'error';
};

const getStatusText = () => {
  if (!subTalent.value?.startDate || !subTalent.value?.endDate) return 'Not Scheduled';
  const now = new Date();
  const start = new Date(subTalent.value.startDate);
  const end = new Date(subTalent.value.endDate);
  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Active';
  return 'Ended';
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Timer utility functions
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

const getTimerDisplay = (st) => {
  // This line makes the function reactive to the timer interval
  const _ = renderTrigger.value;
  if (!st?.startDate || !st?.endDate) return null;
  const now = new Date();
  const start = new Date(st.startDate);
  const end = new Date(st.endDate);
  if (now < start) return formatTime(start - now);
  if (now >= start && now <= end) return formatTime(end - now);
  return formatTime(now - end);
};

const getTimerClass = (st) => { /* ... similar logic as getStatus ... */ };
const getTimerIcon = (st) => { /* ... similar logic ... */ };
const getTimerIconClass = (st) => { /* ... similar logic ... */ };
const getTimerText = (st) => { /* ... similar logic ... */ };
const getTimerTextClass = (st) => { /* ... similar logic ... */ };


onMounted(async() => {
  // Check if the store's categories array is empty.
  if (categoryStore.categories.length === 0) {
    console.log("Store is empty, fetching categories before loading data...");
    // If it's empty, wait for the fetchCategories action to complete.
    await categoryStore.fetchCategories();
  }
  
  // Now that we are GUARANTEED to have data, run the search.
  loadSubTalentData();

  // The rest of your timer setup can stay the same
  timerInterval.value = setInterval(() => {
    renderTrigger.value++;
  }, 10000);
});

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

</script>

<style scoped>
/* Your component styles remain unchanged */
.sub-talent-view-container {
  background-color: #f8f9fa;
  overflow-y: auto !important;
  min-height: 100vh;
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

.header-section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-chip {
  background-color: #FFF !important;
  border-radius: 8px !important;
  padding: 4px 12px !important;
  transition: all 0.3s ease;
  border: 1px solid #E0E0E0;
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

.details-card,
.participants-card,
.top-participants-card,
.stats-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.details-card:hover,
.participants-card:hover,
.top-participants-card:hover,
.stats-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.detail-item {
  padding: 8px 0;
}

.participant-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.participant-item:hover {
  border-color: #4caf50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.top-participant-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.top-participant-item:hover {
  border-color: #ff9800;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
}

.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
}

.rank-badge.gold {
  background-color: #ffd700;
}

.rank-badge.silver {
  background-color: #c0c0c0;
}

.rank-badge.bronze {
  background-color: #cd7f32;
}

.rank-badge.grey {
  background-color: #9e9e9e;
}

.likes-count {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #e8f5e9;
  border-radius: 6px;
}

.stat-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
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
</style>