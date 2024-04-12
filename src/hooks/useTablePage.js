export default function (selectPageReq) {
  /* 分頁 */
  const currentPage = ref(1)
  const pageSize = ref(10)

  /**
   * 換頁時呼叫此 handler
   * @param { Number } val 第幾頁
   */
  const handleCurrentChange = (val) => {
    currentPage.value = val
    selectPageReq()
  }
  const handleSizeChange = (val) => {
    pageSize.value = val
    selectPageReq()
  }
  onMounted(() => {})
  return {
    currentPage,
    pageSize,
    handleCurrentChange,
    handleSizeChange
  }
}
