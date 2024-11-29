<!-- pages/chart.vue -->
<template>
  <br>
  <div class="container">
    <div class="row">
      <!-- 前 6 等份：第一個下拉式選單（業務代號） -->
      <div class="col-6">
        <label for="businessDropdown" class="form-label">選擇業務代號</label>
        <select
          id="businessDropdown"
          class="form-select"
          v-model="selectedBusinessCode"
          @change="updateCompanies"
        >
          <option v-for="code in uniqueBusinessCodes" :key="code" :value="code">
            {{ code }}
          </option>
        </select>
      </div>

      <!-- 後 6 等份：第二個下拉式選單（公司名稱） -->
      <div class="col-6">
        <label for="companyDropdown" class="form-label">選擇公司名稱</label>
        <select
          id="companyDropdown"
          class="form-select"
          v-model="selectedCompany"
          @change="updateCompanyAnswers"
        >
          <option v-for="company in filteredCompanies" :key="company" :value="company">
            {{ company }}
          </option>
          <!-- 顯示總營業額 -->
        
        </select>
      </div>
    </div>

    <!-- 顯示該公司第 1 到第 10 題的答案和總營業額 -->
    <div v-if="selectedCompanyAnswers.length > 0" class="mt-4">
      <!-- 顯示公司名稱和總營業額 -->
      <div class="row mb-3">
        <div class="col-md-12 d-flex justify-content-between">
          <h4 class="m-0">{{ selectedCompany }}</h4>
          <h4 class="m-0" v-if="totalRevenue !== null">
            總營業額 : 
            <span v-if="totalRevenue === '無資料'">{{ totalRevenue }}</span>
            <span v-else>{{ formatRevenue(totalRevenue) }} 元</span>
          </h4>
        </div>
      </div>

      <!-- 顯示問卷答案 -->
      <h5>問卷答案</h5>
      <ul class="list-group">
        <li v-for="(answer, index) in selectedCompanyAnswers" :key="index" class="list-group-item">
          <div v-if="index < 10">第 {{ index + 1 }} 題：{{ answer }}</div>
          <div v-else-if="index === 10">建議改善之產品名稱 : <span class="text-red">{{ answer }}</span></div>
          <div v-else-if="index === 11">產品規格 : <span class="text-red">{{ answer }}</span></div>
          <div v-else-if="index === 12">改善建議 : <span class="text-red">{{ answer }}</span></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExcel } from '~/composables/useExcel'

const { loadExcelFile, excelDataA, excelDataB } = useExcel()
const selectedBusinessCode = ref(null) // 儲存選中的業務代號
const selectedCompany = ref(null) // 儲存選中的公司名稱
const totalRevenue = ref(null) // 儲存選擇公司對應的總營業額

// 獲取唯一業務代號列表
const uniqueBusinessCodes = computed(() => {
  if (!excelDataA.value || excelDataA.value.length <= 1) return []
  const businessCodes = excelDataA.value.slice(1).map(row => row[17])
  return [...new Set(businessCodes)]
})

// 根據選中的業務代號篩選公司名稱
const filteredCompanies = computed(() => {
  if (!selectedBusinessCode.value) return []
  return excelDataA.value
    .slice(1)
    .filter(row => row[17] === selectedBusinessCode.value)
    .filter(companyRow => {
      // 檢查該公司是否有回答問題，這裡假設公司名稱在索引 1，並檢查問題答案是否有填寫
      const answers = companyRow.slice(2, 15) // 這裡假設問題的答案是從索引 2 到 11
      return answers.some(answer => answer) // 檢查是否至少有一題有回答
    })
    .map(row => row[1])
})

// 根據選中的公司名稱篩選並取得第 1 到第 10 題的答案 與 建議
const selectedCompanyAnswers = computed(() => {
  if (!selectedCompany.value) return []
  const companyRow = excelDataA.value.find(row => row[1] === selectedCompany.value)
  return companyRow ? companyRow.slice(2, 15) : [] // 取得第 1 到第 10 題的答案（索引 2 到 11）
})

// 重置公司選擇和答案
function updateCompanies() {
  selectedCompany.value = null
  totalRevenue.value = null // 重置營業額
}

function updateCompanyAnswers() {
  // 切換公司後自動計算答案
}

// 根據選中的公司名稱，從 excelDataB 中計算該公司的總營業額
watch([selectedBusinessCode, selectedCompany], () => {
  if (selectedBusinessCode.value && selectedCompany.value) {
    calculateTotalRevenue()
  }
})

// 計算總營業額
function calculateTotalRevenue() {
  totalRevenue.value = 0

  if (!excelDataB.value || excelDataB.value.length <= 1) return

  excelDataB.value.forEach(row => {
    if (row[0] === selectedBusinessCode.value && row[3] === selectedCompany.value) {
      totalRevenue.value += row[12] || 0  // 假設營業額在第 13 列（索引 12）
    }
  })

  // 如果營業額仍為 0，則將其顯示為 "無資料"
  if (totalRevenue.value === 0) {
    totalRevenue.value = '無資料'
  }
}

//總營業額的分隔符號
const formatRevenue = (revenue) => {
  if (revenue === '無資料') {
    return revenue;
  }
  
  // 確保 totalRevenue 是數字型態
  const revenueNumber = parseFloat(revenue);
  
  // 使用 toLocaleString 格式化數字，每4位加逗號
  return revenueNumber.toLocaleString();
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
.list-group-item {
  padding-top: 5px;  /* 減少上邊距 */
  padding-bottom: 5px;  /* 減少下邊距 */
  line-height: 1.2;  /* 減少行高 */
}
.text-red {
  color: red; /* 設定紅色字體 */
}
</style>
