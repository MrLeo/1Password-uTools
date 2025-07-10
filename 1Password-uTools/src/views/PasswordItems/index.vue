<script setup lang="ts">
import { ref } from 'vue'
import AuthContext from '../../components/AuthContext.vue'
import Categories from '../../components/Categories.vue'
import Items from '../../components/Items.vue'
import { DEFAULT_CATEGORY } from '../../const'

const selectedCategory = ref(DEFAULT_CATEGORY)

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="password-items">
    <AuthContext>
      <div class="content-layout">
        <div class="sidebar">
          <Categories :selectedCategory="selectedCategory" @categoryChange="handleCategoryChange" />
        </div>
        <div class="main-content">
          <Items :selectedCategory="selectedCategory" />
        </div>
      </div>
    </AuthContext>
  </div>
</template>

<style scoped>
.password-items {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-layout {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.main-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
</style>
