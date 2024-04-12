<template>
  <ExportXlsxBtn :on-export="exportXlsx" />
</template>

<script setup>
import * as ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import { ElMessage } from 'element-plus'
import { dateGenerator } from '@/hooks/useDate'
import { lang } from '@/hooks/useCommon'
import { ExportXlsxBtn } from '@/components'
const props = defineProps({
  resource: {
    type: Object,
    require: true,
    default: () => {
      return {}
    }
  },
  title: {
    type: String,
    require: true,
    default: () => {
      return 'Weekly'
    }
  }
})

const today = dateGenerator()
const filename = ref(`ReqM_${today}_weekly control table`)
const sheetname = ref('Control table')
const resource = ref([])  //從服務端取出的資料
const data = ref([])      //二維陣列
const redCells = ref([])  //二維陣列
const cols = ref([
  //cols 裡的每個 item 皆為一維陣列
  [
    'ReqNo', 'Request name', 'Status', 'Approve date', 'Review duration (day)', 'Lead time (day)',
    'Rescheduling (times)', '', 'Type', 'Plant', 'Requester', 'IT', 'Issue date', 'Turn on',
    'IT buyoff (UAT1)', '', 'User buyoff (UAT2)', '',
    'Release', '', 'Monitor 1 lot', ''
  ],
  [
    '', '', '', '', '', '',
    'IT', 'Requester', '', '', '', '', '', '',
    'Expect', 'Actual', 'Expect', 'Actual',
    'Expect', 'Actual', 'Expect', 'Actual'
  ]
])

/**
 * @description 改變資料結構
 * @param { Array } $resource : 資料來源
 * @returns { Array } 等待被寫入表格中的值
 */
const transferData = async ($resource) => {
  //for debugging
  // console.log($resource)
  const data = []

  $resource.forEach(doc => {
    let {
      reqNo, reqName, buyoffStatus, approveDate, reviewDuration, leadTime, rescheduleIT, rescheduleReqr, type,
      plant, reqr, pgr, issueDate, turnOnDate, UAT1Exp, UAT1Act, UAT2Exp, UAT2Act,
      releaseExp, releaseAct, monitorExp, monitorAct
    } = doc
    leadTime = leadTime < 0 ? 'NA' : leadTime
    type = type ? type : 'NA'

    data.push([
      reqNo, reqName, buyoffStatus, approveDate, reviewDuration, leadTime, rescheduleIT, rescheduleReqr, type,
      plant, reqr, pgr, issueDate, turnOnDate, UAT1Exp, UAT1Act, UAT2Exp, UAT2Act,
      releaseExp, releaseAct, monitorExp, monitorAct
    ])
  })

  return data
}

/**
 * @description 取得需要標紅字的儲存格
 * @param { Array } $resource : 資料來源
 * @returns { Array } 需要被標紅字的儲存格
 */
const getRedCells = async ($resource) => {
  //for debugging
  // console.log($resource)

  let redCells = []
  for await (const value of $resource) {
    let redInOneRaw = []
    if (value.status === 'Proceeding') {
      switch (true) {
        case value.UAT1IsDue: redInOneRaw.push(2, 3, 15); break;
        case value.UAT2IsDue: redInOneRaw.push(2, 3, 17); break;
        case value.releaseIsDue: redInOneRaw.push(2, 3, 19); break;
        case value.monitorIsDue: redInOneRaw.push(2, 3, 21); break;
      }
    }
    redCells.push(redInOneRaw)
  }
  return redCells
}

//從 props 取得 raw data, 並改變資料結構
watch(props, async () => {
  if (props.resource) {
    resource.value = Object.assign([], props.resource)
    data.value = await transferData(resource.value)
    redCells.value = await getRedCells(resource.value)
  }
  if (props.title) {
    filename.value = `ReqM_${today}_${props.title.toLowerCase()} control table`
    sheetname.value = `${props.title} table`
  }
})

/**
 * @description 繪製 .xlsx 檔中的工作頁 (worksheet)
 * @param { Object } $wb : 工作簿
 * @param { String } $sheetname : 工作表名稱
 * @param { Array } $columns : 表頭名
 * @param { Array } $rawData : 原始資料
 * @param { Array } $data : 等待要 insert 的資料
 */
const drawTable = async ($wb, $sheetname, $columns, $rawData, $data) => {
  const ws = $wb.addWorksheet($sheetname) //工作頁 (分頁 sheet)
  const colLength = $columns[0].length    //有幾個欄位
  const headerRows = $columns.length      //表頭有幾行

  //樣式相關
  const widths = ['', 11, 51, 17, 13, 15, 12, 11, 11, 10, 8, 15, 15, 12, 9, 10, 10, 10, 10, 9, 9, 9, 9]
  const headerFont = { bold: true, size: 10, name: 'Arial' }
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }
  const bodyFont = { size: 10, name: 'Arial' }
  const redFont = { size: 10, name: 'Arial', color: { argb: 'FFFF0000' } }
  const blueFont = { size: 10, name: 'Arial', color: { argb: 'FF0000FF' } }
  const grayFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } }
  const alignCenter = { vertical: 'middle', horizontal: 'center', wrapText: true }
  const alignLeft = { vertical: 'middle', horizontal: 'left', wrapText: true }
  const borderStyle = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }

  //插入資料至儲存格
  for (let i = 0; i < $data.length + headerRows; i++) {
    if (i < headerRows) {
      ws.addRow($columns[i])
    } else {
      ws.addRow($data[i - headerRows])
    }
  }

  //處理合併儲存格
  const rowSpans = ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'J', 'K', 'L', 'M', 'N'].map((item) => { return `${item}1:${item}2` })
  const colSpans = ['G1:H1', 'O1:P1', 'Q1:R1', 'S1:T1', 'U1:V1']
  const mergeCells = rowSpans.concat(colSpans)
  mergeCells.forEach((mergeCell) => ws.mergeCells(mergeCell))

  //循環出每一行
  for (let r = 1; r <= ws.rowCount; r++) {
    let _row = ws.getRow(r)
    //循環出每一個儲存格
    for (let c = 1; c <= colLength; c++) {
      //改變欄寬, 及資料對齊方式
      ws.getColumn(c).width = widths[c]
      //Request name 內容置左
      if (c === 2) {
        _row.getCell(c).alignment = r <= headerRows ? alignCenter : alignLeft
      } else {
        _row.getCell(c).alignment = alignCenter
      }
      //為每個儲存格加上邊框
      _row.getCell(c).border = borderStyle
      //處理儲存格文字與填充樣式
      if (r <= headerRows) {
        //處理 header 樣式
        _row.getCell(c).fill = headerFill
        _row.getCell(c).font = headerFont
      } else {
        //處理 body 樣式
        const status = _row.getCell(3).value
        const origin = $rawData[r - headerRows - 1]
        switch (status) {
          case 'Done': {
            _row.getCell(c).fill = grayFill
            _row.getCell(c).font = origin.doneOnToday ? blueFont : bodyFont
            break
          }
          case 'Cancel': {
            _row.getCell(c).fill = grayFill
            _row.getCell(c).font = origin.cancelOnToday ? redFont : bodyFont
            break
          }
          case 'Rejected': {
            _row.getCell(c).fill = grayFill
            _row.getCell(c).font = origin.rejectedOnToday ? redFont : bodyFont
            break
          }
          default: {
            //是否快到期 / 已到期
            const redInOneRow = Object.assign(redCells.value[r - headerRows - 1])
            switch (origin.newOnToday) {
              //如果是當天新增的需求
              case true: {
                if (redInOneRow.length && redInOneRow.includes(c)) {
                  _row.getCell(c).font = redFont
                } else {
                  _row.getCell(c).font = blueFont
                }
                break
              }
              //如果不是當天的新需求
              case false: {
                if (redInOneRow.length && redInOneRow.includes(c)) {
                  _row.getCell(c).font = redFont
                } else {
                  _row.getCell(c).font = bodyFont
                }
                break
              }
            }
          }
        }
      }
    }
  }

  //for debugging
  // console.log(ws.rowCount)
  // console.log(ws)
}

/**
 * @description 匯出為 .xlsx 檔案供下載
 */
const exportXlsx = async () => {
  try {
    const workbook = new ExcelJS.Workbook()
    await drawTable(workbook, sheetname.value, cols.value, resource.value, data.value)
    const buffer = await workbook.xlsx.writeBuffer()
    ElMessage.success(lang('Export successfully'))
    return FileSaver(new Blob([buffer]), filename.value + '.xlsx')
  } catch (err) {
    console.error(err)
    ElMessage.error(lang('Failed to export'))
  }
}
</script>
