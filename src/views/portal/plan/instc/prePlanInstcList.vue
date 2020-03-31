<template>
  <div class="main-container">
    <el-row>
      <el-form :inline="true" :model="formInline">
        <el-form-item label="">
          <el-input v-model="formInline.keywords" placeholder="名称、关键词、业务关联"></el-input>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select v-model="formInline.status" clearable placeholder="请选择执行状态">
            <!-- <el-option label="未执行" value="0"> </el-option> -->
            <el-option label="执行中" value="2"> </el-option>
            <el-option label="已中止" value="5"> </el-option>
            <el-option label="已完成" value="8"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :row-style="{ height: '40px' }"
        :cell-style="{ padding: '4px 4px' }"
        stripe
      >
        <el-table-column prop="name" label="预案名称" align="center"></el-table-column>
        <el-table-column prop="bizRelId" label="业务关联" width="240" align="center"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间" width="240" align="center"></el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          width="240"
          align="center"
          :formatter="endTimeFormatter"
        ></el-table-column>
        <el-table-column prop="statusName" label="状态" width="160" align="center"></el-table-column>
        <!-- <el-table-column prop="createdTime" label="创建时间" width="160" align="center"></el-table-column> -->
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <router-link
              class="el-button el-button--primary el-button--mini"
              :to="{
                path: '/caseExecute',
                query: { preplanInstcId: encodeURI(scope.row.id) }
              }"
              title="执行进度"
              ><i class="el-icon-time"> </i
            ></router-link>
            <el-dropdown size="mini" type="primary" @command="statusHandleClick" style="margin-left: 10px;">
              <el-button type="primary" size="mini">
                <i class="el-icon-s-operation"></i><i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="val in formatStatusData(scope.row)"
                  :key="val.id"
                  :command="formatterStatusCmd(val.cmd, scope.row)"
                  :disabled="val.disabled"
                >
                  {{ val.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div style="float: right; margin: 4px 8px;">
        <el-pagination
          background
          layout="prev, pager, next,  sizes,total"
          :total="paging.total"
          :page-size="paging.pageSize"
          :page-sizes="[5, 10, 20, 50]"
          @current-change="current_change"
          @size-change="size_change"
        >
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>
<script>
import { prePlanInstcApi } from "@/api/prePlanInstcApi.js";
import { endTimeColumnFormatter } from "@/utils/formatterUtils.js";
export default {
  data() {
    return {
      formInline: { keywords: null, status: null },
      tableData: [],
      paging: {
        pageIndex: 0,
        pageSize: 10,
        total: 0
      }
    };
  },
   watch: {
  },
  created() {
    this.doQueryPrePlanInstcList();
  },
  methods: {
    endTimeFormatter: endTimeColumnFormatter,
    formatterStatusCmd: function(cmd, row) {
      return { status: cmd, row };
    },
    formatStatusData: function(row) {
      var cmdArr = new Array();
      switch (row.status) {
        case 2:
          cmdArr.push({ cmd: 5, name: "中止", disabled: false });
          cmdArr.push({ cmd: 8, name: "完成", disabled: false });
          break;
        case 5:
        case 8:
          cmdArr.push({ cmd: 5, name: "中止", disabled: true });
          cmdArr.push({ cmd: 8, name: "完成", disabled: true });
          break;
      }
      return cmdArr;
    },
    doQueryPrePlanInstcList: function() {
      const params = {
        keywords: this.formInline.keywords,
        status: this.formInline.status,
        pageIndex: this.paging.pageIndex,
        pageSize: this.paging.pageSize
      };
      prePlanInstcApi.queryPrePlanInstcList(params).then(d => {
        if (d.data.resultCode === 0) {
          this.tableData = d.data.data.data;
          this.paging.total = d.data.data.recordTotal;
        }
      });
    },
    onSearch: function() {
      this.doQueryPrePlanInstcList();
    },
    current_change: function(currentPage) {
      this.paging.pageIndex = currentPage;
      this.doQueryPrePlanInstcList();
    },
    size_change: function(pageSize) {
      this.paging.pageIndex = 0;
      this.paging.pageSize = pageSize;
      this.doQueryPrePlanInstcList();
    },
    statusHandleClick: function(data) {
      this.$confirm("确定更改预案[" + data.row.name + "]状态吗?", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(() => {
        const params = { planInstcId: data.row.id, status: data.status };
        prePlanInstcApi.changeStatus(params).then(d => {
          if (d.data.resultCode === 0) {
            this.doQueryPrePlanInstcList();
            this.$message({
              type: "success",
              message: "修改预案状态成功!"
            });
          } else {
            this.$message({
              type: "warning",
              message: "修改预案状态失败!"
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.msg {
  color: red;
}
</style>
