<template>
  <div>
    <el-row>
      <el-button type="primary" @click="testHandleClick">添加反馈测试</el-button>
    </el-row>
  </div>
</template>
<script>
import { testApi } from "@/api/testApi.js";
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    testHandleClick: function() {
      // eslint-disable-next-line no-unused-vars
      const data = {
        id: "",
        planInstcItemId: "70386c95-0170-40280981-386c9897-0003",
        remark: "test11"
      };
      testApi.test(data).then(d => {
        console.log(d.data);
        if (d.data.resultCode === 0) {
          this.$message({
            type: "success",
            message: "调用成功!"
          });
        } else {
          this.$message({
            type: "error",
            message: "调用失败!"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.msg {
  margin: 0px 4px;
}
</style>
