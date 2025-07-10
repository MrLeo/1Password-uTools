import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

type EnterAction = Parameters<Parameters<UToolsApi['onPluginEnter']>[0]>[0]

export const useAppStore = defineStore('app', () => {
  const route = ref('')
  const enterAction = ref<EnterAction>()

  onMounted(() => {
    window.utools.onPluginEnter<EnterAction>((action) => {
      route.value = action.code
      enterAction.value = action
    })
    window.utools.onPluginOut((isKill) => {
      route.value = ''
    })
  })

  return { route, enterAction }
})
