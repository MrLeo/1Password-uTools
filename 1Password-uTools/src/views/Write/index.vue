<script lang="ts" setup>
import { watch } from 'vue'
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()

watch(
  () => appStore.enterAction,
  (enterAction) => {
    let outputPath
    try {
      if (enterAction?.type === 'over') {
        outputPath = window.services.writeTextFile(enterAction.payload as string)
      } else if (enterAction?.type === 'img') {
        outputPath = window.services.writeImageFile(enterAction.payload as string)
      }
    } catch (err) {
      // 写入错误弹出通知
      window.utools.showNotification('文件保存出错了！')
    }
    if (outputPath) {
      // 在资源管理器中显示
      window.utools.shellShowItemInFolder(outputPath)
    }
    // 退出插件应用
    // window.utools.outPlugin();
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div></div>
</template>
