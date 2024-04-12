<template>
  <span>
    <ExportXlsxBtn :on-export="exportXlsx" />
  </span>
</template>

<script setup>
import * as ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import { ElMessage } from 'element-plus'
import { ExportXlsxBtn } from '@/components'
import { dateGenerator } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
const props = defineProps({
  resource: {
    type: Array,
    require: true,
    default: () => {
      return []
    }
  }
})
const today = dateGenerator()
const filename = ref(`ReqM_${today}_weekly-request-summary`)
const sheetnames = ref(['Sort by status', 'Show plant data (grouped)', 'Show plant data (ungrouped)'])
const resource = ref([])
const data1 = ref([]) //二維陣列
const cols1 = ref([])
const data2 = ref([]) //二維陣列
const cols2 = ref([])
const data3 = ref([]) //二維陣列
const cols3 = ref([])

/**
 * @description 改變資料結構
 * @param { array } $resource : 資料來源 (raw data)
 */
const transferData = async ($resource) => {
  //for debugging
  // console.log($resource)

  //1st table
  cols1.value = [
    ['Week', 'Total', 'Status', '', '', '', '', ''],
    ['', '', 'Reviewing', 'Proceeding', 'Done', 'Cancel', 'Delay', 'Rejected']
  ]

  //2nd table
  cols2.value = [['Week', 'Plant', 'Total', 'Reviewing', 'Proceeding', 'Done', 'Cancel', 'Delay', 'Rejected']]

  //3rd table
  cols3.value = [
    ['Week', 'Total', 'Reviewing', '', '', 'Proceeding', '', '', 'Done', '', '', 'Cancel', '', '', 'Delay', '', '', 'Rejected', '', ''],
    ['', '', 'P1', 'P2', 'P3', 'P1', 'P2', 'P3', 'P1', 'P2', 'P3', 'P1', 'P2', 'P3', 'P1', 'P2', 'P3', 'P1', 'P2', 'P3']
  ]

  data1.value = []
  data2.value = []
  data3.value = []

  for await (const [index, doc] of Object.entries($resource)) {
    //get data in 1st table
    data1.value.push([
      doc.week,
      doc.total,
      doc.reviewing,
      doc.prcd,
      doc.done,
      doc.cancel,
      doc.delay,
      doc.rejected
    ])

    //get data in 2nd table
    data2.value.push(
      [doc.week, 'P1', doc.P1.total, doc.P1.reviewing, doc.P1.prcd, doc.P1.done, doc.P1.cancel, doc.P1.delay, doc.P1.rejected],
      ['', 'P2', doc.P2.total, doc.P2.reviewing, doc.P2.prcd, doc.P2.done, doc.P2.cancel, doc.P2.delay, doc.P2.rejected],
      ['', 'P3', doc.P3.total, doc.P3.reviewing, doc.P3.prcd, doc.P3.done, doc.P3.cancel, doc.P3.delay, doc.P3.rejected]
    )

    //get data in 3rd table
    data3.value.push([
      doc.week,
      doc.total,
      doc.P1.reviewing,
      doc.P2.reviewing,
      doc.P3.reviewing,
      doc.P1.prcd,
      doc.P2.prcd,
      doc.P3.prcd,
      doc.P1.done,
      doc.P2.done,
      doc.P3.done,
      doc.P1.cancel,
      doc.P2.cancel,
      doc.P3.cancel,
      doc.P1.delay,
      doc.P2.delay,
      doc.P3.delay,
      doc.P1.rejected,
      doc.P2.rejected,
      doc.P3.rejected
    ])
  }
}

/**
 * @description 繪製 .xlsx 檔中的工作頁 (worksheet)
 * @param { number } $seq : 第幾張表格
 * @param { object } $wb : 工作簿
 * @param { string } $sheetname : 工作表名稱
 * @param { array } $columns : 表頭名
 * @param { array } $data : 表格資料
 * @param { number } $width : 各列寬度
 */
const drawTable = async ($seq, $wb, $sheetname, $columns, $data, $width) => {
  //工作頁 (分頁 sheet)
  const worksheet = $wb.addWorksheet($sheetname)
  const column = $seq === 2 ? $columns[0] : $columns[1]
  //此表格有幾行標題
  const headerRows = $seq === 2 ? 1 : 2

  //樣式相關
  const headerFont = { bold: true, size: 10, name: 'Arial' }
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE4E7ED' } }
  const bodyFont = { size: 10, name: 'Arial' }
  const redFont = { bold: true, size: 10, name: 'Arial', color: { argb: 'FFFF0000' } }
  const blueFont = { bold: true, size: 10, name: 'Arial', color: { argb: 'FF0000FF' } }
  const boldFont = { bold: true, size: 10, name: 'Arial' }
  const alignCenter = { vertical: 'middle', horizontal: 'center' }
  const borderStyle = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }

  //插入資料至儲存格
  for (let i = 0; i < $data.length + headerRows; i++) {
    if (i < headerRows) {
      worksheet.addRow($columns[i])
    } else {
      worksheet.addRow($data[i - headerRows])
    }
  }

  //處理合併儲存格
  switch ($seq) {
    case 1: {
      const mergeCells = ['A1:A2', 'B1:B2', 'C1:H1']
      mergeCells.forEach((mergeCell) => worksheet.mergeCells(mergeCell))
      break
    }
    case 2: {
      let mergeCells = []
      for (let i = 0; i < $data.length; i++) {
        if (i % 3 === 0) mergeCells.push(`A${i + 2}:A${i + 4}`)
      }
      mergeCells.forEach((mergeCell) => worksheet.mergeCells(mergeCell))
      break
    }
    case 3: {
      const mergeCells = ['A1:A2', 'B1:B2', 'C1:E1', 'F1:H1', 'I1:K1', 'L1:N1', 'O1:Q1', 'R1:T1']
      mergeCells.forEach((mergeCell) => worksheet.mergeCells(mergeCell))
      break
    }
  }

  //循環出每一個儲存格
  for (let a = 1; a <= column.length; a++) {
    //改變欄寬, 及資料對齊方式
    worksheet.getColumn(a).width = $width
    worksheet.getColumn(a).alignment = alignCenter
    //循環出每一行
    for (let b = 1; b <= worksheet.rowCount; b++) {
      //處理儲存格樣式
      if (b <= headerRows) {
        worksheet.getRow(b).getCell(a).fill = headerFill
        worksheet.getRow(b).getCell(a).font = headerFont
      } else {
        const isOverZero = worksheet.getRow(b).getCell(a).value > 0
        switch ($seq) {
          case 1: {
            if (2 <= a && a < 5 && isOverZero) {
              //total, reviewing, proceeding 件數 > 0 => 標粗體
              worksheet.getRow(b).getCell(a).font = boldFont
            } else if (a === 5 && isOverZero) {
              //done 件數 > 0 => 標藍字
              worksheet.getRow(b).getCell(a).font = blueFont
            } else if (6 <= a && a <= 8 && isOverZero) {
              //cancel, delay, rejected 件數 > 0 => 標紅字
              worksheet.getRow(b).getCell(a).font = redFont
            } else {
              //other => 正常黑字
              worksheet.getRow(b).getCell(a).font = bodyFont
            }
            break
          }
          case 2: {
            if (3 <= a && a <= 5 && isOverZero) {
              //total, reviewing, proceeding 件數 > 0 => 標粗體
              worksheet.getRow(b).getCell(a).font = boldFont
            } else if (a === 6 && isOverZero) {
              //done 件數 > 0 => 標藍字
              worksheet.getRow(b).getCell(a).font = blueFont
            } else if (7 <= a && a <= 9 && isOverZero) {
              //cancel, delay, rejected 件數 > 0 => 標紅字
              worksheet.getRow(b).getCell(a).font = redFont
            } else {
              //other => 正常黑字
              worksheet.getRow(b).getCell(a).font = bodyFont
            }
            break
          }
          case 3: {
            if (2 <= a && a <= 8 && isOverZero) {
              //total, reviewing, proceeding 件數 > 0 => 標粗體
              worksheet.getRow(b).getCell(a).font = boldFont
            } else if (9 <= a && a <= 11 && isOverZero) {
              //done 件數 > 0 => 標藍字
              worksheet.getRow(b).getCell(a).font = blueFont
            } else if (12 <= a && a <= 20 && isOverZero) {
              //cancel, delay, rejected 件數 > 0 => 標紅字
              worksheet.getRow(b).getCell(a).font = redFont
            } else {
              //other => 正常黑字
              worksheet.getRow(b).getCell(a).font = bodyFont
            }
            break
          }
        }
      }
      //為每個儲存格加上邊框
      worksheet.getRow(b).getCell(a).border = borderStyle

      //預設只顯示 header 與最近的 10 行資料
      if ($seq !== 2) {
        if (b > 2 && b <= worksheet.rowCount - 10) {
          worksheet.getRow(b).hidden = true
        }
      } else {
        if (b > 1 && b <= worksheet.rowCount - 15) {
          worksheet.getRow(b).hidden = true
        }
      }
    }
  }

  //for debugging
  // console.log(worksheet.rowCount)
  // console.log(worksheet)
}

/**
 * @description 匯出 .xlsx 檔案
 */
const exportXlsx = async () => {
  try {
    await transferData(props.resource)      //取得 columns, data
    const workbook = new ExcelJS.Workbook()
    await drawTable(1, workbook, sheetnames.value[0], cols1.value, data1.value, 12)
    await drawTable(2, workbook, sheetnames.value[1], cols2.value, data2.value, 12)
    await drawTable(3, workbook, sheetnames.value[2], cols3.value, data3.value, 8)
    const buffer = await workbook.xlsx.writeBuffer()
    ElMessage.success(lang('Export successfully'))
    return FileSaver(new Blob([buffer]), filename.value + '.xlsx')
  } catch (err) {
    console.error(err)
    ElMessage.error(lang('Failed to export'))
  }
}
</script>
