<template>
  <div class="main-container">
    <el-form :inline="true">
      <el-form-item label="操作人">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select clearable v-model="value" placeholder="请选择登录类型">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间范围">
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
      <el-table-column prop="str1" label="操作模块" width="200" align="center"></el-table-column>
      <el-table-column prop="str2" label="操作对象" width="160" align="center"></el-table-column>
      <el-table-column prop="str3" label="操作类型" width="160" align="center"></el-table-column>
      <el-table-column prop="str4" label="操作人" width="160" align="center"></el-table-column>
      <el-table-column prop="str5" label="操作结果" width="160" align="center"></el-table-column>
      <el-table-column prop="str6" label="操作时间" align="center"></el-table-column>
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
          str1: Random.pick(["资源", "模板", "数据源", "用户权限", "工单"]),
          str2: Random.string("lower", 8),
          str3: Random.pick(["UNKNOWN", "SEARCH", "CREATE", "UPDATE", "DELETE"]),
          str4: Random.string("lower", 8),
          str5: Random.pick(["成功", "失败"]),
          str6: Random.datetime("yyyy-MM-dd HH:mm:ss")
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
