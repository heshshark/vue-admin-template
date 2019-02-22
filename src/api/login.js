import request from '@/utils/request'

export function loginByUsername(username, password) {
  const grant_type = 'password';
  const scope = 'server';
  return request({
    url: '/auth/oauth/token',
    headers: {
      'Authorization': 'Basic YXBwOmFwcA=='
    },
    method: 'post',
    params: {username, password, grant_type, scope}
  })
}

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/upms/user/info',
    method: 'get',
    params: {token}
  })
}

export function logout(token) {
  return request({
    url: '/auth/token?accessToken=' + token,
    method: 'delete'
  })
}
