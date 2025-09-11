<template>
  <div class="pa-5">
    <h2 class="mb-4">Categories</h2>

    <!-- Search Filter -->
    <v-text-field
        v-model="search"
        label="Search by name"
        class="mb-4"
        clearable
        @input="loadCategories"
    />

    <!-- Add Category Button -->
    <v-btn color="primary" class="mb-4" @click="openDialog()">
      <v-icon left>mdi-plus</v-icon>
      Add Category
    </v-btn>

    <v-divider class="my-6"></v-divider>

    <!-- Category List -->
    <v-data-table
        :items="categories"
        :headers="headers"
        :loading="categoryStore.loading"
        :items-per-page="pagination?.per_page || 10"
        :page="pagination?.page || 1"
        :server-items-length="pagination?.total || 0"
        @update:page="loadCategories"
    >
      <template #item.actions="{ item }">
        <v-btn icon @click="openDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="removeCategory(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog for Create / Edit Category -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ form.id ? 'Edit' : 'Add' }} Category</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="handleSubmit">
            <v-text-field v-model="form.name" label="Name" required></v-text-field>
            <v-text-field v-model="form.icon" label="Icon"></v-text-field>
            <v-switch v-model="form.is_future" label="Is Future?"></v-switch>
            <v-select v-model="form.type" :items="[0, 1, 2]" label="Type"></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :loading="loading" @click="handleSubmit">
            {{ form.id ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()

const categories = computed(() => categoryStore.categories)
const pagination = computed(() => categoryStore.pagination)

const form = ref({ id: null, name: '', icon: '', is_future: 0, type: 0 })
const search = ref('')
const options = ref({ page: 1, itemsPerPage: 10, sortBy: [], sortDesc: [] })
const dialog = ref(false)
const loading = computed(() => categoryStore.loading)

const headers = [
  { title: 'Name', value: 'name' },
  { title: 'Icon', value: 'icon' },
  { title: 'Is Future', value: 'is_future' },
  { title: 'Type', value: 'type' },
  { title: 'Actions', value: 'actions', sortable: false },
]

const loadCategories = (page = 1) => {
  categoryStore.fetchCategories({
    page,
    per_page: pagination.value.per_page || 10,
    search: search.value,
  })
}

watch(options, loadCategories, { deep: true })
onMounted(loadCategories)

const handleSubmit = async () => {
  if (form.value.id) {
    await categoryStore.updateCategory(form.value.id, form.value)
  } else {
    await categoryStore.createCategory(form.value)
  }
  resetForm()
  closeDialog()
  loadCategories()
}

const removeCategory = async (id) => {
  await categoryStore.deleteCategory(id)
  loadCategories()
}

const openDialog = (item = null) => {
  if (item) {
    form.value = { ...item }
  } else {
    resetForm()
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const resetForm = () => {
  form.value = { id: null, name: '', icon: '', is_future: 0, type: 0 }
}
</script>
