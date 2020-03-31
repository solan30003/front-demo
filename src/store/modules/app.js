const app = {
  state: {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    userInfo: {
      administrator: false,
      roles: [],
      userId: JSON.parse(localStorage.getItem("loginInfo")) ? JSON.parse(localStorage.getItem("loginInfo")).userInfo.userId : "",
      userName: JSON.parse(localStorage.getItem("loginInfo")) ? JSON.parse(localStorage.getItem("loginInfo")).userInfo.userName : "",
      cnName: JSON.parse(localStorage.getItem("loginInfo")) ? JSON.parse(localStorage.getItem("loginInfo")).userInfo.cnName : "",
      idCardNumber: JSON.parse(localStorage.getItem("loginInfo")) ? JSON.parse(localStorage.getItem("loginInfo")).userInfo.idCardNumber : "",
      departmentName: JSON.parse(localStorage.getItem("loginInfo")) ? JSON.parse(localStorage.getItem("loginInfo")).userInfo.departmentName : "",
    }
  },
  mutations: {
    SET_TOKEN: (state, payload) => {
      state.token = payload;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    }
  },
  actions: {
    setUserInfo({ commit }, userInfo) {
      commit("SET_USERINFO", userInfo);
    }
  }
};

export default app;
