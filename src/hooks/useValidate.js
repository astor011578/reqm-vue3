/**
 * @description 判斷 Object 是否有屬性
 * @param { object } obj
 * @returns { boolean } true 表示有屬性, false 表示 obj 為空物件
 */
export const hasProperty = (obj) => {
  return Object.entries(obj).length ? true : false
}

/**
 * @description 檢查日期的合法性 (後面步驟的日期不可早於前面的步驟)
 * @param { string } date1: (Required) 比較早的日期字串
 * @param { string } date2: (Required) 比較晚的日期字串
 * @param { string } title1: (Optional) 比較早的日期標題
 * @param { string } title2: (Optional) 比較早的日期標題
 * @returns { string } validate string
 */
export const validateDate = (date1, date2, title1, title2) => {
  if (date1 && date2) {
    let dateObj1 = new Date(date1)
    let dateObj2 = new Date(date2)

    if (dateObj1 && dateObj2) {
      if (title1 && title2) {
        return dateObj2 - dateObj1 < 0 ? `${title2} date should not be earlier than ${title1} date` : ''
      }
      return 'Invalid date value'
    }
  }
}