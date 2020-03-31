<template>
  <div style="height: 100%;">
    <el-row
      style="height: 100%;"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(204,204,204, 0.5)"
    >
      <!-- 左边-->
      <el-col style="height: 100%;padding: 0px 16px;">
        <!--搜索框-->
        <div style="margin-top:16px;height:150px;overflow-y:auto">
          <el-form :inline="true" :model="formInline" style="text-align: center;">
            <el-form-item>
              <el-radio-group v-model="formInline.planType" @change="searchAllPlanListFun()">
                <el-radio key label value>全部</el-radio>
                <el-radio
                  v-for="item in planTypeArr"
                  :key="item.dictCode"
                  :label="item.dictCode"
                  :value="item.dictCode"
                >{{ item.dictValue }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label>
              <el-row>
                <el-col :span="9">
                  <el-input v-model="formInline.keyword" placeholder="预案搜索"></el-input>
                </el-col>
                <el-col :span="15">
                  <el-button size="medium"
                  type="primary" icon="el-icon-search" @click="searchAllPlanListFun()">搜索</el-button>
                  <el-button size="medium" type="primary" icon="el-icon-refresh-left" @click="reSet()">重置</el-button>
                  <el-button size="medium" type="primary" icon="el-icon-plus" @click="addPlan()">新建</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <!--所有预案-->
        <div style="margin-top: 10px;height: calc(100% - 222px);overflow-y:auto">
          <div class="list-box">
            <!--表格-->
            <div style="height: 242px;" v-loading="loading">
              <div class="list-item" v-for="(item, index) in tableData" :key="index">
                <el-row class="list-name">
                  <el-col :span="24">
                    <div class="grid-content bg-purple-dark key-name" :title="item.name">
                      <b>{{ item.name }}</b>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="list-name">
                  <el-col :span="14">
                    <div class="grid-content bg-purple key-words" :title="item.keywords">
                      <b>关键词：</b>
                      <a v-if="item.keywords == null" size="medium" style="margin-left: 5px;">--</a>
                      <el-tag
                        v-else
                        v-for="(itemC, indexC) in item.keywords.split(',')"
                        :key="indexC"
                        size="medium"
                        style="margin-left: 5px;"
                      >{{ itemC }}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div
                      class="grid-content bg-purple-light text-center key-type"
                      :title="item.planCategoryName"
                    >{{ item.planCategoryName }}</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple text-center opt-toolbar">
                      <el-row>
                        <el-button
                          size="mini"
                          type="primary"
                          icon="el-icon-edit"
                          @click="gotoEdit(item.id)"
                          title="编辑"
                        ></el-button>
                        <el-button
                          size="mini"
                          type="danger"
                          icon="el-icon-delete"
                          @click="deleteTmpl(item.id)"
                          title="删除"
                        ></el-button>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <el-col :span="12" style="float: right;text-align: right;margin-top: 20px;"></el-col>
        </div>
        <!--分页插件-->
        <div style="margin-top: 10px;float: right;height:40px">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
            :current-page.sync="formInline.pageIndex"
            :page-size.sync="formInline.pageSize"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
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
/deep/ {
  .el-loading-spinner i {
    color: rgba(204, 204, 204, 0.5);
    background: rgba(204, 204, 204, 0.5);
  }
}
.list-box {
  color: #606266;
  font-size: 15px;
  .list-link {
    padding-right: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
  .opt-toolbar {
    display: none;
  }
  .list-item:hover {
    background: #e9f7ff;
    transition: background-color 0.25s ease;
    cursor: pointer;
  }
  .list-item:hover .opt-toolbar {
    display: block;
  }
  .list-item {
    height: 80px;
    line-height: 40px;
    .list-name {
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
</style>

<script>
import bus from "@/assets/bus.js";
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";
import { commonApi } from "@/api/commonApi.js";
export default {
  data() {
    return {
      total: 0,
      loading: true,

      //搜索预案数据
      formInline: {
        pageIndex: 0,
        pageSize: 7,
        planCategory: "", //预案种类
        planType: "", //预案类型
        keyword: "" //搜搜关键字
      },
      planTypeArr: [],
      tableData: []
    };
  },
  created() {
    bus.$on("refreshlist", val => {
      this.init();
    });
    this.init();
  },
  methods: {
    init() {
      this.queryPlan(); //查询所有的预案类型
      this.searchAllPlanListFun(); //查询所有的预案
    },
    //查询所有的预案类型
    queryPlan() {
      let params = {
        pageIndex: 0,
        pageSize: 50,
        parentCode: "1002"
      };
      commonApi.getDictListByParent(params).then(res => {
        this.planTypeArr = [];
        if (res.data.resultCode === 0) {
          this.planTypeArr = res.data.data.data;
        } else {
          this.$message({
            type: "warning",
            message: "加载预案类型失败。"
          });
        }
      });
    },

    //搜索预案列表
    searchAllPlanListFun() {
      this.loading = true;
      let params = this.formInline;
      prePlanTmplApi.searchAllPlanList(params).then(res => {
        this.loading = false;
        if (res.data.resultCode == 0) {
          this.tableData = res.data.data.data;
          this.total = res.data.data.pageTotal;
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
      this.formInline.pageSize = 7;
      this.formInline.planCategory = "";
      this.formInline.planType = "";
      this.formInline.keyword = "";
      this.searchAllPlanListFun();
    },

    //页码变化事件
    handleCurrentChange() {
      this.searchAllPlanListFun();
    },
    //新增预案
    addPlan() {
      bus.$emit("showActive", { type: 1 });
    },
    gotoEdit(id) {
      // debugger;
      bus.$emit("showActive", { type: 2, id: id });
    },
    deleteTmpl(id) {
      //删除预案模板
      this.$confirm("确定删除模板吗?", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(() => {
        let params = { planTmplId: id };
        prePlanTmplApi.deletePreplanTmpl(params).then(res => {
          if (res.data.resultCode === 0) {
            this.queryPlan();
            this.searchAllPlanListFun();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            bus.$emit("showActive", { type: 3 });
          } else {
            this.$message({
              type: "warning",
              message: "删除失败!"
            });
          }
        });
      });
    }
  }
};
</script>
