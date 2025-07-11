<script setup lang="ts">
import { computed } from 'vue'
import { DEFAULT_CATEGORY } from '../const'
import { useCategories } from '../hooks'
import type { Category } from '../types'
import { capitalizeWords } from '../utils'

const props = defineProps<{
  selectedCategory: string
}>()

const emit = defineEmits(['categoryChange'])

const { data, isLoading, error } = useCategories()

const categoriesList = computed(() => {
  if (!data.value || !Array.isArray(data.value)) return [DEFAULT_CATEGORY]

  const categoryNames = data.value.map((category: Category) => {
    const name = category.name.toLowerCase().replace(/_/g, ' ')
    return capitalizeWords(name)
  })

  return [DEFAULT_CATEGORY, ...categoryNames.sort()]
})

const onCategorySelect = (category: string) => {
  emit('categoryChange', category)
}
</script>

<template>
  <div class="categories">
    <div class="categories-header">
      <h3>分类</h3>
    </div>
    <div v-if="isLoading" class="loading">加载分类中...</div>
    <div v-else-if="error" class="error">
      {{ error instanceof Error ? error.message : String(error) }}
    </div>
    <div v-else class="categories-list">
      <div
        v-for="category in categoriesList"
        :key="category"
        :class="['category-item', { active: category === selectedCategory }]"
        @click="onCategorySelect(category)"
      >
        {{ category }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories {
  width: 100%;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
}

.categories-header {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.category-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: #f0f0f0;
}

.category-item.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.loading,
.error {
  padding: 10px;
  color: #666;
}

.error {
  color: #d32f2f;
}
</style>
