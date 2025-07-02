<template>
  <DefaultLayout>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
        <span class="text-3xl bg-green-500 text-white rounded-full px-3 py-2 max-w-max shrink-0">
          <i class="ri-bar-chart-box-line"></i>
        </span>
        <div class="flex flex-col gap-1">
          <p class="text-2xl font-bold">{{ userStats?.total_counting ?? 0 }}</p>
          <p class="text-base text-gray-500">Total Counting</p>
        </div>
      </div>
      <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
        <span class="text-3xl bg-yellow-400 text-black rounded-full px-3 py-2 max-w-max shrink-0">
          <i class="ri-temp-hot-line"></i>
        </span>
        <div class="flex flex-col gap-1">
          <p class="text-2xl font-bold">{{ parseFloat(userStats?.Identity?.temp) || 0 }} °C</p>
          <p class="text-base text-gray-500">Suhu</p>
        </div>
      </div>
        <div class="flex flex-col gap-1">
          <p class="text-2xl font-bold">
            {{ userStats?.Identity?.IP || 'Belum terhubung' }}
          </p>
          <p class="text-base text-gray-500">
            IP
            <button
              @click="showIpModal = true"
              class="text-yellow-500 hover:text-yellow-600 underline cursor-pointer"
            >
              Ubah IP? Klik di sini
            </button>
          </p>
        </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Log Counter Barang</h2>
        <button class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Reset Device</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="bg-gray-100 text-gray-600">
            <tr>
              <th class="py-6 px-4">Count</th>
              <th class="py-6 px-4">Tanggal</th>
              <th class="py-6 px-4">Waktu</th>
              <th class="py-6 px-4">IP</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-base">
            <tr v-for="item in logs" :key="item.id">
              <td class="py-8 px-4">{{ item.count }}</td>
              <td class="py-8 px-4">{{ formatDate(item.predicted_date) }}</td>
              <td class="py-8 px-4">{{ item.predicted_time }}</td>
              <td class="py-8 px-4">{{ item.Identity?.IP || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-6">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        <div class="space-x-2 flex items-center">
          <button
            v-for="(page, index) in paginationPages"
            :key="index"
            @click="typeof page === 'number' && (currentPage = page)"
            :disabled="page === '...'"
            :class="[
              'px-4 py-2 rounded',
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700',
              page === '...' ? 'cursor-default' : 'hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <!-- Modal Ubah IP -->
    <div v-if="showIpModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Ubah Alamat IP</h2>
        <input
          v-model="newIp"
          type="text"
          class="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Masukkan IP baru"
        />
        <div class="flex justify-end gap-2">
          <button @click="showIpModal = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            Batal
          </button>
          <button @click="updateIp" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const logs = ref([])
const currentPage = ref(1)
const perPage = 5
const totalData = ref(0)

const totalPages = computed(() => Math.ceil(totalData.value / perPage))

const paginationPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current > 2) pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    if (current < total) pages.push(total)
  }

  return pages
})

watchEffect(fetchData)

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

async function fetchData() {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/counting?page=${currentPage.value}&limit=${perPage}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await res.json()
    logs.value = data.data
    totalData.value = data.totalData
  } catch (err) {
    console.error('Failed to fetch counting logs:', err)
  }
}

const userStats = ref(null)

async function fetchUserStats() {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()
    userStats.value = data?.[0] || null
  } catch (err) {
    console.error('Failed to fetch user stats:', err)
  }
}

watchEffect(() => {
  fetchData()
  fetchUserStats()
})

const showIpModal = ref(false)
const newIp = ref('')

watchEffect(() => {
  if (userStats.value?.Identity?.IP) {
    newIp.value = userStats.value.Identity.IP
  }
})

async function updateIp() {
  try {
    const token = localStorage.getItem('token')
    const identityId = userStats.value?.identity_id

    if (!identityId) return

    await fetch(`${import.meta.env.VITE_BASE_URL}/identity/${identityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ IP: newIp.value })
    })

    showIpModal.value = false
    await fetchUserStats()
  } catch (err) {
    console.error('Gagal mengubah IP:', err)
  }
}

</script>
