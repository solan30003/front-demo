<template>
  <div class="main-style" v-loading="loading">
    <el-row style="height:calc(100% - 64px);overflow-y: auto">
      <el-row style="height:40px;display: flex;margin-bottom:16px">
        <span style="height: 28px;width:5px; background:#409EFF;display: inline-block;"></span>
        <span style="line-height:28px;height:40px;font-size:18px;margin-left:8px">基本信息</span>
      </el-row>
      <el-form :model="planform" :rules="rules" ref="planform" label="right" label-width="100px" @submit.native.prevent>
        <el-form-item label="预案名称:" prop="name">
          <el-input v-model="planform.name"></el-input>
        </el-form-item>
        <el-form-item label="关键词:" prop="keywords">
          <keywords
            ref="keywords"
            :propdata="propKeywordsData"
            @sendKeywords="getKeywords"
            @senderr="getKeywordsError"
          ></keywords>
        </el-form-item>
        <el-form-item label="预案种类:" prop="category">
          <el-radio-group v-model="planform.category">
            <el-radio
              v-for="item in planCategoryData"
              :key="item.dictCode"
              :label="item.dictCode"
              :value="item.dictCode"
              >{{ item.dictValue }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预案类型:" prop="plantype">
          <el-radio-group v-model="planform.plantype">
            <el-radio v-for="item in planTypeArr" :key="item.dictCode" :label="item.dictCode" :value="item.dictCode">{{
              item.dictValue
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效性:" prop="effective">
          <el-radio-group v-model="planform.effective">
            <el-radio label="1">有效</el-radio>
            <el-radio label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="附件:" v-model="planform.file" prop="file">
          <el-upload
            class="upload-demo"
            single
            :limit="5"
            :on-exceed="exceed"
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
      </el-form>
    </el-row>
    <el-row style="height:64px">
      <el-button style="float:right;margin-right:8px" @click="resetForm('planform')">返回</el-button>
      <el-button style="float:right;margin-right:8px" type="primary" @click="submitForm('planform')">{{
        submitBtn
      }}</el-button>
    </el-row>
  </div>
</template>

<script>
import keywords from "./keywords";
import { commonApi } from "@/api/commonApi.js";
import { fileUploadUrl, prePlanTmplApi } from "@/api/prePlanTmplApi.js";
import bus from "@/assets/bus.js";
export default {
  data() {
    var checkKeywords = (rule, value, callback) => {
      if (this.keywordsError !== "") {
        callback(new Error(this.keywordsError));
      }
      callback();
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
      modelId: "",
      loading: false,
      parentId: "",
      fileUploadUrl: fileUploadUrl,
      upURL: "",
      keywords: "",
      planTypeArr: [],
      planCategoryData: [],
      keywordsError: "",
      propKeywordsData: {
        dynamicTags: []
      },
      submitBtn: "",
      planform: {
        name: "",
        plantype: "", //0,1
        keywords: "", //坦克,飞机,大炮
        keywordList: [],
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
        keywords: [{ validator: checkKeywords }],
        category: [{ required: true, message: "请选择", trigger: "change" }],
        effective: [{ required: true, message: "请选择", trigger: "change" }],
        plantype: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  components: { keywords },
  created() {
    bus.$on("showActive", this.activeHandle);
    this.doQueryPlanType();
    this.doQueryPlanCategoryList();
  },
  beforeDestroy() {
    bus.$off("showActive", this.activeHandle);
  },
  methods: {
    activeHandle(val) {
      if (val.type === 1) {
        this.initforAdd();
        this.submitBtn = "保存";
        this.propDatas.type = 1;
        this.propDatas.changenum++;
      } else if (val.type === 2) {
        this.propDatas.type = 2;
        this.submitBtn = "修改";
        this.propDatas.id = val.id;
        this.propDatas.changenum++;
        this.parentId = val.id;
        this.initforEdit();
      } else {
        this.initforAdd(); //delete 场景同add
        this.propDatas.type = 1;
        this.propDatas.changenum++;
      }
    },
    doQueryPlanCategoryList() {
      const params = {
        parentCode: "1001",
        pageIndex: 0,
        pageSize: 50
      };
      this.loading = true;
      commonApi
        .getDictListByParent(params)
        .then(d => {
          this.loading = false;
          if (d.data.resultCode === 0) {
            this.planCategoryData = d.data.data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    initforAdd() {
      if (this.$refs["planform"]) {
        this.$refs["planform"].resetFields();
        this.propKeywordsData = {
          dynamicTags: []
        };
        this.planform.file = [];
      }
      bus.$emit("init", { type: 1, data: this.propDatas });
    },
    initforEdit() {
      this.loading = true;
      prePlanTmplApi.queryPlanBasicInfo({ planTmplId: this.parentId }).then(
        res => {
          this.loading = false;
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
            if (res.data.data.keywordList && res.data.data.keywordList.length > 0) {
              this.propKeywordsData = {
                dynamicTags: res.data.data.keywordList
              };
            } else {
              this.propKeywordsData = {
                dynamicTags: []
              };
            }
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.loading = false;
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    doQueryPlanType() {
      let params = { parentCode: "1002" };
      this.loading = true;
      commonApi
        .getDictListByParent(params)
        .then(res => {
          this.loading = false;
          if (res.data.resultCode === 0) {
            this.planTypeArr = res.data.data.data;
          } else {
            this.$message({
              type: "warning",
              message: "加载数据失败，请稍候重试"
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getKeywords(data) {
      this.planform.keywordList = data;
    },
    getKeywordsError(data) {
      if (data.status) {
        this.keywordsError = data.message;
        this.planform.keywords = this.planform.keywords + "err";
        this.$refs["planform"].validateField("keywords");
      } else {
        this.keywordsError = "";
        this.planform.keywords = this.planform.keywords + "normal";
        this.$refs["planform"].validateField("keywords");
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.propDatas.type === 1 && this.modelId == "") {
            this.addBasicPlan();
          } else {
            this.modifyBasicPlan();
          }
        } else {
          return false;
        }
      });
    },
    addBasicPlan() {
      this.loading = true;
      let params = {
        enabled: this.planform.effective === "0" ? false : true,
        fsFileDtoList: this.planform.file.map(item => {
          return {
            fileName: item.name,
            filePath: item.url
          };
        }),
        planType: this.planform.plantype,
        keywordList: this.planform.keywordList,
        name: this.planform.name,
        planCategory: this.planform.category,
        diPlanTmpIItemDtoList: this.$store.state.modelData.findTmplInitDetails
      };
      prePlanTmplApi.addBasisPlanInfo(params).then(
        res => {
          this.loading = false;
          if (res.data.resultCode === 0) {
            this.propDatas.id = res.data.data;
            this.propDatas.changenum++;
            bus.$emit("refreshlist");
            this.$message({
              type: "success",
              message: "添加预案基础信息成功！"
            });
            //把id存起来
            this.modelId = res.data.data;
            this.$store.commit("ADD_MODEL_ID", this.modelId);
            this.$store.commit("CHANGE_BUTTON", false);

            ////添加基础信息成功后
            bus.$emit("init", { type: 3, data: this.propDatas });
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.loading = false;
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    modifyBasicPlan() {
      this.loading = true;
      let params = {
        id: this.parentId ? this.parentId : this.modelId,
        enabled: this.planform.effective === "0" ? false : true,
        planType: this.planform.plantype,
        fsFileDtoList: this.planform.file.map(item => {
          return {
            fileName: item.name,
            filePath: item.url
          };
        }),
        keywordList: this.planform.keywordList,
        name: this.planform.name,
        planCategory: this.planform.category
      };
      prePlanTmplApi.updateBasisPlanInfo(params).then(
        res => {
          this.loading = false;
          if (res.data.resultCode === 0) {
            this.propDatas.id = this.parentId ? this.parentId : this.$store.state.modelData.modelId;
            this.propDatas.changenum++;
            bus.$emit("init", { type: 2, data: this.propDatas });
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
          this.loading = false;
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    resetForm(formName) {
      // let Base64 = require("js-base64").Base64;
      // var baseStr = Base64.encode("");
      this.$confirm("如果有未保存的修改，将被丢弃，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
      // this.$refs[formName].resetFields();
      // this.$refs.keywords.dynamicTags = [];
      // this.planform.file = [];
    },
    handleSuccessData(file, data) {
      if (file.resultCode === 0) {
        this.planform.file.push({
          name: file.data.name,
          url: file.data.Path
        });
      }
    },
    uploadError() {
      this.$message({
        type: "error",
        message: "上传文件失败"
      });
    },
    exceed() {
      this.$message.error("最多只能上传5个文件");
    },
    handleRemove(file, fileList) {
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
.main-style {
  height: 100%;
  font-size: 16px;
}
/deep/ {
  .el-upload-list__item:first-child {
    margin-top: 4px;
  }
  .el-form-item__label {
    font-size: 16px;
  }
  .el-radio__label {
    font-size: 16px;
    padding-left: 10px;
  }
  .upload-style {
    font-size: 20px;
    margin-left: 8px;
    float: left;
    margin-right: 8px;
    margin-bottom: -4px;
  }
}
</style>
