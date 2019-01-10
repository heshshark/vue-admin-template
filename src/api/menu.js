import request from '@/utils/request'

export function GetMenu() {
  return request({
    url: '/upms/menu/userMenu',
    method: 'get'
  })
}

export function fetchMenuTree() {
  return request({
    url: '/upms/menu/tree',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/upms/menu/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/upms/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/upms/menu/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/menu/',
    method: 'put',
    data: obj
  })
}
