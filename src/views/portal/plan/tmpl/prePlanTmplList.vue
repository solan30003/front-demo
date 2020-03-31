<template>
  <div class="main-container">
    <el-form :inline="true" :model="formInline">
      <el-form-item label>
        <el-input v-model="formInline.keyword" placeholder="名称、关键词"></el-input>
      </el-form-item>
      <el-form-item label="预案种类">
        <el-select v-model="formInline.planCategory" clearable placeholder="请选择预案种类">
          <el-option
            v-for="item in planCategoryData"
            :key="item.dictCode"
            :label="item.dictValue"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预案类型">
        <el-select v-model="formInline.planType" clearable placeholder="请选择预案类型">
          <el-option
            v-for="item in planTypeData"
            :key="item.dictCode"
            :label="item.dictValue"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tools-area">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :row-style="{ height: '40px' }"
      :cell-style="{ padding: '4px 4px' }"
      stripe
    >
      <el-table-column prop="name" label="模板名称" align="center" fixed></el-table-column>
      <el-table-column prop="planCategoryName" label="预案种类" width="160" align="center"></el-table-column>
      <el-table-column prop="planTypeName" label="预案类型" width="160" align="center"></el-table-column>
      <el-table-column prop="keywords" label="关键词" width="240" align="center"></el-table-column>
      <!-- <el-table-column prop="remark" label="备注" align="left" :show-overflow-tooltip="true"></el-table-column> -->
      <el-table-column
        prop="enabled"
        label="有效状态"
        width="140"
        align="center"
        :formatter="booleanFormatter"
      ></el-table-column>
      <el-table-column prop="createdDate" label="创建时间" width="160" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editTmpl(scope.row.id)" title="编辑">
          </el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-document-copy"
            @click="copyTmpl(scope.row)"
            title="复制"
          ></el-button>
          <router-link
            class="el-button el-button--primary el-button--mini"
            :to="{
              path: '/prePlanDetail',
              query: { planTmplId: encodeURI(scope.row.id) }
            }"
            title="详情"
          >
            <i class="el-icon-view"></i>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteTmpl(scope.row.id)"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next,  sizes,total"
      :total="paging.total"
      :page-size="paging.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      @current-change="current_change"
      @size-change="size_change"
    ></el-pagination>
    <copyDialog v-model="dialogEditVisible" :preName="preName" :id="id" @update="update"> </copyDialog>
  </div>
</template>
<script>
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";
import { commonApi } from "@/api/commonApi.js";
import { booleanColumnFormatter } from "@/utils/formatterUtils.js";
import copyDialog from "./component/copyDialog";
export default {
  components: { copyDialog },
  data() {
    return {
      formInline: { keyword: null, planCategory: null, planType: null },
      planCategoryData: [],
      planTypeData: [],
      tableData: [],
      paging: {
        pageIndex: 0,
        pageSize: 10,
        total: 0
      },
      dialogEditVisible: false,
      preName: "",
      id: ""
    };
  },
  watch: {
    $route: {
      handler: function() {
        this.doQueryPlanCategoryList();
        this.doQueryPlanTypeList();
        this.doQueryPrePlanTmplList();
      },
      deep: true
    }
  },
  created() {
    this.doQueryPlanCategoryList();
    this.doQueryPlanTypeList();
    this.doQueryPrePlanTmplList();
  },
  methods: {
    booleanFormatter: booleanColumnFormatter,
    doQueryPrePlanTmplList: function() {
      const params = {
        keyword: this.formInline.keyword,
        planCategory: this.formInline.planCategory,
        planType: this.formInline.planType,
        pageIndex: this.paging.pageIndex,
        pageSize: this.paging.pageSize
      };
      prePlanTmplApi.searchAllPlanList(params).then(d => {
        if (d.data.resultCode === 0) {
          this.tableData = d.data.data.data;
          this.paging.total = d.data.data.recordTotal;
        }
      });
    },
    doQueryPlanCategoryList: function() {
      const params = {
        parentCode: "1001",
        pageIndex: 0,
        pageSize: 50
      };
      commonApi.getDictListByParent(params).then(d => {
        if (d.data.resultCode === 0) {
          this.planCategoryData = d.data.data.data;
        }
      });
    },
    doQueryPlanTypeList: function() {
      const params = {
        parentCode: "1002",
        pageIndex: 0,
        pageSize: 50
      };
      commonApi.getDictListByParent(params).then(d => {
        if (d.data.resultCode === 0) {
          this.planTypeData = d.data.data.data;
        }
      });
    },
    onSearch: function() {
      this.doQueryPrePlanTmplList();
    },
    onAdd: function() {
      this.$store.commit("CHANGE_BUTTON", true);
      this.$router.push({
        path: "/plansManage",
        query: { opt: 0, preplanTmplId: null }
      });
    },
    current_change: function(currentPage) {
      this.paging.pageIndex = currentPage;
      this.doQueryPrePlanTmplList();
    },
    size_change: function(pageSize) {
      this.paging.pageIndex = 0;
      this.paging.pageSize = pageSize;
      this.doQueryPrePlanTmplList();
    },
    editTmpl(id) {
      this.$store.commit("CHANGE_BUTTON", false);
      this.$router.push({ path: "/plansManage", query: { opt: 1, preplanTmplId: encodeURI(id) } });
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
            this.doQueryPrePlanTmplList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message({
              type: "warning",
              message: "删除失败!"
            });
          }
        });
      });
    },
    copyTmpl(row) {
      this.preName = row.name + "-副本";
      this.id = row.id;
      this.dialogEditVisible = true;
    },
    update() {
      this.doQueryPlanCategoryList();
      this.doQueryPlanTypeList();
      this.doQueryPrePlanTmplList();
    }
  }
};
</script>
<style lang="scss" scoped>
.msg {
  color: red;
}
.tools-area {
  text-align: right;
  margin-top: -62px;
  margin-bottom: 22px;
}
</style>
