<template>
  <div v-if="isLoggedIn" class="container">
    <div class="d-flex justify-content-between align-items-center">
      <h2>原始資料</h2>
      <button class="btn btn-primary" @click="downloadExcel">下載原始資料xlsx</button>
    </div>

    <!-- 顯示資料正在加載中 -->
    <div v-if="!Array.isArray(excelDataA) || excelDataA.length === 0">
      <p>資料正在加載中...</p>
    </div>

    <!-- 資料加載完成後顯示表格 -->
    <div v-else>
      <!-- 顯示過濾後的表格 -->
      <table id="excelTable" class="table table-striped table-bordered">
        <thead>
          <tr>
            <th v-for="(header, index) in filteredExcelData[0]" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filteredExcelData.slice(1)" :key="index">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useExcel } from '~/composables/useExcel'
import * as XLSX from 'xlsx'

const { excelDataA } = useExcel()
const filteredExcelData = ref([])
// 檢查 cookie 來判斷是否登入，僅在客戶端執行
const isLoggedIn = ref(false)

watch(excelDataA, (newData) => {
  if (Array.isArray(newData) && newData.length > 0) {
    filteredExcelData.value = removeColumns(newData)  // 移除索引 14 和 15
    initializeDataTable()  // 初始化 DataTable
  }
})

function removeColumns(data) {
  let tempData = []
  for (let row of data) {
    let filteredRow = []
    var nullrow = false
    for (let i = 0; i < row.length; i++) {
      if (row[2] == "" || row[2] == null || row[2] == undefined) {
        nullrow = true
        break;
      }
      if (i !== 14 && i !== 15) {
        filteredRow.push(row[i])  // 加入過濾後的欄位
      }
    }
    if (nullrow == false) {
      tempData.push(filteredRow)  // 把過濾後的行加入 tempData
      nullrow = false
    }
  }
  return tempData
}

function initializeDataTable() {
  nextTick(() => {
    setTimeout(() => {
      if (typeof $ !== 'undefined' && $('#excelTable').length) {
        $('#excelTable').DataTable({
          paging: true,
          searching: true,
          ordering: false,
          info: true,
        })
      }
    }, 100)
  })
}

function downloadExcel() {
  if (Array.isArray(excelDataA.value) && excelDataA.value.length > 0) {
    const jsonData = convertToJSON(excelDataA.value)
    const ws = XLSX.utils.json_to_sheet(jsonData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "資料")
    XLSX.writeFile(wb, "資料.xlsx")
  }
}

function convertToJSON(excelDataA) {
  const headers = excelDataA[0]
  const data = excelDataA.slice(1)

  const jsonData = data.map(row => {
    return row.reduce((obj, cell, index) => {
      obj[headers[index]] = cell
      return obj
    }, {})
  })

  return jsonData
}

onMounted(() => {
  if (process.client) {
    const cookie = document.cookie.match(new RegExp('(^| )' + 'isLoggedIn' + '=([^;]+)'))
    if (cookie) {
      isLoggedIn.value = cookie[2] === 'true'
    }
  }
  
  if (Array.isArray(excelDataA.value) && excelDataA.value.length > 0) {
    filteredExcelData.value = removeColumns(excelDataA.value)
    initializeDataTable()
  }
})
</script>

<style scoped>
table.dataTable td, table.dataTable th {
  font-size: 12px;
}

table.dataTable tbody tr {
  height: 10px;
}

table.dataTable {
  margin: 0;
  padding: 0;
}

th {
  white-space: nowrap;
}

button {
  margin-left: 10px;
}

/* 強制讓搜尋框右對齊 */
div.dataTables_filter {
  display: flex;
  justify-content: flex-end;  /* 讓搜尋框向右對齊 */
  width: 100%;
  margin-bottom: 10px; /* 可以調整搜尋框和表格之間的間距 */
}

/* 可調整搜尋框樣式 */
div.dataTables_filter input {
  width: 200px; /* 可根據需要調整搜尋框寬度 */
  margin-left: 10px; /* 可以調整左邊距離 */
}
</style>
