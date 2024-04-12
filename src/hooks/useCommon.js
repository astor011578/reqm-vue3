//i18n language match title
import { i18n } from '@/lang'
//the keys using zh file
import langZh from '@/lang/zh'

//deep copy
export const cloneDeep = (value) => { return JSON.parse(JSON.stringify(value)) }

//sleep promise instance
export const sleepTimeout = (time) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve(null)
    }, time)
  })
}

//change displaying language 
const { t, te } = i18n.global
export const lang = (title) => {
  for (const key of Object.keys(langZh)) {
    if (te(`${key}.${title}`) && t(`${key}.${title}`)) return t(`${key}.${title}`)
  }
  return title
}
