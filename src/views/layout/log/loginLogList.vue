<template>
  <div class="main-container">
    <el-form :inline="true">
      <el-form-item label="操作人">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="登录类型">
        <el-select clearable v-model="value" placeholder="请选择登录类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间范围">
        <div class="block">
          <el-date-picker
            type="datetimerange"
            value=""
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :row-style="{ height: '40px' }"
      :cell-style="{ padding: '4px 4px' }"
      stripe
    >
      <el-table-column prop="userName" label="操作人" width="160" align="center"></el-table-column>
      <el-table-column prop="orgName" label="单位名称" width="200" align="center"></el-table-column>
      <el-table-column prop="ip" label="IP" width="160" align="center"></el-table-column>
      <el-table-column prop="loginType" label="登入或登出" width="160" align="center"></el-table-column>
      <el-table-column prop="status" label="操作结果" width="160" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="操作时间" align="center"></el-table-column>
    </el-table>
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
</template>
<script>
import Mock from "mockjs";
export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "登入"
        },
        {
          value: "2",
          label: "登出"
        }
      ],
      value: "",
      tableData: [],
      paging: {
        pageIndex: 0,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData: function() {
      var Random = Mock.Random;
      var list = [];
      for (let i = 0; i < 5; i++) {
        let obj = {
          "id|+1": 1,
          userName: Random.string("lower", 8),
          orgName: Random.pick(["财务部", "商务部", "客服", "总裁办公室"]),
          ip: "192." + Random.integer(1, 254) + "." + Random.integer(1, 254) + "." + Random.integer(1, 254),
          loginType: Random.pick(["登入", "登出"]),
          loginTime: Random.datetime("yyyy-MM-dd HH:mm:ss"),
          status: Random.pick(["成功", "失败"])
        };
        list.push(obj);
      }

      this.tableData = list;
      this.paging.total = 5;
    },
    current_change: function(currentPage) {
      this.paging.pageIndex = currentPage;
    },
    size_change: function(pageSize) {
      this.paging.pageSize = pageSize;
    }
  }
};
</script>
<style lang="scss" scoped>
.msg {
  margin: 0px 4px;
}
.el-table {
  margin-top: 10px;
}
</style>
