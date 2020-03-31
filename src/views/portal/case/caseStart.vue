<template xmlns="http://www.w3.org/1999/html">
  <div class="main-container">
    <gis-map></gis-map>
    <div class="plan-content">
      <div class="first-title"><i class="el-icon-thumb"></i> 推荐预案</div>
      <div class="list-box" v-loading="loadingSuggest">
        <div class="list-item" v-for="(item, index) in tableDataSuggest" :key="index">
          <el-row class="list-name">
            <el-col :span="24">
              <div class="grid-content bg-purple-dark key-name" :title="item.name">
                <span>{{ item.name }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="list-name">
            <el-col :span="16">
              <div class="grid-content bg-purple key-words" >
                <span>关键词：</span>
                <a v-if="item.keywords == '' || item.keywords == null" size="medium" style="margin-left: 5px;">--</a>
                  <span v-else :title="item.keywords">
                    <el-tag
                      v-for="(itemC, index) in item.keywords.split(',')"
                      :key="index"
                      size="medium"
                      style="margin-left: 5px;"
                    >{{ itemC }}</el-tag>
                  </span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple-light text-center" :title="item.planCategoryName||'--'">
                {{ item.planCategoryName||"--" }}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple text-center opt-toolbar">
                <el-button size="mini" type="danger" @click="startCase(item)">启动</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="first-title" style="margin-top: 20px;"><i class="el-icon-d-arrow-right"></i> 更多预案</div>
      <div class="list-box">
        <!--搜索框-->
        <el-form :inline="true" :model="formInline"  @submit.native.prevent>
          <el-form-item>
            <el-radio-group v-model="formInline.planType" @change="searchPlanListMoreFun()">
              <el-radio key label value>全部</el-radio>
              <el-radio
                v-for="item in planTypeArr"
                :key="item.dictCode"
                :label="item.dictCode"
                :value="item.dictCode"
                >{{ item.dictValue }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label>
            <el-input v-model="formInline.keyword" placeholder="预案搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchPlanListMoreFun()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh-left" @click="reSet()">重置</el-button>
          </el-form-item>
        </el-form>

        <!--表格-->
        <div v-loading="loadingMore">
          <div class="list-item" v-for="(item, index) in tableDataMore" :key="index">
            <el-row class="list-name">
              <el-col :span="24">
                <div class="grid-content bg-purple-dark key-name" :title="item.name">
                  <span>{{ item.name }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row class="list-name">
              <el-col :span="16">
                <div class="grid-content bg-purple key-words" >
                  <span>关键词：</span>
                  <a v-if="item.keywords == '' || item.keywords == null" size="medium" style="margin-left: 5px;">--</a>
                  <span v-else :title="item.keywords">
                    <el-tag
                    v-for="(itemC, index) in item.keywords.split(',')"
                    size="medium"
                    style="margin-left: 5px;"
                    :key="index">{{ itemC }}</el-tag>
                  </span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple-light text-center key-type" :title="item.planCategoryName||'--'">
                  {{ item.planCategoryName ||"--"}}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple text-center opt-toolbar">
                  <el-button size="mini" type="danger" @click="startCase(item)">启动</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
        :current-page.sync="formInline.pageIndex"
        :page-size.sync="formInline.pageSize"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import imgPath from "@/assets/images/map.png";
// import {queryPlanType,searchPlanList ,searchPlanListSuggest,startPlan } from "@/api/serviceAll.js";
import { commonApi } from "@/api/commonApi.js";
import { util } from "@/utils/utils.js";
import { prePlanInstcApi } from "@/api/prePlanInstcApi.js";
import gisMap from "../gis/map";
export default {
  data() {
    return {
      imgPath: imgPath,
      total: 0,
      loadingSuggest: true,
      loadingMore: true,

      //搜索更多预案数据
      formInline: {
        pageIndex: 0,
        pageSize: 5,
        planCategory: "", //预案种类
        planType: "", //预案类型
        keyword: "" //搜搜关键字
      },
      planTypeArr: [],
      tableDataSuggest: [],
      tableDataMore: []
    };
  },
  components: {
    gisMap
  },
  watch: {
  },
  created() {
    this.queryPlan(); //查询所有的预案类型
    this.searchPlanListSuggestFun(); //查询所有的推荐预案
    this.searchPlanListMoreFun(); //查询所有的更多预案
  },
  methods: {
    //查询所有的预案类型
    queryPlan() {
      let params = {
        pageIndex: 0,
        pageSize: 50,
        parentCode: "1002"
      };
      commonApi.getDictListByParent(params).then(res => {
        this.planTypeArr = res.data.data;
        if (res.data.resultCode === 0) {
          this.planTypeArr = res.data.data.data;
        }
      });
    },

    //搜索推荐预案列表caseStart.vue
    searchPlanListSuggestFun() {
      let params = {
        pageIndex: 0,
        pageSize: 3,
        keyword: ""
      };
      prePlanInstcApi.searchPlanListSuggest(params).then(res => {
        this.loadingSuggest = false;
        if (res.data.resultCode == 0) {
          this.tableDataSuggest = res.data.data.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.resultMessage,
            type: "error"
          });
        }
      });
    },

    //搜索更多预案列表
    searchPlanListMoreFun() {
      this.loadingMore = true;
      let params = this.formInline;
      prePlanInstcApi.searchPlanList(params).then(res => {
        this.loadingMore = false;
        if (res.data.resultCode == 0) {
          this.tableDataMore = res.data.data.data;
          this.total = res.data.data.recordTotal;
        } else {
          this.$message({
            showClose: true,
            message: res.data.resultMessage,
            type: "error"
          });
        }
      });
    },

    //重置按钮事件
    reSet() {
      this.formInline.pageIndex = 0;
      this.formInline.pageSize = 5;
      this.formInline.planCategory = "";
      this.formInline.planType = "";
      this.formInline.keyword = "";
      this.searchPlanListMoreFun();
    },

    //页码变化事件
    handleCurrentChange() {
      this.searchPlanListMoreFun();
    },

    //启动预案
    startCase(item) {
      console.log(item);
      this.$prompt("请输入业务事件编号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function(val) {
          if (typeof val === "undefined" || val == null) return false;
          return val.length >= 2 && val.length <= 20;
        },
        inputErrorMessage: "长度规则：[2, 20]"
      })
        .then(({ value }) => {
          let data = {
            bizRelId: value,
            planTmplId: item.id
          };
          prePlanInstcApi.startPlan(data).then(res => {
            console.log(res);
            if (res.data.resultCode == 0) {
              this.$router.push({
                path: "/caseExecute",
                query: { preplanInstcId: encodeURI(res.data.data.planInstcId) }
              });
              this.$message({
                showClose: true,
                type: "success ",
                message: "启动成功！"
              });
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "启动失败(" + res.data.resultMessage + ")"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
      // this.$confirm("此操作将启动该预案, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //   })
      //   .catch(() => {
      //     this.$message({
      //       showClose: true,
      //       type: "info",
      //       message: "已取消启动"
      //     });
      //   });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table .cell .el-button {
  height: 22px;
  line-height: 22px;
  vertical-align: middle;
  padding: 0px 0px !important;
}
.el-divider--horizontal {
  margin: 10px 0px;
  margin-top: 20px;
}
.first-title {
  border-color: #409eff;
  font-size: 15px;
  border-radius: 4px;
  // box-shadow: 0 2px 4px #008df7, 0 0 6px #008df7;
  background: #ecf5ff;
  color: #409eff;
  margin-bottom: 10px;
  display: inline-block;
  width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.list-box {
  color: #606266;
  font-size: 15px;
  .list-link {
    padding-right: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
  .list-item:hover {
    background: #e9f7ff;
    transition: background-color 0.25s ease;
    cursor: pointer;
  }
  .list-item {
    height: 80px;
    line-height: 40px;
    padding: 5px 10px;
    border-bottom: 1px dotted #dcdddd;
    .list-name {
      .el-col {
        &:nth-of-type(2),
        &:nth-of-type(3) {
          text-align: right;
        }
      }
      .key-name,
      .key-words,
      .text-center {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .text-center {
        font-size: 14px;
      }
    }
  }
}
.plan-content {
  width: 50%;
  height: inherit;
  background-color: #fff;
  position: relative;
  padding: 20px;
  overflow-y: auto;
}
.main-container {
  padding: 0;
  height: 100%;
}
.opt-toolbar {
  display: none;
}
.list-name:hover .opt-toolbar {
  display: block;
}
</style>
