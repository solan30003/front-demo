<template>
  <div class="main-container">
    <el-row>
      <el-col :span="2" style="min-width: 30px;">
        <el-button @click="addHandleClick" type="primary">新增</el-button>
      </el-col>
      <el-col :span="12">
        <el-alert :title="activeDictMsg" type="success" :closable="false"></el-alert>
      </el-col>
      <el-col :span="10" style="text-align:right;">
        <el-select v-model="dicType" placeholder="请选择" @change="nvaMenuSelect" v-loading="loading1">
          <el-option
            v-for="(item, index) in tableLeftData"
            :key="index"
            :label="item.dictValue"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-table
      :data="tableDetailsData"
      border
      style="width: 100%"
      :row-style="{ height: '40px' }"
      :cell-style="{ padding: '4px 4px' }"
      stripe
      v-loading="loading"
    >
      <el-table-column prop="dictCode" label="code" width="140" align="center"></el-table-column>
      <el-table-column prop="dictValue" label="value" width="200" align="center"></el-table-column>
      <el-table-column prop="parentCode" label="父级编码" width="140" align="center"></el-table-column>
      <el-table-column prop="sortNum" label="排序值" width="100" align="center"></el-table-column>
      <el-table-column
        prop="statusName"
        label="状态"
        width="100"
        align="center"
        :formatter="formatterEnabled"
      ></el-table-column>
      <el-table-column prop="summary" label="备注" align="center"></el-table-column>
      <el-table-column
        prop="statusName"
        label="系统参数"
        width="100"
        align="center"
        :formatter="formatBoolean"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button @click="editHandleClick(scope.row)" type="text" size="small" v-if="scope.row.basal === false"
            >编辑</el-button
          >
          <el-button @click="deleteHandleClick(scope.row)" type="text" size="small" v-if="scope.row.basal === false"
            >删除</el-button
          >
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
    >
    </el-pagination>
    <el-dialog title="编辑字典" :visible.sync="form.dialogFormVisible" width="600px" append-to-body>
      <el-form ref="form" name="dialog-form" :model="form.model" label-width="120px" size="mini">
        <el-input type="hidden" id="id" name="id" prop="id" v-model="form.model.id"></el-input>
        <el-form-item
          label="CODE"
          prop="dictCode"
          :rules="[
            { required: true, message: '不能为空', trigger: ['blur'] },
            { min: 1, max: 36, message: '长度在 1 到 36之间', trigger: ['blur'] }
          ]"
        >
          <el-input
            v-model="form.model.dictCode"
            :disabled="form.model.id"
            maxlength="36"
            placeholder="请认真填写，添加后，CODE将不能修改"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="VALUE"
          prop="dictValue"
          :rules="[
            { required: true, message: '不能为空', trigger: ['blur'] },
            { min: 1, max: 50, message: '长度在 1 到 50之间', trigger: ['blur'] }
          ]"
        >
          <el-input v-model="form.model.dictValue" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item
          label="父级编码"
          prop="parentCode"
          :rules="[
            { required: true, message: '不能为空', trigger: ['blur'] },
            { min: 1, max: 36, message: '长度在 1 到 36之间', trigger: ['blur'] }
          ]"
        >
          <el-input v-model="form.model.parentCode" :disabled="true" maxlength="36"></el-input>
        </el-form-item>
        <el-form-item
          label="字典分类"
          prop="category"
          :rules="[
            { required: true, message: '不能为空', trigger: ['blur'] },
            { min: 1, max: 36, message: '长度在 1 到 36之间', trigger: ['blur'] }
          ]"
        >
          <el-input v-model="form.model.category" :disabled="true" maxlength="36"></el-input>
        </el-form-item>
        <el-form-item
          label="排序参考值"
          prop="sortNum"
          :rules="[{ type: 'number', min: 0, max: 1000, message: '请输入0-1000之间的数字' }]"
        >
          <el-input v-model.number="form.model.sortNum" type="number" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item
          label="有效性"
          prop="enabled"
          :rules="[{ required: true, message: '不能为空', trigger: ['blur'] }]"
        >
          <el-radio-group v-model="form.model.enabled">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="form.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDictHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { dictApi } from "@/api/dictApi.js";
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      dicType: "",
      tableLeftData: [],
      activeDict: null,
      activeDictMsg: "当前字典种类：",
      tableDetailsData: [],
      tableDetailsParams: {
        category: "all"
      },
      paging: {
        pageIndex: 0,
        pageSize: 10,
        total: 0
      },
      form: {
        dialogFormVisible: false,
        model: {
          id: null,
          dictCode: null,
          dictValue: null,
          parentCode: null,
          category: null,
          sortNum: 0,
          enabled: true
        }
      }
    };
  },
  created() {
    this.doGetDictListForSysOfLeft();
  },
  methods: {
    nvaMenuSelect: function(index) {
      this.activeDict = this.tableLeftData.find(e => {
        return e.id === index;
      });
      if (this.activeDict) {
        this.activeDictMsg =
          "字典分类：" +
          this.activeDict.category +
          "，编码：" +
          this.activeDict.dictCode +
          "，值：" +
          this.activeDict.dictValue;
        this.doGetDictListForSysOfDetails();
      }
    },
    formatterEnabled: function(row) {
      if (row.enabled) return "启用";
      else return "禁用";
    },
    formatBoolean: function(row) {
      return row.basal && row.basal === true ? "是" : "否";
    },
    doGetDictListForSysOfLeft: function() {
      const params = {
        category: "all",
        pageIndex: this.paging.pageIndex,
        pageSize: this.paging.pageSize
      };
      this.loading1 = true;
      dictApi
        .getDictListForSys(params)
        .then(d => {
          if (d.data.resultCode === 0) {
            this.tableLeftData = d.data.data.data;
            if (this.tableLeftData.length > 0) {
              this.dicType = this.tableLeftData[0].id;
              this.nvaMenuSelect(this.dicType);
            }
          }
        })
        .finally(() => {
          this.loading1 = false;
        });
    },
    doGetDictListForSysOfDetails: function() {
      const params = {
        category: this.activeDict.category,
        pageIndex: this.paging.pageIndex,
        pageSize: this.paging.pageSize
      };
      this.loading = true;
      dictApi
        .getDictListForSys(params)
        .then(d => {
          if (d.data.resultCode === 0) {
            this.tableDetailsData = d.data.data.data;
            this.paging.total = d.data.data.recordTotal;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    current_change: function(currentPage) {
      this.paging.pageIndex = currentPage;
      this.doGetDictListForSysOfDetails();
    },
    size_change: function(pageSize) {
      this.paging.pageSize = pageSize;
      this.doGetDictListForSysOfDetails();
    },
    addHandleClick: function() {
      if (this.activeDict) {
        this.form.model = {
          id: null,
          dictCode: null,
          dictValue: null,
          parentCode: this.activeDict.dictCode,
          category: this.activeDict.category,
          sortNum: 0,
          enabled: true
        };
        this.form.dialogFormVisible = true;
      } else {
        this.$message({
          message: "请从左侧列表中选择字典种类",
          type: "warning"
        });
      }
    },
    editHandleClick: function(row) {
      this.form.model = {
        id: row.id,
        dictCode: row.dictCode,
        dictValue: row.dictValue,
        parentCode: this.activeDict.dictCode,
        category: this.activeDict.category,
        sortNum: row.sortNum,
        enabled: row.enabled
      };
      this.form.dialogFormVisible = true;
    },
    saveDictHandle: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          dictApi.saveDict(this.form.model).then(
            d => {
              if (d.data.resultCode === 0) {
                this.doGetDictListForSysOfDetails();
                this.form.dialogFormVisible = false;
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "保存失败，请稍候重试。" + d.data.resultMessage,
                  type: "warning"
                });
              }
            },
            error => {
              console.log(error);
              this.$message({
                message: "保存失败，请稍候重试。",
                type: "warning"
              });
            }
          );
        }
      });
    },
    deleteHandleClick: function(row) {
      this.$confirm("确定要删除字典[" + row.dictValue + "]吗?", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        dictApi.deleteDict(row.id).then(d => {
          if (d.data.resultCode === 0) {
            this.doGetDictListForSysOfDetails();
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
