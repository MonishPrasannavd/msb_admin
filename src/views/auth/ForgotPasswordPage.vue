<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <v-col cols="12" md="6" class="login-form">
        <div class="form-content">
          <div class="logo">Msb<span class="dot">.</span></div>
          
          <h1 class="welcome-text">Forgot Password</h1>
          <p class="login-text">Enter your email to reset your password</p>
          
          <v-form @submit.prevent="sendResetLink" ref="form">
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
            
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="loading || !isFormValid"
            >
              <template v-if="loading">
                <v-progress-circular
                  indeterminate
                  color="white"
                ></v-progress-circular>
              </template>
              <template v-else>
                Send Reset Link
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

            <v-alert
              v-if="emailSent"
              type="success"
              class="mt-4"
            >
              {{ successMessage }}
            </v-alert>

            <div class="back-to-login mt-4">
              <v-btn
                variant="text"
                color="primary"
                to="/login"
                class="text-none"
              >
                <v-icon class="mr-1">mdi-arrow-left</v-icon>
                Back to Login
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-col>
      
      <v-col cols="12" md="6" class="login-image">
        <!-- Background image will be added via CSS -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ForgotPasswordPage',
  data() {
    return {
      email: '',
      emailError: '',
      formErrors: [],
      emailSent: false,
      successMessage: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address'
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['authLoading', 'authError']),
    loading() {
      return this.authLoading
    },
    error() {
      return this.authError
    },
    isFormValid() {
      return this.email && !this.emailError
    }
  },
  methods: {
    ...mapActions('auth', ['forgotPassword']),
    validateEmail() {
      if (!this.email) {
        this.emailError = 'Email is required'
        return false
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Please enter a valid email address'
        return false
      }
      
      this.emailError = ''
      return true
    },
    async sendResetLink() {
      // Reset all errors
      this.emailError = ''
      this.formErrors = []
      
      // Validate form
      const isEmailValid = this.validateEmail()
      
      if (!isEmailValid) {
        return
      }
      
      try {
        const response = await this.forgotPassword({ email: this.email })
        this.successMessage = response.message
        this.emailSent = true
      } catch (error) {
        this.formErrors.push(error.message || 'Failed to send reset link. Please try again.')
        console.error('Reset link error:', error)
      }
    }
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
  margin-bottom: 0.75rem;
  color: #222;
  font-family: 'Poppins', sans-serif;
}

.login-text {
  font-size: 1rem;
  color: #83ADDD;
  margin-bottom: 2rem;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

.back-to-login {
  text-align: center;
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
</style> 