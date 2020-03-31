<template>
  <div
    class="main-style"
    v-loading="allfixed"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(204,204,204, 0.5)"
  >
    <div class="top-aside">
      <el-row style="height:calc(100% - 40px);overflow-y: auto">
        <el-form
          :model="planform"
          :rules="rules"
          ref="planform"
          label="right"
          label-width="100px"
          size="small"
        >
          <el-col :span="14" style="padding-right: 1rem;">
            <el-form-item label="预案名称:" prop="name">
              <el-input v-model="planform.name"></el-input>
            </el-form-item>
            <el-form-item label="关键词:" prop="keywords">
              <keywords ref="keywords" :keywords="planform.keywords" @sendKeywords="getKeywords"></keywords>
            </el-form-item>
            <el-form-item label="预案种类:" prop="plantype">
              <el-radio-group v-model="planform.plantype">
                <el-radio label="11">通用预案</el-radio>
                <el-radio label="12">专项预案</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="预案类型:" prop="category">
              <el-radio-group v-model="planform.category">
                <el-radio
                  v-for="item in planTypeArr"
                  :key="item.dictCode"
                  :label="item.dictCode"
                  :value="item.dictCode"
                >{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="有效性:" prop="effective">
              <el-radio-group v-model="planform.effective">
                <el-radio label="1">有效</el-radio>
                <el-radio label="0">无效</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="附件:" v-model="planform.file" prop="file">
              <el-upload
                class="upload-demo"
                single
                :limit="4"
                v-model="upURL"
                accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .png, .jpg, .rar, .zip, .txt"
                :action="fileUploadUrl"
                :on-success="handleSuccessData"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :onError="uploadError"
                :file-list="planform.file"
                :show-file-list="true"
              >
                <el-tooltip class="item" effect="light" content="请上传文件" placement="right-start">
                  <el-link class="upload-style" icon="el-icon-upload" :underline="false"></el-link>
                </el-tooltip>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row style="height:40px">
        <el-button
          style="float:right;margin-right:8px"
          type="primary"
          @click="submitForm('planform')"
          size="small"
        >提交</el-button>
        <el-button
          style="float:right;margin-right:8px"
          size="small"
          @click="resetForm('planform')"
        >取消</el-button>
      </el-row>
    </div>
    <div style="height: 75%; padding: 12px 0px;">
      <planDetail ref="planDetail" :propDatas="propDatas"></planDetail>
    </div>
  </div>
</template>

<script>
import planDetail from "./planDetail";
import keywords from "./keywords";
import { commonApi } from "@/api/commonApi.js";
import { fileUploadUrl, prePlanTmplApi } from "@/api/prePlanTmplApi.js";
import bus from "@/assets/bus.js";
export default {
  data() {
    var checkKeywords = (rule, value, callback) => {
      if (this.planform.keywords === "") {
        callback(new Error("请添加关键字"));
      } else {
        callback();
      }
    };
    var checkName = (rule, value, callback) => {
      this.planform.name = this.planform.name.trim();
      if (this.planform.name === "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };

    return {
      parentId: "",
      allfixed: true,
      fileUploadUrl: fileUploadUrl,
      upURL: "",
      planTypeArr: [],
      planform: {
        name: "",
        plantype: "", //0,1
        keywords: "", //坦克,飞机,大炮
        category: "", //
        effective: "", //0,1
        file: []
      },
      propDatas: {
        type: "", //1新建2 修改，
        changenum: 1,
        id: "" //模板id
      },
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" },
          { validator: checkName }
        ],
        category: [{ required: true, message: "请选择", trigger: "change" }],
        effective: [{ required: true, message: "请选择", trigger: "change" }],
        plantype: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  components: { planDetail, keywords },
  created() {
    bus.$on("showActive", val => {
      if (val.type === 1) {
        this.initforAdd();
        this.allfixed = false;
        this.propDatas.type = 1;
        this.propDatas.changenum++;
      } else if (val.type === 2) {
        this.allfixed = false;
        this.propDatas.type = 2;
        this.propDatas.id = val.id;
        this.propDatas.changenum++;
        this.parentId = val.id;
        this.initforEdit();
      } else {
        this.initforAdd(); //delete 场景同add
        this.allfixed = true;
        this.propDatas.type = 1;
        this.propDatas.changenum++;
      }
    });
    this.doQueryPlanType();
  },
  methods: {
    initforAdd() {
      if (this.$refs["planform"]) {
        this.$refs["planform"].resetFields();
        this.$refs.keywords.dynamicTags = [];
        this.planform.keywords = "";
        this.planform.file = [];
      }
      this.$refs.planDetail.initforAddMode();
    },
    initforEdit() {
      prePlanTmplApi.queryPlanBasicInfo({ planTmplId: this.parentId }).then(
        res => {
          if (res.data.resultCode === 0) {
            this.planform = {
              name: res.data.data.name,
              plantype: res.data.data.planType,
              keywords: res.data.data.keyWords,
              category: res.data.data.planCategory, //
              effective: res.data.data.enabled === true ? "1" : "0", //0,1
              file: res.data.data.fsFileDtoList
                ? res.data.data.fsFileDtoList.map(item => {
                    return {
                      name: item.fileName,
                      url: item.filePath,
                      id: item.id,
                      bizRelId: item.bizRelId
                    };
                  })
                : []
            };
            if (res.data.data.keyWords !== "") {
              this.$refs.keywords.dynamicTags = res.data.data.keyWords.split(",");
            }
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    doQueryPlanType() {
      let params = { parentCode: "1002" }; ////
      commonApi.getDictListByParent(params).then(res => {
        if (res.data.resultCode === 0) {
          this.planTypeArr = res.data.data.data;
        } else {
          this.$message({
            type: "warning",
            message: "加载数据失败，请稍候重试"
          });
        }
      });
    },
    getKeywords(data) {
      this.planform.keywords = data;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.propDatas.type === 1) {
            this.addBasicPlan();
          } else {
            this.modifyBasicPlan();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addBasicPlan() {
      let params = {
        enabled: this.planform.effective === "0" ? false : true,
        fsFileDtoList: this.planform.file.map(item => {
          return {
            fileName: item.name,
            filePath: item.url
          };
        }),
        planType: this.planform.plantype,
        keyWords: this.planform.keywords,
        name: this.planform.name,
        planCategory: this.planform.category
      };
      prePlanTmplApi.addBasisPlanInfo(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.propDatas.id = res.data.data;
            this.propDatas.changenum++;
            bus.$emit("refreshlist");
            this.$message({
              type: "success",
              message: "添加预案基础信息成功！"
            });
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    modifyBasicPlan() {
      let params = {
        id: this.parentId,
        enabled: this.planform.effective === "0" ? false : true,
        planType: this.planform.plantype,
        fsFileDtoList: this.planform.file.map(item => {
          return {
            fileName: item.name,
            filePath: item.url
          };
        }),
        keyWords: this.planform.keywords,
        name: this.planform.name,
        planCategory: this.planform.category
      };
      prePlanTmplApi.updateBasisPlanInfo(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.propDatas.id = this.parentId;
            this.propDatas.changenum++;
            this.$message({
              type: "success",
              message: "修改预案基础信息成功！"
            });
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.keywords.dynamicTags = [];
      this.planform.keywords = "";
      this.planform.file = [];
    },
    handleSuccessData(file, data) {
      if (file.resultCode === 0) {
        this.planform.file.push({
          name: file.data.name,
          url: file.data.Path
        });
        console.log("文件上传成功");
      }
    },
    uploadError() {
      this.$message({
        type: "error",
        message: "上传文件失败"
      });
    },
    handleRemove(file, fileList) {
      console.log("remove", file, fileList);
      this.planform.file = fileList;
    },
    beforeUpload(file) {
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message.error("上传文件大小不能超过 100MB!");
      }
      return isLt100M;
    }
  }
};
</script>
<style lang="scss" scoped>
.form-item {
  height: 40px;
}
.main-style {
  height: 100%;
  font-size: 16px;
  padding: 24px 16px;
}
.top-aside {
  // height: 280px;
  height: 25%;
  padding-bottom: 4px;
  border-bottom: 1px dashed #5e5e5e;
  overflow-y: auto;
}
/deep/ {
  .el-form-item--small.el-form-item {
    margin-bottom: 12x;
  }
  .el-upload-list {
    float: left;
  }
  .el-upload-list__item:first-child {
    margin-top: 0px;
  }
  .upload-style {
    font-size: 20px;
    margin-left: 8px;
    float: left;
    margin-right: 8px;
    margin-bottom: -4px;
  }
  .el-loading-spinner i {
    color: rgba(204, 204, 204, 0.5);
  }
}
</style>