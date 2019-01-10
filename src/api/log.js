import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/upms/log/logPage',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/upms/log/' + id,
    method: 'delete'
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/user/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/user/' + id,
    method: 'get'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/user/',
    method: 'put',
    data: obj
  })
}
