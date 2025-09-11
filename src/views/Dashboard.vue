<template>
  <div class="quiz-list-container">
    <v-row no-gutters class="px-2" style="height: 100vh">

      <!-- Left Categories Section -->
      <v-col cols="3" class="categories-section d-flex flex-column nav-border pa-4">
        <h3 class="mb-4">Categories</h3>
        <v-list>
          <v-list-item
              v-for="(item, index) in dashboard"
              :key="index"
          >

            <v-list-item-title>
              {{ item.title }}


              <v-chip size="x-small">
                {{ item.qty }}
              </v-chip>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>


    </v-row>
  </div>
</template>

<script>
export default {
  name: "QuizzesListPage",
  data() {
    return {
      dashboard: []
    };
  },
  created() {
    this.loadQuizzes();
  },
  methods: {
    loadQuizzes() {
      try {
        this.dashboard = [

          {title: "Categories", qty: 10},
          {title: "Quizzes", qty: 52},

        ]
      } catch (error) {
        console.error('Error preparing quiz dashboard:', error);
        alert('Failed to load quizzes');
      }
    },
  },
};
</script>

<style scoped>
.nav-border {
  border-right: 1px solid #ddd;
}
</style>
