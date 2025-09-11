<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="login-form">
        <div class="form-content">
          <div class="logo">Msb<span class="dot">.</span></div>

          <h1 class="welcome-text">Welcome</h1>
          <p class="login-text">Login</p>

          <v-form @submit.prevent="handleLogin" ref="form">
            <v-text-field
                v-model="email"
                :error-messages="emailError"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                class="mb-4"
                :rules="emailRules"
                @blur="validateEmail"
                required
            ></v-text-field>

            <v-text-field
                v-model="password"
                :error-messages="passwordError"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                class="mb-4"
                :rules="passwordRules"
                @blur="validatePassword"
                @click:append-inner="showPassword = !showPassword"
                required
            ></v-text-field>

            <div class="d-flex justify-space-between align-center mb-4">
              <v-checkbox
                  v-model="showPassword"
                  label="Show password"
                  :model-value="showPassword"
                  color="primary"
                  density="compact"
                  hide-spin-buttons
                  hide-details
                  class="mt-0 show-password-checkbox"
              ></v-checkbox>

              <v-btn
                  variant="text"
                  color="primary"
                  to="/forgot-password"
                  class="text-none"
              >
                Forgot Password?
              </v-btn>
            </div>

            <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="loading || !isFormValid"
                class="login-btn"
            >
              <template v-if="loading">
                <v-progress-circular
                    indeterminate
                    color="white"
                ></v-progress-circular>
              </template>
              <template v-else>
                Login
              </template>
            </v-btn>

            <v-alert
                v-if="formErrors.length > 0"
                type="error"
                class="mt-4"
            >
              <div v-for="(error, index) in formErrors" :key="index">
                {{ error }}
              </div>
            </v-alert>
          </v-form>
        </div>
      </v-col>

      <v-col cols="12" md="6" class="login-image">
        <!-- Background image will be added via CSS -->
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from "@/stores/index.js";

// form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')
const formErrors = ref([])

const router = useRouter()
const auth = useAuthStore()

// validation
const emailRules = [
  v => !!v || 'Email is required',
  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email'
]
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters long'
]

function validateEmail() {
  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email.value)) {
    emailError.value = 'Invalid email'
    return false
  }
  emailError.value = ''
  return true
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  }
  if (password.value.length < 6) {
    passwordError.value = 'Password too short'
    return false
  }
  passwordError.value = ''
  return true
}

const isFormValid = computed(() =>
    email.value && password.value && !emailError.value && !passwordError.value
)


async function handleLogin() {
  emailError.value = ''
  passwordError.value = ''
  formErrors.value = []

  const validEmail = validateEmail()
  const validPass = validatePassword()
  if (!validEmail || !validPass) return

  const success = await auth.login(email.value, password.value)

  if (success) {
    console.log(router.getRoutes().map(r => r.name)) // check route names
    await router.push({name: "Dashboard"})
  } else {
    formErrors.value.push(auth.error || 'Login failed')
  }
}


</script>




<style scoped>
.v-container {
  padding: 0px;
}

.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
}

.form-content {
  width: 100%;
  max-width: 400px;
}

.login-image {
  background-color: #1a1a2e;
  background-image: url('../../assets/images/login-bg.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  position: relative;
}

.login-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
}

.logo {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  color: #222;
  font-family: 'Poppins', sans-serif;
}

.dot {
  color: #4CAF50;
  font-size: 3.2rem;
}

.welcome-text {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #222;
  font-family: 'Poppins', sans-serif;
}

.login-text {
  font-size: 1.5rem;
  color: #83ADDD;
  margin-bottom: 2rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

@media (max-width: 960px) {
  .login-image {
    min-height: 200px;
  }

  .login-form {
    min-height: auto;
    padding: 2rem 1rem;
  }

  .welcome-text {
    font-size: 2.5rem;
  }

  .logo {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
}

.show-password-checkbox :deep(.v-selection-control) {
  min-height: 24px;
}

.show-password-checkbox :deep(.v-selection-control__wrapper) {
  margin-right: 8px;
}

.show-password-checkbox :deep(.v-selection-control__input) {
  width: 18px;
  height: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 2px;
  transition: all 0.2s ease;
  position: relative;
}

.show-password-checkbox :deep(.v-selection-control__input input) {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  z-index: 1;
}

.show-password-checkbox :deep(.v-selection-control--density-default .v-selection-control__input.v-selection-control--checked) {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.show-password-checkbox :deep(.v-selection-control--density-default .v-selection-control__input.v-selection-control--checked input) {
  opacity: 1;
}

.show-password-checkbox :deep(.v-selection-control--density-default .v-selection-control__input.v-selection-control--checked .v-icon) {
  color: white;
  font-size: 14px;
  opacity: 1;
}

.login-btn:hover {
  color: #4CAF50 !important;
  border: 2px solid #4CAF50 !important;
  /* box-shadow: none !important; */
}
</style>