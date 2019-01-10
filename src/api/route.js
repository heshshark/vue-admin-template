import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/upms/route/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/route/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/route/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/route/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/route',
    method: 'put',
    data: obj
  })
}

export function applyObj() {
  return request({
    url: '/upms/route/apply',
    method: 'get'
  })
}
