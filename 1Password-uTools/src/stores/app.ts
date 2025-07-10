import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

// 明确定义 EnterAction 类型
interface EnterAction {
  code: string
  type: string
  payload?: any
  [key: string]: any
}

export const useAppStore = defineStore('app', () => {
  const route = ref('')
  const enterAction = ref<EnterAction | undefined>()

  onMounted(() => {
    window.utools.onPluginEnter((action: EnterAction) => {
      route.value = action.code
      enterAction.value = action

      // Handle feature code for 1Password
      if (
        action.code === 'item-list' ||
        action.code === 'vault-list' ||
        action.code === 'generate-password'
      ) {
        // The router will redirect based on this route value
      }
    })

    window.utools.onPluginOut((_isKill: boolean) => {
      route.value = ''
    })
  })

  return { route, enterAction }
})
