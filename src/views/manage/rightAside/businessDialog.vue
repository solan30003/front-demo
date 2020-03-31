<template>
  <div>
    <el-dialog
      v-loading="loading"
      v-if="dialogdata.type !== '4'"
      :title="dialogdata.title"
      :visible.sync="dialogvisible"
      :append-to-body="true"
      width="400px"
    >
      <!-- 指挥机构 单位指令 人员指令 -->
      <el-form
        :model="commandOrgan"
        :rules="commandOrganRules"
        ref="commandOrgan"
        label="right"
        label-width="100px"
        size="small"
      >
        <el-form-item v-if=" dialogdata.type === '1'" label="名称:" prop="name">
          <el-input v-model="commandOrgan.name"></el-input>
        </el-form-item>
        <el-form-item
          v-if="dialogdata.type === '2' || dialogdata.type === '3'"
          label="指令内容:"
          prop="content"
        >
          <el-input type="textarea" v-model="commandOrgan.content"></el-input>
        </el-form-item>
        <el-form-item v-show="dialogdata.type !== '4'" label="责任人:" prop="people">
          <el-cascader
            ref="myCascader"
            :options="areaOptions"
            :props="organsProps"
            v-model="selectedOrgan"
            @change="organChanged"
          ></el-cascader>
          <div v-if="peopleOptions.length === 0 && selectedOrgan" style="color:red">该区域暂无人员！</div>
          <el-checkbox-group
            v-model="checkpeopleList"
            v-if="peopleOptions.length > 0 && selectedOrgan"
          >
            <el-checkbox
              v-for="item in peopleOptions "
              :key="item.staffId"
              :label="item.staffId"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="dialogdata.type === '2'" label="出动人数:" prop="arrivenums">
          <el-col :span="6">
            <el-input v-model.number="commandOrgan.arrivenums"></el-input>
          </el-col>
          <el-col :span="18">
            <div style="margin-left:8px;">人</div>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogdata.type === '2'" label="备勤人数:" prop="backnums">
          <el-col :span="6">
            <el-input v-model.number="commandOrgan.backnums"></el-input>
          </el-col>
          <el-col :span="18">
            <div style="margin-left:8px;">人</div>
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogdata.type === '1'" label="备注:" prop="desc">
          <el-input type="textarea" v-model="commandOrgan.desc"></el-input>
        </el-form-item>

        <el-form-item
          v-if="dialogdata.type === '2' || dialogdata.type === '3'"
          label="到场限时:"
          prop="time"
        >
          <el-col :span="6">
            <el-input v-model.number="commandOrgan.time"></el-input>
          </el-col>
          <el-col :span="18">
            <div style="margin-left:8px;">分钟</div>
          </el-col>
        </el-form-item>
        <el-button
          style="margin-right:8px"
          type="primary"
          @click="submitcommandOrgan('commandOrgan')"
          size="small"
        >提交</el-button>
        <el-button
          style="margin-right:8px"
          size="small"
          @click="resetcommandOrgan('commandOrgan')"
        >取消</el-button>
      </el-form>
      <!-- 文本 -->
    </el-dialog>

    <el-dialog
      v-if="dialogdata.type === '4' "
      :rules="addtextRules"
      :title="dialogdata.title"
      :visible.sync="dialogvisible"
      :append-to-body="true"
      width="50%"
    >
      <el-form
        :model="addtext"
        ref="addtext"
        label="right"
        label-width="100px"
        size="small"
        :rules="addtextRules"
      >
        <el-form-item label="添加文本:" prop="text">
          <el-input
            :autosize="{ minRows: 6, maxRows: 100}"
            minlength="1"
            maxlength="1024"
            type="textarea"
            v-model="addtext.text"
          ></el-input>
        </el-form-item>
        <el-button
          style="margin-right:8px"
          type="primary"
          @click="submitText('addtext')"
          size="small"
        >提交</el-button>
        <el-button style="margin-right:8px" size="small" @click="resetaddText('addtext')">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { commonApi } from "@/api/commonApi.js";
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      this.commandOrgan.name = this.commandOrgan.name.trim();
      if (this.commandOrgan.name === "") {
        callback(new Error("请输入"));
      } else {
        callback();
      }
    };
    var checkNum = (rule, value, callback) => {
      const val = parseInt(value, 10);
      if (!val && value !== "" && val !== 0) {
        return callback(new Error("数字不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(val)) {
          callback(new Error("请输入数字值"));
        } else {
          if (val > 65535 || val < 1) {
            callback(new Error("请输入1-65535之间的数字"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var checkPeople = (rule, value, callback) => {
      if (!this.checkpeopleList.length > 0) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    };
    return {
      id: "",
      loading: false,
      dialogvisible: false,
      dialogtitle: "",
      selectedOrgan: null,
      peopleOptions: [],
      selectPepleNames: "",
      checkpeopleList: [],
      commandOrgan: {
        name: "",
        people: "",
        organ: "",
        desc: "",
        content: "",
        arrivenums: null,
        backnums: null,
        time: null
      },
      addtextRules: {
        text: [
          { required: true, message: "请输入文本", trigger: "blur" },
          { min: 1, max: 1024, message: "请输入长度在 1 到 1024 之间的字符", trigger: "blur" }
        ]
      },
      commandOrganRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 20, message: "请输入长度在 1 到 1024 之间的字符", trigger: "blur" },
          { validator: checkName }
        ],
        content: [
          { required: true, message: "请输入指令", trigger: "blur" },
          { min: 1, max: 1024, message: "请输入长度在 1 到 1024 之间的字符", trigger: "blur" }
        ],
        people: [{ validator: checkPeople }],
        arrivenums: [{ validator: checkNum }],
        backnums: [{ validator: checkNum }],
        time: [{ validator: checkNum }]
      },
      organsProps: {
        value: "id",
        label: "name",
        emitPath: false
      },
      addtext: {
        text: ""
      },
      areaOptions: []
    };
  },

  props: {
    dialogdata: {
      type: Object
    }
  },
  computed: {
    dialogConfig() {
      return this.dialogdata;
    }
  },
  created() {},
  watch: {
    checkpeopleList(val) {
      let nameList = [];
      for (let one of this.peopleOptions) {
        if (val.indexOf(one.staffId) !== -1) {
          nameList.push(one.name);
        }
      }
      this.selectPepleNames = nameList.join(",");
    }
  },
  created() {
    //查询组织机构
    commonApi.queryOrgansTree().then(
      res => {
        if (res.data.resultCode === 0) {
          this.setChildren(res.data.data);
          this.areaOptions = res.data.data;
        }
      },
      err => {
        this.$message({
          message: "查询组织机构失败!",
          type: "error"
        });
      }
    );
  },
  methods: {
    initforAdd(dialogdata) {
      this.selectedOrgan = null;
      this.checkpeopleList = [];
      this.commandOrgan = {
        name: "",
        people: "",
        organ: "",
        desc: "",
        content: "",
        arrivenums: null,
        backnums: null,
        time: null
      };
      this.addtext = {
        text: ""
      };
      if (this.$refs["commandOrgan"]) {
        this.$refs["commandOrgan"].resetFields();
      }
      if (this.$refs["addtext"]) {
        this.$refs["addtext"].resetFields();
      }
      this.dialogvisible = dialogdata.visible;
    },
    initforEdit(dialogdata) {
      this.peopleOptions = [];
      this.dialogdata = dialogdata;
      this.addtext.text = dialogdata.text;
      this.commandOrgan = dialogdata.formdata;
      this.id = dialogdata.subid;
      this.selectedOrgan = dialogdata.orgId;
      if (this.dialogdata.type !== "4") {
        commonApi.queryPeoplefromOrgan({ orgId: this.selectedOrgan }).then(
          res => {
            if (res.data.resultCode === 0) {
              this.peopleOptions = res.data.data.data;
              this.checkpeopleList = dialogdata.executorId.split(",");
              this.dialogvisible = true;
              this.loading = false;
            } else {
              this.$message({
                message: res.data.resultMessage,
                type: "error"
              });
            }
          },
          err => {
            this.$message({
              message: res.data.resultMessage,
              type: "error"
            });
          }
        );
      }
    },
    setChildren(datas) {
      //把children 设置成 null
      for (var i in datas) {
        if (datas[i].children.length === 0) {
          datas[i].children = null;
          this.setChildren(datas[i].children);
        }
      }
    },
    //选择组织机构变化
    organChanged() {
      let organid = this.selectedOrgan ? this.selectedOrgan : this.dialogdata.orgId;
      commonApi.queryPeoplefromOrgan({ orgId: organid.toString() }).then(
        res => {
          if (res.data.resultCode === 0) {
            this.peopleOptions = res.data.data.data;
          }
        },
        err => {}
      );
    },
    getPeopleNameById(id) {
      for (let one of this.peopleOptions) {
        if (one.staffId === id) {
          return one.name;
        }
      }
    },
    //添加指挥机构 单位指令 人员指令
    submitcommandOrgan(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogdata.type === "1") {
            this.submitCommandOrgan();
          } else if (this.dialogdata.type === "2") {
            this.submitUnitCommand();
          } else {
            this.submitPeopleCommand();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //指挥机构
    submitCommandOrgan() {
      if (this.dialogdata.addstatus) {
        this.addcommandOrgan();
      } else {
        this.modifyCommandOrgan();
      }
    },
    addcommandOrgan() {
      console.log("ssssssssssssssssssssssssssssssssthis.checkpeopleList", this.checkpeopleList);
      let params = {
        orgName: this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"),
        executorId: this.checkpeopleList.filter(res => res !== "undefined").join(","),
        executorName: this.selectPepleNames,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 1,
        name: this.commandOrgan.name,
        orgId: this.selectedOrgan,
        userRelEntityList: this.checkpeopleList.map(item => {
          return {
            tmplItemSubId: "",
            userId: item,
            userName: this.getPeopleNameById(item)
          };
        }),
        remark: this.commandOrgan.desc
      };

      prePlanTmplApi.addItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "添加成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    modifyCommandOrgan() {
      let params = {
        id: this.id,
        orgName: this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"),
        executorId: this.checkpeopleList.filter(res => res !== "undefined").join(","),
        executorName: this.selectPepleNames,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 1,
        name: this.commandOrgan.name,
        orgId: this.selectedOrgan,
        userRelEntityList: this.checkpeopleList.map(item => {
          return {
            tmplItemSubId: "",
            userId: item,
            userName: this.getPeopleNameById(item)
          };
        }),
        remark: this.commandOrgan.desc
      };

      prePlanTmplApi.ModifyItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    //单位指令
    submitUnitCommand() {
      if (this.dialogdata.addstatus) {
        this.addUnitCommand();
      } else {
        this.ModifyUnitCommand();
      }
    },
    addUnitCommand() {
      let params = {
        orgName: this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"),
        executorId: this.checkpeopleList.filter(res => res !== "undefined").join(","),
        executorName: this.selectPepleNames,
        content: this.commandOrgan.content,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 2,
        orgId: this.selectedOrgan,
        userRelEntityList: this.checkpeopleList.map(item => {
          return {
            tmplItemSubId: "",
            userId: item,
            userName: this.getPeopleNameById(item)
          };
        }),
        actorInNum: this.commandOrgan.arrivenums,
        actorOutNum: this.commandOrgan.backnums,
        arriveTimeLimit: this.commandOrgan.time
      };
      prePlanTmplApi.addItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "添加成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    ModifyUnitCommand() {
      let params = {
        id: this.id,
        executorId: this.checkpeopleList.filter(res => res !== "undefined").join(","),
        orgName: this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"),
        executorName: this.selectPepleNames,
        content: this.commandOrgan.content,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 2,
        orgId: this.selectedOrgan,
        userRelEntityList: this.checkpeopleList.map(item => {
          return {
            tmplItemSubId: "",
            userId: item,
            userName: this.getPeopleNameById(item)
          };
        }),
        actorInNum: this.commandOrgan.arrivenums,
        actorOutNum: this.commandOrgan.backnums,
        arriveTimeLimit: this.commandOrgan.time
      };
      prePlanTmplApi.ModifyItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    //人员指令
    submitPeopleCommand() {
      if (this.dialogdata.addstatus) {
        this.addPeopleCommand();
      } else {
        this.ModifyPeopleCommand();
      }
    },
    addPeopleCommand() {
      let params = {
        orgName: this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"),
        executorId: this.checkpeopleList.filter(res => res !== "undefined").join(","),
        executorName: this.selectPepleNames,
        content: this.commandOrgan.content,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 3,
        orgId: this.selectedOrgan,
        userRelEntityList: this.checkpeopleList.map(item => {
          return {
            tmplItemSubId: "",
            userId: item,
            userName: this.getPeopleNameById(item)
          };
        }),
        arriveTimeLimit: this.commandOrgan.time
      };
      prePlanTmplApi.addItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "添加成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    ModifyPeopleCommand() {
      let params = {
        id: this.id,
        executorId: this.checkpeopleList.filter(res => res !== "undefined").join(","),
        orgName: this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"),
        executorName: this.selectPepleNames,
        content: this.commandOrgan.content,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 3,
        orgId: this.selectedOrgan,
        userRelEntityList: this.checkpeopleList.map(item => {
          return {
            tmplItemSubId: "",
            userId: item,
            userName: this.getPeopleNameById(item)
          };
        }),
        arriveTimeLimit: this.commandOrgan.time
      };
      prePlanTmplApi.ModifyItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    resetcommandOrgan(formName) {
      this.$refs[formName].resetFields();
      this.dialogvisible = false;
    },
    // 添加文本
    submitText(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogdata.addstatus) {
            this.addOneText();
          } else {
            this.modifyOneText();
          }
          this.dialogvisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addOneText() {
      let params = {
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 4,
        id: "",
        content: this.addtext.text
      };
      prePlanTmplApi.addItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "添加成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    modifyOneText() {
      let params = {
        id: this.id,
        planTmplItemId: this.dialogdata.stageId,
        configCategory: 4,
        content: this.addtext.text
      };
      prePlanTmplApi.ModifyItemonDatailorProcess(params).then(
        res => {
          if (res.data.resultCode === 0) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$emit("refresh");
            this.dialogvisible = false;
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
    },
    resetaddText(formName) {
      this.$refs[formName].resetFields();
      this.dialogvisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>