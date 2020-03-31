<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{
      tag
      }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-tag v-else-if="addVisible" class="button-new-tag" @click="showInput">+</el-tag>
  </div>
</template>

<script>
import { utils } from "@/utils/utils.js";
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
    propdata: {
      type: Object
    }
  },
  computed: {},
  watch: {},
  created() {},
  watch: {
    propdata: {
      handler: function(val) {
        this.dynamicTags = val.dynamicTags;
      },
      immediate: true,
      deep: true
    },
    dynamicTags(val) {
      if (this.dynamicTags.length >= 4) {
        this.addVisible = false;
        this.$emit("sendKeywords", this.dynamicTags);
      } else {
        this.$emit("sendKeywords", this.dynamicTags);
        this.addVisible = true;
      }
    },
    inputValue(val) {
      if (val.length > 8) {
        this.$emit("senderr", { message: "关键在1-8个字符之间，请重新输入!" });
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
      this.inputValue = this.inputValue.trim();
      let inputValue = this.inputValue;
      if (inputValue === "") {
        this.inputVisible = false;
        return;
      }
      if (this.dynamicTags.indexOf(inputValue) !== -1) {
        this.$emit("senderr", { status: true, message: "关键词重复，请重新输入!" });
        this.inputVisible = true;
      } else if (inputValue.length > 8) {
        this.$emit("senderr", { status: true, message: "关键在1-8个字符之间，请重新输入!" });
        this.inputVisible = true;
      } else {
        this.$emit("senderr", { status: false });
        this.dynamicTags.push(inputValue);
        this.inputVisible = false;
        this.inputValue = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  vertical-align: bottom;
}
</style>
