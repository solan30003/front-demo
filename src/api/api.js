import request from "@/utils/request";

//添加退出日志
export function addUserLogoutLog(data) {
  return request({
    url: `${window.ENV.API_USER}/addUserLogoutLog`,
    method: "POST",
    data: data
  });
}
// 获取换肤
export function getSkin(data) {
  return request({
    url: `${window.ENV.API_SKIN}/BCM/skin/query`,
    method: "POST",
    data: data
  });
}
//换肤
export function postSkin(data) {
  return request({
    url: `${window.ENV.API_SKIN}/BCM/skin/update`,
    method: "POST",
    data: data
  });
}

export function passwordUpdate(userId, data) {
  return request({
    url: window.ENV.API_USER + `/v1/users/${userId}/password`,
    method: "PUT",
    data: data
  });
}

//用户登录接口
export function login(data) {
  return request({
    url: window.ENV.API_USER + `/v1/login`,
    method: "POST",
    data: data
  });
}

//用户退出接口
export function logout(params) {
  return request({
    url: window.ENV.API_USER + `/v1/logout`,
    method: "get",
    params: params
  });
}


//ca认证获取随机数
export function generateRandom(params) {
  return request({
    url: window.ENV.API_CA_AUTH + `/CaAuthProvider/ca/generateRandom`,
    method: "get",
    params: params
  });
}

export function caAuth(data) {
  return request({
    url: window.ENV.API_CA_AUTH + `/CaAuthProvider/ca/auth`,
    method: "post",
    data: data
  });
}

// 获取菜单目录数据
export function getMenuList(roleId) {
  return request({
    url: window.ENV.API_USER + `/v1/users/${roleId}/authority`,
    method: "GET",
    params: ""
  });
}

// 菜单收藏
export function getCollectedMenu(id) {
  return request({
    url: window.ENV.API_USER + `/favorite/collect?menuId=${id}`,
    method: "GET",
    params: ""
  });
}
//取消菜单收藏
export function deleteCollectedMenu(id) {
  return request({
    url: window.ENV.API_USER + `/favorite/collectCancel?menuId=${id}`,
    method: "GET",
    params: ""
  });
}
//获取收藏的菜单
export function getMenuCollectionList() {
  return request({
    url: window.ENV.API_USER + `/favorite/listMenuCollection`,
    method: "GET",
    params: ""
  });
}
