

<template>
  <v-app>
    <template v-if="!isAuthPage">
      <v-app-bar flat>
        <v-app-bar-title>
          <div class="d-flex align-center">
            <router-link to="/" class="text-h4 font-weight-bold">Msb</router-link>
            <div class="green-dot ml-2"></div>
          </div>
        </v-app-bar-title>

        <template v-slot:append>
          <div class="d-flex align-center">
            <v-menu
              v-model="showUserMenu"
              :close-on-content-click="true"
              location="bottom end"
              min-width="200"
              rounded="lg"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="#4CAF50"
                  variant="text"
                  v-bind="props"
                  class="text-none user-btn border-md mr-3"
                >
                  <font-awesome-icon icon="fa-solid fa-user" class="mr-2" />
                  <span class="mr-0">{{
                    currentUser ? currentUser.name : "User"
                  }}</span>
                  <font-awesome-icon icon="fa-solid fa-chevron-down" class="ml-2" />
                </v-btn>
              </template>

              <v-list class="pa-2" nav>
                <v-list-item
                  rounded="lg"
                  class="mb-1"
                  @click="handleLogout"
                >
                  <template v-slot:prepend>
                    <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="mr-2" />
                  </template>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-app-bar>

      <v-navigation-drawer
        permanent
        class="pa-2 nav-width"
         style="top: 65px;"
      >
        <v-list class="pa-2">



          <v-list-item
            prepend-icon="mdi-stats"
            title="Dashboard"
            :to="{name:'Dashboard'}"
            class="rounded-lg mb-2"
            active-color="success"
          >
            <template v-slot:prepend>
              <font-awesome-icon icon="fa-solid fa-eye" class="mr-2" />
            </template>
          </v-list-item>


          <v-list-item
            prepend-icon="mdi-book"
            title="Talents"
            :to="{name: 'Categories'}"
            class="rounded-lg mb-2"
            active-color="success"
          >
            <template v-slot:prepend>
              <font-awesome-icon icon="fa-solid fa-book" class="mr-2" />
            </template>
          </v-list-item>





          <v-list-item
            prepend-icon="mdi-book"
            title="Quizzes"
            to="/quizzes"
            class="rounded-lg mb-2"
            active-color="success"
          >
            <template v-slot:prepend>
              <font-awesome-icon icon="fa-solid fa-book" class="mr-2" />
            </template>
          </v-list-item>






          <!-- Talents Section -->
         
        </v-list>

        <!-- Add Talent Button and Legal Links at Bottom -->
        <template v-slot:append>
          <div class="pa-2">
            <!-- <v-btn
              block
              color="success"
              class="add-talent-btn mb-3"
              @click="openAddTalentDialog"
            >
              <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
              Add Talent
            </v-btn> -->
            
            <v-divider class="mb-3"></v-divider>
            
            <v-list class="pa-0 legal-links">
              <v-list-item
                prepend-icon="mdi-shield-lock"
                title="Privacy Policy"
                to="/privacy-policy"
                class="rounded-lg mb-2 legal-item"
                active-color="success"
                density="compact"
              >
                <template v-slot:prepend>
                  <font-awesome-icon icon="fa-solid fa-shield-halved" class="mr-2" />
                </template>
              </v-list-item>

              <v-list-item
                prepend-icon="mdi-file-document"
                title="Terms & Conditions"
                to="/terms-and-conditions"
                class="rounded-lg mb-2 legal-item"
                active-color="success"
                density="compact"
              >
                <template v-slot:prepend>
                  <font-awesome-icon icon="fa-solid fa-file-contract" class="mr-2" />
                </template>
              </v-list-item>
            </v-list>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main class="bg-grey-lighten-4">
        <router-view></router-view>
      </v-main>
    </template>
    <template v-else>
      <router-view />
    </template>

    <!-- Add Talent Dialog -->
    <v-dialog v-model="showAddTalentDialog" max-width="500" persistent>
      <v-card class="add-talent-dialog">
        <v-card-title class="text-h5 pa-4">
          Add New Talent
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-text-field
            v-model="newTalent.name"
            label="Talent Name"
            variant="outlined"
            density="comfortable"
            placeholder="Enter talent name"
            class="mb-4"
            required
          ></v-text-field>
          
          <v-select
            v-model="newTalent.mediaType"
            :items="mediaTypes"
            label="Media Type"
            variant="outlined"
            density="comfortable"
            placeholder="Select media type"
            class="mb-4"
            required
          ></v-select>
          
          <!-- Image Upload Section -->
          <div class="image-upload-section mb-4">
            <div class="text-subtitle-2 mb-2">Profile Image (Optional)</div>
            
            <!-- Image Preview -->
            <div v-if="imagePreview" class="image-preview-container mb-3">
              <v-img
                :src="imagePreview"
                width="120"
                height="120"
                cover
                class="rounded-lg"
              ></v-img>
              <v-btn
                icon="mdi-close"
                size="small"
                variant="text"
                color="error"
                @click="removeImage"
                class="remove-image-btn"
              ></v-btn>
            </div>
            
            <!-- Upload Button -->
            <div v-if="!imagePreview" class="upload-area" @click="$refs.imageInput.click()">
              <v-icon icon="mdi-camera-plus" size="48" color="grey"></v-icon>
              <div class="text-body-2 text-grey mt-2">Click to upload image</div>
              <div class="text-caption text-grey">Max size: 5MB</div>
            </div>
            
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleImageUpload"
            />
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeAddTalentDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="addTalent"
            :disabled="!newTalent.name.trim()"
            class="add-talent-btn-dialog"
          >
            Add Talent
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>



<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "vue-toastification"

// stores
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// state
const drawer = ref(true)
const showUserMenu = ref(false)
const showAddTalentDialog = ref(false)
const newTalent = ref({
  name: "",
  image: null,
  mediaType: "Image"
})
const talents = ref([])
const mediaTypes = ["Image", "Video", "Text", "Audio"]
const talentSearch = ref("")
const imagePreview = ref(null)

// computed
const isAuthPage = computed(() =>
    ["Login", "ForgotPassword", "ResetPassword"].includes(route.name)
)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)
const filteredTalents = computed(() => {
  if (!talentSearch.value.trim()) return talents.value
  const term = talentSearch.value.toLowerCase()
  return talents.value.filter(
      t =>
          t.name.toLowerCase().includes(term) ||
          t.mediaType.toLowerCase().includes(term)
  )
})

// lifecycle
onMounted(() => {
  loadTalents()
})

// methods
function handleLogout() {
  showUserMenu.value = false
  authStore.logout()
  router.push("/login")
}

function loadTalents() {
  const saved = localStorage.getItem("talents")
  if (saved) talents.value = JSON.parse(saved)
}

function openAddTalentDialog() {
  showAddTalentDialog.value = true
  newTalent.value = { name: "", image: null, mediaType: "Image" }
  imagePreview.value = null
}

function closeAddTalentDialog() {
  showAddTalentDialog.value = false
  newTalent.value = { name: "", image: null, mediaType: "Image" }
  imagePreview.value = null
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file")
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size should be less than 5MB")
    return
  }

  newTalent.value.image = file
  const reader = new FileReader()
  reader.onload = ev => {
    imagePreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  newTalent.value.image = null
  imagePreview.value = null
}

function addTalent() {
  if (!newTalent.value.name.trim()) return

  const talent = {
    id: Date.now(),
    name: newTalent.value.name.trim(),
    mediaType: newTalent.value.mediaType,
    image: newTalent.value.image,
    addedDate: new Date().toLocaleDateString()
  }

  if (newTalent.value.image) {
    const reader = new FileReader()
    reader.onload = ev => {
      talent.image = ev.target.result
      saveTalent(talent)
    }
    reader.readAsDataURL(newTalent.value.image)
  } else {
    saveTalent(talent)
  }
}

function saveTalent(talent) {
  talents.value.push(talent)
  localStorage.setItem("talents", JSON.stringify(talents.value))
  closeAddTalentDialog()
  toast.success("Talent added successfully!")
}

function removeTalent(id) {
  talents.value = talents.value.filter(t => t.id !== id)
  localStorage.setItem("talents", JSON.stringify(talents.value))
  toast.success("Talent removed successfully!")
}

function viewTalent(talent) {
  router.push({ name: "TalentView", params: { id: talent.id } })
}
</script>



<style>
/* Global styles */
.v-application {
  font-family: "Poppins", sans-serif !important;
}
.v-application__wrap {
  background-color: #f8f9fa !important;
}
.v-app-bar.v-toolbar{
/* background: #f8f9fa !important; */
box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
/* .v-application__wrap .bg-grey-lighten-4{
  background-color: red !important;
} */
/* .nav-width {
  width: 225px !important;
  margin-left: 15px;
  box-shadow: 1px 1px 7px 1px rgba(0, 0, 0, 0.2) !important;
  height: calc(100vh - 85px) !important;
  border-radius: 15px !important;
} */
.text-decoration-none {
  text-decoration: none;
}

/* Added for proper login page display */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: "Poppins", sans-serif;
  color: #333333;
}

#app {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  font-family: "Poppins", sans-serif;
}

.v-application--wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.v-main {
  flex: 1;
  overflow-y: auto;
}

/* Override Vuetify text colors */
.v-application .text--primary {
  color: #333333 !important;
}

.v-btn:hover {
  background-color: transparent !important;
}
.v-application {
  color: #333333 !important;
}

.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(0, 0, 0, 0.2);
}

.green-dot {
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
  margin-bottom: 8px;
}

.user-btn {
  font-size: 16px;
}

.status-text {
  font-size: 16px !important;
  margin-left: 5px !important;
  color: #151313 !important;
}

.add-competition-btn {
  padding: 20px 15px !important;
  font-size: 16px !important;
}

.add-competition-btn:hover {
  color: #4CAF50 !important;
  border: 2px solid #4CAF50 !important;
  box-shadow: none !important;
}

.add-talent-btn {
  padding: 20px 15px !important;
  font-size: 16px !important;
  border: 1px solid #4caf50 !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-talent-btn:hover {
  color: #4caf50 !important;
  border: 1px solid #4caf50 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.add-talent-btn::after {
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

.add-talent-btn:hover::after {
  width: 300px;
  height: 300px;
}

/* Legal Links Styles */
.legal-links {
  background: transparent !important;
}

.legal-item {
  min-height: 40px !important;
  font-size: 14px !important;
  transition: all 0.3s ease;
}

.legal-item:hover {
  background-color: #f0f8f0 !important;
  transform: translateX(4px);
}

.legal-item .v-list-item-title {
  font-size: 14px !important;
  font-weight: 500 !important;
}

:deep(.v-list-item--active) {
  background-color: #f5f5f5 !important;
}

:deep(.v-list-item) {
  min-height: 44px !important;
}

.text-h4 {
  color: #000;
  letter-spacing: -1px;
}

/* Talent specific styles */
.talents-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow:hidden;
  padding: 5px;
}

.talents-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.talent-item {
  transition: all 0.3s ease;
  cursor: pointer;
  background: transparent;
}

.talent-item:hover {
  background-color: rgba(76, 175, 80, 0.1) !important;
  cursor: pointer;
  transform: translateX(4px);
}

.talent-search-field {
  :deep(.v-field) {
    border-radius: 8px !important;
    background-color: #f8f9fa !important;
    border: 1px solid #e0e0e0 !important;
  }
  
  :deep(.v-field:hover) {
    border-color: #4caf50 !important;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
  }
  
  :deep(.v-field--focused) {
    border-color: #4caf50 !important;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
  }
  
  :deep(.v-field__input) {
    font-size: 14px !important;
  }
  
  :deep(.v-field__prepend-inner) {
    color: #4caf50 !important;
  }
}

.talent-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.delete-talent-btn {
  opacity: 0;
  transition: all 0.3s ease;
}

.talent-item:hover .delete-talent-btn {
  opacity: 1;
}

.add-talent-dialog {
  border-radius: 16px !important;
}

.add-talent-dialog .v-card-title {
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Image Upload Styles */
.image-upload-section {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  background: #fafafa;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.upload-area:hover {
  border-color: #4CAF50;
  background: #f0f8f0;
}

.image-preview-container {
  position: relative;
  display: inline-block;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  z-index: 1;
}

.remove-image-btn:hover {
  background: #ffebee;
  border-color: #f44336;
}

/* Avatar Styles */
.talent-item .v-avatar {
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.talent-item:hover .v-avatar {
  border-color: #4CAF50;
  transform: scale(1.1);
}
.add-talent-btn-dialog:hover{
  color: #4CAF50 !important;
  border: 2px solid #4CAF50 !important;
  box-shadow: none !important;
}
</style>
