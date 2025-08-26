<template>
  <div class="talents-list-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">All Talents</h1>
          
          <v-row>
            <v-col
              v-for="talent in talents"
              :key="talent.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card
                class="talent-card"
                @click="viewTalent(talent)"
                hover
              >
                <v-card-text class="text-center pa-6">
                  <v-avatar size="80" class="mb-4">
                    <v-img
                      v-if="talent.image"
                      :src="talent.image"
                      :alt="talent.name"
                      cover
                    ></v-img>
                    <v-icon v-else icon="mdi-account" size="40" color="grey"></v-icon>
                  </v-avatar>
                  
                  <h3 class="text-h6 mb-2">{{ talent.name }}</h3>
                  <p class="text-caption text-grey">Added: {{ talent.addedDate }}</p>
                  
                  <v-btn
                    color="success"
                    variant="outlined"
                    class="mt-4"
                    @click.stop="viewTalent(talent)"
                  >
                    View Details
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <div v-if="talents.length === 0" class="text-center pa-8">
            <v-icon icon="mdi-account-group-outline" size="64" color="grey" class="mb-4"></v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">No Talents Found</h3>
            <p class="text-body-1 text-grey">Add some talents to get started</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "TalentsListPage",
  data() {
    return {
      talents: []
    };
  },
  created() {
    this.loadTalents();
  },
  methods: {
    loadTalents() {
      const talents = JSON.parse(localStorage.getItem('talents') || '[]');
      this.talents = talents;
    },
    viewTalent(talent) {
      this.$router.push({ name: 'TalentView', params: { id: talent.id } });
    }
  }
};
</script>

<style scoped>
.talents-list-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.talent-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
}

.talent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
</style>
