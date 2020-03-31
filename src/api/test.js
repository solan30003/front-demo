import request from "@/utils/request";

const env = window.ENV || {
  API: "",
  SERVE: "",
  API_USER: ""
};
export const fileUploadUrl = `${env.API}/rplan/impl/v1/fs/file/FastDFS`;

//改变预案执行状态
export function changeDisposeStatus(params) {
  return request({
    url: env.API + `/rplan/impl/v1/plan/instc/items/changeDisposeStatus`,
    method: "post",
    params

  });
}


