<script setup lang="ts">
import { ref, watch } from 'vue'
import AuthContext from '../../components/AuthContext.vue'
import { usePasswords, useVaults } from '../../hooks'
import type { Item, Vault } from '../../types'

const { data: vaults, isLoading: vaultsIsLoading, error: vaultsError } = useVaults()
const { data: passwords, isLoading: passwordsIsLoading, error: passwordsError } = usePasswords()

const selectedVault = ref<Vault | null>(null)

const selectVault = (vault: Vault) => {
  selectedVault.value = vault
}

const clearSelection = () => {
  selectedVault.value = null
}

// Filter items by selected vault
const filteredItems = ref<Item[]>([])

const updateFilteredItems = () => {
  if (!selectedVault.value || !passwords.value || !Array.isArray(passwords.value)) {
    filteredItems.value = []
    return
  }

  filteredItems.value = (passwords.value as Item[]).filter(
    (item: Item) => item.vault.id === selectedVault.value?.id,
  )
}

// Watch for changes in selected vault or passwords data
watch(
  [() => selectedVault.value, () => passwords.value],
  () => {
    updateFilteredItems()
  },
  { immediate: true },
)
</script>

<template>
  <div class="vaults-view">
    <AuthContext>
      <div v-if="selectedVault" class="vault-items">
        <div class="header">
          <button class="back-button" @click="clearSelection">&larr; 返回</button>
          <h2>{{ selectedVault.name }}</h2>
          <span class="items-count">{{ filteredItems.length }}</span>
        </div>

        <div v-if="passwordsIsLoading" class="loading">加载项目中...</div>
        <div v-else-if="filteredItems.length === 0" class="empty-view">
          <p>此保险库中没有项目</p>
        </div>
        <div v-else class="items-list">
          <div v-for="item in filteredItems" :key="item.id" class="item-card">
            <h3>{{ item.title }}</h3>
            <p v-if="item.additional_information" class="item-subtitle">
              {{ item.additional_information }}
            </p>
            <div class="item-category">{{ item.category.replace(/_/g, ' ') }}</div>
          </div>
        </div>
      </div>
      <div v-else class="vaults-list">
        <h2>保险库</h2>

        <div v-if="vaultsIsLoading" class="loading">加载保险库中...</div>
        <div v-else-if="vaultsError" class="error">
          {{ vaultsError instanceof Error ? vaultsError.message : String(vaultsError) }}
        </div>
        <div
          v-else-if="!vaults || !Array.isArray(vaults) || vaults.length === 0"
          class="empty-view"
        >
          <p>没有找到保险库</p>
        </div>
        <div v-else class="vault-cards">
          <div
            v-for="vault in vaults"
            :key="vault.id"
            class="vault-card"
            @click="selectVault(vault as Vault)"
          >
            <h3>{{ vault.name }}</h3>
          </div>
        </div>
      </div>
    </AuthContext>
  </div>
</template>

<style scoped>
.vaults-view {
  width: 100%;
  height: 100vh;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;
  margin-right: 10px;
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

.error {
  color: #d32f2f;
}

.vault-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.vault-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.vault-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  padding: 16px;
}

.item-subtitle {
  margin: 4px 0 8px;
  font-size: 14px;
  color: #666;
}

.item-category {
  font-size: 12px;
  color: #666;
  text-transform: capitalize;
}
</style>
