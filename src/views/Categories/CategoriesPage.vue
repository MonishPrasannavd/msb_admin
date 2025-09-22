<template>
  <div class="px-5 py-2">
    <h2 class="mb-4">Talents</h2>
    <v-row no-gutters justify="space-between">
      <v-col cols="3">
        <v-btn class="mb-4 add-category" @click="openDialog()">
          <i class="fa-solid fa-plus me-2"></i>
          Add Category
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="search"
          label="Search by Talent Name .."
          variant="solo"
          rounded="lg"
          bg-color="white"
          density="compact"
          class="mb-4 input-search"
          clearable
          @input="loadCategories"
        >
          <template v-slot:prepend-inner>
            <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <!-- Search Filter -->

    <!-- Add Category Button -->

    <!-- <v-divider class="my-6"></v-divider> -->

    <!-- Category List -->
    <v-data-table
      :items="categories"
      :headers="headers"
      :loading="categoryStore.loading"
      :items-per-page="pagination?.per_page || 10"
      :page="pagination?.page || 1"
      :server-items-length="pagination?.total || 0"
      @update:page="loadCategories"
      class="rounded-lg responsive-table"
      fixed-header
    >
      <template #item.actions="{ item }" class="d-flex flex-row ga-4">
        <v-btn
          @click="openDialog(item)"
          icon="mdi-plus"
          density="comfortable"
          class="me-4 edit-btn"
        >
          <i class="fa-solid fa-pen-to-square"></i>
        </v-btn>

        <v-btn
          @click="openDeleteDialog(item)"
          icon="mdi-plus"
          density="comfortable"
          class="me-4 delete-btn"
        >
          <i class="fa-solid fa-trash"></i>
        </v-btn>
        <v-btn
          :to="{ name: 'TalentView', params: { id: item.id } }"
          icon="mdi-plus"
          density="comfortable"
          class="me-4 view-btn"
        >
          <i class="bi bi-eye-fill"></i>
        </v-btn>
      </template>
      <template #item.icon="{ item }">
        <v-img :width="50" cover :src="item.icon_url"></v-img>
      </template>

      <template #item.name="{ item }">
        <p class="ps-3 text-subtitle-1">
          {{ item.name }}
        </p>
      </template>

      <template #item.is_future="{ item }">
        <v-chip
          variant="flat"
          color="red"
          size="small"
          v-if="item.is_future == 0"
        >
          NO
        </v-chip>
        <v-chip
          variant="flat"
          color="green"
          size="small"
          v-if="item.is_future == 1"
        >
          YES
        </v-chip>
      </template>
    </v-data-table>

    <!-- Dialog for Create / Edit Category -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card>
        <div class="d-flex flex-row justify-space-between">
          <v-card-title class="justify-space-between align-center">
            <span class="text-h6">
              {{ form.id ? "Edit Category" : "Add Category" }}
            </span>
          </v-card-title>
          <v-btn icon @click="closeDialog" variant="text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-divider></v-divider>

        <v-card-text>
          <v-form
            ref="formRef"
            @submit.prevent="handleSubmit"
            class="d-flex flex-column gap-4"
          >
            <v-text-field
              v-model="form.name"
              variant="solo"
              rounded="lg"
              bg-color="white"
              color="#4caf50"
              label="Category Name"
              :rules="[(v) => !!v || 'Name is required']"
              required
              prepend-inner-icon="mdi-tag"
              density="comfortable"
              class="custom-shadow"
            ></v-text-field>

            <v-select
              v-model="form.type"
              :items="[
                { title: 'Image', value: 0 },
                { title: 'Video', value: 1 },
                { title: 'Audio', value: 2 },
                { title: 'Text', value: 3 },
                { title: 'Quiz', value: 4 },
              ]"
              required
              variant="solo"
              rounded="lg"
              bg-color="white"
              label="Select Media Type"
              density="comfortable"
              class="custom-shadow"
            ></v-select>

            <v-switch
              v-model="form.is_future"
              label="Is Future?"
              density="compact"
              color="success"
              class="ms-3 custom-shadow"
            ></v-switch>

            <v-file-input
              v-model="form.icon"
              label="Upload Image"
              variant="plain"
              rounded="lg"
              bg-color="white"
              prepend-inner-icon="mdi-image"
              accept="image/*"
              :multiple="false"
              clearable
              show-size
              density="comfortable"
            ></v-file-input>

            <v-img
              v-if="imagePreviewUrl"
              :src="imagePreviewUrl"
              height="100"
              width="100"
              class="my-2"
              cover
              alt="Category Icon Preview"
            ></v-img>
            <!-- <div class="d-flex align-center gap-4">
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
                  { title: 'Type 2', value: 2 },
                ]"
                label="Type"
                class="flex-grow-1"
                required
              ></v-select>
            </div> -->
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn
            class="add-category"
            :loading="loading"
            @click="handleSubmit"
            variant="flat"
          >
            <v-icon left>{{
              form.id ? "mdi-content-save" : "mdi-plus"
            }}</v-icon>
            {{ form.id ? "Update" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <v-dialog v-model="dialog" max-width="480">
  </v-dialog> -->

    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title class="text-h5"> Confirm Deletion </v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ itemToDelete?.name }}</strong
          >? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDeleteDialog"> Cancel </v-btn>
          <v-btn
            color="red-darken-1"
            variant="flat"
            :loading="loading"
            @click="confirmDelete"
          >
            Delete
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

const form = ref({ id: null, name: "", icon: "", is_future: 0, type: null });
const search = ref("");
const options = ref({ page: 1, itemsPerPage: 10, sortBy: [], sortDesc: [] });
const dialog = ref(false);
const loading = computed(() => categoryStore.loading);

const deleteDialog = ref(false);
const itemToDelete = ref(null);

const imagePreviewUrl = computed(() => {
  // Case 1: A new file has been selected by the user.
  // `form.value.icon` will be a File object.
  if (form.value.icon && form.value.icon instanceof File) {
    // Create a temporary local URL for the selected file.
    return URL.createObjectURL(form.value.icon);
  }

  // Case 2: We are editing an existing item that has an icon_url.
  if (form.value.icon_url) {
    return form.value.icon_url;
  }

  // Case 3: No image is available.
  return null;
});

const headers = [
  { title: "Name", value: "name" },
  { title: "Icon", value: "icon" },
  { title: "Is Future", value: "is_future" },
  { title: "Type", value: "type" },
  { title: "Actions", value: "actions", sortable: false },
];

// CORRECTED: This function now correctly uses the 'options' ref
const loadCategories = () => {
  categoryStore.fetchCategories({
    page: options.value.page,
    per_page: options.value.itemsPerPage,
    search: search.value,
    // You could also pass sorting options here if your API supports it
    // sortBy: options.value.sortBy,
    // sortDesc: options.value.sortDesc,
  });
};

watch(options, loadCategories, { deep: true });
onMounted(loadCategories);

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("is_future", form.value.is_future ? 1 : 0);
  formData.append("type", form.value.type);

  if (form.value.id) {
    // Logic for UPDATE
    if (form.value.icon && form.value.icon instanceof File) {
      formData.append("icon", form.value.icon);
    }
    await categoryStore.updateCategory(form.value.id, formData);
  } else {
    // Logic for CREATE
    // BUG FIX: v-file-input (when not multiple) returns a single File object, NOT an array.
    // Accessing form.value.icon[0] would cause an error.
    if (form.value.icon && form.value.icon instanceof File) {
      formData.append("icon", form.value.icon);
    }
    await categoryStore.createCategory(formData);
  }

  resetForm();
  closeDialog();
  loadCategories();
};

const openDialog = (item = null) => {
  if (item) {
    form.value = { ...item, icon: null };
  } else {
    resetForm();
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  resetForm();
};

const openDeleteDialog = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const closeDeleteDialog = () => {
  deleteDialog.value = false;
  itemToDelete.value = null;
};

const confirmDelete = async () => {
  if (itemToDelete.value) {
    await categoryStore.deleteCategory(itemToDelete.value.id);
    closeDeleteDialog();
    loadCategories();
  }
};

const resetForm = () => {
  form.value = { id: null, name: "", icon: null, is_future: false, type: null };
};
</script>

<style>
.auth-layout {
  background: transparent !important;
}
.add-category {
  background-color: #4caf50;
  color: #fff;
  border: 1px solid #4caf50;
  transition: all 0.8s ease;
}
.v-messages__message {
  line-height: 2rem !important;
  font-size: 0.85rem;
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
.v-input--horizontal .v-input__prepend {
  display: none;
}
.search-icon {
  color: #4caf50 !important;
}
.add-category:hover {
  background-color: #fff !important;
  color: #4caf50;
  border: 1px solid #4caf50;
  box-shadow: none !important;
}
table tbody tr td {
  padding: 7px !important;
}
table thead tr th {
  font-size: 1rem !important;
  font-weight: 500;
  color: #4caf50;
}
.view-btn {
  background-color: #4caf50;
  color: #fff;
  border: 1px solid #4caf50;
  transition: all 0.8s ease;
}
.view-btn:hover {
  background-color: #fff;
  color: #4caf50;
}
.delete-btn {
  background-color: #dc3545;
  color: #fff;
  border: 1px solid #dc3545;
  transition: all 0.8s ease;
}
.delete-btn:hover {
  background-color: #fff;
  color: #dc3545;
}
.edit-btn {
  background-color: #0d6efd;
  color: #fff;
  border: 1px solid #0d6efd;
  transition: all 0.8s ease;
}
.edit-btn:hover {
  color: #0d6efd;
}
.responsive-table {
  height: calc(100vh - 220px); /* 64px = app-bar height */
}
</style>
