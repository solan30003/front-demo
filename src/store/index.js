import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import modelData from "./modules/modelmanage";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    app,
    errorLog,
    modelData
  },
  getters
});

export default store;
