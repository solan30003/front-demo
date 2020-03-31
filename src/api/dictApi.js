import request from "@/utils/request";

const env = window.ENV || {
  API: "",
  SERVE: "",
  API_USER: ""
};
//########################################################
//### 字典参数管理API
//########################################################
export const dictApi = {
  /**
   * 查询管理列表
   * @param {object} params {category, pageIndex, pageSize}
   */
  getDictListForSys: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/listForSys`,
      method: "GET",
      params: params
    });
  },
  /**
   * 根据父级查询字典列表。示例：/dicts/list?parentCode=&pageIndex=0&pageSize=10
   * @param {*} params 参数
   */
  getDictListByParent: function(params) {
    let $params = { parentCode: "", pageIndex: 0, pageSize: 50 };
    Object.assign($params, params);
    return request({
      url: env.API + `/rplan/impl/v1/dicts/listByParent`,
      method: "GET",
      params: $params
    });
  },
  /**
   * 根据种类查询字典列表。示例：/dicts/listByCategory?category=&withRoot=false&pageIndex=0&pageSize=10
   * @param {*} params 种类category
   */
  getDictListByCategory: function(params) {
    let $params = { category: "", withRoot: false, pageIndex: 0, pageSize: 50 };
    Object.assign($params, params);
    return request({
      url: env.API + `/rplan/impl/v1/dicts/listByCategory`,
      method: "GET",
      params: $params
    });
  },

  /**
   * 保存字典
   * @param {object} data {}
   */
  saveDict: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/save`,
      method: "POST",
      data
    });
  },
  //删除字典
  deleteDict: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/delete/` + params,
      method: "DELETE"
    });
  }
};
