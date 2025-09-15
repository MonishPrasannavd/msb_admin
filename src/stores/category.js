import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
        pagination: {
            page: 1,
            per_page: 10,
            total: 0,
        },
    }),
    actions: {
        async fetchCategories(params = {}) {
            this.loading = true
            try {
                const { data } = await api.get('/category/get-categories', { params })

                this.categories = data.data
                this.pagination = {
                    page: data.meta?.current_page || 1,
                    per_page: data.meta?.per_page || 10,
                    total: data.meta?.total || 0,
                }
            } finally {
                this.loading = false
            }
        },

        async createCategory(payload) {
            this.loading = true
            const formData = new FormData();
            formData.append('name', payload.name);
            formData.append('type', payload.type);
            formData.append('is_future', payload.is_future ? 1 : 0);
            if (payload.icon) {
                formData.append('icon', payload.icon);
            }
            try {
                await api.post('/category/create-category', formData)
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create category'
                console.error("Failed to create category:", err.response?.data);
                return false
            } finally {
                this.loading = false
            }
        },

        async updateCategory(id, payload) {
            this.loading = true
            try {
                await api.put(`/category/update-category/${id}`, payload)
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to update category'
                return false
            } finally {
                this.loading = false
            }
        },

        async deleteCategory(id) {
            this.loading = true
            try {
                await api.delete(`/category/delete-category/${id}`)
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to delete category'
                return false
            } finally {
                this.loading = false
            }
        }
    }
})
