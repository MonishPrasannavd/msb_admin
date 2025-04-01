<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      drawer: true,
      showUserMenu: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]),
    isAuthPage() {
      return ["Login", "ForgotPassword", "ResetPassword"].includes(
        this.$route.name
      );
    },
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    async handleLogout() {
      this.showUserMenu = false;
      await this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<template>
  <v-app>
    <template v-if="!isAuthPage">
      <v-app-bar flat>
        <v-app-bar-title>
          <div class="d-flex align-center">
            <span class="text-h4 font-weight-bold">Msb</span>
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

          <v-list-item
            prepend-icon="mdi-shield-lock"
            title="Privacy Policy"
            to="/privacy-policy"
            class="rounded-lg mb-2"
            active-color="success"
          >
            <template v-slot:prepend>
              <font-awesome-icon icon="fa-solid fa-shield-halved" class="mr-2" />
            </template>
          </v-list-item>

          <v-list-item
            prepend-icon="mdi-file-document"
            title="Terms & Conditions"
            to="/terms-and-conditions"
            class="rounded-lg mb-2"
            active-color="success"
          >
            <template v-slot:prepend>
              <font-awesome-icon icon="fa-solid fa-file-contract" class="mr-2" />
            </template>
          </v-list-item>
        </v-list>

        <!-- <template v-slot:append>
          <div class="pa-2">
            <v-btn
              block
              color="success"
              class="add-competition-btn"
            >
              Add Competitions
            </v-btn>
          </div>
        </template> -->
      </v-navigation-drawer>

      <v-main class="bg-grey-lighten-4">
        <router-view></router-view>
      </v-main>
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

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
</style>
