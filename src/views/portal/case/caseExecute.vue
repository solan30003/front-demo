<template>
  <div class="main-container">
    <gis-map></gis-map>
    <div class="item-box">
      <!-- 左边-->
      <!--预案名称-->
      <div class="first-title">
        {{ feedbacksListDetailData.name || "--" }}<em>[状态：{{ feedbacksListDetailData.statusName }}]</em>
      </div>

      <el-divider></el-divider>

      <!--预案详情-->
      <div class="item-top" v-loading="loadingFirst">
        <el-tabs
          v-if="feedbacksListDetailData.preplanExecInstcItemList1.length"
          v-model="activeName1"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item, index) in feedbacksListDetailData.preplanExecInstcItemList1"
            :key="index"
            :label="item.name"
            :name="index.toString()"
          >
            <div class="content-box">
              <p v-if="item.preplanExecInstcItemSubList.length > 0" style="text-align: right;margin-right: 10px;">
                <el-button
                  :disabled="isOver"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="editOneSub(item)"
                ></el-button>
              </p>
              <el-row
                v-if="item.preplanExecInstcItemSubList.length > 0"
                v-for="(itemChild, index) in item.preplanExecInstcItemSubList"
                :key="index"
              >
                <!--指挥结构-->
                <el-col v-if="itemChild.configCategory == 1" :span="24" style="text-align:left">
                  <div class="name" :title="itemChild.name + ':' + itemChild.orgName + ' ' + itemChild.executorName">
                    <ul class="caseList">
                      <li>
                        <strong>{{ index + 1 }}、{{ itemChild.name || "--" }}：</strong>{{ itemChild.orgName }}
                        {{ itemChild.executorName }}
                      </li>
                      <li><b>人员：</b>{{ itemChild.receiverStaffNames }}</li>
                      <li><b>备注：</b>{{ itemChild.remark || "--" }}</li>
                    </ul>
                  </div>
                </el-col>
                <!--文本-->
                <el-col
                  v-if="itemChild.configCategory == 4"
                  :span="24"
                  style="text-align:left"
                  :title="itemChild.content"
                >
                  <p class="remark" :title="itemChild.content">
                    <b>{{ index + 1 }}、</b>
                    {{ itemChild.content || "--" }}
                  </p>
                </el-col>
              </el-row>

              <el-row v-if="item.preplanExecInstcItemSubList.length == 0">
                <p class="remark">暂无数据</p>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!--没有预案详情-->
        <p v-if="feedbacksListDetailData.preplanExecInstcItemList1.length == 0">预案详情：暂无数据</p>
      </div>
      <div class="download-area">
        <h4>
          <span>附件</span>
        </h4>
        <ul>
          <li v-for="(item, index) in feedbacksListDetailData.attachments" :key="index">
            {{ index + 1 }}、
            <a :href="item.downloadUrl">{{ item.fileName }}</a>
          </li>
        </ul>
      </div>
      <!--处置过程-->
      <div class="item-bottom" style>
        <p v-if="feedbacksListDetailData.preplanExecInstcItemList2.length == 0">处置过程：暂无数据</p>

        <el-tabs
          v-if="feedbacksListDetailData.preplanExecInstcItemList2.length > 0"
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane label="处置过程" name="first">
            <el-row>
              <el-col :span="8" v-loading="loadingSecond">
                <div class="item-bottom-left">
                  <el-steps
                    direction="vertical"
                    space="50px"
                    :active="feedbacksListDetailData.preplanExecInstcItemList2Active"
                  >
                    <el-step
                      v-for="(item, index) in feedbacksListDetailData.preplanExecInstcItemList2"
                      :key="index"
                      :title="item.name"
                      :icon="iconStep[item.status]"
                      @click.native="queryItemsSecondFun(item, index)"
                      style="cursor: pointer;"
                    >
                      <template slot="icon" v-if="(item.status == 0 || item.status == 2) && !isOver">
                        <el-dropdown @command="changeStatusFun">
                          <span class="ico-step" :class="iconStep[item.status]"></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              :command="{ status: 2, planInstcItemId: item.planInstcItemId, activeNode: index }"
                              >处置中</el-dropdown-item
                            >
                            <el-dropdown-item
                              :command="{ status: 8, planInstcItemId: item.planInstcItemId, activeNode: index }"
                              >已完成</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </el-dropdown>
                      </template>
                    </el-step>
                  </el-steps>
                  <!-- <div class="oper-box">
                      <p @click="changeStatusFun(2)">处置中</p>
                      <p @click="changeStatusFun(8)">已完成</p>
                  </div>-->
                </div>
              </el-col>
              <el-col :span="16" v-loading="loadingThird">
                <div class="item-bottom-right">
                  <div class="item-bottom-right-c">
                    <h6>l {{ itemsSecondArrName }}</h6>
                    <div v-if="itemsSecondArr.length > 0" v-for="(item, index) in itemsSecondArr" :key="index">
                      <div v-if="item.configCategory == 2">
                        <ul class="caseList">
                          <li>
                            <strong>{{ index + 1 }}、</strong>{{ item.orgName }} {{ item.executorName }}
                          </li>
                          <li><b>指令内容：</b>{{ item.content || "--" }}</li>
                          <li><b>出动人员：</b>{{ item.receiverStaffNames || "--" }}</li>
                          <li><b>出动人数：</b>{{ item.actorOutNum || "--" }}</li>
                          <li><b>备勤人数：</b>{{ item.actorInNum || "--" }}</li>
                          <li><b>到场限时：</b>{{ item.arriveTimeLimit || "--" }}</li>
                        </ul>
                      </div>
                      <div v-if="item.configCategory == 3">
                        <ul class="caseList">
                          <li>
                            <strong>{{ index + 1 }}、</strong>{{ item.orgName }} {{ item.executorName }}
                          </li>
                          <li><b>指令内容：</b>{{ item.content || "--" }}</li>
                          <li><b>出动人员：</b>{{ item.receiverStaffNames || "--" }}</li>
                          <li><b>到场限时：</b>{{ item.arriveTimeLimit || "--" }}</li>
                        </ul>
                      </div>
                      <p class="btn-box">
                        <el-dropdown @command="updateFeedbacksFun">
                          <el-button type="primary" icon="el-icon-setting" circle></el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :disabled="isOver || isFinish" :command="'edit,' + item.planInstcItemId"
                              >编辑</el-dropdown-item
                            >
                            <el-dropdown-item :disabled="isOver || isFinish" :command="'add,' + item.planInstcItemId"
                              >添加反馈</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </el-dropdown>
                      </p>
                    </div>
                    <div v-if="itemsSecondArr.length == 0">
                      <p>暂无数据</p>
                      <p class="btn-box">
                        <el-dropdown @command="updateFeedbacksFun">
                          <el-button type="primary" icon="el-icon-setting" circle></el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :disabled="isOver || isFinish" :command="'add,'"
                              >添加反馈</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </el-dropdown>
                      </p>
                    </div>
                  </div>

                  <div class="item-bottom-right-c">
                    <h6>l 处置进度</h6>
                    <p
                      v-if="itemsThirdArr.length > 0"
                      v-for="(item, index) in itemsThirdArr"
                      class="feedList"
                      :key="index"
                      :title="item.remark"
                    >
                      <b>{{ index + 1 }}、</b>
                      {{ item.remark }}
                      <el-button
                        title="删除反馈"
                        type="text"
                        class="el-icon-delete"
                        style="color: #f56c6c;float: right;margin-left:10px;"
                        @click="deleteFeedbacksFunOne(item)"
                        :disabled="isOver || isFinish"
                      ></el-button>
                      <el-button
                        title="修改反馈"
                        type="text"
                        class="el-icon-edit"
                        style="color: #409EFF;float: right;margin-left:10px;"
                        @click="updateFeedbacksFunOne(item)"
                        :disabled="isOver || isFinish"
                      ></el-button>
                    </p>
                    <p v-if="itemsThirdArr.length == 0">暂无数据</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!--添加/修改反馈-->
      <el-dialog
        :title="dialogFormTitle"
        :visible.sync="dialogFormVisible"
        append-to-body
        :close-on-click-modal="false"
        v-loading="loading"
      >
        <el-form :model="form" ref="form">
          <el-form-item
            label="反馈内容"
            :label-width="formLabelWidth"
            prop="remark"
            :rules="[
              { required: true, message: '请输反馈内容', trigger: ['blur'] },
              { min: 1, max: 200, message: '长度在 1 到 200之间', trigger: ['blur'] }
            ]"
          >
            <el-input
              type="textarea"
              v-model="form.remark"
              autocomplete="off"
              :rows="5"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateFeedbacksRequest()">确 定</el-button>
        </div>
      </el-dialog>

      <!--预案详情编辑-->
      <el-dialog
        :title="dialogtitle"
        :visible.sync="dialogtitleVisible"
        v-if="dialogtitleVisible"
        :append-to-body="true"
        width="600px"
        :close-on-click-modal="false"
      >
        <businessDialog ref="dialog" :dialogdata.sync="dialogdata" @closeDiaTest="closeDialogTest()"></businessDialog>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import imgPath from "@/assets/images/map.png";
import { changeDisposeStatus } from "@/api/test.js";
import { prePlanInstcApi } from "@/api/prePlanInstcApi.js";
import businessDialog from "./businessDialog";
import gisMap from "../gis/map";
export default {
  data() {
    return {
      loading: false,
      imgPath: imgPath,
      preplanInstcId: "70386c95-0170-40280981-386c9524-0000", //当前页面的id
      activeName: "first",
      activeName1: "0",
      feedbacksListDetailData: {
        preplanExecInstcItemList1: [], //基础详情页
        preplanExecInstcItemList2: [], //处置过程节点
        preplanExecInstcItemList2Active: 0 //处置过程节点高两点
      },
      itemsSecondArr: [],
      itemsSecondArrName: "",
      itemsThirdArr: [],
      formLabelWidth: "120px",

      planInstcItemIdNow: "",
      loadingFirst: true, //预案详情
      loadingSecond: true, //处置过程
      loadingThird: true, //反馈列表
      dialogFormVisible: false, //添加反馈表单
      dialogFormTitle: "", //添加反馈表单标题
      form: {
        //添加反馈表单
        remark: "",
        planInstcItemId: "",
        id: ""
      },
      operBoxShow: true,

      //编辑预案详情数据
      dialogtitle: "预案编辑",
      dialogtitleVisible: false,
      dialogdata: {},
      dialogdataTemp: {},
      iconStep: {
        0: "el-icon-warning",
        2: "el-icon-time",
        8: "el-icon-success"
      },
      activeNode: 0
    };
  },
  computed: {
    //实列是否完成
    isOver() {
      return this.feedbacksListDetailData.status == 8 || this.feedbacksListDetailData.status == 5;
    },
    //当前处置节点是否完成
    isFinish() {
      return this.feedbacksListDetailData.preplanExecInstcItemList2[this.activeNode].status == 8;
    }
  },
  watch: {},
  created() {
    this.feedbacksListDetailFun(); //获取一级项列表
  },
  methods: {
    //预案详情--编辑
    showServiceTest(row) {
      this.toServiceTest.show = true;
    },
    editOneSub(item) {
      console.log(item);
      let onedata = item;
      this.dialogdata = item;
      this.dialogtitleVisible = true;
    },
    closeDialogTest() {
      this.dialogtitleVisible = false;
      console.log("设置窗口关闭");
      console.log(this.activeNode);
      this.feedbacksListDetailFun({}, this.activeNode);
    },

    //改变节点状态
    changeStatusFun(params) {
      /* let  params = {
            planInstcItemId:this.planInstcItemIdNow,
            status:status
          } */
      let { status, planInstcItemId, activeNode } = params;
      this.activeNode = activeNode;
      changeDisposeStatus({ status, planInstcItemId }).then(res => {
        if (res.data.resultCode == 0) {
          this.feedbacksListDetailFun();
          this.$message({
            showClose: true,
            message: "状态设置成功！",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.data.resultMessage,
            type: "error"
          });
        }
      });
    },

    //获取一级项列表
    feedbacksListDetailFun(activeNode) {
      //preplanInstcId: decodeURI(this.$route.query.preplanInstcId)  planInstcItemId
      //let params = decodeURI("70386c95-0170-40280981-386c9524-0000");

      console.log("查询一级项");
      console.log(this.activeNode);

      let params = decodeURI(this.$route.query.preplanInstcId);
      let _self = this;
      this.loadingSecond = true;
      prePlanInstcApi
        .feedbacksListDetail(params)
        .then(res => {
          this.loadingSuggest = false;
          if (res.data.resultCode == 0) {
            _self.feedbacksListDetailData = res.data.data;
            res.data.data.preplanExecInstcItemList.forEach(item => {
              item.preplanExecInstcItemSubList.forEach(it => {
                this.$set(it, "peopleOptions", []);
                if (it.receiverStaffIds) {
                  this.$set(it, "receiverStaffIdss", it.receiverStaffIds.split(","));
                } else {
                  this.$set(it, "receiverStaffIdss", []);
                }
              });
            });
            _self.feedbacksListDetailData.preplanExecInstcItemList1 = res.data.data.preplanExecInstcItemList.filter(
              function(n) {
                return n.infoType == 1; //基础详情页
              }
            );
            this.loadingFirst = false;
            _self.feedbacksListDetailData.preplanExecInstcItemList2 = res.data.data.preplanExecInstcItemList.filter(
              function(n) {
                return n.infoType == 2; //处置过程节点
              }
            );
            _self.feedbacksListDetailData.preplanExecInstcItemList2.forEach(function(n, index) {
              if (n.status == 8) {
                _self.feedbacksListDetailData.preplanExecInstcItemList2Active = index + 1;
              }
            });

            this.loadingSecond = false;
            if (_self.feedbacksListDetailData.preplanExecInstcItemList2.length > 0) {
              //存在处置过程结点
              if (this.activeNode) {
                console.log("编辑之后");
                console.log(_self.feedbacksListDetailData.preplanExecInstcItemList2[this.activeNode]);
                _self.queryItemsSecondFun(
                  _self.feedbacksListDetailData.preplanExecInstcItemList2[this.activeNode],
                  this.activeNode
                ); //查询反馈列表
              } else {
                _self.queryItemsSecondFun(_self.feedbacksListDetailData.preplanExecInstcItemList2[0], 0); //查询反馈列表
              }
            } else {
            }
          } else {
            this.$message({
              showClose: true,
              message: res.data.resultMessage,
              type: "error"
            });
          }
        })
        .finally(() => {
          this.loadingSecond = false;
        });
    },

    //查询反馈列表
    findFeedbacks(planInstcItemId) {
      this.loadingThird = true;
      prePlanInstcApi.findFeedbacks(planInstcItemId).then(res => {
        if (res.data.resultCode == 0) {
          this.itemsThirdArr = res.data.data.data;
          this.loadingThird = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.resultMessage,
            type: "error"
          });
          this.loadingThird = false;
        }
      });
    },

    //添加反馈
    updateFeedbacksFun(command) {
      if (command.split(",")[0] == "add") {
        //添加反馈
        this.dialogFormTitle = "添加反馈";
        this.dialogFormVisible = true;
        this.form.remark = null;
        this.form.id = null;
      }
      if (command.split(",")[0] == "edit") {
        //编辑指令
        this.dialogtitleVisible = true;
        this.dialogdata = {};
        this.dialogdata = {
          infoType: this.dialogdataTemp.infoType,
          preplanExecInstcItemSubList: this.dialogdataTemp.preplanExecInstcItemSubList,
          planInstcItemId: this.dialogdataTemp.planInstcItemId
        };
      }
    },

    //编辑反馈
    updateFeedbacksFunOne(item) {
      this.dialogFormVisible = true;
      this.dialogFormTitle = "编辑反馈";
      this.form.remark = item.remark;
      this.form.id = item.id;
    },

    //删除反馈
    deleteFeedbacksFunOne(item) {
      let _self = this;
      this.$confirm("此操作将删除该反馈, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          prePlanInstcApi.feedbacksListDelete(item.id).then(res => {
            if (res.data.resultCode == 0) {
              this.$message({
                showClose: true,
                type: "success ",
                message: "删除成功！"
              });
              this.findFeedbacks({ planInstcItemId: this.form.planInstcItemId });
            } else {
              this.$message({
                showClose: true,
                type: "error ",
                message: res.data.resultMessage
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除！"
          });
        });
    },

    //新增或修改反馈请求
    updateFeedbacksRequest() {
      let params = {
        id: this.form.id,
        planInstcItemId: this.form.planInstcItemId,
        remark: this.form.remark
      };

      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          prePlanInstcApi
            .updateFeedbacks(params)
            .then(res => {
              if (res.data.resultCode == 0) {
                this.$message({
                  showClose: true,
                  type: "success ",
                  message: "操作成功！"
                });
                this.dialogFormVisible = false;
                this.findFeedbacks({ planInstcItemId: this.form.planInstcItemId });
                this.form.remark = "";
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.resultMessage,
                  type: "error"
                });
                this.dialogFormVisible = false;
              }
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },

    //查询反馈列表、点击处置过程节点
    queryItemsSecondFun(item, index) {
      console.log(item);

      this.activeNode = index || 0;

      this.itemsSecondArrName = item.name;
      this.operBoxShow = !this.operBoxShow;
      this.form.planInstcItemId = item.planInstcItemId;
      let params = item.planInstcItemId;
      this.planInstcItemIdNow = item.planInstcItemId;

      this.dialogdataTemp.infoType = item.infoType;
      this.dialogdataTemp.planInstcItemId = item.planInstcItemId;

      //this.loadingSecond = true;
      prePlanInstcApi
        .queryItemsSecond(params)
        .then(res => {
          console.log("处置过程返回:");
          console.log(res);
          if (res.data.resultCode == 0) {
            this.itemsSecondArr = res.data.data;
            this.dialogdataTemp.preplanExecInstcItemSubList = res.data.data;
            this.dialogdataTemp.preplanExecInstcItemSubList.forEach(it => {
              this.$set(it, "peopleOptions", []);
              if (it.receiverStaffIds) {
                this.$set(it, "receiverStaffIdss", it.receiverStaffIds.split(","));
              } else {
                this.$set(it, "receiverStaffIdss", []);
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: res.data.resultMessage,
              type: "error"
            });
          }
        })
        .finally(() => {});
      let planInstcItemId = { planInstcItemId: item.planInstcItemId };
      this.findFeedbacks(planInstcItemId);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },

  watch: {
    $route: {
      handler: function(val, oldVal) {
        if (val.query.preplanInstcId) {
          this.feedbacksListDetailFun();
          this.activeName1 = "0";
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  components: {
    businessDialog,
    gisMap
  }
};
</script>
<style>
.el-icon-warning {
  color: #606266;
}
.el-tabs__item {
  font-size: 16px;
}
.el-step__title {
  font-size: 14px;
}
.item-box {
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
.el-table .cell .el-button {
  height: 22px;
  line-height: 22px;
  vertical-align: middle;
  padding: 0px 0px !important;
}
.el-divider--horizontal {
  margin: 10px 0px;
}
.item-box .el-tabs__item {
  font-size: 16px;
}
.steps-style {
  font-size: 14px;
}

.el-step__title {
  font-size: 14px;
}

.el-button.is-circle {
  padding: 5px;
}
p {
  margin: 0px;
  padding-left: 10px;
}
p.remark,
p.name,
span.remark,
p.remark {
  overflow: hidden; /*超出的部分隐藏起来。*/
  //white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 20px;
}
p.feedList {
  overflow: hidden; /*超出的部分隐藏起来。*/
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 38px;
  position: relative;
}
p.feedList .el-button--text {
  margin-left: 10px;
  position: absolute;
  right: 2px;
  padding-top: 0px;
  padding-bottom: 0px;
  top: 50%;
  margin-top: -8px;
}
p.feedList .el-button--text:nth-child(2) {
  right: 19px;
}
.btn-box {
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
}
.first-title {
  font-size: 16px;
  font-weight: bold;
  color: #606266;
  margin-left: 10px;
  margin-top: 20px;
  em {
    font-style: normal;
    font-weight: normal;
    margin-left: 10px;
  }
}
.item-box {
  position: relative;
  background-color: #fff;
  width: 50%;
  overflow-y: auto;
  color: #606266;
  font-size: 14px;
  height: inherit;
  .item-top {
    //height: 206px;
    overflow-y: auto;
    .content-box {
      height: 150px;
      line-height: 30px;
    }
  }
  .item-bottom {
    .item-bottom-left {
      border-top: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;
      position: relative;
      padding: 15px;
    }
    .item-bottom-right {
      // height: 500px;
      overflow: auto;
      .item-bottom-right-c {
        // max-height: 250px;
        line-height: 30px;
        position: relative;
        overflow-y: auto;
        border: 1px solid #e4e7ed;
        padding-left: 10px;
        h6 {
          font-size: 16px;
          margin: 10px 0px;
        }
      }
    }
  }
}

.oper-box {
  background-color: #409eff;
  color: #ffffff;
  border-radius: 5px;
  height: 60px;
  line-height: 30px;
  position: absolute;
  top: 50%;
  right: 0px;
  margin-top: -30px;
  font-size: 12px;
}
.oper-box p {
  padding: 0px 10px;
}
.oper-box p:hover {
  background-color: #66b1ff;
  border-radius: 5px;
  transition: background-color 0.25s ease;
  cursor: pointer;
}
.main-container {
  padding: 0;
  height: 100%;
}
/deep/.ico-step {
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
}
.download-area {
  margin-bottom: 50px;
  h4 {
    border-bottom: 1px solid #dcdddd;
    font-size: 16px;
    font-weight: normal;
    span {
      display: inline-block;
      padding: 10px 20px;
      border: 1px solid #dcdddd;
      border-left: none;
      border-bottom: none;
      background-color: #fff;
      margin-bottom: -1px;
      color: #409eff;
    }
  }
  ul,
  li {
    list-style: none;
  }
  li {
    line-height: 25px;
  }
}
.caseList {
  margin-top: 0;
  li {
    &:first-child {
      margin-left: -20px;
    }
  }
}
</style>
