<template>
  <div class="main-style">
    <el-col :span="8" class="left-aside">
      <leftAside></leftAside>
    </el-col>
    <el-col :span="16" class="right-aside">
      <rightAside></rightAside>
    </el-col>
  </div>
</template>

<script>
import leftAside from "./leftAside/leftAside";
import rightAside from "./rightAside/rightAside";
export default {
  components: { leftAside, rightAside }
};
</script>
<style lang="scss" scoped>
.main-style {
  height: 100%;
  border: 3px solid #5e5e5e;
  background-color: rgba(242, 242, 242, 1);
}
.left-aside,
.right-aside {
  height: 100%;
}
.left-aside {
  border-right: 2px solid #5e5e5e;
}
</style>