<template>
  <div class="warp">
    <el-tabs v-model="activeName" class="t">
      <el-tab-pane label="账户登录" name="first">
        <el-form :model="ruleForm" class="demo-ruleForm">
          <el-form-item label="">
            <el-input v-model="ruleForm.name" clearable placeholder="请输入内容">
              <template slot="prepend">
                <i class="el-icon-user-solid" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="ruleForm.password" clearable type="password" placeholder="请输入内容" @keyup.enter.native="handleGetLoginInfo">
              <template slot="prepend">
                <i class="el-icon-lock" />
              </template>
            </el-input>
          </el-form-item>
          <router-link to="/forgetPassword">
            <p>忘记密码</p>
          </router-link>
          <el-button
            :type="!ruleForm.name || !ruleForm.password ? 'info' : 'success'"
            style="width:100%"
            :disabled="!ruleForm.name || !ruleForm.password"
            @click="handleGetLoginInfo"
          >登录</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  data() {
    return {
      activeName: 'first',
      ruleForm: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    handleGetLoginInfo(item) {
      const userInfo = {
        login: {
          name: this.ruleForm.name,
          password: md5(this.ruleForm.password)
        },
        school_info: {
          school_id: null
        }
      }
      this.$store.dispatch('user/login', userInfo).then(() => {
        this.$router.push({ path: this.redirect || '/' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 20px;
  text-align: right;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}
/deep/ .el-form-item {
  background: #fff !important;
}
/deep/ .el-input-group--prepend {
  display: flex !important;
}
/deep/ .el-input-group__prepend {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>
