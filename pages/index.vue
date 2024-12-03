<!-- pages/index.vue -->
<template>
  <div v-if="isLoggedIn">
    <h1>首頁</h1>
    <p>這是網站的主頁面。</p>
  </div>
</template>

<script setup>
// 檢查 cookie 來判斷是否登入，僅在客戶端執行
const isLoggedIn = ref(false)

onMounted(() => {
  if (process.client) {
    const cookie = document.cookie.match(new RegExp('(^| )' + 'isLoggedIn' + '=([^;]+)'))
    if (cookie) {
      isLoggedIn.value = cookie[2] === 'true'
    }
  }
})
</script>