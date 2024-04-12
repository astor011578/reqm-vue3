import request from '@/utils/axiosReq'

export const uploadAttachedFiles = (data) => {
  return request({
    method: 'post',
    url: '/upload/attached-files',
    data,
    isUploadFile: true
  })
}

export const uploadEvidence = (data, reqNo, step) => {
  return request({
    method: 'post',
    url: `/upload/evidence?reqNo=${reqNo}&step=${step}`,
    data,
    isUploadFile: true
  })
}
