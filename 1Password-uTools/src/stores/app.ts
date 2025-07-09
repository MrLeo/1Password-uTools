import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const route = ref('')
  const enterAction = ref({})

  onMounted(() => {
    window.utools.onPluginEnter((action) => {
      route.value = action.code
      enterAction.value = action
    })
    window.utools.onPluginOut((isKill) => {
      route.value = ''
    })
  })

  return { route, enterAction }
})
