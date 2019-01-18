import request from '@/utils/request'

const prefix = "/wechat/mp"

/*
粉丝
 */
export function fetchFansList(query) {
  return request({
    url: prefix + '/fans/queries',
    method: 'post',
    data: query
  })
}

/*
粉丝标签
 */
export function fetchFansTagList(query) {
  return request({
    url: prefix + '/fansTags/queries',
    method: 'post',
    data: query
  })
}

export function addFansTag(tag) {
  return request({
    url: prefix + '/fansTags',
    method: 'post',
    data: query
  })
}

export function updateFansTag(tag) {
  return request({
    url: prefix + '/fansTags',
    method: 'put',
    data: query
  })
}

/*
菜单
 */
export function getCurrentWechatMenu() {
  return request({
    url: prefix + '/menus/current',
    method: 'get'
  })
}

export function previewWechatMenuMatch(userId) {
  return request({
    url: prefix + '/menus/match/' + userId,
    method: 'get'
  })
}

export function addWechatMenu(tag) {
  return request({
    url: prefix + '/menus',
    method: 'post',
    data: query
  })
}

export function deleteWechatMenu(menuId) {
  return request({
    url: prefix + '/menus/' + menuId,
    method: 'delete',
  })
}

/*
菜单按钮
 */
export function fetchMenuButtonList(query) {
  return request({
    url: prefix + '/menuButtons/queries',
    method: 'post',
    data: query
  })
}

export function addMenuButton(button) {
  return request({
    url: prefix + '/menuButtons',
    method: 'post',
    data: button
  })
}

export function deleteMenuButton(buttonId) {
  return request({
    url: prefix + '/menuButtons/' + buttonId,
    method: 'delete'
  })
}

export function updateMenuButton(button) {
  return request({
    url: prefix + '/menuButtons',
    method: 'put',
    data: button
  })
}

/*
文章
 */
