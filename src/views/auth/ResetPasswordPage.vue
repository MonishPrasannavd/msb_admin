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
              <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="submitResetPassword">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="New Password"
                  prepend-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append-inner="showPassword = !showPassword"
                  required
                />
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  prepend-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
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
            <v-btn v-if="passwordReset" variant="text" to="/login">
              Go to Login
            </v-btn>
            <v-spacer />
            <v-btn 
              v-if="!passwordReset"
              color="primary" 
              :loading="loading" 
              :disabled="!isFormValid || loading" 
              @click="submitResetPassword"
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

// 1. Initialize Composables
const store = useStore();
const route = useRoute();
const router = useRouter();

// 2. State Management (Replaces data())
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isFormValid = ref(false);
const passwordReset = ref(false);
const successMessage = ref('');
const token = ref('');
const form = ref(null); // To get a reference to the <v-form>

// 3. Vuex Integration (Replaces mapGetters)
const loading = computed(() => store.getters['auth/authLoading']);
const error = computed(() => store.getters['auth/authError']);

// 4. Validation Rules
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters',
  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  v => /[0-9]/.test(v) || 'Password must contain at least one number'
];

// Special case: Rules that depend on other reactive state
const confirmPasswordRules = computed(() => [
  v => !!v || 'Confirm password is required',
  v => v === password.value || 'Passwords do not match'
]);

// 5. Lifecycle Hook (Replaces created())
onMounted(() => {
  token.value = route.query.token;
  if (!token.value) {
    router.push('/login');
  }
});

// 6. Logic (Replaces methods and mapActions)
const submitResetPassword = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      const response = await store.dispatch('auth/resetPassword', {
        token: token.value,
        password: password.value
      });
      successMessage.value = response.message;
      passwordReset.value = true;
    } catch (err) {
      // Error is handled by the Vuex store and displayed via the 'error' computed property
      console.error("Failed to reset password:", err);
    }
  }
};
</script>