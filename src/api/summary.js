import request from '@/utils/axiosReq'
import { getTimestamp } from '@/hooks/useDate'

export const getReqSummary = () => {
  return request({
    method: 'get',
    url: `/summary/requests/${getTimestamp()}`
  })
}
