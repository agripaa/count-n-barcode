<template>
  <div class="flex min-h-screen bg-gray-100 p-4">
    <Sidebar />
    <div class="flex-1 ml-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
</script>
