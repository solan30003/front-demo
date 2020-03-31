import request from "@/utils/request";

const env = window.ENV || {
  API: "",
  SERVE: "",
  API_USER: ""
};
//########################################################
//### 公共通用部分API，不分业务功能
//########################################################
export const commonApi = {
  /**
   * 查询组织机构 /api/rplan/impl/v1/orgs/tree
   */
  queryOrgansTree: function() {
    return request({
      url: env.API + `/rplan/impl/v1/orgs/tree`,
      method: "get"
    });
  },

  /**
   * 查询组织机构范围内人员 /api/rplan/impl/v1/orgs/staff
   * @param {object} data {}
   */
  queryPeoplefromOrgan: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/orgs/staff`,
      method: "get",
      params: data
    });
  },
  /**
   * 根据父级查询字典列表。示例：/dicts/list?parentCode=&pageIndex=0&pageSize=10
   * @param {object} params {}
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
   * @param {object} params 种类category
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
   * 查询所有的预案类型列表。
   * 暂时保留，后面不要再调用此方法，查询字典类通过getDictListByCategory()或getDictListByParent查询 by hyl 20200218
   * @deprecated
   * @param {object} params {}
   */
  queryPlanType: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/list`,
      method: "GET",
      params: params
    });
  }
};
