import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { hasProperty } from '@/hooks/useValidate'
import { lang } from '@/hooks/useCommon'
import { getRequest } from '@/api/request'
const router = useRouter()

export const useReqStore = defineStore('request', {
  state: () => {
    return {
      reqNo: '',
      pgrInfo: {},
      reqrInfo: {},
      uploadStatus: {},
      step: '',
      basicInfo: {},
      cancellation: {},
      scope: {},
      turnOnDate: {},
      schedule: {},
      evidence: {}
    }
  },

  getters: {
    getReqNo: (state) => { return state.reqNo },
    getSimpleStep: (state) => { return state.step },
    getFullStep: (state) => { return state.step === 'monitor' ? 'monitor 1 lot' : state.step },
    getPgrInfo: (state) => { return state.pgrInfo },
    getReqrInfo: (state) => { return state.reqrInfo },
    getReqType: (state) => { return state.basicInfo.type },
    getReqStatus: (state) => { return state.basicInfo.status },
    getUploadStatus: (state) => { return state.uploadStatus },
    getBasicInfo: (state) => { return state.basicInfo },
    getCancellation: (state) => { return state?.cancellation },
    getScope: (state) => { return state.scope },
    getTurnOnDate: (state) => { return state.turnOnDate },
    getSchedule: (state) => { return state.schedule },
    getEvidence: (state) => { return state.evidence },
    getPermission: (state) => {
      const step = state.getSimpleStep
      const uploadStatus = state.getUploadStatus
      const isPendingCancel = state.getCancellation?.result === 'Reviewing' ? true : false
      const userId = useUserStore().getUserId
      const isPgr = state.getPgrInfo.id === userId ? true : false
      const isReqr = state.getReqrInfo.id === userId ? true : false
      let permissions = {}

      switch (state.basicInfo.status) {
        case 'Reviewing': {
          permissions.revNew = isPgr ? true : false
          permissions.editNew = false
          break
        }
        case 'Returned': {
          permissions.revNew = false
          permissions.editNew = isReqr ? true : false
          break
        }
        default: {
          permissions.revNew = false
          permissions.editNew = false
          break
        }
      }
      switch (uploadStatus[step]) {
        case 'Unuploaded':
        case 'Rejected': {
          permissions.approve = false
          permissions.postpone = isPgr || isReqr ? true : false
          permissions.cancel = isPendingCancel ? false : (isReqr ? true : false)
          if (step === 'UAT1') {
            permissions.evidence = isPgr ? true : false
          } else {
            permissions.evidence = isReqr ? true : false
          }
          break
        }
        case 'Reviewing': {
          permissions.evidence = false
          permissions.postpone = isPgr || isReqr ? true : false
          permissions.cancel = isPendingCancel ? false : (isReqr ? true : false)
          if (step === 'UAT1') {
            permissions.approve = isReqr ? true : false
          } else {
            permissions.approve = isPgr ? true : false
          }
          break
        }
        case 'Approved': {
          permissions.approve = false
          permissions.evidence = false
          permissions.postpone = false
          permissions.cancel = false
          break
        }
      }
      return permissions
    },
    getApplicant: (state) => {
      const userId = useUserStore().getUserId
      const isPgr = state.pgrInfo.id === userId ? true : false
      const isReqr = state.reqrInfo.id === userId ? true : false
      const programmer = [state.pgrInfo.name, state.pgrInfo.id]
      const requester = [state.reqrInfo.name, state.reqrInfo.id]
      const applicant = isPgr ? programmer : (isReqr ? requester : [])
      return applicant
    }
  },

  actions: {
    setReqNo(reqNo) {
      this.reqNo = reqNo
    },

    async getReqInfo() {
      try {
        if (this.reqNo.length) {
          await getRequest(this.reqNo)
            .then((res) => {
              const {
                reqNo, reqrName, reqrId, pgrName, pgrId, issueDate, status, reqTable, review, cancel,
                turnOnDate, type, uploadStatus, attachedFiles, leadTime, reviewDuration, UAT1Logs, UAT2Logs, releaseLogs, monitorLogs
              } = res.data
              const { reqName } = reqTable

              //get values of programmer
              this.pgrInfo = { name: pgrName, id: pgrId }
              //get values of requester
              this.reqrInfo = { name: reqrName, id: reqrId }
              //get values of uploadStatus
              this.uploadStatus = uploadStatus
              //get values in basicInfo
              this.basicInfo = { reqNo, reqName, type, status, leadTime, pgrName, reqrName, issueDate, review, reviewDuration }
              //get values in cancellation
              this.cancellation = cancel
              //get values in scope
              this.scope = Object.assign({ attachedFiles }, reqTable)
              //get values about schedule
              this.turnOnDate = { owner: pgrName, date: turnOnDate }
              this.schedule = {
                UAT1: scheduleHandler(res.data, 'UAT1', status),
                UAT2: scheduleHandler(res.data, 'UAT2', status),
                release: type === 'Project' ? scheduleHandler(res.data, 'release', status) : undefined,
                monitor: type === 'Project' ? scheduleHandler(res.data, 'monitor', status) : undefined
              }
              //get values about evidence
              this.evidence = {
                UAT1: {
                  uploadFiles: UAT1Logs?.uploadFiles,
                  uploadReply: UAT1Logs?.result,
                  updateDate: UAT1Logs?.updateDate,
                  reviewDate: UAT1Logs?.reviewDate,
                  comments: UAT1Logs?.comments
                },
                UAT2: {
                  uploadFiles: UAT2Logs?.uploadFiles,
                  uploadReply: UAT2Logs?.result,
                  updateDate: UAT2Logs?.updateDate,
                  reviewDate: UAT2Logs?.reviewDate,
                  comments: UAT2Logs?.comments
                },
                release: {
                  uploadFiles: releaseLogs?.uploadFiles,
                  uploadReply: releaseLogs?.result,
                  updateDate: releaseLogs?.updateDate,
                  reviewDate: releaseLogs?.reviewDate,
                  comments: releaseLogs?.comments
                },
                monitor: {
                  uploadFiles: monitorLogs?.uploadFiles,
                  uploadReply: monitorLogs?.result,
                  updateDate: monitorLogs?.updateDate,
                  reviewDate: monitorLogs?.reviewDate,
                  comments: monitorLogs?.comments
                }
              }
              //get current proceeding step
              switch (true) {
                case uploadStatus.UAT1 && uploadStatus.UAT1 !== 'Approved': this.step = 'UAT1'; break;
                case uploadStatus.UAT2 && uploadStatus.UAT2 !== 'Approved': this.step = 'UAT2'; break;
                case uploadStatus.release && uploadStatus.release !== 'Approved': this.step = 'release'; break;
                case uploadStatus.monitor && uploadStatus.monitor !== 'Approved': this.step = 'monitor'; break;
                default: this.step = status; break;
              }
            })
        } else {
          throw 'missingArgumentError'
        }
      } catch (err) {
        //如果是客製的 error message string
        const isCustomError = err.indexOf('status code ') === -1 ? true : false
        if (isCustomError) {
          switch (err) {
            case 'missingArgumentError': return console.error('請提供 reqNo ')
            default: return console.error(err)
          }
        }

        //如果是此框架的原作者設計的 error message
        const errorCode = JSON.parse(err).msg.split('status code ')[1]
        switch (errorCode) {
          case '404': {
            console.error(`找不到 reqNo #${this.reqNo} 資料，請確認 reqNo 是否正確輸入`)
            ElMessage.error(`reqNo #${this.reqNo} ${lang('data not found')}`)
            router.push('/404')
            return
          }
          default: return console.error(errorCode)
        }
      }
    }
  }
})

/**
 * @description modify values in each stages of schedule
 * @param { object } resource resource data
 * @param { string } stage name of stage in schedule
 * @param { string } status status of this request
 * @return { object } output Object, modified values of each stage
 */
const scheduleHandler = (resource, stage, status) => {
  let _resource = resource[`${stage}Logs`]
  let output = {
    title: '',
    owner: '',
    state: '',
    act: '',
    exp: {
      old: [],
      new: ''
    },
    KPI: {}
  }

  switch (stage) {
    case 'UAT1': {
      output.title = 'IT buyoff (UAT1)'
      output.owner = resource.pgrName
      break
    }
    case 'UAT2': {
      output.title = 'User buyoff (UAT2)'
      output.owner = resource.reqrName
      break
    }
    case 'release': {
      output.title = 'Release'
      output.owner = resource.reqrName
      break
    }
    case 'monitor': {
      output.title = 'Monitor 1 lot'
      output.owner = resource.reqrName
      break
    }
  }

  if (!_resource.actDate) {
    if (status === 'Cancel') {
      output.state = 'Cancel'
    } else {
      if (_resource.result === 'Reviewing') {
        output.state = 'Reviewing'
      } else if (_resource.result === 'Rejected') {
        output.state = 'Rejected'
      } else {
        output.state = 'Proceeding'
      }
    }
  } else {
    output.state = 'Done'
  }

  output.act = _resource.actDate
  const expDatesLength = _resource.expDates.length
  switch (expDatesLength > 1) {
    case true: {
      for (let i = 0; i < expDatesLength; i++) {
        if (i < expDatesLength - 1) {
          output.exp.old.push(_resource.expDates[i])
        } else {
          output.exp.new = _resource.expDates[i]
        }
      }
      break
    }
    case false: {
      output.exp.new = _resource.expDates[0]
      break
    }
  }

  if (hasProperty(resource.KPI[stage])) {
    output.KPI = Object.assign({}, resource.KPI[stage])
  } else {
    output.KPI = {
      reschedule: 0,
      delay: 0
    }
  }
  return output
}
