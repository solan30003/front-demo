const getters = {
  token: state => state.app.token,
  errorLogs: state => state.errorLog.logs,
  userInfo: state => state.app.userInfo
};
export default getters;
