<template>
  <div style="height:100%;" v-loading="loading">
    <el-row style="height:40px;display: flex;margin-bottom:16px">
      <span style="height: 28px;width:5px; background:#409EFF;display: inline-block;"></span>
      <span style="line-height:28px;height:40px;font-size:18px;margin-left:8px">详细信息</span>
    </el-row>
    <div class="left-aside">
      <div style>
        <el-button type="info" size="small" disabled>预案详情</el-button>
        <div class="content-style">
          <el-button
            v-for="(item, index) in dynamicDetail"
            :key="index"
            size="small"
            :class="item.status === 0 ? '' : 'a-active'"
            @click="enableEditDetail(index)"
            :disabled="buttondisAble"
          >
            <div style="width: 120px;display:flex;">
              <el-col :span="21" style="padding-left:12px">
                <span style="display:block;white-space:normal;word-wrap: break-word;word-break: break-all;">{{
                  item.name
                }}</span>
              </el-col>
              <el-col :span="3" style="margin:auto">
                <i class="el-icon-close icon-close-style" @click="delOneDetail(item)"></i>
              </el-col>
            </div>
          </el-button>
        </div>
        <el-button size="small" @click="addOneDetail">+</el-button>
      </div>
      <div style="margin-top:8px">
        <el-button type="info" size="small" disabled>处置过程</el-button>
        <div class="content-style">
          <el-button
            v-for="(item, index) in dynamicProcess"
            :key="index"
            size="small"
            :class="item.status === 0 ? '' : 'a-active'"
            @click="enableEditProcess(index)"
            :disabled="buttondisAble"
          >
            <div style="width: 120px;display:flex;">
              <el-col :span="22" style="padding-left:12px">
                <span style="display:block;white-space:normal;word-wrap: break-word;word-break: break-all;">{{
                  item.name
                }}</span>
              </el-col>
              <el-col :span="2" style="margin:auto">
                <i class="el-icon-close icon-close-style" @click="delOneProcess(item)"></i>
              </el-col>
            </div>
          </el-button>
        </div>

        <el-button size="small" @click="addOneProcess">+</el-button>
      </div>
    </div>
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" :append-to-body="true" width="400px">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label="right"
        label-width="100px"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="名称:" prop="name">
          <el-input width="250px" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button style="margin-right:8px" type="primary" @click="submitForm('form')" size="mini">提交</el-button>
          <el-button style="margin-right:8px" size="mini" @click="resetForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="right-aside">
      <toolBar ref="toolBarArea" :propdata="propDatasfortoolbar"></toolBar>
    </div>
  </div>
</template>

<script>
import toolBar from "./toolBar";
import bus from "@/assets/bus.js";
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
      propDatas: {},
      loading: false,
      propDatasfortoolbar: {
        initaddflag: true,
        initeditflag: false
      },
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
  computed: {
    buttondisAble() {
      return this.$store.state.modelData.buttondisAble;
    }
  },
  props: {},
  watch: {},
  created() {
    bus.$on("init", this.initHandle);
    bus.$on("showActive", this.activeHandle);
  },
  //用eventbus 一定要记得监听后销毁
  beforeDestroy() {
    bus.$off("showActive", this.activeHandle);
    bus.$off("init", this.initHandle);
  },
  methods: {
    activeHandle(val) {
      if (val.type && val.type === 1) {
        //新建
        this.propDatas.type = 1;
        this.propDatas.id = null;
        this.initforAddMode();
      } else if (val.type && val.type === 2) {
        //修改 data
        this.propDatas.id = val.id;
        this.initforEditMode();
      } else {
        //新建成功之后
        this.propDatas = val;
        this.initforAddEnd();
      }
    },
    initHandle(val) {
      if (val.type && val.type === 1) {
        //新建
        this.propDatas = val.data;
        this.propDatas.id = null;
        this.initforAddMode();
      } else if (val.type && val.type === 2) {
        //修改 data
        this.propDatas = val.data;
        this.initforEditMode();
      } else {
        //新建成功之后
        this.propDatas = val.data;
        this.initforAddEnd();
      }
    },
    async initforAddMode() {
      let res = await prePlanTmplApi.findTmplInitDetails();
      this.$store.dispatch("dispatch_MODEL_DATA", res.data.data.planTmplItemInitList);
      this.dynamicDetail = res.data.data.planTmplItemInitList
        .filter(e => e.infoType == 1)
        .map(item => {
          return { id: item.planTmplItemId, name: item.name, status: 0 };
        });
      this.dynamicProcess = res.data.data.planTmplItemInitList
        .filter(e => e.infoType == 2)
        .map(item => {
          return { id: item.planTmplItemId, name: item.name, status: 0 };
        });
      this.propDatasfortoolbar = {
        initaddflag: true,
        initeditflag: false
      };
    },
    initforAddEnd() {
      this.dynamicDetail = [];
      this.dynamicProcess = [];
      //查询详情
      // this.loading = true;
      prePlanTmplApi.queryPlanStageList({ planTmplId: this.$store.state.modelData.modelId, infoType: "" }).then(res => {
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
          if (JSON.stringify(res.data.data) == "{}") {
            this.propDatasfortoolbar = {
              initaddflag: true,
              initeditflag: false
            };
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
    initforEditMode() {
      this.dynamicDetail = [];
      this.dynamicProcess = [];
      //查询详情
      // this.loading = true;
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
          if (JSON.stringify(res.data.data) == "{}") {
            this.propDatasfortoolbar = {
              initaddflag: true,
              initeditflag: false
            };
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
      //查找用户选中项 刷新后用户选中项 不变
      let selectedItemId = this.dynamicDetail.find(item => item.status === 1)
        ? this.dynamicDetail.find(item => item.status === 1).id
        : this.dynamicDetail.find(item => item.status === 1)
        ? this.dynamicProcess.find(item => item.status === 1).id
        : null;
      this.dynamicDetail = [];
      this.dynamicProcess = [];

      //查询详情
      this.loading = true;
      prePlanTmplApi.queryPlanStageList({ planTmplId: this.propDatas.id, infoType: "" }).then(res => {
        this.loading = false;
        if (res.data.resultCode === 0) {
          if (res.data.data["1"] && res.data.data["1"].length > 0) {
            this.dynamicDetail = res.data.data["1"].map((item, index) => {
              if (selectedItemId === item.id) {
                return {
                  id: item.id,
                  name: item.name,
                  status: 1
                };
              } else {
                return {
                  id: item.id,
                  name: item.name,
                  status: 0
                };
              }
            });
          }
          if (res.data.data["2"] && res.data.data["2"].length > 0) {
            this.dynamicProcess = res.data.data["2"].map((item, index) => {
              if (selectedItemId === item.id) {
                return {
                  id: item.id,
                  name: item.name,
                  status: 1
                };
              } else {
                return {
                  id: item.id,
                  name: item.name,
                  status: 0
                };
              }
            });
          }
          if (
            !this.dynamicDetail.find(item => item.status === 1) &&
            !this.dynamicProcess.find(item => item.status === 1)
          ) {
            this.propDatasfortoolbar = {
              initaddflag: true,
              initeditflag: false
            };
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
      if (!this.$store.state.modelData.buttondisAble) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.ajaxDeleteDetail(onedata);
          })
          .catch(() => {});
      }
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
      if (this.propDatas.id === null) {
        this.$message({
          type: "warning",
          message: "请先创建预案基本信息"
        });
        return;
      }
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogtitle = "添加预案详情";
      this.dialogVisible = true;
    },
    addOneProcess() {
      if (this.propDatas.id === null) {
        this.$message({
          type: "warning",
          message: "请先创建预案基本信息"
        });
        return;
      }
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
          this.loading = true;
          if (this.dialogtitle === "添加预案详情") {
            let params = {
              planTmplId: this.propDatas.id,
              infoType: 1,
              name: this.form.name
            };
            prePlanTmplApi.addDatailorProcess(params).then(
              res => {
                this.loading = false;
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
                this.loading = false;
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
                this.loading = false;
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
                this.loading = false;
                this.$message({
                  message: err,
                  type: "error"
                });
              }
            );
          }
        } else {
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
      this.propDatasfortoolbar = {
        type: this.propDatas.type, //新建还是修改
        planid: this.propDatas.id,
        parent: this.dynamicDetail[index], //预案详情处置过程,
        stageId: this.stageId, ////预案详情处置过程id,
        stageType: 1,
        initaddflag: false,
        initeditflag: true
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
      this.propDatasfortoolbar = {
        type: this.propDatas.type, //新建还是修改
        planid: this.propDatas.id,
        parent: this.dynamicDetail[index], //预案详情处置过程,
        stageId: this.stageId, ////预案详情处置过程id,
        stageType: 2,
        initaddflag: false,
        initeditflag: true
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
    font-size: 16px;
    font-weight: 500;
  }
  .el-button + .el-button {
    margin-left: 0px;
    margin-top: 8px;
  }
  .el-button--small,
  .el-button--small.is-round {
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
  // height: 100%;
  height: calc(100% - 80px);
  float: left;
  width: 160px;
  padding: 8px 12px 0px 0px;
  overflow-y: auto;
}
.right-aside {
  height: 100%;
  float: left;
  padding: 0px 0px 0px 12px;
  width: calc(100% - 186px);
}
.icon-close-style {
  font-size: 14px;
  font-weight: 500;
}
.content-style {
  // max-height: calc(100% - 130px);
  // overflow-y: auto;
  overflow-x: hidden;
  margin: 8px 0px;
}
</style>
