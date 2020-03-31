const modelData = {
  state: {
    findTmplInitDetails: [],
    modelId: "",
    buttondisAble: true
  },
  mutations: {
    ADD_MODEL_DATA: (state, log) => {
      state.findTmplInitDetails = log;
    },
    ADD_MODEL_ID: (state, log) => {
      state.modelId = log;
    },
    CHANGE_BUTTON: (state, log) => {
      state.buttondisAble = log;
    }
  },
  actions: {
    dispatch_MODEL_DATA({ commit }, log) {
      commit("ADD_MODEL_DATA", log);
    }
  }
};

export default modelData;
