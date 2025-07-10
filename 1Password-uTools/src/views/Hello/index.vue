<script lang="ts" setup>
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
</script>

<template>
  <div class="hello">
    <h1>你好，Hello</h1>
    <h2>插件应用进入参数</h2>
    <pre>{{ JSON.stringify(appStore.enterAction, undefined, 2) }}</pre>
  </div>
</template>

<style>
.hello {
  padding: 10px 28px;
}
</style>
