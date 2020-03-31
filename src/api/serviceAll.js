import request from "@/utils/request";

const env = window.ENV || {
  API: ""
};

export function getLog(data) {
  return request({
    url: env.API + `/log/implmain/v1/logs/add`,
    method: "post",
    data: data
  });
}
