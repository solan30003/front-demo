<template>
  <div style="height: 100%;">
    <el-row style="height: 100%;">

      <!-- 左边-->
      <el-col :span="8" style="height: 100%;padding: 0px 15px;border: 1px solid red;">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic" style="margin-top: 50px;">
          <el-form-item
            prop="email"
            label="页码"
            :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]"
          >
            <el-input v-model="dynamicValidateForm.email"></el-input>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'参数'+ index "
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{
      required: true, message: '域名不能为空', trigger: 'blur'
    }"
          >
            <el-input v-model="domain.value"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
            <el-button @click="addDomain">新增参数</el-button>
            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 右边-->
      <el-col :span="16" style="height: 100%;border: 1px solid red;">
        <img :src="imgPath" />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>

</style>



<script>
  import imgPath from "@/assets/images/map.png";
  // import {queryPlanType,searchPlanList ,searchPlanListSuggest,startPlan } from "@/api/serviceAll.js";
  export default {
    data() {
      return {
        imgPath: imgPath,
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        }
      };
    },
    created() {
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        });
      }
    }
  }
</script>
