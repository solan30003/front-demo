<template>
  <div class="main-container">
    <div class="item-box">
      <!--预案基础信息-->
      <div class="item-base">
        <el-tabs type="border-card">
          <el-tab-pane label="基础信息">
            <div class="">
              <el-form ref="form" name="form" label-width="100px" size="mini">
                <el-form-item label="名称">{{ feedbacksListDetailData.name }} </el-form-item>
                <el-form-item label="预案种类">{{ feedbacksListDetailData.planCategoryName }} </el-form-item>
                <el-form-item label="预案类型">{{ feedbacksListDetailData.planTypeName }} </el-form-item>
                <el-form-item label="标签">
                  <el-tag
                    style="margin-right:10px;"
                    type="success"
                    v-for="(item, index) in feedbacksListDetailData.keywordList"
                    :key="index"
                    >{{ item }}</el-tag
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--预案详情-->
      <div class="item-top">
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in feedbacksListDetailData.prePlanTemplItemDtoList"
            :key="index"
            :label="item.name"
            :name="index.toString()"
          >
            <div class="content-box">
              <el-row v-for="(itemChild, index) in item.prePlanTempItemSubDtoList" :key="index">
                <!--指挥结构-->
                <el-col :span="24" v-if="itemChild.configCategory == 1" style="text-align:left">
                  <div class="name" :title="itemChild.name + ':' + itemChild.orgName + ' ' + itemChild.executorName">
                    <ul class="caseList">
                      <li>
                        <strong>{{ index + 1 }}、{{ itemChild.name || "--" }}：</strong>{{ itemChild.orgName }}
                        {{ itemChild.executorName }}
                      </li>
                      <li><b>人员：</b>{{ itemChild.executorName }}</li>
                      <li><b>备注：</b>{{ itemChild.remark || "--" }}</li>
                    </ul>
                  </div>
                </el-col>
                <!--文本-->
                <el-col
                  :span="24"
                  style="text-align:left"
                  :title="itemChild.content"
                  v-if="itemChild.configCategory == 4"
                >
                  <p class="remark" :title="itemChild.content">
                    <b>{{ index + 1 }}、</b>
                    {{ itemChild.content || "--" }}
                  </p>
                </el-col>
              </el-row>
              <el-row v-if="item.prePlanTempItemSubDtoList.length == 0">
                <p class="remark">暂无数据</p>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!--没有预案详情-->
        <p v-if="feedbacksListDetailData.prePlanTemplItemDtoList.length == 0">预案详情：暂无数据</p>
      </div>
      <div class="download-area">
        <el-tabs type="border-card">
          <el-tab-pane label="附件">
            <ul>
              <li v-for="(item, index) in feedbacksListDetailData.fsFileDtoList" :key="index">
                {{ index + 1 }}、
                <a :href="item.filePath">{{ item.fileName }}</a>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--处置过程-->
      <div class="item-bottom">
        <p v-if="feedbacksListDetailData.preplanExecuteDtoList.length == 0">处置过程：暂无数据</p>
        <el-tabs v-if="feedbacksListDetailData.preplanExecuteDtoList.length > 0">
          <el-tab-pane label="处置过程">
            <el-row>
              <el-col :span="8">
                <div class="item-bottom-left">
                  <el-steps direction="vertical" space="50px">
                    <el-step
                      v-for="(item, index) in feedbacksListDetailData.preplanExecuteDtoList"
                      :key="index"
                      :title="item.name"
                      icon="el-icon-time"
                      @click.native="queryItemsSecondFun(item, index)"
                      style="cursor: pointer;"
                    >
                    </el-step>
                  </el-steps>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="item-bottom-right">
                  <div class="item-bottom-right-c">
                    <h6>l {{ itemsSecondArrName }}</h6>
                    <div v-for="(item, index) in itemsSecondArr" :key="index">
                      <div v-if="item.configCategory == 2">
                        <ul class="caseList">
                          <li>
                            <strong>{{ index + 1 }}、</strong>{{ item.orgName }} {{ item.executorName }}
                          </li>
                          <li><b>指令内容：</b>{{ item.content || "--" }}</li>
                          <li><b>出动人员：</b>{{ item.executorName || "--" }}</li>
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
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";
export default {
  data() {
    return {
      feedbacksListDetailData: {
        fsFileDtoList: [],
        prePlanTemplItemDtoList: [], //基础详情页
        preplanExecuteDtoList: [] //处置过程节点
      },
      itemsSecondArr: [],
      itemsSecondArrName: ""
    };
  },
  async created() {
    await this.feedbacksListDetailFun(); //获取一级项列表
    this.queryItemsSecondFun(this.feedbacksListDetailData.preplanExecuteDtoList[0]);
  },
  methods: {
    //获取一级项列表
    async feedbacksListDetailFun() {
      let params = {
        planTmplId: this.$route.query.planTmplId
      };
      let res = await prePlanTmplApi.planTmplBaseDetail(params);
      this.feedbacksListDetailData = res.data.data;
    },
    handleClick() {},
    async queryItemsSecondFun(item) {
      let params = {
        planTmplItemId: item.id
      };
      let res = await prePlanTmplApi.detailPlanTmplItem(params);
      this.itemsSecondArr = res.data.data;
      this.itemsSecondArrName = item.name;
    }
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
  width: 100%;
  min-width: 300px;
  overflow-y: auto;
  color: #606266;
  font-size: 14px;
  height: inherit;
  .item-base {
    margin-bottom: 8px;
  }
  .item-top {
    margin-bottom: 8px;
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
  padding: 0px 8px;
  height: 100%;
}
/deep/.ico-step {
  font-size: 25px;
  font-weight: bold;
  cursor: pointer;
}
.download-area {
  margin-bottom: 8px;
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
