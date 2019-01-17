import request from '@/utils/request'

const prefix = "/wechat/mp"

export function fetchList(query) {
  return request({
    url: prefix + '/upms/user/queries',
    method: 'post',
    data: query
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

export function delObj(id) {
  return request({
    url: '/upms/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/user',
    method: 'put',
    data: obj
  })
}

