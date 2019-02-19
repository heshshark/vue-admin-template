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
    url: prefix + '/fansTags/'+fansTagId,
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
    url: prefix + '/fansTags/'+tagId,
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
    url: prefix + '/menus/publish/'+menuId,
    method: 'put'
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
export function fetchArticleList(query) {
  return request({
    url: prefix + '/keywords/queries',
    method: 'post',
    data: query
  })
}

export function getArticle(articlesId) {
  return request({
    url: prefix + '/articles/' + articlesId,
    method: 'get'
  })
}

export function addArticle(article) {
  return request({
    url: prefix + '/articles/',
    method: 'post',
    data: article
  })
}

export function deleteArticle(articleId) {
  return request({
    url: prefix + '/articles/' + articleId,
    method: 'delete'
  })
}

export function updateArticle(article) {
  return request({
    url: prefix + '/articles/',
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
