<!-- components/NavigationBar.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <NuxtLink class="navbar-brand" to="/">AIM報表</NuxtLink>
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
            <NuxtLink class="nav-link" to="/">首頁</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/business">業務</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/chart">圖表</NuxtLink>
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
  try {
    // 自動加載指定的 Excel 檔案
    await autoLoadExcel('/answer2024_1~3.xlsx', loadExcelFile, 'A')
    console.log('ExcelA file loaded successfully')
    //console.log(excelDataA.value)
    // 自動加載 B 檔案
    const dataB = await autoLoadExcel('/2024_1~3.xlsx', loadExcelFile, 'B')  // B 檔案
    console.log('ExcelB file loaded successfully')
    //console.log(excelDataB.value[1])
  } catch (error) {
    console.error('Failed to load Excel file:', error)
  }
})
</script>

<style scoped>
/* 你可以在這裡加入自訂樣式 */
</style>
