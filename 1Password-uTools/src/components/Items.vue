<script setup lang="ts">
import { computed, reactive } from 'vue'
import { DEFAULT_CATEGORY } from '../const'
import { useAccount, usePasswords } from '../hooks'
import type { Item } from '../types'
import { actionsForItem, getCategoryIcon, getCliPath } from '../utils'

const props = defineProps<{
  selectedCategory: string
}>()

const { data: account } = useAccount()
const { data: passwords, isLoading, error } = usePasswords()

const filteredItems = computed(() => {
  if (!passwords.value || !Array.isArray(passwords.value)) {
    return []
  }

  if (props.selectedCategory === DEFAULT_CATEGORY) {
    return passwords.value as Item[]
  } else {
    const categoryKey = props.selectedCategory.toUpperCase().replace(/ /g, '_')
    return (passwords.value as Item[]).filter((item) => item.category === categoryKey)
  }
})

const actionLabels: Record<string, string> = {
  'open-in-1password': '在1Password中打开',
  'open-in-browser': '在浏览器中打开',
  'copy-username': '复制用户名',
  'copy-password': '复制密码',
  'copy-one-time-password': '复制一次性密码',
}

const loading = reactive<Record<string, boolean>>({
  'open-in-1password': false,
  'open-in-browser': false,
  'copy-username': false,
  'copy-password': false,
  'copy-one-time-password': false,
})

const actionStrategies: Record<string, (item: Item) => void> = {
  'open-in-1password': (item: Item) => {
    loading['open-in-1password'] = true
    const url = `onepassword://view-item/?a=${account.value?.account_uuid}&v=${item.vault.id}&i=${item.id}`
    window.utools.shellOpenExternal(url)
    loading['open-in-1password'] = false
  },
  'open-in-browser': (item: Item) => {
    loading['open-in-browser'] = true
    const url = item.category === 'LOGIN' ? item.urls?.find((u) => u.primary)?.href : undefined
    url && window.utools.shellOpenExternal(url)
    loading['open-in-browser'] = false
  },
  'copy-username': (item: Item) => {
    loading['copy-username'] = true
    const uri = `op://${item.vault.id}/${item.id}/username`
    const username = window.node.child_process.execFileSync(getCliPath(), ['read', uri])
    if (username) {
      window.utools.copyText(username.toString().trim())
      window.utools.showNotification('用户名已复制到剪贴板')
    }
    loading['copy-username'] = false
  },
  'copy-password': (item: Item) => {
    loading['copy-password'] = true
    const uri = `op://${item.vault.id}/${item.id}/password`
    const password = window.node.child_process.execFileSync(getCliPath(), ['read', uri])
    if (password) {
      window.utools.copyText(password.toString().trim())
      window.utools.showNotification('密码已复制到剪贴板')
    }
    loading['copy-password'] = false
  },
  'copy-one-time-password': (item: Item) => {
    loading['copy-one-time-password'] = true
    const otp = window.node.child_process.execFileSync(getCliPath(), [
      'item',
      'get',
      item.id,
      '--otp',
    ])
    if (otp) {
      window.utools.copyText(otp.toString().trim())
      window.utools.showNotification('一次性密码已复制到剪贴板')
    }
    loading['copy-one-time-password'] = false
  },
}

const handleItemAction = (item: Item, action: string) => {
  console.log(`[LOG] → handleItemAction → item`, JSON.stringify(item, null, 2))
  const strategy = actionStrategies[action]
  if (strategy) {
    strategy(item)
  }
}

const getActionLabel = (action: string) => {
  return actionLabels[action] || action
}
</script>

<template>
  <div class="items-container">
    <div class="items-header">
      <h2>项目</h2>
      <span class="items-count">{{ filteredItems.length }}</span>
    </div>

    <div v-if="isLoading" class="loading">加载项目中...</div>
    <div v-else-if="error" class="error">
      {{ error instanceof Error ? error.message : String(error) }}
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
            {{ getActionLabel(action) }}
            <span v-if="loading[action]">...</span>
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
  background-color: #083de9;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #0631bc;
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
