<template>
  <el-container class="main-layout">
    <enc-header></enc-header>
    <app-main ref="mainTable" />
    <el-footer class="footer">版权所有 2020 新智认知数字科技股份有限公司</el-footer>
  </el-container>
</template>
<script>
import { AppMain } from "./components";

import encHeader from "./components/header";
import { addUserLogoutLog, logout } from "@/api/api.js";

export default {
  name: "Layout",
  data() {
    return {};
  },
  components: {
    AppMain,
    encHeader
  },
  computed: {},
  watch: {
    $route(value, old) {
      this.hideHeader = this.$route.name === "aiSearch";
    }
  },
  mounted() {
    this.hideHeader = this.$route.name === "aiSearch";
  },
  methods: {
    loginOut() {
      const params = {
        loginAccount: this.$store.getters.userInfo.userName
      };
      logout(params).then(res => {
        if (res.data.data) {
          const map = {
            token: "",
            userInfo: {
              userId: "",
              userName: "",
              cnName: "",
              idCardNumber: "",
              departmentName: ""
            }
          };
          localStorage.setItem("loginInfo", JSON.stringify(map));
          localStorage.setItem("token", "");
          this.$store.commit("SET_TOKEN", "");
          this.$store.commit("SET_USERINFO", "");
          this.$router.push("/login");
        } else {
          this.$message.error("退出失败");
        }
      });
    }
  }
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
.main-layout{
  height:100%;
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

