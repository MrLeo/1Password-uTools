<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAppStore } from './stores/app'

const appStore = useAppStore()
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <!-- <RouterLink to="/">首页</RouterLink> -->
        <RouterLink to="/item-list">密码项目</RouterLink>
        <RouterLink to="/vault-list">保险库</RouterLink>
        <RouterLink to="/generate-password">生成密码</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.wrapper {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
}

nav a:first-of-type {
  border: 0;
}

nav a.router-link-exact-active {
  color: var(--color-primary);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
