import { useState } from '#app'

export function useExcel() {
  // 使用 useState 設定全局共享的 excelData
  //const excelData = useState('excelData', () => [])
  const excelDataA = useState('excelDataA', () => [])  // 用於儲存 A.xlsx 的資料
  const excelDataB = useState('excelDataB', () => [])  // 用於儲存 B.xlsx 的資料

  const loadExcelFile = (file, fileType) => {
    return new Promise(async (resolve, reject) => {
      try {
        const XLSX = await import('xlsx') // 動態引入 xlsx
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            //excelData.value = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            const result = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            //resolve(excelData.value)
            //resolve(result)
            // 根據檔案類型來決定寫入到哪一個變數
            
            if (fileType === 'A') {
              excelDataA.value = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
              resolve(excelDataA.value)
            } else if (fileType === 'B') {
              excelDataB.value = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
              resolve(excelDataB.value)
            }
            
            //resolve()
          } catch (error) {
            reject(error)
          }
        }
        reader.readAsArrayBuffer(file)
      } catch (error) {
        reject(error)
      }
    })
  }

  //return { excelData, loadExcelFile }
  return { excelDataA, excelDataB, loadExcelFile }
}
