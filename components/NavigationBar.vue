<template>
  <nav class="navbar navbar-expand-lg navbar-light custom-bg">
    <div class="container-fluid">
      <span style="font-weight: bold; font-size: 24px; color: white;">AIM滿意度報表</span>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/business" style="color: white;">滿意度</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/chart" style="color: white;">圖表</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/data" style="color: white;">原始資料</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { autoLoadExcel } from '~/composables/autoExcel'

// 自動加載 Excel 檔案的組件
import { useExcel } from '~/composables/useExcel'
const { loadExcelFile } = useExcel()

// 讀取 cookie 的函數
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

// 設置 cookie 的函數
function setCookie(name, value, days) {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)) // 設置有效期為 days 天
  const expires = "expires=" + date.toUTCString()
  document.cookie = name + "=" + value + ";" + expires + ";path=/"
}

// 當組件掛載時執行
onMounted(async () => {
  // 先檢查是否已經登入過（透過讀取 cookie）
  const isLoggedIn = getCookie('isLoggedIn')

  if (!isLoggedIn) {
    // 若未登入，顯示 SweetAlert2 登入對話框
    await showLoginDialog()
  }

  // 顯示 SweetAlert2 的 loading 提示框
  Swal.fire({
    title: '資料加載中...',
    html: '正在載入資料，請稍候...',
    allowOutsideClick: false,  // 不允許外部點擊關閉
    didOpen: () => {
      Swal.showLoading()  // 顯示轉圈
    },
  })

  try {
    // 自動加載指定的 Excel 檔案
    await autoLoadExcel('/answer2024_1~3.xlsx', loadExcelFile, 'A')
    console.log('ExcelA file loaded successfully')
    // 自動加載 B 檔案
    await autoLoadExcel('/2024_1~3.xlsx', loadExcelFile, 'B')  // B 檔案
    console.log('ExcelB file loaded successfully')
    Swal.close()
  } catch (error) {
    console.error('Failed to load Excel file:', error)
    Swal.close()
  }
})

// 顯示登入對話框的邏輯
const showLoginDialog = async () => {
  const result = await Swal.fire({
    title: '登入',
    html: `
      <form id="loginForm">
        <input type="text" id="username" class="swal2-input" placeholder="帳號" required>
        <input type="password" id="password" class="swal2-input" placeholder="密碼" required>
      </form>
    `,
    focusConfirm: false,
    confirmButtonText: '登入',
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: async () => {
      const username = Swal.getPopup().querySelector('#username').value
      const password = Swal.getPopup().querySelector('#password').value

      if (!username || !password) {
        Swal.showValidationMessage('請輸入帳號和密碼')
        return false
      }

      // 假設登入成功
      if (username === 'AIM2024' && password === 'AIM2024') {
        // 登入成功，設定登入狀態到 Cookie，並設置有效期為 1 天
        setCookie('isLoggedIn', 'true', 1)
        Swal.fire({
          icon: 'success',
          title: '登入成功',
          //text: '正在跳轉到商業頁面...',
        }).then(() => {
          const currentPage = window.location.pathname
          if(currentPage === '/'){
            window.location.href = '/business' // 跳轉頁面
          }
          else{
            alert(currentPage)
            window.location.href = currentPage // 跳轉頁面
          }
          Swal.close()
        })
      } else {
        Swal.showValidationMessage('帳號或密碼錯誤')
        return false
      }
    }
  })
}
</script>

<style scoped>
.custom-bg {
  background-color: #1D4E89;
}
</style>
