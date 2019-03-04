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

export function syncFans() {
  return request({
    url: prefix + '/task/sync',
    method: 'post'
  })
}

export function updateFansRemarkName(fansId,fansOpenId, remarkName) {
  return request({
    url: prefix + '/fans/'+fansId+'/remarkName?openId='+fansOpenId+'&remarkName='+remarkName,
    method:'patch'
  })
}

export function overwriteFansTags(fansId, fansTags) {
  return request({
    url: prefix + '/fans/' + fansId + '/tags?tagIds=' + fansTags,
    method: 'patch',
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

export function getFansTag(fansTagId) {
  return request({
    url: prefix + '/fansTags/' + fansTagId,
    method: 'get'
  })
}

export function addFansTag(tag) {
  return request({
    url: prefix + '/fansTags',
    method: 'post',
    data: tag
  })
}

export function updateFansTag(tag) {
  return request({
    url: prefix + '/fansTags',
    method: 'put',
    data: tag
  })
}

export function deleteFansTag(tagId) {
  return request({
    url: prefix + '/fansTags/' + tagId,
    method: 'delete'
  })
}

/*
菜单
 */
export function fetchMenuList(query) {
  return request({
    url: prefix + '/menus/queries',
    method: 'post',
    data: query
  })
}

export function publishMenu(menuId) {
  return request({
    url: prefix + '/menus/publish/' + menuId,
    method: 'put'
  })
}

export function updateMenu(menu) {
  return request({
    url: prefix + '/menus',
    method: 'put',
    data: menu
  })
}

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
    data: tag
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

export function fetchMenuButtonTree(menuId) {
  return request({
    url: prefix + '/menuButtons/tree/' + menuId,
    method: 'get'
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
素材管理
 */
export function fetchMaterialList(type, offset, count) {
  return request({
    url: prefix + '/materials?type=' + type + '&offset=' + offset + '&count=' + count,
    method: 'get'
  })
}

export function getMaterial(type, mediaId) {
  return request({
    url: prefix + '/materials/' + type + '/' + mediaId,
    method: 'get'
  })
}

export function addMaterialNews(article) {
  return request({
    url: prefix + '/materials/news',
    method: 'post',
    data: article
  })
}

export function addMaterial(type, material) {
  return request({
    url: prefix + '/materials/' + type,
    method: 'post',
    data: material
  })
}

export function deleteMaterial(articleId) {
  return request({
    url: prefix + '/materials/' + articleId,
    method: 'delete'
  })
}

export function updateMaterial(article) {
  return request({
    url: prefix + '/materials/',
    method: 'patch',
    data: article
  })
}

/*
关键字
 */
export function fetchKeywordList(query) {
  return request({
    url: prefix + '/keywords/queries',
    method: 'post',
    data: query
  })
}

export function getKeyword(keywordId) {
  return request({
    url: prefix + '/keywords/' + keywordId,
    method: 'get'
  })
}

export function addKeyword(keyword) {
  return request({
    url: prefix + '/keywords/',
    method: 'post',
    data: keyword
  })
}

export function deleteKeyword(keywordId) {
  return request({
    url: prefix + '/keywords/' + keywordId,
    method: 'delete'
  })
}

export function updateKeyword(keyword) {
  return request({
    url: prefix + '/keywords/',
    method: 'patch',
    data: keyword
  })
}
