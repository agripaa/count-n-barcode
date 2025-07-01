<template>
  <DefaultLayout>
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
        <span class="text-3xl bg-blue-600 text-white rounded-full px-3 py-2 max-w-max shrink-0">
          <i class="ri-inbox-unarchive-fill"></i>
        </span>
        <div class="flex flex-col gap-1">
          <p class="text-2xl font-bold">87</p>
          <p class="text-base text-gray-500">Barang Keluar</p>
        </div>
      </div>
      <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
        <span class="text-3xl bg-yellow-400 text-black rounded-full px-3 py-2 max-w-max shrink-0">
          <i class="ri-temp-hot-line"></i>
        </span>
        <div class="flex flex-col gap-1">
          <p class="text-2xl font-bold">47 °C</p>
          <p class="text-base text-gray-500">Suhu</p>
        </div>
      </div>
      <div class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
        <span class="text-3xl bg-[#02264A] text-white rounded-full px-3 py-2 max-w-max shrink-0">
          <i class="ri-rss-line"></i>
        </span>
        <div class="flex flex-col gap-1">
          <p class="text-2xl font-bold">10.26.101.197</p>
          <p class="text-base text-gray-500">IP <a href="" class="text-blue-400 hover:text-blue-500 cursor-pointer">Ubah IP? Klik di sini</a></p>
        </div>
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
      `${import.meta.env.VITE_BASE_URL_DEV_V1}/counting?page=${currentPage.value}&limit=${perPage}`,
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
</script>
