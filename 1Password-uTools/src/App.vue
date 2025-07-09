<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Hello</RouterLink>
        <RouterLink to="/read">Read</RouterLink>
        <RouterLink to="/write">Write</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
