import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { lang } from '@/hooks/useCommon'
let reqConfig
let loadingInstance
const service = axios.create()

/**
 * request interceptor (請求攔截器)
 */
service.interceptors.request.use(
  (request) => {
    //token setting
    request.headers['Authorization'] = getToken()

    //is download file
    if (request.isDownLoadFile) request.responseType = 'blob'

    //is upload file
    if (request.isUploadFile) request.headers['Content-Type'] = 'multipart/form-data'

    reqConfig = request

    //loading
    if (request.bfLoading) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: `${lang('Loading')}...`,
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }

    //if has params (params 與 url 相接)
    if (request.isParams) {
      request.params = request.data
      request.data = {}
    }

    return request
  },
  (err) => {
    Promise.reject(err)
  }
)

/**
 * response interceptor (回應攔截器)
 */
service.interceptors.response.use(
  (response) => {
    //如果請求時有開啟 loading 效果, 返回回應後要關閉
    if (reqConfig.afHLoading && loadingInstance) loadingInstance.close()

    //如果是檔案, 直接回傳 response 進行下載
    if (reqConfig.isDownLoadFile) return response

    const statusCode = response.status
    const { message, status, authorization, data } = response.data

    const resData = {
      message,
      status,
      code: statusCode
    }

    if (authorization) resData.authorization = authorization
    if (data) resData.data = data

    return resData
  },
  (err) => {
    //關閉 loading 動畫
    if (loadingInstance) loadingInstance.close()

    //取得錯誤狀態碼
    const codeString = JSON.stringify(err.message).split('status code ')[1]
    const statusCode = Number.parseInt(codeString.slice(0, -1))

    //處理 HTTP 錯誤代碼 401, 404, 500 ....等問題
    let message = ''
    switch (statusCode) {
      case 401: {
        message = 'Please login again'
        break
      }
      case 403: {
        message = 'Permission denied'
        break
      }
      case 404: {
        message = 'Data not found'
        break
      }
      case 500: {
        message = 'Server encountered an unexpected condition'
        break
      }
    }

    ElMessage.error({
      message: lang(message),
      duration: 5 * 1000
    })

    return Promise.reject(err)
  }
)

export function axiosReq({
  url,
  data,
  method,
  isParams,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg = true
}) {
  return service({
    url: url,
    method: method ?? 'get',
    data: data ?? {},
    isParams: isParams ?? false,
    bfLoading: bfLoading ?? false,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg,
    baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL,
    timeout: timeout ?? 15000
  })
}

export default axiosReq
