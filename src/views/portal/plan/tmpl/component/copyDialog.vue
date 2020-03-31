<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogEditVisible" :append-to-body="true" width="500px">
      <div>请输入预案名称</div>
      <el-input v-model="preName" placeholder="请输入预案名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHandel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";

export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    preName: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    }
  },
  computed: {
    dialogEditVisible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    confirmHandel() {
      let params = {
        name: this.preName,
        preplanTmplId: this.id
      };
      if (typeof params.name !== "string" || params.name.length == 0 || params.name.length > 30) {
        this.$message({
          message: "请输入有效的预案名称，长度: [1, 30]",
          type: "error"
        });
        return;
      }
      prePlanTmplApi.copyPreplanTmpl(params).then(res => {
        if (res.data.resultCode == 0) {
          this.$message({
            type: "success",
            message: "复制成功!"
          });
          this.dialogEditVisible = false;
          this.$emit("update");
        } else {
          this.$message({
            showClose: true,
            message: res.data.resultMessage,
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-radio__inner {
    border: 0px;
    background-color: inherit;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: none;
  }
  .el-radio {
    height: 100%;
    width: 150px;
    position: absolute;
  }
}
</style>
