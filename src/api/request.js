import request from '@/utils/axiosReq'

export const getRequests = (status) => {
  return request({
    method: 'get',
    url: `/requests?status=${status}`
  })
}

export const getPendings = (reviewerId, status) => {
  const basicUrl = `/requests/pendings/${reviewerId}`
  const url = status ? `${basicUrl}?status=${status}` : basicUrl
  return request({
    method: 'get',
    url
  })
}

export const getRequest = (reqNo) => {
  return request({
    method: 'get',
    url: `/request/${reqNo}`,
    isParams: true
  })
}

export const newRequest = (data) => {
  return request({
    method: 'post',
    url: '/request/new',
    data
  })
}

export const reviewRequest = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `/request/review/${reqNo}`,
    data
  })
}

export const editRequest = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `/request/edit/${reqNo}`,
    data
  })
}

//以下與更新 request 的功能有關
export const rescheduleRequest = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `request/reschedule/${reqNo}`,
    data
  })
}

export const updateEvidence = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `request/evidence/${reqNo}`,
    data
  })
}

export const approveEvidence = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `request/approve/${reqNo}`,
    data
  })
}

export const applyCancellation = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `request/apply-cancellation/${reqNo}`,
    data
  })
}

export const reviewCancellation = (reqNo, data) => {
  return request({
    method: 'patch',
    url: `request/review-cancellation/${reqNo}`,
    data
  })
}
