<template>
  <el-header class="header">
    <div class="content">
      <div class="left">
        <div>
          <route-path></route-path>
        </div>
        <div>
          <i class="font_family icon-DigitalOS"></i>
        </div>
        <div style="font-weight: 600; min-width: 180px; margin-left: 12px;">
          <span>{{ title }}</span>
        </div>
      </div>
    </div>
  </el-header>
</template>

<script>
import routePath from "./routePath";
export default {
  components: {
    routePath
  },
  data() {
    return {
      // title: "front-demo",
      userName: "admin"
    };
  },
  computed: {
    title() {
      return this.$route.meta.title;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/header.scss";
</style>
