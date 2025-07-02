<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path) => route.path === path

const name = ref('...') // default loading

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (res.ok && data.name) {
      name.value = data.name
    } else {
      name.value = 'User'
    }
  } catch (err) {
    name.value = 'User'
  }
})
</script>

<template>
  <div class="bg-white h-auto w-64 p-4 shadow-md rounded-2xl">
    <div class="flex items-center gap-2 mb-3">
      <img src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png" class="w-12 h-12 rounded-full" />
      <div>
        <p class="font-semibold">{{ name }}</p>
        <span class="text-xs bg-blue-500 text-white px-3 py-0.5 rounded-full">Admin</span>
      </div>
    </div>
    <hr class="mb-3 border-neutral-200" />
    <nav class="space-y-2">
      <router-link
        to="/dashboard-counting"
        class="flex items-center gap-3 p-2 py-3 rounded-lg transition"
        :class="isActive('/dashboard-counting') ? 'bg-[#F5F8FA] text-blue-500 font-medium' : 'hover:bg-gray-100 text-gray-700'"
      >
        <i class="ri-inbox-unarchive-fill"></i>
        <span>Counter Barang</span>
      </router-link>

      <router-link
        to="/dashboard-barcode"
        class="flex items-center gap-3 p-2 py-3 rounded-lg transition"
        :class="isActive('/dashboard-barcode') ? 'bg-[#F5F8FA] text-blue-500 font-medium' : 'hover:bg-gray-100 text-gray-700'"
      >
        <i class="ri-barcode-line"></i>
        <span>Barcode</span>
      </router-link>

      <router-link
        to="/profile"
        class="flex items-center gap-3 p-2 py-3 rounded-lg transition"
        :class="isActive('/profile') ? 'bg-[#F5F8FA] text-blue-500 font-medium' : 'hover:bg-gray-100 text-gray-700'"
      >
        <i class="ri-user-fill"></i>
        <span>Profile</span>
      </router-link>
    </nav>
  </div>
</template>
