<!-- components/NavigationBar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light custom-bg">
    <div class="container-fluid">
      <!--<NuxtLink class="navbar-brand" to="/business">AIM滿意度報表</NuxtLink>-->
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
          <!--<li class="nav-item">
            <NuxtLink class="nav-link" to="/">首頁</NuxtLink>
          </li>-->
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
        <!-- 上傳檔案按鈕 -->
        <!--<input
          type="file"
          class="form-control-file"
          @change="handleFileUpload"
          style="display: none;"
          ref="fileInput"
        />
        <button class="btn btn-primary" @click="triggerFileUpload">上傳 Excel</button>-->
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useExcel } from '~/composables/useExcel'
import { ref } from 'vue'
import { autoLoadExcel } from '~/composables/autoExcel'
//import Swal from 'sweetalert2'  // 引入 SweetAlert2 套件

const { loadExcelFile, excelDataA, excelDataB } = useExcel()
const fileInput = ref(null)

/* 
//button上傳
function triggerFileUpload() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    loadExcelFile(file)
      .then(() => {
        console.log('Excel data loaded successfully')
      })
      .catch((error) => {
        console.error('Failed to load Excel file:', error)
      })
  }
}
*/

// 當組件掛載時自動加載 Excel 檔案
onMounted(async () => {
  // 顯示 SweetAlert2 的 loading 提示框
  Swal.fire({
    title: '資料加載中...',
    html: '正在載入資料，請稍候...',  // 可以設置更具體的提示語
    allowOutsideClick: false,  // 不允許外部點擊關閉
    didOpen: () => {
      Swal.showLoading()  // 顯示轉圈
    },
    willClose: () => {
      // 關閉 loading 提示框
    }
  })

  try {
    // 自動加載指定的 Excel 檔案
    await autoLoadExcel('/answer2024_1~3.xlsx', loadExcelFile, 'A')
    console.log('ExcelA file loaded successfully')
    //console.log(excelDataA.value)
    // 自動加載 B 檔案
    const dataB = await autoLoadExcel('/2024_1~3.xlsx', loadExcelFile, 'B')  // B 檔案
    console.log('ExcelB file loaded successfully')
    //console.log(excelDataB.value[1])
    Swal.close()
  } catch (error) {
    console.error('Failed to load Excel file:', error)
    Swal.close()
  }
})
</script>

<style scoped>
/* 你可以在這裡加入自訂樣式 */
.custom-bg {
  background-color: #1D4E89;
}
</style>
