import request from "@/utils/request";

const env = window.ENV || {
  API: "",
  SERVE: "",
  API_USER: ""
};
/**
 * 上传文件地址
 */
export const fileUploadUrl = `${env.API}/rplan/impl/v1/fs/file/FastDFS`;

//########################################################
//### 预案模板API
//########################################################
export const prePlanTmplApi = {
  /**
   * 所有预案列表
   * @param {object} params {}
   */
  searchAllPlanList: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/searchForSys`,
      method: "GET",
      params: params
    });
  },
  /**
   * 添加预案模板 /api/rplan/impl/v1/plan/tmpls/divided/addPlanTmpl
   * @param {object} data {}
   */
  addBasisPlanInfo: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/addPlanTmpl`,
      method: "post",
      data
    });
  },
  /**
   * 删除预案模板一级项
   * infoType: 1-基础项；2-处置过程节点
   * @param {*} params params
   */
  deletePreplanItem1st: function(params) {
    let $params = { planItemId: "", infoType: 0 };
    Object.assign($params, params);
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/deleteplanItem`,
      method: "DELETE",
      params: $params
    });
  },
  /**
   * 添加指挥机构 单位指令 人员指令 文本 /api/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItemSub
   * @param {object} data {}
   */
  addItemonDatailorProcess: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItemSub`,
      method: "post",
      data
    });
  },
  //修改指挥机构 单位指令 人员指令 文本 /api/rplan/impl/v1/plan/tmpls/divided/updateplanItemSub
  ModifyItemonDatailorProcess: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/updateplanItemSub`,
      method: "post",
      data
    });
  },

  //删除指挥机构 单位指令 人员指令 文本 /api/rplan/impl/v1/plan/tmpls/divided/deleteplanItemSub
  deleteItemonDatailorProcess: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/deleteplanItemSub`,
      method: "delete",
      params: data
    });
  },

  /**
   * 添加预案详情或 处置过程 api/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItem
   * @param {object} data {}
   */
  addDatailorProcess: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItem`,
      method: "post",
      data
    });
  },
  /**
   * 查询预案模板详情项/执行过程详情，即某个指定预案详情/执行过程下的（比如指挥机构下的）工具栏下的数据
   * @param {object} data {}
   */
  queryDatailorProcess: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/detailPlanTmplItem`,
      method: "get",
      params: data
    });
  },

  /**
   * 查询预案模板详情项和执行过程，即左侧预案详情/执行过程下的数据list
   * @param {object} data {}
   */
  queryPlanStageList: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/planTmpItemList`,
      method: "get",
      params: data
    });
  },

  /**
   * 查询预案模板详情,仅模板表详情
   * @param {object} data {}
   */
  queryPlanBasicInfo: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/detailPlanTmpl`,
      method: "get",
      params: data
    });
  },

  /**
   * 修改预案模板 /api/rplan/impl/v1/plan/tmpls/divided/updatePlanTmpl
   * @param {object} data {}
   */
  updateBasisPlanInfo: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/updatePlanTmpl`,
      method: "post",
      data
    });
  },
  /**
   * 修改预案模板 /api/rplan/impl/v1/plan/tmpls/divided/updatePlanTmpl
   * @param {object} params {planTmplId:}
   */
  deletePreplanTmpl: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/deletePlanTmpl`,
      method: "DELETE",
      params
    });
  },
  //复制预案模板
  copyPreplanTmpl(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/copyPreplanTmpl`,
      method: "post",
      data
    });
  },
  //查询预案模板详情
  planTmplBaseDetail(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/planTmplBaseDetail`,
      method: "GET",
      params
    });
  },
  //查询预案模板详情项/执行过程对应项的详情
  detailPlanTmplItem(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/divided/detailPlanTmplItem`,
      method: "GET",
      params
    });
  },
  // 获取预案模板初始化数据
  findTmplInitDetails(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/tmpls/findTmplInitDetails`,
      method: "GET",
      params
    });
  }
};
