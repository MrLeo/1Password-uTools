<script setup lang="ts">
import { ref } from 'vue'
import { getCliPath } from '../../utils'

const password = ref('')
const isLoading = ref(false)
const error = ref('')

// Password options
const length = ref(20)
const useDigits = ref(true)
const useSymbols = ref(true)
const useLowercase = ref(true)
const useUppercase = ref(true)

const generatePassword = () => {
  isLoading.value = true
  error.value = ''

  try {
    const cliPath = getCliPath()
    const args = ['item', 'template', 'get', 'Password', '--fields', 'password']

    // Add options
    if (length.value) {
      args.push('--length', length.value.toString())
    }

    if (!useDigits.value) {
      args.push('--no-digits')
    }

    if (!useSymbols.value) {
      args.push('--no-symbols')
    }

    if (!useLowercase.value) {
      args.push('--no-letters')
    }

    if (!useUppercase.value) {
      args.push('--no-uppercase')
    }

    const result = window.node.child_process.execFileSync(cliPath, args, { encoding: 'utf-8' })
    password.value = result.trim()
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = String(err)
    }
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = () => {
  if (password.value) {
    window.utools.copyText(password.value)
    window.utools.showNotification('密码已复制到剪贴板')
  }
}

// Generate a password on mount
generatePassword()
</script>

<template>
  <div class="generate-password">
    <h1>生成密码</h1>

    <div class="password-display">
      <div v-if="isLoading" class="loading">生成密码中...</div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="password">
        {{ password }}
      </div>

      <div class="actions">
        <button class="action-button generate" @click="generatePassword" :disabled="isLoading">
          重新生成
        </button>
        <button
          class="action-button copy"
          @click="copyToClipboard"
          :disabled="!password || isLoading"
        >
          复制
        </button>
      </div>
    </div>

    <div class="options">
      <h2>密码选项</h2>

      <div class="option-group">
        <label for="length">长度:</label>
        <input
          id="length"
          v-model.number="length"
          type="number"
          min="4"
          max="64"
          @change="generatePassword"
        />
      </div>

      <div class="option-group">
        <label>
          <input type="checkbox" v-model="useDigits" @change="generatePassword" />
          包含数字
        </label>
      </div>

      <div class="option-group">
        <label>
          <input type="checkbox" v-model="useSymbols" @change="generatePassword" />
          包含符号
        </label>
      </div>

      <div class="option-group">
        <label>
          <input type="checkbox" v-model="useLowercase" @change="generatePassword" />
          包含小写字母
        </label>
      </div>

      <div class="option-group">
        <label>
          <input type="checkbox" v-model="useUppercase" @change="generatePassword" />
          包含大写字母
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generate-password {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.password-display {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.password {
  font-family: monospace;
  font-size: 18px;
  word-break: break-all;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.loading,
.error {
  padding: 10px;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.error {
  color: #d32f2f;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.generate {
  background-color: #0572ec;
  color: white;
}

.action-button.copy {
  background-color: #4caf50;
  color: white;
}

.options {
  margin-top: 30px;
}

.option-group {
  margin: 10px 0;
}

input[type='number'] {
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>
