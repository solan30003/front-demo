import Mock from "mockjs";

const data = {
  id: "@guid",
  name: "@cname"
};
Mock.mock("/api/getLoginLogList", "get", data);

export default Mock;
