<template>
  <div style="display: flex;justify-content: center;flex-direction: column; align-items: center;">
    <div >
      <img :src="imgPath" />
    </div>
    <div>
        <el-button type="primary" @click="goBack">返回首页</el-button>
      </div>
  </div>
</template>

<script>
import imgPath from "@/assets/images/404.png";
export default {
  data() {
    return {
      imgPath: imgPath
    };
  },
  methods: {
    goBack() {
      let src = `${window.ENV.API_ZC}/dashboard`;
      localStorage.setItem("pathName", "");
      this.$router.push({
        name: "dass",
        params: {
          src: src
        }
      });
    }
  }
};
</script>