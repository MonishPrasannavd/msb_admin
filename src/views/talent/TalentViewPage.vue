<template>
  <div class="talent-view-container">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular
        indeterminate
        color="success"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-h6">Loading talent data...</p>
    </div>
    
    <v-row no-gutters class="px-2" style="height: 100vh">
      <!-- Left Sidebar - Talent Info -->
      <v-col cols="3" class="talent-info-section d-flex flex-column nav-border">
        <div class="d-flex justify-space-between align-center px-4 py-3">
          <span class="text-h5 font-weight-bold">{{ talent?.name || 'Talent' }}</span>
          <v-btn
            color="success"
            variant="text"
            size="small"
            @click="$router.push('/talents')"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-left" class="mr-2" />
            Back
          </v-btn>
        </div>
        
        <!-- Talent Details -->
        <div class="talent-details pa-4">
          <div class="talent-avatar-container text-center mb-4">
            <v-avatar size="120" class="mb-3">
              <v-img
                v-if="talent?.image"
                :src="talent.image"
                :alt="talent?.name"
                cover
              ></v-img>
              <v-icon v-else icon="mdi-account" size="60" color="grey"></v-icon>
            </v-avatar>
            <h3 class="text-h6">{{ talent?.name }}</h3>
            <p class="text-caption text-grey">Added: {{ talent?.addedDate }}</p>
          </div>
          
          <v-divider class="mb-4"></v-divider>
          
          <div class="talent-stats">
            <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Media Type:</span>
              <v-chip color="info" size="small">{{ talent?.mediaType || 'N/A' }}</v-chip>
            </div>
            <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Total Sub-talents:</span>
              <v-chip color="success" size="small">{{ subTalents.length }}</v-chip>
            </div>
            <div class="stat-item d-flex justify-space-between align-center mb-3">
              <span class="text-body-2">Active:</span>
              <v-chip color="success" size="small">{{ activeSubTalentsCount }}</v-chip>
            </div>
            <div class="stat-item d-flex justify-space-between align-center">
              <span class="text-body-2">Inactive:</span>
              <v-chip color="warning" size="small">{{ inactiveSubTalentsCount }}</v-chip>
            </div>
          </div>
        </div>
        
        <!-- Add Sub-talent Button -->
        <div class="px-4 py-3">
          <v-btn
            color="success"
            class="text-none add-sub-talent-btn"
            @click="openAddSubTalentDialog"
            size="large"
            block
          >
            <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
            Add Sub-talent
          </v-btn>
        </div>
      </v-col>

      <!-- Right Content Section -->
      <v-col cols="9" class="content-section px-5">
        <!-- Search and Status Bar -->
        <div class="py-3 d-flex align-center">
          <v-text-field
            v-model="search" 
            placeholder="Search sub-talents..."
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
          
                     <!-- Filter Buttons -->
           <div class="filter-buttons d-flex align-center mr-4">
             <font-awesome-icon icon="fa-solid fa-filter" class="filter-icon mr-2" />
             
             <v-btn
               :variant="statusFilter === 'all' ? 'flat' : 'outlined'"
               :color="statusFilter === 'all' ? 'success' : 'grey'"
               size="small"
               class="mr-2"
               @click="setStatusFilter('all')"
             >
               All
             </v-btn>
             <v-btn
               :variant="statusFilter === 'active' ? 'flat' : 'outlined'"
               :color="statusFilter === 'active' ? 'success' : 'grey'"
               size="small"
               class="mr-2"
               @click="setStatusFilter('active')"
             >
               Active
             </v-btn>
             <v-btn
               :variant="statusFilter === 'inactive' ? 'flat' : 'outlined'"
               :color="statusFilter === 'inactive' ? 'success' : 'grey'"
               size="small"
               @click="setStatusFilter('inactive')"
             >
               Inactive
             </v-btn>
           </div>

          <v-spacer></v-spacer>

          <div class="d-flex align-center mr-4">
            <div class="d-flex align-center mr-4">
              <font-awesome-icon
                icon="fa-solid fa-circle"
                class="mr-1 text-success"
              />
              <span class="text-caption status-text">Active({{ activeSubTalentsCount }})</span>
            </div>
            <div class="d-flex align-center">
              <font-awesome-icon
                icon="fa-solid fa-circle"
                class="mr-1 text-warning"
              />
              <span class="text-caption status-text">Inactive({{ inactiveSubTalentsCount }})</span>
            </div>
          </div>
        </div>
          
        <!-- Sub-talents Cards -->
        <div 
          class="sub-talents-cards pa-6"
          style="overflow-y: auto"
        >
          <v-row>
            <v-col
              v-for="subTalent in filteredSubTalents" 
              :key="subTalent.id" 
              cols="12"
              md="6"
            >
              <v-card flat class="pa-4 rounded-lg sub-talent-card">
                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="d-flex align-center">
                    <v-switch
                      :model-value="subTalent.isActive"
                      color="success"
                      hide-details
                      density="compact"
                      inset
                      class="compact-switch mr-3"
                      style="transform: scale(0.8); transform-origin: left center;"
                      @update:model-value="toggleSubTalentStatus(subTalent.id)"
                    ></v-switch>
                    <div class="d-flex align-center status-chip">
                      <font-awesome-icon 
                        :icon="['fas', 'circle']" 
                        :class="subTalent.isActive ? 'text-success' : 'text-warning'" 
                        class="mr-1" 
                        size="sm"
                      />
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

                <!-- Timer Section -->
                <div class="timer-section mb-3 pa-2 rounded" :class="getTimerClass(subTalent)">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <font-awesome-icon 
                        :icon="getTimerIcon(subTalent)" 
                        :class="getTimerIconClass(subTalent)"
                        class="mr-2" 
                        size="sm"
                      />
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
                    <v-btn
                      variant="text"
                      class="action-btn view-btn"
                      size="small"
                      @click="viewSubTalent(subTalent)"
                    >
                      <font-awesome-icon icon="fa-solid fa-eye" class="mr-2" />
                      View
                    </v-btn>
                    <v-btn
                      variant="text"
                      class="action-btn edit-btn"
                      size="small"
                      @click="editSubTalent(subTalent)"
                    >
                      <font-awesome-icon icon="fa-solid fa-pencil" class="mr-2" />
                      Edit
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Empty State -->
          <div v-if="filteredSubTalents.length === 0" class="text-center pa-8">
            <v-icon icon="mdi-account-group-outline" size="64" color="grey" class="mb-4"></v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">No Sub-talents Found</h3>
            <p class="text-body-1 text-grey">Click "Add Sub-talent" to get started</p>
          </div>
        </div>
      </v-col>
    </v-row>
    
    <!-- Add/Edit Sub-talent Dialog -->
    <v-dialog v-model="showSubTalentDialog" max-width="600" persistent>
      <v-card class="sub-talent-dialog">
        <v-card-title class="text-h5 pa-4">
          {{ isEditing ? 'Edit' : 'Add' }} Sub-talent
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-form ref="subTalentForm">
            <v-text-field
              v-model="subTalentForm.name"
              label="Sub-talent Name"
              variant="outlined"
              density="comfortable"
              placeholder="Enter sub-talent name"
              class="mb-4"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="talent.name"
              label="Talent Name"
              variant="outlined"
              density="comfortable"
              readonly
              class="mb-4"
            ></v-text-field>
            
            <v-select
              v-model="subTalentForm.grade"
              :items="grades"
              label="Grade"
              variant="outlined"
              density="comfortable"
              placeholder="Select grade"
              class="mb-4"
              required
            ></v-select>
            
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="subTalentForm.startDate"
                  label="Start Date"
                  variant="outlined"
                  density="comfortable"
                  type="datetime-local"
                  placeholder="Select start date"
                  class="mb-4"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="subTalentForm.endDate"
                  label="End Date"
                  variant="outlined"
                  density="comfortable"
                  type="datetime-local"
                  placeholder="Select end date"
                  class="mb-4"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeSubTalentDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="saveSubTalent"
            :loading="isSaving"
            :disabled="!isSubTalentFormValid"
            class="add-sub-talent-btn-dialog"
          >
            {{ isEditing ? 'Update' : 'Add' }} Sub-talent
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- View Sub-talent Dialog -->
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
                <font-awesome-icon 
                  :icon="['fas', 'circle']" 
                  :class="selectedSubTalent?.isActive ? 'text-success' : 'text-warning'" 
                  class="mr-2" 
                  size="sm"
                />
                {{ selectedSubTalent?.isActive ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </div>
        </v-card-title>
           
        <v-card-text class="pa-6 pt-0">
          <!-- Timer Section for detailed view -->
          <div class="timer-section mb-4 pa-3 rounded" :class="getTimerClass(selectedSubTalent)">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <font-awesome-icon 
                  :icon="getTimerIcon(selectedSubTalent)" 
                  :class="getTimerIconClass(selectedSubTalent)"
                  class="mr-2" 
                  size="sm"
                />
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
          <v-btn
            color="success"
            variant="text"
            @click="showViewDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "TalentViewPage",
  data() {
    return {
      talent: null,
      subTalents: [],
      search: "",
      showSubTalentDialog: false,
      showViewDialog: false,
      isEditing: false,
      isSaving: false,
      selectedSubTalent: null,
      grades: ['Grade 1-4', 'Grade 5-7', 'Grade 7-12'],
      availableTalents: [],
      subTalentForm: {
        name: '',
        talentName: '',
        grade: '',
        startDate: '',
        endDate: '',
        isActive: true
      },
      timerInterval: null,
      isLoading: false,
      statusFilter: 'all' // 'all', 'active', 'inactive'
    };
  },
  computed: {
    filteredSubTalents() {
      let filtered = this.subTalents;

      if (this.search) {
        const searchLower = this.search.toLowerCase();
        filtered = filtered.filter(
          (subTalent) =>
            subTalent.name.toLowerCase().includes(searchLower) ||
            subTalent.category.toLowerCase().includes(searchLower) ||
            subTalent.description?.toLowerCase().includes(searchLower)
        );
      }

      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(subTalent => {
          if (this.statusFilter === 'active') {
            return subTalent.isActive;
          } else { // inactive
            return !subTalent.isActive;
          }
        });
      }

      return filtered;
    },
    activeSubTalentsCount() {
      return this.subTalents.filter((subTalent) => subTalent.isActive).length;
    },
    inactiveSubTalentsCount() {
      return this.subTalents.filter((subTalent) => !subTalent.isActive).length;
    },
    isSubTalentFormValid() {
      return this.subTalentForm.name.trim() && 
             this.subTalentForm.grade && 
             this.subTalentForm.startDate && 
             this.subTalentForm.endDate;
    }
  },
  created() {
    this.loadTalentData();
    // Start timer interval for real-time updates
    this.timerInterval = setInterval(() => {
      this.$forceUpdate(); // Force re-render to update timers
    }, 1000);
  },
  watch: {
    // Watch for route changes to reload data when navigating between talents
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.loadTalentData();
      }
    }
  },
  beforeUnmount() {
    // Clear timer interval when component is destroyed
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
  methods: {
    loadTalentData() {
      this.isLoading = true;
      const talentId = this.$route.params.id;
      console.log('Loading talent with ID:', talentId);
      
      if (!talentId) {
        console.log('No talent ID provided');
        this.$toast.error('No talent ID provided. Please select a talent from the sidebar.');
        this.$router.push('/');
        this.isLoading = false;
        return;
      }
      
      // Load talent from localStorage
      const talents = JSON.parse(localStorage.getItem('talents') || '[]');
      console.log('All talents:', talents);
      
      // Try to find talent by ID (handle both string and number)
      this.talent = talents.find(t => t.id == talentId || t.id === parseInt(talentId));
      console.log('Found talent:', this.talent);
      
      if (!this.talent) {
        console.log('Talent not found, showing available talents');
        
        // Show available talents in console for debugging
        console.log('Available talents:', talents);
        
        // If no talents exist, suggest adding talents
        if (talents.length === 0) {
          this.$toast.error('No talents found. Please add a talent first using the "Add Talent" button.');
        } else {
          const talentNames = talents.map(t => t.name).join(', ');
          this.$toast.error(`Talent not found. Available talents: ${talentNames}`);
        }
        
        // Redirect to main page
        this.$router.push('/');
        this.isLoading = false;
        return;
      }
      
      // Load sub-talents for this specific talent only
      const subTalents = JSON.parse(localStorage.getItem(`subTalents_${this.talent.id}`) || '[]');
      console.log('Sub-talents for talent:', subTalents);
      this.subTalents = subTalents;

      // Load available talents for the dropdown (but we'll use current talent only)
      this.availableTalents = talents.map(t => ({
        title: t.name,
        value: t.id
      }));
      
      console.log('Talent data loaded successfully:', {
        talent: this.talent,
        subTalentsCount: this.subTalents.length
      });
      
      this.isLoading = false;
    },
    refreshTalentData() {
      // Force reload talent data
      this.loadTalentData();
    },
    openAddSubTalentDialog() {
      this.isEditing = false;
      this.subTalentForm = {
        name: '',
        grade: '',
        startDate: '',
        endDate: ''
      };
      this.showSubTalentDialog = true;
    },
    editSubTalent(subTalent) {
      this.isEditing = true;
      this.selectedSubTalent = subTalent;
      this.subTalentForm = {
        name: subTalent.name,
        grade: subTalent.grade,
        startDate: subTalent.startDate,
        endDate: subTalent.endDate
      };
      this.showSubTalentDialog = true;
    },
    viewSubTalent(subTalent) {
      // Navigate to the detailed sub-talent view
      this.$router.push({
        name: 'SubTalentView',
        params: {
          talentId: this.talent.id,
          subTalentId: subTalent.id
        }
      });
    },
    closeSubTalentDialog() {
      this.showSubTalentDialog = false;
      this.selectedSubTalent = null;
    },
    async saveSubTalent() {
      if (!this.isSubTalentFormValid) return;
      
      this.isSaving = true;
      
      try {
        const subTalentData = {
          id: this.isEditing ? this.selectedSubTalent.id : Date.now(),
          name: this.subTalentForm.name.trim(),
          talentName: this.talent.id, // Always use current talent's ID
          grade: this.subTalentForm.grade,
          startDate: this.subTalentForm.startDate,
          endDate: this.subTalentForm.endDate,
          isActive: this.isEditing ? this.selectedSubTalent.isActive : true,
          addedDate: this.isEditing ? this.selectedSubTalent.addedDate : new Date().toLocaleDateString(),
          talentId: this.talent.id
        };
        
        if (this.isEditing) {
          const index = this.subTalents.findIndex(st => st.id === subTalentData.id);
          if (index !== -1) {
            this.subTalents[index] = subTalentData;
          }
        } else {
          this.subTalents.push(subTalentData);
        }
        
        // Save to localStorage
        localStorage.setItem(`subTalents_${this.talent.id}`, JSON.stringify(this.subTalents));
        
        this.closeSubTalentDialog();
        this.$toast.success(`Sub-talent ${this.isEditing ? 'updated' : 'added'} successfully!`);
      } catch (error) {
        console.error('Error saving sub-talent:', error);
        this.$toast.error('Failed to save sub-talent. Please try again.');
      } finally {
        this.isSaving = false;
      }
    },
    toggleSubTalentStatus(subTalentId) {
      const subTalent = this.subTalents.find(st => st.id === subTalentId);
      if (subTalent) {
        subTalent.isActive = !subTalent.isActive;
        localStorage.setItem(`subTalents_${this.talent.id}`, JSON.stringify(this.subTalents));
        this.$toast.success(`Sub-talent ${subTalent.isActive ? 'activated' : 'deactivated'} successfully!`);
      }
    },
    getTalentName(talentId) {
      const talent = this.availableTalents.find(t => t.value === talentId);
      return talent ? talent.title : 'N/A';
    },
    formatDateTime(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
    getTimerClass(subTalent) {
      if (!subTalent.startDate || !subTalent.endDate) {
        return 'inactive';
      }
      const now = new Date();
      const start = new Date(subTalent.startDate);
      const end = new Date(subTalent.endDate);

      if (now < start) {
        return 'upcoming';
      } else if (now >= start && now <= end) {
        return 'active';
      } else {
        return 'inactive';
      }
    },
    getTimerIcon(subTalent) {
      if (!subTalent.startDate || !subTalent.endDate) {
        return 'fa-solid fa-clock';
      }
      const now = new Date();
      const start = new Date(subTalent.startDate);
      const end = new Date(subTalent.endDate);

      if (now < start) {
        return 'fa-solid fa-arrow-up';
      } else if (now >= start && now <= end) {
        return 'fa-solid fa-check-circle';
      } else {
        return 'fa-solid fa-arrow-down';
      }
    },
    getTimerIconClass(subTalent) {
      if (!subTalent.startDate || !subTalent.endDate) {
        return 'text-grey';
      }
      const now = new Date();
      const start = new Date(subTalent.startDate);
      const end = new Date(subTalent.endDate);

      if (now < start) {
        return 'text-success';
      } else if (now >= start && now <= end) {
        return 'text-success';
      } else {
        return 'text-warning';
      }
    },
    getTimerText(subTalent) {
      if (!subTalent.startDate || !subTalent.endDate) {
        return 'Not Scheduled';
      }
      const now = new Date();
      const start = new Date(subTalent.startDate);
      const end = new Date(subTalent.endDate);

      if (now < start) {
        return 'Upcoming';
      } else if (now >= start && now <= end) {
        return 'Active';
      } else {
        return 'Inactive';
      }
    },
    getTimerTextClass(subTalent) {
      if (!subTalent.startDate || !subTalent.endDate) {
        return 'text-grey';
      }
      const now = new Date();
      const start = new Date(subTalent.startDate);
      const end = new Date(subTalent.endDate);

      if (now < start) {
        return 'text-success';
      } else if (now >= start && now <= end) {
        return 'text-success';
      } else {
        return 'text-warning';
      }
    },
    getTimerDisplay(subTalent) {
      if (!subTalent.startDate || !subTalent.endDate) {
        return null;
      }
      const now = new Date();
      const start = new Date(subTalent.startDate);
      const end = new Date(subTalent.endDate);

      if (now < start) {
        const diff = start - now;
        return this.formatTime(diff);
      } else if (now >= start && now <= end) {
        const diff = end - now;
        return this.formatTime(diff);
      } else {
        const diff = now - end;
        return this.formatTime(diff);
      }
    },
    formatTime(milliseconds) {
      const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    },
    setStatusFilter(filter) {
      this.statusFilter = filter;
    }
  }
};
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
  background-color:transparent !important;
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
