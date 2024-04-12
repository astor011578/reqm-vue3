import request from '@/utils/axiosReq'

export const loginReq = (data) => {
  return request({
    method: 'post',
    url: '/login',
    data,
    bfLoading: false,
    isAlertErrorMsg: false
  })
}

export const authReq = () => {
  return request({
    method: 'post',
    url: '/auth',
    bfLoading: false,
    isAlertErrorMsg: false
  })
}

export const logoutReq = () => {
  return request({
    method: 'post',
    url: '/logout'
  })
}

export const getInfoReq = (userId) => {
  return request({
    method: 'get',
    url: `/user/${userId}`
  })
}

export const getUsersReq = (dept) => {
  const url = dept ? `/users?dept=${dept}` : '/users'
  return request({
    method: 'get',
    url
  })
}

export const editInfoReq = (data) => {
  return request({
    method: 'patch',
    url: '/user',
    data
  })
}
