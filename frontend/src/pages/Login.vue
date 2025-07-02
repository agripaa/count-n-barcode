<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Sign In</h2>
      <hr class="mb-6 border-neutral-200" />
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Masukkan Username, cth: Ncen"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Masukkan Password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-yellow-400 text-black py-2 rounded-lg hover:opacity-80 transition duration-200"
        >
          Masuk
        </button>

        <p v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin() {
  error.value = ''

  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await res.json()

    if (!res.ok) {
      error.value = data.message || 'Login gagal'
      return
    }

    // Simpan token dan redirect
    localStorage.setItem('token', data.token)
    router.push('/dashboard-counting') // Ganti sesuai route dashboard kamu
  } catch (err) {
    error.value = 'Terjadi kesalahan server'
  }
}
</script>
