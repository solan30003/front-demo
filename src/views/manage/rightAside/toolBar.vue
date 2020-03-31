<template>
  <div class="main-style">
    <div class="tool-header" v-loading="loading">
      <span>工具栏</span>
      <span style="float:right;">
        <span v-for="(item,index) in toolsList" :key="index">
          <el-link
            v-if="item.disable"
            :underline="false"
            class="el-icon-folder-add icon-plus-style"
            disabled
          ></el-link>
          <el-link
            v-if="!item.disable"
            :underline="false"
            class="el-icon-folder-add icon-plus-style"
            @click="goToAdd(item)"
          ></el-link>
          <span>{{item.name}}</span>
        </span>
      </span>
    </div>
    <div class="content-style">
      <div v-for="(item,index) in contentsList" :key="index">
        <div
          v-if="item.type === '1'"
          class="item-main"
          style="padding-bottom: 8px;line-height: 48px;"
        >
          <span class="span-title">{{item.title}}:</span>
          <span class="span-content">{{item.content}}</span>
          <i
            class="el-icon-delete"
            style="float:right;font-size: 20px;color:red;line-height: 48px;margin-left:12px;"
            @click="delOneSub(index)"
          ></i>
          <i
            class="el-icon-edit"
            style="float:right;font-size: 20px;line-height: 48px;"
            @click="editOneSub(index)"
          ></i>
        </div>
        <div
          v-if="item.type === '2'"
          class="item-main"
          style="padding-bottom: 12px;padding-top: 12px;"
        >
          <el-row>
            <span class="span-title">指令内容:</span>
            <span class="span-content">{{item.content}}</span>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="span-title">出动单位:</span>
              <span class="span-content">{{item.unit}}</span>
            </el-col>
            <el-col :span="12">
              <span class="span-title">责任人:</span>
              <span class="span-content">{{item.people}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <span class="span-title">出动人数:</span>
              <span class="span-content">{{item.actorOutNum}}人</span>
            </el-col>
            <el-col :span="6">
              <span class="span-title">备勤人数:</span>
              <span class="span-content">{{item.actorInNum}}人</span>
            </el-col>
            <el-col :span="6">
              <span class="span-title">到场时限:</span>
              <span class="span-content">{{item.arriveTimeLimit}}分钟</span>
            </el-col>
            <el-col :span="6">
              <i
                class="el-icon-delete"
                style="float:right;font-size: 20px;color:red;margin-left:12px;"
                @click="delOneSub(index)"
              ></i>
              <i
                class="el-icon-edit"
                style="float:right;font-size: 20px;"
                @click="editOneSub(index)"
              ></i>
            </el-col>
          </el-row>
        </div>
        <div
          v-if="item.type === '3'"
          class="item-main"
          style="padding-bottom: 12px;padding-top: 12px;"
        >
          <el-row>
            <span class="span-title">指令内容:</span>
            <span class="span-content">{{item.content}}</span>
          </el-row>
          <el-row>
            <span class="span-title">执行人员:</span>
            <span class="span-content">{{item.people}}</span>
          </el-row>
          <el-row>
            <el-col :span="8">
              <span class="span-title">到场时限:</span>
              <span class="span-content">{{item.arriveTimeLimit}}分钟</span>
            </el-col>
            <el-col :span="16">
              <i
                class="el-icon-delete"
                style="float:right;font-size: 20px;color:red;margin-left:12px;"
                @click="delOneSub(index)"
              ></i>
              <i
                class="el-icon-edit"
                style="float:right;font-size: 20px;"
                @click="editOneSub(index)"
              ></i>
            </el-col>
          </el-row>
        </div>
        <div v-if="item.type === '4'" class="item-main">
          <p>
            {{item.content}}
            <i class="el-icon-delete icon-del-style" @click="delOneSub(index)"></i>
            <i class="el-icon-edit icon-edit-style" @click="editOneSub(index)"></i>
          </p>
        </div>
      </div>
    </div>
    <businessDialog ref="dialogcontent" :dialogdata="dialogdata" @refresh="refreshTable"></businessDialog>
  </div>
</template>

<script>
import businessDialog from "./businessDialog";
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";
export default {
  data() {
    return {
      allData: [],
      dialogtitle: "",
      toolsList: [
        { id: "1", name: "指挥机构", disable: true },
        { id: "3", name: "人员指令", disable: true },
        { id: "2", name: "单位指令", disable: true },
        { id: "4", name: "文本", disable: true }
      ],
      contentsList: [],
      addtext: {
        text: ""
      },
      loading: false,
      addtextRules: {
        text: [
          { required: true, message: "请输入文本", trigger: "blur" },
          { min: 1, message: "长度在不小于1个字符", trigger: "blur" }
        ]
      },
      areaOptions: [],
      dialogdata: {
        visible: false,
        type: "", // 类型
        addstatus: true, //新建
        stageId: "" //
      }
    };
  },

  props: {
    propDatasfortoolbar: {
      type: Object
    }
  },
  components: { businessDialog },
  created() {},
  watch: {
    propDatasfortoolbar: {
      handler(newdata, olddata) {
        this.refreshTable();
      },
      deep: true
    }
  },
  created() {},
  methods: {
    initforAdd() {
      this.toolsList = [
        { id: "1", name: "指挥机构", disable: true },
        { id: "3", name: "人员指令", disable: true },
        { id: "2", name: "单位指令", disable: true },
        { id: "4", name: "文本", disable: true }
      ];
      this.contentsList = [];
    },

    refreshTable() {
      this.contentsList = [];
      this.loading = true;
      prePlanTmplApi.queryDatailorProcess({ planTmplItemId: this.propDatasfortoolbar.stageId }).then(
        res => {
          this.loading = false;
          if (res.data.resultCode === 0) {
            this.allData = res.data.data;
            this.setContentListfromData(res.data.data);
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.loading = false;
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    },
    setContentListfromData(data) {
      for (let item of data) {
        if (item.configCategory === 1) {
          this.contentsList.push({
            id: item.id,
            title: `${item.name}`,
            content: `${item.orgName} ${item.executorName}`,
            type: "1"
          });
        } else if (item.configCategory === 2) {
          this.contentsList.push({
            id: item.id,
            content: item.content,
            unit: item.orgName,
            people: item.executorName,
            actorOutNum: item.actorOutNum,
            actorInNum: item.actorInNum,
            arriveTimeLimit: item.arriveTimeLimit,
            type: "2"
          });
        } else if (item.configCategory === 3) {
          this.contentsList.push({
            id: item.id,
            content: item.content,
            people: item.executorName,
            arriveTimeLimit: item.arriveTimeLimit,
            type: "3"
          });
        } else {
          this.contentsList.push({
            id: item.id,
            content: `${item.content}`,
            type: "4"
          });
        }
      }
    },
    goToAdd(item) {
      this.setDialogTitle(item.id, true);
      this.dialogdata = {
        visible: true,
        title: this.dialogtitle,
        type: item.id, // 类型
        addstatus: true, //新建
        stageId: this.propDatasfortoolbar.stageId // 详情id,
      };
       this.$nextTick(() => {
        this.$refs["dialogcontent"].initforAdd(this.dialogdata);
      });
    },
    //编辑单条
    editOneSub(index) {
      let subid = this.contentsList[index].id;
      let onedata = this.allData.find(item => {
        return item.id === subid;
      });
      this.setDialogTitle(onedata.configCategory.toString(), false);
      this.dialogdata = this.getDefaultDialogData(onedata, subid);
      this.$nextTick(() => {
        this.$refs["dialogcontent"].initforEdit(this.dialogdata);
      });
    },
    getDefaultDialogData(onedata, subid) {
      return {
        title: this.dialogtitle,
        visible: true,
        type: onedata.configCategory.toString(), // 类型 2 单位 3人员
        addstatus: false, //修改
        stageId: this.propDatasfortoolbar.stageId, // 详情id,
        formdata: {
          name: onedata.name,
          people: "", //人员
          organ: "", //z组织机构
          desc: onedata.remark,
          content: onedata.content, //指令
          arrivenums: onedata.actorOutNum,
          backnums: onedata.actorInNum,
          time: onedata.arriveTimeLimit
        },
        orgId: onedata.orgId,
        executorId: onedata.executorId,
        text: onedata.content,
        subid: subid,
        stageId: this.propDatasfortoolbar.stageId
      };
    },
    setDialogTitle(type, addstatus) {
      if (addstatus) {
        this.dialogtitle =
          type === "1" ? "添加指挥机构" : type === "2" ? "添加单位指令" : type === "3" ? "添加人员指令" : "添加文本";
      } else {
        this.dialogtitle =
          type === "1" ? "修改指挥机构" : type === "2" ? "修改单位指令" : type === "3" ? "修改人员指令" : "修改文本";
      }
    },
    delOneSub(index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajaxDelete(index);
        })
        .catch(() => {});
    },
    ajaxDelete(index) {
      prePlanTmplApi.deleteItemonDatailorProcess({ planItemSubId: this.contentsList[index].id }).then(
        res => {
          if (res.data.resultCode === 0) {
            this.refreshTable();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        },
        err => {
          this.$message({
            message: err,
            type: "error"
          });
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.main-style {
  height: calc(100% - 64px);
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(161, 161, 161, 1);
}
.tool-header {
  height: 20px;
  background: rgba(201, 201, 201, 1);
  padding: 8px;
  line-height: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #5e5e5e;
}
.content-style {
  height: calc(100% - 60px);
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 1);
  padding: 8px 16px;
}
.icon-plus-style {
  margin-right: 8px;
  margin-left: 8px;
}
/deep/ {
  .el-link.el-link--default.is-disabled {
    color: #5e5e5e;
  }
}
p {
  color: #5e5e5e;
  text-indent: 2em;
  line-height: 1.8em;
  font-size: 18px;
}
.icon-edit-style {
  float: right;
  font-size: 20px;
}
.icon-del-style {
  float: right;
  color: red;
  font-size: 20px;
  margin-left: -20px;
}
.item-main {
  border-bottom: 1px dashed #5e5e5e;
}
.span-title {
  font-weight: 600;
  font-size: 18px;
  margin-left: 32px;
  margin-right: 8px;
}
.span-content {
  font-size: 18px;
}
</style>