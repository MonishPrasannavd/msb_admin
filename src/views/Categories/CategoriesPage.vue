<template>
  <div class="pa-5">
    <h2 class="mb-4">Categories</h2>

    <!-- Search Filter -->
    <v-text-field v-model="search" label="Search by name" class="mb-4" clearable @input="loadCategories" />

    <!-- Add Category Button -->
    <v-btn color="primary" class="mb-4" @click="openDialog()">
      <v-icon left>mdi-plus</v-icon>
      Add Category
    </v-btn>

    <v-divider class="my-6"></v-divider>

    <!-- Category List -->
    <v-data-table :items="categories" :headers="headers" :loading="categoryStore.loading"
      :items-per-page="pagination?.per_page || 10" :page="pagination?.page || 1"
      :server-items-length="pagination?.total || 0" @update:page="loadCategories">
      <template #item.actions="{ item }">
        <v-btn icon @click="openDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="removeCategory(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template #item.icon="{ item }">
        <v-img :width="50" cover :src="item.icon_url"></v-img>
      </template>

      <template #item.name="{ item }">
        <v-btn :to="{ name : 'TalentView', params:{id:item.id}}" variant="flat" color="primary" size="small">
          {{ item.name }}
        </v-btn>
      </template>

      <template #item.is_future="{ item }">
        <v-chip variant="flat" color="red" size="small" v-if="item.is_future == 0">
          NO
        </v-chip>
        <v-chip variant="flat" color="green" size="small" v-if="item.is_future == 1">
          YES
        </v-chip>
      </template>
    </v-data-table>

    <!-- Dialog for Create / Edit Category -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card>
        <v-card-title class="justify-space-between align-center">
          <span class="text-h6">{{ form.id ? "Edit Category" : "Add Category" }}</span>
          <v-btn icon @click="closeDialog" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="handleSubmit" class="d-flex flex-column gap-4">
            <v-text-field
              v-model="form.name"
              label="Category Name"
              :rules="[v => !!v || 'Name is required']"
              required
              prepend-inner-icon="mdi-tag"
            ></v-text-field>

            <v-file-input
              v-model="form.icon"
              label="Category Icon"
              accept="image/*"
              :multiple="false"
              clearable
              show-size
              prepend-icon="mdi-image"
            ></v-file-input>

            <div class="d-flex align-center gap-4">
              <v-switch
                v-model="form.is_future"
                label="Is Future?"
                inset
              ></v-switch>
              <v-select
                v-model="form.type"
                :items="[
                  { title: 'Type 0', value: 0 },
                  { title: 'Type 1', value: 1 },
                  { title: 'Type 2', value: 2 }
                ]"
                label="Type"
                class="flex-grow-1"
                required
              ></v-select>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :loading="loading" @click="handleSubmit" variant="flat">
            <v-icon left>{{ form.id ? "mdi-content-save" : "mdi-plus" }}</v-icon>
            {{ form.id ? "Update" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useCategoryStore } from "@/stores/category";

const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categories);
const pagination = computed(() => categoryStore.pagination);

const form = ref({ id: null, name: "", icon: "", is_future: 0, type: 0 });
const search = ref("");
const options = ref({ page: 1, itemsPerPage: 10, sortBy: [], sortDesc: [] });
const dialog = ref(false);
const loading = computed(() => categoryStore.loading);

const headers = [
  { title: "Name", value: "name" },
  { title: "Icon", value: "icon" },
  { title: "Is Future", value: "is_future" },
  { title: "Type", value: "type" },
  { title: "Actions", value: "actions", sortable: false },
];

const loadCategories = (page = 1) => {
  categoryStore.fetchCategories({
    page,
    per_page: pagination.value.per_page || 10,
    search: search.value,
  });
};

watch(options, loadCategories, { deep: true });
onMounted(loadCategories);

const handleSubmit = async () => {
  if (form.value.id) {
    await categoryStore.updateCategory(form.value.id, form.value);
  } else {
    await categoryStore.createCategory(form.value);
  }
  resetForm();
  closeDialog();
  loadCategories();
};

const removeCategory = async (id) => {
  await categoryStore.deleteCategory(id);
  loadCategories();
};

const openDialog = (item = null) => {
  if (item) {
    form.value = { ...item };
  } else {
    resetForm();
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

//changed string to null for icon
const resetForm = () => {
  form.value = { id: null, name: "", icon: null, is_future: false, type: 0 };
};
</script>
