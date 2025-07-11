<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { useAccounts } from '../hooks'
import {
  CommandLineMissingError,
  ZSH_PATH,
  ZshMissingError,
  checkZsh,
  errorRegex,
  getCliPath,
  getSignInStatus,
  signIn,
} from '../utils'

const isAuthenticated = ref(false)
const zshMissing = ref(!checkZsh())
const accountSelected = ref(true)
const errorMessage = ref('')
const accounts = useAccounts()

// 添加计算属性处理账户数据
const accountsList = computed(() => {
  if (Array.isArray(accounts.data)) {
    return accounts.data
  }
  return []
})

const emit = defineEmits(['authenticated'])

// Provide authentication state to child components
provide('auth', {
  isAuthenticated,
  errorMessage,
})

const authenticate = async () => {
  try {
    if (!ZSH_PATH) {
      throw new ZshMissingError('Zsh Binary Path Missing!')
    }
    if (!getCliPath()) {
      throw new CommandLineMissingError('1Password CLI is missing! Please install it before use.')
    }
    signIn()
    isAuthenticated.value = true
    accountSelected.value = true
    emit('authenticated', true)
    return
  } catch (err) {
    if (!(err instanceof Error)) {
      errorMessage.value = String(err)
      return
    }

    const errorMessageMatches = err.message.match(errorRegex)
    if (errorMessageMatches && errorMessageMatches[1]) {
      errorMessage.value = errorMessageMatches[1]
    } else {
      errorMessage.value = err.message
    }

    if (err.message.includes('multiple accounts found')) return (accountSelected.value = false)
  }
}

const onAccountSelect = async (accountId: string) => {
  try {
    signIn(`--account ${accountId}`)
    isAuthenticated.value = true
    accountSelected.value = true
    emit('authenticated', true)
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    }
  }
}

onMounted(async () => {
  isAuthenticated.value = getSignInStatus()
  if (!isAuthenticated.value && !zshMissing.value) {
    authenticate()
  } else if (isAuthenticated.value) {
    emit('authenticated', true)
  }
})
</script>

<template>
  <div v-if="!accountSelected" class="account-selector">
    <h2>选择账户</h2>
    <div v-if="accounts.isLoading" class="loading">加载账户中...</div>
    <div v-else-if="accounts.error" class="error">
      {{ accounts.error instanceof Error ? accounts.error.message : String(accounts.error) }}
    </div>
    <div v-else class="accounts-list">
      <div
        v-for="(account, index) in accountsList"
        :key="index"
        class="account-item"
        @click="account.account_uuid && onAccountSelect(account.account_uuid)"
      >
        {{ account.url }} - {{ account.email }}
      </div>
    </div>
  </div>
  <div v-else-if="zshMissing" class="error-guide">
    <h2>错误</h2>
    <p>未找到 Zsh。请确保已安装 Zsh 并在设置中提供正确路径。</p>
  </div>
  <div v-else-if="!isAuthenticated" class="auth-required">
    <h2>需要认证</h2>
    <p>{{ errorMessage || '请使用请求的方法进行身份验证以继续。' }}</p>
    <button @click="authenticate" class="reload-btn">重新加载</button>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.account-selector,
.error-guide,
.auth-required {
  padding: 20px;
  text-align: center;
}

.accounts-list {
  margin-top: 20px;
}

.account-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}

.account-item:hover {
  background-color: #e0e0e0;
}

.loading,
.error {
  margin: 20px 0;
}

.reload-btn {
  padding: 8px 16px;
  background-color: #0572ec;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.reload-btn:hover {
  background-color: #0456b3;
}
</style>
