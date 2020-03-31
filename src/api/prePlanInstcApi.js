import request from "@/utils/request";

const env = window.ENV || {
  API: "",
  SERVE: "",
  API_USER: ""
};
//########################################################
//### 预案实例API
//########################################################
export const prePlanInstcApi = {
  /**
   * 查询预案实例列表 by hyl 20200213
   * @param {object} params {status, pageIndex, pageSize}
   */
  queryPrePlanInstcList: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/list`,
      method: "get",
      params: params
    });
  },
  /**
   * 搜索预案列表
   * @param {object} params {}
   */
  searchPlanList: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/search`,
      method: "GET",
      params: params
    });
  },

  /**
   * 推荐预案列表
   * @param {object} params {}
   */
  searchPlanListSuggest: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/searchSuggest`,
      method: "GET",
      params: params
    });
  },
  /**
   * 修改预案实例执行状态
   * @param {object} params {planInstcId, status}
   */
  changeStatus: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/changeStatus`,
      method: "POST",
      params
    });
  },
  /**
   * 启动预案
   * @param {object} data { "bizRelId": "", "planTmplId": "" }
   */
  startPlan: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/start`,
      method: "post",
      data
    });
  },
  /**
   * 根据指定的一级项id查询其二级项列表
   * @param {string} params itemId
   */
  queryItemsSecond: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instc/items/` + params,
      method: "GET"
    });
  },

  /**
   * 添加或修改反馈
   * @param {object} data 反馈对象
   */
  updateFeedbacks: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/save`,
      method: "post",
      data
    });
  },

  /**
   * 根据指定的预案一级项id查询反馈列表
   * @param {object} params 一级项id
   */
  findFeedbacks: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/list`,
      method: "GET",
      params: params
    });
  },

  /**
   * 根据指定的id查询反馈
   * @param {string} params 反馈id
   */
  findFeedbacksById: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/` + params,
      method: "GET"
    });
  },
  //根据指定的id查询反馈
  feedbacksListDetail: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/` + params,
      //url:"http://10.19.151.116:19700/api/rplan/impl/v1/plan/instcs/70386c95-0170-40280981-386c9524-0000",
      method: "GET"
      //params: params
    });
  },
  /**
   * 删除反馈
   * @param {*} params id
   */
  feedbacksListDelete: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/` + params,
      method: "delete"
    });
  },
  /**
   * 批量修改预案详情/处置过程的二级项
   * @param {object}
   */
  updateItemSubBatch: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instc/items/updateItemSubBatch`,
      method: "post",
      data
    });
  },


};
