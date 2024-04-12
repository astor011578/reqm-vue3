import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { lang } from '@/hooks/useCommon'
import { getInfoReq, getUsersReq } from '@/api/user'
import { getRequest, newRequest, editRequest, reviewRequest } from '@/api/request'
import { uploadAttachedFiles } from '@/api/upload'
import Application from './state/Application'
import Validate from './state/ValidateString'
const router = useRouter()

export const useNewReqStore = defineStore('newRequest', {
  state: () => {
    return {
      application: new Application(),
      validate: new Validate(),
      validateCode: 0   //有呼叫 checkEmpty() 或 checkIllegalDate() 時就會 +1
    }
  },

  getters: {
    getReqTable: (state) => { return state.application.reqTable },
    getPlant: (state) => { return state.application.reqTable.plant },
    getRequestType: (state) => { return state.application.type },
    getAttachedFiles: (state) => { return state.application.attachedFiles },
    getValidate: (state) => { return state.validate },
    getValidateCode: (state) => { return state.validateCode }
  },

  actions: {
    //* setters
    setReqr(reqrInfo) {
      this.application.coreTeam.reqr = Object.assign({}, reqrInfo)
    },
    setPgr(pgrInfo) {
      this.application.coreTeam.pgr = Object.assign({}, pgrInfo)
    },
    setReqTable(reqTableData) {
      const { reqName, stage, customer, device, tester, equipment, system, purpose } = reqTableData
      const plant = this.getPlant
      this.application.reqTable = { reqName, stage, customer, device, tester, equipment, system, purpose, plant }
    },
    setPlant($plant) {
      this.application.reqTable.plant = $plant
    },
    setAttachedFiles($attachedFiles) {
      this.application.attachedFiles = Object.assign([], $attachedFiles)
    },
    setRequestType(requestType) {
      this.application.type = requestType
    },
    setSchedule(scheduleInfo) {
      this.application.schedule = Object.assign({}, scheduleInfo)
    },
    setSpecificValidate(validateKey, warningString) {
      const isNested = validateKey.indexOf('.') !== -1 ? true : false
      if (isNested) {
        const validateKeys = validateKey.split('.')
        //validate 設計上最多只有兩層, 請不要再加更多層, 否則需要額外處理
        this.validate[validateKeys[0]][validateKeys[1]] = warningString
      } else {
        this.validate[validateKey] = warningString
      }
      //改變 validateCode, 通知使用 store 的組件要重新獲取 validate 的值
      this.validateCode++
      // console.log(this.validate, this.validateCode)
    },
    resetApplication() {
      this.application = new Application()
      // console.log('reset', this.application)
    },
    resetValidate() {
      this.validate = new Validate()
      // console.log('reset', this.validate)
    },

    //* api callers
    async fetchUsers(_dept) {
      try {
        const res = await getUsersReq(_dept)
        if (res?.code === 200) {
          const userList = []
          for await (const user of res.data) {
            const { userId, nameEn } = user
            userList.push({
              name: nameEn,
              id: userId
            })
          }
          return userList
        } else {
          console.error(res)
        }
      } catch (error) {
        ElMessage.error("Oops, there's some errors when fetching user data.")
        console.error(error)
      }
    },
    async fetchUserInfo($userId) {
      try {
        const res = await getInfoReq($userId)
        if (res?.code === 200) {
          const { userId, nameEn } = res.data
          const userInfo = {
            name: nameEn,
            id: userId
          }
          return userInfo
        } else {
          console.error(res)
        }
      } catch (error) {
        ElMessage.error("Oops, there's some errors when fetching user data.")
        console.error(error)
      }
    },
    async uploadAttachedFiles() {
      let result = []
      if (this.application.attachedFiles.length) {
        const formData = new FormData()
        for await (const file of this.application.attachedFiles) {
          formData.append('files', file.raw)
        }
        const res = await uploadAttachedFiles(formData)
        result = Object.assign([], res.data)
      }
      return result
    },
    async submitApplication() {
      //for debugging
      // console.log('application: ', this.application)
      // console.log('validate: ', this.validate)
      try {
        const attachedFiles = await this.uploadAttachedFiles()
        this.application.attachedFiles = Object.assign([], attachedFiles)
        const res = await newRequest(this.application)
        if (res?.code !== 200) {
          //拋出異常就會直接進入 catch 區塊中
          throw {
            type: 'HttpRequestError',
            detail: `Error occured when sent HTTP request to server.`,
            statusCode: res?.code,
            fullResponse: res
          }
        }
        this.resetApplication()
        this.resetValidate()
        return true
      } catch (err) {
        console.error(err)
        this.resetApplication()
        this.resetValidate()
        return false
      }
    },
    async reviewApplication(reqNo, reviewResult, message) {
      const { type, schedule } = this.application
      const reviewInfo = { result: reviewResult }

      switch (reviewResult) {
        case 'Approved': {
          reviewInfo.type = type
          reviewInfo.schedule = schedule
          break
        }
        case 'Rejected':
        case 'Returned': {
          reviewInfo.message = message
          break
        }
      }

      // console.log('reviewInfo: ', reviewInfo)
      // console.log('validate: ', this.validate)
      try {
        const res = await reviewRequest(reqNo, reviewInfo)
        if (res?.code !== 200) {
          //拋出異常就會直接進入 catch 區塊中
          throw {
            type: 'HttpRequestError',
            detail: `Error occured when sent HTTP request to server`,
            statusCode: res?.code,
            fullResponse: res
          }
        }
        this.resetApplication()
        this.resetValidate()
        return true
        
      } catch (err) {
        console.error(err)
        this.resetApplication()
        this.resetValidate()
        return false
      }
    },
    async fetchApplication(reqNo) {
      let status
      await getRequest(reqNo)
        .then(res => {
          if (res.code === 200) {
            const { reqrName, reqrId, pgrName, pgrId } = res.data
            this.setReqr({
              name: reqrName,
              id: reqrId
            })
            this.setPgr({
              name: pgrName,
              id: pgrId
            })
            const { reqTable, attachedFiles } = res.data
            const { reqName, stage, customer, device, tester, equipment, system, purpose, plant } = reqTable
            const reqTableData = { reqName, stage, customer, device, tester, equipment, system, purpose }
            this.setPlant(plant)
            this.setReqTable(reqTableData)
            this.setAttachedFiles(attachedFiles)
          }
          status = res.data.status
        })
        .catch(error => {
          ElMessage.error(`ReqNo #${reqNo} ${lang('data not found')}`)
          router.push('/404')
        })
      return status === 'Returned'
    },
    async editApplication(reqNo) {
      //for debugging
      // console.log('application: ', this.application)
      // console.log('validate: ', this.validate)
      try {
        const attachedFiles = await this.uploadAttachedFiles()
        this.application.attachedFiles = Object.assign([], attachedFiles)
        const res = await editRequest(reqNo, this.application)
        if (res?.code !== 200) {
          //拋出異常就會直接進入 catch 區塊中
          throw {
            type: 'HttpRequestError',
            detail: `Error occured when sent HTTP request to server.`,
            statusCode: res?.code,
            fullResponse: res
          }
        }
        this.resetApplication()
        this.resetValidate()
        return true

      } catch (err) {
        this.resetApplication()
        this.resetValidate()
        return false
      }
    },

    //* validators
    async checkEmpty(isReviewing) {
      const warningString = 'Please fill in this field'
      const requestType = this.application.type
      
      for await (const [outerKey, outerValue] of Object.entries(this.validate)) {
        // console.log(`現在在遍歷 ${outerKey} 的物件`)
        for await (const [innerKey] of Object.entries(outerValue)) {
          //target 表示在這個迴圈中要被檢查的對象
          const needSkip = skipSpecific(outerKey, innerKey, requestType, isReviewing)
          // console.log(innerKey, '是否可以略過不檢查?', needSkip, this.validate[outerKey][innerKey])
          if (!needSkip) {
            let target = await getTarget(outerKey, innerKey, this.application)
            this.validate[outerKey][innerKey] = isEmpty(target) ? warningString : ''
            // console.log(innerKey, target, isEmpty(target), this.validate[outerKey][innerKey])
          } else {
            this.validate[outerKey][innerKey] = ''
          }
        }
      }

      //改變 validateCode, 通知使用 store 的組件要重新獲取 validate 的值
      this.validateCode++
      // console.log(this.validate, this.validateCode)
    },
    async checkIllegalDate() {
      try {
        const requestType = this.application.type
        const isIllegals = isIllegal(requestType, this.application.schedule)
        // console.log(isIllegals)
  
        //提供 warningString mapping 日期標題用
        const mappings = {
          UAT1: { title1: 'start coding date', title2: 'UAT1 date' },
          UAT2: { title1: 'UAT1 date', title2: 'UAT2 date' },
          release: { title1: 'UAT2 date', title2: 'Release date' },
          monitor: { title1: 'release date', title2: 'Monitor 1 lot date' },
        }
        
        for await (const [validateKey, validateVal] of Object.entries(this.validate.schedule)) {
          for await (const [isIllegalKey, isIllegalVal] of Object.entries(isIllegals)) {
            //遍歷 isIllegals 取值, 如果值為 true 表示日期不合法
            if (isIllegalVal === true) {
              const { title1, title2 } = mappings[isIllegalKey]
              const warningString = `${title2} should not be earlier than ${title1}`
              //遍歷 this.validate, 只在第一次遇到不合法的日期時, 添加 warningString
              this.validate.schedule[validateKey] = isIllegalKey === validateKey ? warningString : ''
              break
            } else {
              this.validate.schedule[validateKey] = ''
            }
          }
        }
        //改變 validateCode, 通知使用 store 的組件要重新獲取 validate 的值
        this.validateCode++
        // console.log(this.validate, this.validateCode)
        
      } catch (err) {
        console.error(err)
        if (err?.type === 'EmptyStringError') await this.checkEmpty(true)
      }
    }
  }
})

/**
 * @description 取得要檢查的欄位值
 * @description 在檢查是否尚未輸入的環節時, 會呼叫這個函式
 * @param { string } outerKey: this.validate 與 this.application 中的第一層 key
 * @param { string } innerKey: this.validate 與 this.application 中的第二層 key 
 * @param { object } targetResource: 即 this.application
 * @returns { string || number || null } 返回要檢查的欄位值
 */
const getTarget = async (outerKey, innerKey, targetResource) => {
  let target
  //根據 innerKey 決定 target 的值是什麼
  switch (innerKey) {
    //在 this.application 中 pgr 的 value 是陣列 
    case 'pgr': {
      target = targetResource[outerKey][innerKey]
      break
    }
    //其他 key 在 this.application 中則都只是 string
    default: {
      target = targetResource[outerKey][innerKey]
      break
    }
  }
  return target
}

/**
 * @description 有些特殊案例需要額外確認是否需要略過檢查是否有輸入的環節
 * @param { string } outerKey
 * @param { string } innerKey
 * @param { string } requestType
 * @param { boolean } isReviewing: 此時 status 是否為 'Reviewing'
 * @returns { boolean } 可以略過不檢查則返回 true, 必須檢查時則返回 false
 */
const skipSpecific = (outerKey, innerKey, requestType, isReviewing) => {
  let needSkip = false
  if (!isReviewing) {
    //案例 1: status 不為 'Reviewing' 時, 不需要檢查 schedule
    if (outerKey === 'schedule') needSkip = true
  } else {
    needSkip = true
    if (outerKey === 'schedule') {
      needSkip = false
      //案例 2: status 為 'Reviewing' 時, 需要檢查
      //當需求類型為 "OneTime" 時, 不需要輸入 release 及 monitor 1 lot 日期
      if (innerKey === 'release' || innerKey === 'monitor') {
        needSkip = requestType === 'OneTime' ? true : false
      }
    }
  }
  return needSkip
}

/**
 * @description 檢查此欄位是否尚未被輸入
 * @param { string || number || null } value: 被檢查欄位的值
 * @returns { boolean } 如果尚未被輸入返回 true, 有輸入值則返回 false
 */
//檢查輸入的參數值是否為空字串 || 0 || 空值
const isEmpty = (value) => {
  switch (typeof value) {
    case 'string': return value === '' ? true : false
    case 'number': return value === 0 ? true : false
    default: return !value ? true : false
  }
}

/**
 * @description 檢查此日期欄位的值是否合法 (後面步驟不可早於前面步驟的日期)
 * @param { string } requestType: 需求類型
 * @param { object } schedule: 即 this.application.schedule
 * @returns { boolean } 如果不合法返回 true, 合法返回 false
 */
const isIllegal = (requestType, schedule) => {
  //最後會被返回的值
  let isIllegals = {}
  
  for (let i = 1; i < Object.entries(schedule).length; i++) {
    //這個日期值的 key
    const key = Object.entries(schedule)[i][0]
    //這個日期值的 value
    const value = Object.entries(schedule)[i][1]
    //這個日期上一個步驟的日期 value
    const previousValue = Object.entries(schedule)[i - 1][1]
    if (requestType === 'OneTime' && (key === 'release' || key === 'monitor')) {
      break
    } else {
      if (value !== '' && previousValue !== '') {
        isIllegals[key] = new Date(value) - new Date(previousValue) < 0
      } else {
        throw {
          type: 'EmptyStringError',
          detail: `Error occured because value in this.application.schedule.${key} or its previous date value is empty string!`
        }
      }
    }
  }

  return isIllegals
}
