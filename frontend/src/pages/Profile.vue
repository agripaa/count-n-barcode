<template>
  <DefaultLayout>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-1">Edit Profile</h1>

      <div class="p-6 max-w-xl">
        <!-- Avatar (preview only) -->
        <div class="flex flex-col mb-6">
          <img :src="avatar" alt="Avatar" class="w-24 h-24 rounded-full object-cover mb-3" />
          <label class="cursor-pointer text-blue-600 rounded-md text-sm hover:bg-blue-50">
            Upload Gambar
            <input type="file" class="hidden" @change="handleAvatarUpload" />
          </label>
        </div>

        <!-- Username -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Toggle Password Form -->
        <div class="mb-4">
          <button @click="togglePasswordForm" class="text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
            <i class="ri-key-line"></i>
            Ubah Password
          </button>
        </div>

        <!-- Password Fields -->
        <div v-if="showPasswordForm" class="mb-4 space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input type="password" v-model="oldPassword" class="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input type="password" v-model="newPassword" class="w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
        </div>

        <!-- Save Button -->
        <button
          @click="saveProfile"
          class="w-full mt-6 bg-yellow-400 text-black py-2 rounded-lg hover:opacity-80"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = useRouter()
const token = localStorage.getItem('token')

const username = ref('')
const avatar = ref('https://randomuser.me/api/portraits/women/44.jpg')

const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')

function togglePasswordForm() {
  showPasswordForm.value = !showPasswordForm.value
}

function handleAvatarUpload(e) {
  const file = e.target.files[0]
  if (file) {
    avatar.value = URL.createObjectURL(file)
    // Note: simpan file ke server butuh upload endpoint
  }
}

// Ambil profile saat component di-mount
onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL_DEV_V1}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (res.ok) {
      username.value = data.name
    }
  } catch (err) {
    console.error('Gagal mengambil profil:', err)
  }
})

async function saveProfile() {
  try {
    const payload = {
      name: username.value,
    }

    if (showPasswordForm.value && oldPassword.value && newPassword.value) {
      payload.oldPassword = oldPassword.value
      payload.newPassword = newPassword.value
    }

    const res = await fetch(`${import.meta.env.VITE_BASE_URL_DEV_V1}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Gagal menyimpan profil')
      return
    }

    alert('Profil berhasil diperbarui!')
    oldPassword.value = ''
    newPassword.value = ''
    showPasswordForm.value = false
  } catch (err) {
    console.error('Gagal update profil:', err)
    alert('Terjadi kesalahan server')
  }
}
</script>
