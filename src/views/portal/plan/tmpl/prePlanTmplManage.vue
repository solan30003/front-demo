<template>
  <div class="main-style">
    <!-- <el-row style="height:24px">
      <el-breadcrumb
        separator="/"
        style="line-height: 48px;font-size: 18px;margin-left:16px;"
      >
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/prePlanTmplList'}">预案模板</el-breadcrumb-item>
        <el-breadcrumb-item v-if="type === 1">新增</el-breadcrumb-item>
        <el-breadcrumb-item v-if="type === 2">修改</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>-->
    <el-row style="height:calc(100% - 16px);border-right: 1px dotted #5e5e5e;margin-top:16px">
      <el-col :span="8" class="left-aside">
        <leftAside></leftAside>
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="16" class="right-aside">
        <rightAside></rightAside>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import leftAside from "./component/leftAside";
import rightAside from "./component/rightAside";
import bus from "@/assets/bus.js";
export default {
  data() {
    return {
      type: 1,
      propDatas: {}
    };
  },
  components: { leftAside, rightAside },
  watch: {
    $route: {
      handler: function(val) {
        if (val.query.opt == 0) {
          //新增
          this.type = 1;
          bus.$emit("showActive", { type: 1 });
        } else if (val.query.opt == 1) {
          //修改
          this.type = 2;
          if (val.query.preplanTmplId) {
            bus.$emit("showActive", { type: 2, id: val.query.preplanTmplId });
          }
        } else {
          console.log("参数无效");
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {
    let val = this.$route;
    if (val.query.opt == 0) {
      //新增
      this.type = 1;
      bus.$emit("showActive", { type: 1 });
    } else if (val.query.opt == 1) {
      //修改
      this.type = 2;
      if (val.query.preplanTmplId) {
        bus.$emit("showActive", { type: 2, id: val.query.preplanTmplId });
      }
    } else {
      console.log("参数无效");
    }
  }
};
</script>
<style lang="scss" scoped>
.main-style {
  height: 100%;
  // border: 3px solid #5e5e5e;
  // background-color: rgba(242, 242, 242, 1);
}
.left-aside {
  height: 100%;
  padding: 8px 16px;
}
.left-aside {
  // border-right: 2px dotted #5e5e5e;
}
.right-aside {
  height: 100%;
  // margin-left: 16px;
  padding: 8px 16px;
}
</style>
