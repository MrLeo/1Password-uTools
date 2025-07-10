<script setup lang="ts">
import { ref, watch } from 'vue'
import { DEFAULT_CATEGORY } from '../const'
import type { Item } from '../types'
import { actionsForItem, getCategoryIcon, usePasswords } from '../utils'

const props = defineProps<{
  selectedCategory: string
}>()

const passwords = usePasswords()
const filteredItems = ref<Item[]>([])

// Filter items based on selected category
watch(
  [() => passwords.data, () => props.selectedCategory],
  ([items, category]) => {
    if (!items || !Array.isArray(items)) {
      filteredItems.value = []
      return
    }

    if (category === DEFAULT_CATEGORY) {
      filteredItems.value = items as Item[]
    } else {
      const categoryKey = category.toUpperCase().replace(/ /g, '_')
      filteredItems.value = (items as Item[]).filter((item) => item.category === categoryKey)
    }
  },
  { immediate: true },
)

// Handle item actions
const handleItemAction = (item: Item, action: string) => {
  switch (action) {
    case 'open-in-1password':
      window.utools.shellOpenExternal(`op://${item.vault.id}/${item.id}`)
      break
    case 'open-in-browser':
      const url = item.urls?.find((u) => u.primary)?.href
      if (url) {
        window.utools.shellOpenExternal(url)
      }
      break
    case 'copy-username':
      const username = item.fields?.find((f) => f.type === 'username')?.value
      if (username) {
        window.utools.copyText(username)
        window.utools.showNotification('用户名已复制到剪贴板')
      }
      break
    case 'copy-password':
      const password = item.fields?.find((f) => f.type === 'password')?.value
      if (password) {
        window.utools.copyText(password)
        window.utools.showNotification('密码已复制到剪贴板')
      }
      break
    case 'copy-one-time-password':
      const otp = item.fields?.find((f) => f.type === 'otp')?.value
      if (otp) {
        window.utools.copyText(otp)
        window.utools.showNotification('一次性密码已复制到剪贴板')
      }
      break
  }
}
</script>

<template>
  <div class="items-container">
    <div class="items-header">
      <h2>项目</h2>
      <span class="items-count">{{ filteredItems.length }}</span>
    </div>

    <div v-if="passwords.isLoading" class="loading">加载项目中...</div>
    <div v-else-if="passwords.error" class="error">
      {{ passwords.error instanceof Error ? passwords.error.message : String(passwords.error) }}
    </div>
    <div v-else-if="filteredItems.length === 0" class="empty-view">
      <p>没有找到项目</p>
      <p class="empty-description">您在1Password应用中添加的任何项目都将在此处列出。</p>
    </div>
    <div v-else class="items-list">
      <div v-for="item in filteredItems" :key="item.id" class="item-card">
        <div class="item-header">
          <div class="item-icon">
            <i :class="['icon', getCategoryIcon(item.category)]"></i>
          </div>
          <div class="item-title">
            <h3>{{ item.title }}</h3>
            <p v-if="item.additional_information" class="item-subtitle">
              {{ item.additional_information }}
            </p>
          </div>
          <div v-if="item.favorite" class="item-favorite">
            <i class="icon star"></i>
          </div>
        </div>
        <div class="item-vault">{{ item.vault.name }}</div>
        <div class="item-actions">
          <button
            v-for="action in actionsForItem(item)"
            :key="action"
            class="action-button"
            @click="handleItemAction(item, action)"
          >
            {{
              action === 'open-in-1password'
                ? '在1Password中打开'
                : action === 'open-in-browser'
                  ? '在浏览器中打开'
                  : action === 'copy-username'
                    ? '复制用户名'
                    : action === 'copy-password'
                      ? '复制密码'
                      : action === 'copy-one-time-password'
                        ? '复制一次性密码'
                        : action
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.items-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.items-count {
  margin-left: 8px;
  background-color: #e0e0e0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.loading,
.error,
.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
}

.empty-description {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

.error {
  color: #d32f2f;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.item-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-right: 12px;
}

.item-title {
  flex: 1;
}

.item-title h3 {
  margin: 0;
  font-size: 16px;
}

.item-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
}

.item-favorite {
  color: #f9a825;
}

.item-vault {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}

.item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-button {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon.star::before {
  content: '★';
}
</style>
