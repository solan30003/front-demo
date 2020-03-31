<template>
  <div>
    <el-form
      :model="commandOrgan"
      :rules="rules"
      ref="commandOrgan"
      label="right"
      label-width="100px"
      size="small"
      v-loading="loading"
    >
      <div v-for="(itemA, index) in commandOrgan.itemSubList" :key="index">
        <!--指挥机构-->
        <div v-if="itemA.configCategory === 1">
          <div>
            <b>{{ index + 1 }}.指挥机构</b>
          </div>
          <el-form-item
            label="名称"
            :prop="'itemSubList.' + index + '.name'"
            :rules="[
              { required: true, message: '请输入名称', trigger: ['blur'] },
              { min: 0, max: 20, message: '长度在 1 到 20之间', trigger: ['blur'] }
            ]"
          >
            <el-input v-model="itemA.name"></el-input>
          </el-form-item>
          <el-form-item label="组织机构:" :prop="'itemSubList.' + index + '.orgId'" :rules="rules.orgId">
            <el-cascader
              ref="myCascader"
              :options="areaOptions"
              :props="organsProps"
              v-model="itemA.orgId"
              @change="organChanged(itemA.orgId, itemA)"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="人员:"
            :prop="'itemSubList.' + index + '.receiverStaffIdss'"
            :rules="rules.receiverStaffIdss"
          >
            <div v-if="itemA.peopleOptions.length === 0 && itemA.orgId" style="color:red">该区域暂无人员！</div>
            <el-checkbox-group v-model="itemA.receiverStaffIdss" v-if="itemA.peopleOptions.length > 0 && itemA.orgId">
              <el-checkbox v-for="item in itemA.peopleOptions" :key="item.staffId" :label="item.staffId">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="备注:"
            :prop="'itemSubList.' + index + '.remark'"
            :rules="[{ min: 0, max: 100, message: '长度在 0 到 100之间', trigger: ['blur'] }]"
          >
            <el-input type="textarea" v-model="itemA.remark" :rows="3" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </div>
        <!--单位指令-->
        <div v-if="itemA.configCategory === 2">
          <div>
            <b>{{ index + 1 }}.单位指令</b>
          </div>
          <el-form-item
            label="指令内容:"
            :prop="'itemSubList.' + index + '.content'"
            :rules="[
              { required: true, message: '请输指令内容', trigger: ['blur'] },
              { min: 1, max: 200, message: '长度在 1 到 200之间', trigger: ['blur'] }
            ]"
          >
            <el-input type="textarea" v-model="itemA.content" :rows="5" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="出动单位:" :prop="'itemSubList.' + index + '.orgId'" :rules="rules.orgId">
            <el-cascader
              ref="myCascader"
              :options="areaOptions"
              :props="organsProps"
              v-model="itemA.orgId"
              @change="organChanged(itemA.orgId, itemA)"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="人员:"
            :prop="'itemSubList.' + index + '.receiverStaffIdss'"
            :rules="rules.receiverStaffIdss"
          >
            <div v-if="itemA.peopleOptions.length === 0 && itemA.orgId" style="color:red">该区域暂无人员！</div>
            <el-checkbox-group v-model="itemA.receiverStaffIdss" v-if="itemA.peopleOptions.length > 0 && itemA.orgId">
              <el-checkbox v-for="item in itemA.peopleOptions" :key="item.staffId" :label="item.staffId">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="出动人数:" :prop="'itemSubList.' + index + '.actorOutNum'" :rules="rules.actorOutNum">
            <el-col :span="6">
              <el-input v-model.number="itemA.actorOutNum"></el-input>
            </el-col>
            <el-col :span="18">
              <div style="margin-left:8px;">人</div>
            </el-col>
          </el-form-item>
          <el-form-item label="备勤人数:" :prop="'itemSubList.' + index + '.actorInNum'" :rules="rules.actorInNum">
            <el-col :span="6">
              <el-input v-model.number="itemA.actorInNum"></el-input>
            </el-col>
            <el-col :span="18">
              <div style="margin-left:8px;">人</div>
            </el-col>
          </el-form-item>
          <el-form-item
            label="到场限时:"
            :prop="'itemSubList.' + index + '.arriveTimeLimit'"
            :rules="rules.arriveTimeLimit"
          >
            <el-col :span="6">
              <el-input v-model.number="itemA.arriveTimeLimit"></el-input>
            </el-col>
            <el-col :span="18">
              <div style="margin-left:8px;">分钟</div>
            </el-col>
          </el-form-item>
        </div>
        <!--个人指令-->
        <div v-if="itemA.configCategory === 3">
          <div>
            <b>{{ index + 1 }}.个人指令</b>
          </div>
          <div>
            <el-form-item
              label="指令内容:"
              :prop="'itemSubList.' + index + '.content'"
              :rules="[
                { required: true, message: '请输指令内容', trigger: ['blur'] },
                { min: 1, max: 200, message: '长度在 1 到 200之间', trigger: ['blur'] }
              ]"
            >
              <el-input type="textarea" v-model="itemA.content" :rows="5" maxlength="200" show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="执行人员:" :prop="'itemSubList.' + index + '.orgId'" :rules="rules.orgId">
              <el-cascader
                ref="myCascader"
                :options="areaOptions"
                :props="organsProps"
                v-model="itemA.orgId"
                @change="organChanged(itemA.orgId, itemA)"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              label="人员:"
              :prop="'itemSubList.' + index + '.receiverStaffIdss'"
              :rules="rules.receiverStaffIdss"
            >
              <div v-if="itemA.peopleOptions.length === 0 && itemA.orgId" style="color:red">该区域暂无人员！</div>
              <el-checkbox-group v-model="itemA.receiverStaffIdss" v-if="itemA.peopleOptions.length > 0 && itemA.orgId">
                <el-checkbox v-for="item in itemA.peopleOptions" :key="item.staffId" :label="item.staffId">{{
                  item.name
                }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="到场限时:"
              :prop="'itemSubList.' + index + '.arriveTimeLimit'"
              :rules="rules.arriveTimeLimit"
            >
              <el-col :span="6">
                <el-input v-model.number="itemA.arriveTimeLimit"></el-input>
              </el-col>
              <el-col :span="18">
                <div style="margin-left:8px;">分钟</div>
              </el-col>
            </el-form-item>
          </div>
        </div>
        <!--文本-->
        <div v-if="itemA.configCategory === 4">
          <div>
            <b>{{ index + 1 }}.文本</b>
          </div>
          <el-form-item label="文本:" prop="desc">
            <el-input type="textarea" v-model="itemA.content" :rows="5" maxlength="1024" show-word-limit></el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitcommandOrgan('commandOrgan')">提交</el-button>
        <el-button @click="resetcommandOrgan('commandOrgan')">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 文本 -->
</template>

<script>
import { commonApi } from "@/api/commonApi.js";
import { prePlanTmplApi } from "@/api/prePlanTmplApi.js";
import { prePlanInstcApi } from "@/api/prePlanInstcApi.js";
export default {
  data() {
    return {
      loading: false,
      id: "",
      dialogtitle: "",
      selectedOrgan: null,
      // peopleOptions: [],
      selectPepleNames: "",
      checkpeopleList: [],
      rules: {
        orgId: [{ required: true, message: "请选择", trigger: "change" }],
        receiverStaffIdss: [{ required: true, message: "请选择", trigger: "change" }],
        actorOutNum: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", min: 1, max: 65535, message: "请输入1-65535之间的数字", trigger: "blur" }
        ],
        actorInNum: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", min: 1, max: 65535, message: "请输入1-65535之间的数字", trigger: "blur" }
        ],
        arriveTimeLimit: [
          { required: true, message: "请输入", trigger: "blur" },
          { type: "number", min: 1, max: 65535, message: "请输入1-65535之间的数字", trigger: "blur" }
        ]
      },
      organsProps: {
        value: "id",
        label: "name",
        emitPath: false,
        checkStrictly: true
      },
      addtext: {
        text: ""
      },
      addtextRules: {
        text: [
          { required: true, message: "请输入文本", trigger: "blur" },
          { min: 1, message: "长度在不小于1个字符", trigger: "blur" }
        ]
      },
      areaOptions: []
    };
  },

  props: ["dialogdata"],
  computed: {
    dialogConfig() {
      return this.dialogdata;
    }
  },
  activated() {
    this.init();
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
    this.init();
  },
  methods: {
    init() {
      this.dialogdata.preplanExecInstcItemSubList.forEach(item => {
        if (item.orgId) this.ajaxPeopleList(item.orgId, item);
      });
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
    organChanged(orgId, obj) {
      // let label = this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join("/"); // 选择的组织机构 名称 包括上下级
      this.$set(obj, "receiverStaffIdss", []);
      this.$set(obj, "peopleOptions", []);
      this.ajaxPeopleList(orgId, obj);
    },
    //根据组织id获取人员
    ajaxPeopleList(orgId, obj) {
      commonApi.queryPeoplefromOrgan({ orgId: orgId.toString() }).then(
        res => {
          if (res.data.resultCode === 0) {
            obj.peopleOptions = res.data.data.data;
          }
        },
        err => {}
      );
    },
    /* getPeopleNameById(id) {
      for (let one of this.peopleOptions) {
        if (one.staffId === id) {
          return one.name;
        }
      }
    }, */
    //添加指挥机构 单位指令 人员指令
    submitcommandOrgan(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let obj = this.commandOrgan;
          obj.itemSubList.forEach(item => {
            item.receiverStaffIds = item.receiverStaffIdss.join();
            if (item.receiverStaffIdss.length > 0) {
              item.executorId = item.receiverStaffIdss[0];
            } else {
              item.executorId = null;
            }
          });
          this.loading = true;
          prePlanInstcApi
            .updateItemSubBatch(obj)
            .then(res => {
              if (res.data.resultCode === 0) {
                this.$message({
                  showClose: true,
                  type: "success ",
                  message: "更新成功！"
                });
                this.$emit("closeDiaTest");
              } else {
                this.$message({
                  showClose: true,
                  type: "error ",
                  message: res.data.resultMessage
                });
                this.$emit("closeDiaTest");
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetcommandOrgan(formName) {
      this.$refs[formName].resetFields();
      this.$emit("closeDiaTest");
    },

    resetaddText(formName) {
      this.$refs[formName].resetFields();
      this.$emit("closeDiaTest");
    },
    cancelFun() {
      this.$refs[formName].resetFields();
      this.$emit("closeDiaTest");
    }
  },

  watch: {
    dialogdata: {
      handler(val, oldVal) {
        console.log("监听到变化");
        console.log(val);
        let _self = this;
        this.commandOrgan = {};
        this.commandOrgan.infoType = val.infoType;
        this.commandOrgan.itemSubList = val.preplanExecInstcItemSubList;
        this.commandOrgan.planInstcItemId = val.planInstcItemId;
        this.commandOrgan.itemSubList.forEach(function(item) {});
      },
      deep: true,
      immediate: true
    },
    checkpeopleList(val) {
      //[ "1001", __ob__: Observer]

      let nameList = [];
      for (let one of this.peopleOptions) {
        if (val.indexOf(one.staffId) !== -1) {
          nameList.push(one.name);
        }
      }
      this.selectPepleNames = nameList.join(",");
      console.log("sssssssssssssval", val);
    }
  }
};
</script>
<style lang="scss" scoped></style>
