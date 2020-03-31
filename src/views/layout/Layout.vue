<template>
  <el-container class="main-layout">
    <front-header></front-header>
    <app-main ref="mainTable" />
    <el-footer class="footer">FRONT DEMO 2020</el-footer>
  </el-container>
</template>
<script>
import { AppMain } from "./components";

import frontHeader from "./components/front-header";

export default {
  name: "Layout",
  data() {
    return {};
  },
  components: {
    AppMain,
    frontHeader
  },
  computed: {},
  watch: {
    $route(value, old) {
      console.log(value);
      console.log(old);
      this.hideHeader = this.$route.name === "aiSearch";
    }
  },
  mounted() {
    this.hideHeader = this.$route.name === "aiSearch";
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menu-right {
  width: 300px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.user-img {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  line-height: 33px;
  text-align: center;
}
.main-layout {
  height: 100%;
}
.footer {
  background: #c0c4cc;
  text-align: center;
  line-height: 50px;
  height: 50px !important;
  font-size: 14px;
  color: #606266;
  z-index: 999999;
}
</style>
