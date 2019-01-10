import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/upms/dict/queries',
    method: 'post',
    data: query
  })
}

export function getObj(id) {
  return request({
    url: '/upms/dict/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/dict/',
    method: 'post',
    data: obj
  })
}

export function delObj(row) {
  return request({
    url: '/upms/dict/' + row.id + '/' + row.type,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/dict/',
    method: 'put',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/upms/dict/type/' + type,
    method: 'get'
  })
}
