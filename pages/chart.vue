<template>
  <div>
    <div v-if="Array.isArray(excelDataA) && excelDataA.length">
    <!--<div v-if="excelData.length">-->
      <!-- 使用 v-for 渲染 10 個 canvas，並置中 -->
      <div
        v-for="(chartRef, index) in chartRefs"
        :key="index"
        class="text-center my-4"
      >
        <!-- row 分成 12 等份 -->
        <div class="container">
        <div class="row justify-content-center">
          <!-- 長條圖佔 8 等份 -->
          <h2>問卷第 {{ index + 1 }} 題</h2>
          <div class="col-4 text-center">
            <canvas :ref="chartRef" class="chart-canvas" width="400" height="200"></canvas>
          </div>
          <!-- 中位數和平均數佔 4 等份，右側對齊 -->
          <div class="col-3">
            <br>
            <br>
            <br>
            <p><strong>中位數:</strong> {{ statistics[index]?.median }}</p>
            <p><strong>平均數:</strong> {{ statistics[index]?.mean }}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
    <p v-else class="text-center">請上傳一個 Excel 檔案來顯示內容。</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useExcel } from '~/composables/useExcel'

const { excelDataA } = useExcel()
const chartRefs = Array.from({ length: 10 }, () => ref(null))  // 建立10個 canvas 參考
const chartInstances = []  // 用於儲存所有的圖表實例
const statistics = ref(Array(10).fill({ median: 0, mean: 0 }))

// 計算每題的選項次數
function calculateAnswerCounts(questionIndex) {
  const counts = { 2: 0, 4: 0, 6: 0, 8: 0, 10: 0 }
  const answers = []  // 儲存每一題的答案
  /*excelDataA.value.forEach(row => {
    const answer = row[questionIndex + 2]  // 獲取每題的答案，從第3列開始
    if (counts.hasOwnProperty(answer)) {
      counts[answer]++
      answers.push(answer)
    }
  })*/

  // 過濾掉沒有回答的公司
  const validAnswers = excelDataA.value.filter(row => {
    const answer = row[questionIndex + 2]  // 獲取每題的答案，從第3列開始
    return counts.hasOwnProperty(answer) && answer !== ''
  })

  // 只針對有回答的公司進行統計
  validAnswers.forEach(row => {
    const answer = row[questionIndex + 2]  // 獲取每題的答案，從第3列開始
    counts[answer]++
    answers.push(answer)
  })

  // 計算中位數
  answers.sort((a, b) => a - b)
  const median =
    answers.length % 2 === 0
      ? (answers[answers.length / 2 - 1] + answers[answers.length / 2]) / 2
      : answers[Math.floor(answers.length / 2)]
  
  // 計算平均數
  const mean = (answers.reduce((sum, val) => sum + val, 0) / answers.length).toFixed(1)

  // 儲存統計數據
  statistics.value[questionIndex] = { median, mean }

  return counts
}

function drawCharts() {
  // 清除舊圖表
  chartInstances.forEach(chart => chart.destroy())
  chartInstances.length = 0

  // 遍歷每題並繪製圖表
  chartRefs.forEach((chartRef, index) => {
    const counts = calculateAnswerCounts(index)
    const labels = [2, 4, 6, 8, 10]
    const data = labels.map(label => counts[label])

    nextTick(() => {
      const chartInstance = new Chart(chartRef.value, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: `問卷第 ${index + 1} 題`,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      })
      chartInstances.push(chartInstance)
    })
  })
}

// 當 excelData 變更時繪製圖表
watch(excelDataA, (newData) => {
  if (Array.isArray(newData) && newData.length > 0) {
    drawCharts()
  }
})

// 初始化圖表
onMounted(() => {
  if (excelDataA.value.length) {
    drawCharts()
  }
})
</script>
