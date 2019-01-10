import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/upms/role/queries',
    method: 'post',
    data: query
  })
}

export function fetchAllRole() {
  const query = {
    page: 1,
    limit: 100
  }
  return fetchList(query);
}

export function getObj(id) {
  return request({
    url: '/upms/role/' + id,
    method: 'get'
  })
}

export function addRole(obj) {
  return request({
    url: '/upms/role/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/upms/role/',
    method: 'put',
    data: obj
  })
}

export function delRole(id) {
  return request({
    url: '/upms/role/' + id,
    method: 'delete'
  })
}

export function updaterPermission(roleId, menuIds) {
  return request({
    url: '/upms/role/menuIds/'+ roleId,
    method: 'put',
    params: {
      menuIds: menuIds
    }
  })
}

export function fetchRoleMenuIds(roleId) {
  return request({
    url: '/upms/role/menuIds/' + roleId,
    method: 'get'
  })
}
