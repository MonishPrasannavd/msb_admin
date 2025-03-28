<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Reset Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div v-if="!passwordReset">
              <p class="text-subtitle-1 mb-4">
                Please enter your new password below.
              </p>
              <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="resetPassword">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="New Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  required
                />
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  prepend-icon="mdi-lock-check"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                  required
                />
              </v-form>
            </div>
            <div v-else>
              <v-alert type="success" class="mb-4">
                {{ successMessage }}
              </v-alert>
              <p class="text-body-1">
                Your password has been reset successfully. You can now login with your new password.
              </p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="passwordReset" text to="/login">
              Go to Login
            </v-btn>
            <v-spacer />
            <v-btn 
              v-if="!passwordReset"
              color="primary" 
              :loading="loading" 
              :disabled="!isFormValid || loading" 
              @click="resetPassword"
            >
              Reset Password
            </v-btn>
          </v-card-actions>
          <v-alert
            v-if="error"
            type="error"
            dismissible
            class="ma-3"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ResetPasswordPage',
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isFormValid: false,
      passwordReset: false,
      successMessage: '',
      token: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be at least 8 characters',
        v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
        v => /[0-9]/.test(v) || 'Password must contain at least one number'
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirm password is required',
        v => v === this.password || 'Passwords do not match'
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
    }
  },
  created() {
    // Get token from URL query parameters
    this.token = this.$route.query.token
    if (!this.token) {
      this.$router.push('/login')
    }
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    async resetPassword() {
      if (this.$refs.form.validate()) {
        try {
          const response = await this.resetPassword({
            token: this.token,
            password: this.password
          })
          this.successMessage = response.message
          this.passwordReset = true
        } catch (error) {
          // Error is handled by the store
        }
      }
    }
  }
}
</script> 