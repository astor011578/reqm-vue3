import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//global css
import '@/styles/index.scss'
//import theme
import '@/theme/index.scss'
//import unocss
import 'uno.css'

//i18n
import { i18n, setupI18n } from '@/lang'

//import element-plus (i18n 全局設定在 App.vue 中)
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

//import vxe-table
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
VXETable.setup({ i18n: (key, args) => i18n.global.t(key, args) })
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
VXETable.use(VXETablePluginExportXLSX)
VXETable.renderer.add('NoData', {
  renderEmpty() {
    return 'No data'
  }
})
app.use(VXETable)

//import font-awesome-icon
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
app.component('FontAwesomeIcon', FontAwesomeIcon)

//import router
import router from './router'
//import router interceptor
import './permission'

//create pinia store root instance
import { createPinia } from 'pinia'
const store = createPinia()

app.use(setupI18n).use(router).use(store).mount('#app')
