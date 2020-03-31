<template>
  <div>
    <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">{{
      tag
    }}</el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-tag v-else-if="addVisible" class="button-new-tag" @click="showInput">+</el-tag>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textarea2: "",
      dynamicTags: [],
      inputVisible: false,
      addVisible: true,
      inputValue: ""
    };
  },
  props: {
    keywords: {
      type: String
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.keywords !== "") {
      this.dynamicTags = this.keywords.split(",");
    }
  },
  watch: {
    dynamicTags(val) {
      if (this.dynamicTags.length >= 5) {
        this.addVisible = false;
      } else {
        this.$emit("sendKeywords", this.dynamicTags.join(","));
        this.addVisible = true;
      }
    },
    inputValue(val) {
      if (val.length > 8) {
        this.$message({
          showClose: true,
          message: "关键在1-8个字符之间，请重新输入!",
          type: "error"
        });
        this.inputValue = "";
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue.length > 8 || inputValue === "") {
        return;
      }
      console.log("sssssssssssssssssssssssinputValue", inputValue);
      if (this.dynamicTags.indexOf(inputValue) !== -1) {
        this.$message({
          showClose: true,
          message: "关键词重复，请重新输入!",
          type: "error"
        });
        this.inputValue = "";
      } else {
        this.dynamicTags.push(inputValue);
      }

      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
