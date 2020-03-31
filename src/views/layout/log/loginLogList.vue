<template>
  <div class="main-container">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :row-style="{ height: '40px' }"
      :cell-style="{ padding: '4px 4px' }"
      stripe
    >
      <el-table-column prop="userName" label="用户名" width="140" align="center"></el-table-column>
      <el-table-column prop="orgName" label="单位名称" width="200" align="center"></el-table-column>
      <el-table-column prop="ip" label="IP" width="140" align="center"></el-table-column>
      <el-table-column prop="loginType" label="操作行为" width="100" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="操作时间" align="center"></el-table-column>
      <el-table-column prop="status" label="操作结果" align="center"></el-table-column>
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
      var data = Mock.mock({
        "list|1-10": [
          {
            "id|+1": 1,
            "userName|2-10": Random.string(8),
            orgName: Random.string("upper", 5),
            ip: "192." + Random.integer(1, 254) + "." + Random.integer(1, 254) + "." + Random.integer(1, 254),
            loginType: Random.pick(["登入", "登出"]),
            loginTime: Random.datetime("yyyy-MM-dd HH:mm:ss"),
            status: Random.pick(["成功", "失败"])
          }
        ]
      });
      this.tableData = data.list;
      this.paging.total = 10;
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
