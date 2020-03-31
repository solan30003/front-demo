import request from "@/utils/request";

const env = window.ENV || {
  API: "",
  SERVE: "",
  API_USER: ""
};
export const fileUploadUrl = `${env.API}/rplan/impl/v1/fs/file/FastDFS`;

//查询所有的预案类型列表
export function queryPlanType(params) {
  return request({
    url: env.API + `/rplan/impl/v1/dicts/list`,
    method: "GET",
    params: params
  });
}

//推荐预案列表
export function searchPlanListSuggest(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/searchSuggest`,
    method: "GET",
    params: params
  });
}

//搜索预案列表
export function searchPlanList(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/search`,
    method: "GET",
    params: params
  });
}

//启动预案
export function startPlan(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/start`,
    method: "post",
    data
  });
}

//根据指定的一级项id查询其二级项列表
export function queryItemsSecond(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instc/items/` + params,
    method: "GET"
  });
}

//添加或修改反馈
export function updateFeedbacks(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/save`,
    method: "post",
    data
  });
}

//根据指定的预案一级项id查询反馈列表
export function findFeedbacks(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/list`,
    method: "GET",
    params: params
  });
}

//根据指定的id查询反馈
export function findFeedbacksById(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/` + params,
    method: "GET"
  });
}


//查询预案实例列表 by hyl 20200213
export function queryPrePlanInstcList(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/list`,
    method: "get",
    params: params
  });
}

//所有预案列表
export function searchAllPlanList(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/searchForSys`,
    method: "GET",
    params: params
  });
}

//根据指定的id查询反馈
export function feedbacksListDetail(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/` + params,
    //url:"http://10.19.151.116:19700/api/rplan/impl/v1/plan/instcs/70386c95-0170-40280981-386c9524-0000",
    method: "GET"
    //params: params
  });
}

//########################################################
//### 字典管理类
//########################################################
//根据指定的id查询反馈
export function getDictListForSys(params) {
  return request({
    url: env.API + `/rplan/impl/v1/dicts/listForSys`,
    method: "GET",
    params: params
  });
}
export function deleteDict(params) {
  return request({
    url: env.API + `/rplan/impl/v1/dicts/delete/` + params,
    method: "DELETE"
  });
}
export function saveDict(data) {
  return request({
    url: env.API + `/rplan/impl/v1/dicts/save`,
    method: "POST",
    data
  });
}

///添加预案模板 /api/rplan/impl/v1/plan/tmpls/divided/addPlanTmpl
export function addBasisPlanInfo(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/divided/addPlanTmpl`,
    method: "post",
    data
  });
}

//查询组织机构 /api/rplan/impl/v1/orgs/tree
export function queryOrgansTree() {
  return request({
    url: env.API + `/rplan/impl/v1/orgs/tree`,
    method: "get"
  });
}

//查询组织机构范围内人员 /api/rplan/impl/v1/orgs/staff
export function queryPeoplefromOrgan(data) {
  return request({
    url: env.API + `/rplan/impl/v1/orgs/staff`,
    method: "get",
    params: data
  });
}

//添加指挥机构 单位指令 人员指令 文本 /api/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItemSub
export function addItemonDatailorProcess(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItemSub`,
    method: "post",
    data
  });
}

//修改指挥机构 单位指令 人员指令 文本 /api/rplan/impl/v1/plan/tmpls/divided/updateplanItemSub
export function ModifyItemonDatailorProcess(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/divided/updateplanItemSub`,
    method: "post",
    data
  });
}

///添加预案详情或 处置过程 api/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItem
export function addDatailorProcess(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/divided/addPlanTmplItem`,
    method: "post",
    data
  });
}


//########################################################
//### 预案实例API
//########################################################
export const planInstcApi = {
  //查询预案实例列表 by hyl 20200213
  queryPrePlanInstcList: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/list`,
      method: "get",
      params: params
    });
  },
  changeStatus: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/changeStatus`,
      method: "POST",
      params
    });
  }
};
//########################################################
//### 字典参数管理API
//########################################################
export const dictApi = {
  //查询管理列表
  getDictListForSys: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/listForSys`,
      method: "GET",
      params: params
    });
  },
  //删除字典
  deleteDict: function(params) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/delete/` + params,
      method: "DELETE"
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
      url: env.API + `/rplan/impl/v1/dicts/list`,
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

  //保存字典
  saveDict: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/dicts/save`,
      method: "POST",
      data
    });
  }
};
//########################################################
//### 测试API
//########################################################
export const testApi = {
  //test
  test: function(data) {
    return request({
      url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/save`,
      method: "POST",
      data
    });
  }
};


//查询预案模板详情项/执行过程详情，即某个指定预案详情/执行过程下的（比如指挥机构下的）工具栏下的数据
export function queryDatailorProcess(data) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/tmpls/divided/detailPlanTmplItem`,
    method: "get",
    params: data
  });
}


//删除反馈
export function feedbacksListDelete(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instcs/feedbacks/` + params,
    method: "delete",
  });
}


