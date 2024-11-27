// ~/composables/autoExcel.js

// 自動加載 Excel 檔案
export async function autoLoadExcel(url, loadExcelFile, fileType) {

    try {
      // 使用 fetch 下載 Excel 檔案
      const response = await fetch(url)  // 根據你的檔案路徑調整
      if (!response.ok) {
        throw new Error('檔案載入失敗')
      }
  
      // 使用 blob() 獲取檔案內容並創建 File 物件
      const blob = await response.blob()
      //const file = new File([blob], '/answer2024_1~3.xlsx')
      const fileName = url.split('/').pop()  // 取得 URL 中最後的檔案名
      const file = new File([blob], fileName)  // 使用簡單的檔案名稱
  
      // 調用 loadExcelFile 來處理檔案
      await loadExcelFile(file, fileType)
    } catch (error) {
      console.error('自動加載檔案失敗:', error)
    }
  }
  