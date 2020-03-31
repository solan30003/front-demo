<template>
  <div style="height:100%; border-bottom: 1px dashed #5e5e5e;" v-loading="loading">
    <div class="left-aside">
      <div style="height: 50%">
        <el-button type="info" size="mini" disabled>预案详情</el-button>
        <div class="content-style">
          <el-button
            v-for="(item, index) in dynamicDetail"
            :key="index"
            size="mini"
            :class="item.status === 0 ? '' : 'a-active'"
            @click="enableEditDetail(index)"
          >
            <div style="width: 120px">
              <el-col :span="21" style="padding-left:24px">
                <span style="display:block;white-space:normal;word-wrap: break-word;word-break: break-all;">{{
                  item.name
                }}</span>
              </el-col>
              <el-col :span="3">
                <i class="el-icon-close icon-close-style" @click="delOneDetail(item)"></i>
              </el-col>
            </div>
          </el-button>
        </div>
        <el-button size="mini" @click="addOneDetail">+</el-button>
      </div>
      <div style="height: 50%">
        <el-button type="info" size="mini" disabled>处置过程</el-button>
        <div class="content-style">
          <el-button
            v-for="(item, index) in dynamicProcess"
            :key="index"
            size="mini"
            :class="item.status === 0 ? '' : 'a-active'"
            @click="enableEditProcess(index)"
          >
            <div style="width: 120px;">
              <el-col :span="21" style="padding-left:24px">
                <span style="display:block;white-space:normal;word-wrap: break-word;word-break: break-all;">{{
                  item.name
                }}</span>
              </el-col>
              <el-col :span="3">
                <i class="el-icon-close icon-close-style" @click="delOneProcess(item)"></i>
              </el-col>
            </div>
          </el-button>
        </div>

        <el-button size="mini" @click="addOneProcess">+</el-button>
      </div>
    </div>
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" :append-to-body="true" width="25%">
      <el-form :model="form" :rules="rules" ref="form" label="right" label-width="100px" size="small">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-button style="margin-right:8px" type="primary" @click="submitForm('form')" size="small">提交</el-button>
        <el-button style="margin-right:8px" size="small" @click="resetForm('form')">取消</el-button>
      </el-form>
    </el-dialog>
    <div class="right-aside">
      <toolBar ref="toolBarArea" :propDatasfortoolbar="propDatasfortoolbar"></toolBar>
    </div>
  </div>
</template>

<script>
import toolBar from "./toolBar";
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";

export default {
  data() {
    var checkName = (rule, value, callback) => {
      this.form.name = this.form.name.trim();
      if (this.form.name === "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: ""
      },
      loading: false,
      propDatasfortoolbar: {},
      dialogtitle: "",
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
          { validator: checkName }
        ]
      },
      dynamicDetail: [],
      dynamicProcess: [],
      stageId: ""
    };
  },
  components: { toolBar },
  props: {
    propDatas: {
      type: Object
    }
  },
  watch: {
    propDatas: {
      handler(newdata, olddata) {
        if (newdata.type && newdata.type === 1) {
          //新建
          this.initforAddMode();
        } else if (newdata.type && newdata.type === 2) {
          //修改
          //newdata.id 模板id
          this.initforEditMode();
        }
      },
      deep: true
    }
  },
  created() {},
  methods: {
    async initforAddMode() {
      this.dynamicDetail = [];
      this.dynamicProcess = [];
      this.$refs.toolBarArea.initforAdd();
    },
    initforEditMode() {
      this.dynamicDetail = [];
      this.dynamicProcess = [];
      //查询详情
      this.loading = true;
      prePlanTmplApi.queryPlanStageList({ planTmplId: this.propDatas.id, infoType: "" }).then(res => {
        this.loading = false;
        if (res.data.resultCode === 0) {
          if (res.data.data["1"] && res.data.data["1"].length > 0) {
            this.dynamicDetail = res.data.data["1"].map((item, index) => {
              return index === 0
                ? {
                    id: item.id,
                    name: item.name,
                    status: 1
                  }
                : {
                    id: item.id,
                    name: item.name,
                    status: 0
                  };
            });

            this.enableEditDetail(0);
          }
          if (res.data.data["2"] && res.data.data["2"].length > 0) {
            if (this.dynamicDetail.length > 0) {
              this.dynamicProcess = res.data.data["2"].map((item, index) => {
                return {
                  id: item.id,
                  name: item.name,
                  status: 0
                };
              });
            } else {
              this.dynamicProcess = res.data.data["2"].map((item, index) => {
                return index === 0
                  ? {
                      id: item.id,
                      name: item.name,
                      status: 1
                    }
                  : {
                      id: item.id,
                      name: item.name,
                      status: 0
                    };
              });
              this.enableEditProcess(0);
            }
          }
        } else {
          this.loading = false;
          this.$message({
            type: "error",
            message: "查询过程失败"
          });
        }
      });
    },
    refreshList() {
      this.dynamicDetail = [];
      this.dynamicProcess = [];
      //查询详情
      this.loading = true;
      prePlanTmplApi.queryPlanStageList({ planTmplId: this.propDatas.id, infoType: "" }).then(res => {
        this.loading = false;
        if (res.data.resultCode === 0) {
          if (res.data.data["1"] && res.data.data["1"].length > 0) {
            this.dynamicDetail = res.data.data["1"].map((item, index) => {
              return {
                id: item.id,
                name: item.name,
                status: 0
              };
            });
          }
          if (res.data.data["2"] && res.data.data["2"].length > 0) {
            this.dynamicProcess = res.data.data["2"].map((item, index) => {
              return {
                id: item.id,
                name: item.name,
                status: 0
              };
            });
          }
        } else {
          this.loading = false;
          this.$message({
            type: "error",
            message: "查询过程失败"
          });
        }
      });
    },
    delOneDetail(onedata) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajaxDeleteDetail(onedata);
        })
        .catch(() => {});
    },
    ajaxDeleteDetail(onedata) {
      let params = { planItemId: onedata.id, infoType: 1 };
      prePlanTmplApi.deletePreplanItem1st(params).then(res => {
        if (res.data.resultCode === 0) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.refreshList();
        } else {
          this.$message({
            type: "warning",
            message: "删除失败，请稍候重试。"
          });
        }
      });
    },
    delOneProcess(onedata) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajaxDeleteProcess(onedata);
        })
        .catch(() => {});
    },
    ajaxDeleteProcess(onedata) {
      let params = { planItemId: onedata.id, infoType: 2 };
      prePlanTmplApi.deletePreplanItem1st(params).then(res => {
        if (res.data.resultCode === 0) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.refreshList();
        } else {
          this.$message({
            type: "warning",
            message: "删除失败，请稍候重试。"
          });
        }
      });
    },
    addOneDetail() {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogtitle = "添加预案详情";
      this.dialogVisible = true;
    },
    addOneProcess() {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogtitle = "添加处置过程";
      this.dialogVisible = true;
    },
    onSubmitDetail() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogtitle === "预案详情") {
            let params = {
              planTmplId: this.propDatas.id,
              infoType: 1,
              name: this.form.name
            };
            prePlanTmplApi.addDatailorProcess(params).then(
              res => {
                if (res.data.resultCode === 0) {
                  this.stageId = res.data.data;
                  this.$message({
                    message: "添加成功！",
                    type: "success"
                  });
                  this.dialogVisible = false;
                  this.form.name = "";
                  this.refreshList();
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
          } else {
            let params = {
              planTmplId: this.propDatas.id,
              infoType: 2,
              name: this.form.name
            };
            prePlanTmplApi.addDatailorProcess(params).then(
              res => {
                if (res.data.resultCode === 0) {
                  this.stageId = res.data.data;
                  this.$message({
                    message: "添加成功！",
                    type: "success"
                  });
                  this.dialogVisible = false;
                  this.form.name = "";
                  this.refreshList();
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    enableEditDetail(index) {
      this.stageId = this.dynamicDetail[index].id;
      for (let one of this.dynamicDetail) {
        if (one === this.dynamicDetail[index]) {
          one.status = 1;
        } else {
          one.status = 0;
        }
      }
      for (let one of this.dynamicProcess) {
        one.status = 0;
      }

      this.$refs.toolBarArea.toolsList = [
        { id: "1", name: "指挥机构", disable: false },
        { id: "2", name: "单位指令", disable: true },
        { id: "3", name: "人员指令", disable: true },
        { id: "4", name: "文本", disable: false }
      ];
      this.propDatasfortoolbar = {
        type: this.propDatas.type, //新建还是修改
        planid: this.propDatas.id,
        parent: this.dynamicDetail[index], //预案详情处置过程,
        stageId: this.stageId, ////预案详情处置过程id,
        stageType: 1
      };
    },
    enableEditProcess(index) {
      this.stageId = this.dynamicProcess[index].id;
      for (let one of this.dynamicProcess) {
        if (one === this.dynamicProcess[index]) {
          one.status = 1;
        } else {
          one.status = 0;
        }
      }
      for (let one of this.dynamicDetail) {
        one.status = 0;
      }
      this.$refs.toolBarArea.toolsList = [
        { id: "1", name: "指挥机构", disable: true },
        { id: "2", name: "单位指令", disable: false },
        { id: "3", name: "人员指令", disable: false },
        { id: "4", name: "文本", disable: true }
      ];
      this.propDatasfortoolbar = {
        type: this.propDatas.type, //新建还是修改
        planid: this.propDatas.id,
        parent: this.dynamicDetail[index], //预案详情处置过程,
        stageId: this.stageId, ////预案详情处置过程id,
        stageType: 2
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.a-active {
  background: rgba(25, 137, 250, 0.8);
  color: #fff;
}
/deep/ {
  .el-button {
    // width: 140px;
    font-size: 14px;
    font-weight: 500;
  }
  .el-button + .el-button {
    margin-left: 0px;
    margin-top: 8px;
  }
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 0px;
    width: 140px;
  }
  .el-button--info.is-disabled,
  .el-button--info.is-disabled:active,
  .el-button--info.is-disabled:focus,
  .el-button--info.is-disabled:hover {
    width: 140px;
    color: #fff;
    background-color: rgba(107, 107, 107, 1);
    border-color: rgba(107, 107, 107, 1);
  }
}
.left-aside {
  height: 100%;
  float: left;
  width: 160px;
  padding: 0px 12px 0px 24px;
  border-right: 1px dashed #5e5e5e;
}
.right-aside {
  height: 100%;
  float: left;
  padding: 0px 0px 0px 12px;
  width: calc(100% - 210px);
}
.icon-close-style {
  font-size: 14px;
  font-weight: 500;
}
.content-style {
  max-height: calc(100% - 130px);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 8px 0px;
}
</style>
