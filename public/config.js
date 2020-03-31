(function(win) {
  // 后台 前端 keycloak ip 统一配置
  // var backDomain = `http://localhost`;
  var backDomain = `http://10.19.151.116`;
  //var frontDomain = `http://10.19.151.115`;

  win.ENV = {
    KpiLoginTitle: "数据资源服务平台", // 登陆首页标题
    LoginTitle: "大数据运维平台", // 登陆首页标题
    API: `${backDomain}:19700/api`
  };
})(window);
