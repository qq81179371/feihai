
<template>
  <div class="change_warp">
    <el-form ref="ruleForm" :model="ruleForm" status-icon size="small" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="密码:" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码:" prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button class="e_btn" type="primary" @click="submitForm('ruleForm')">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { postChangePassword } from '@/api/app'
import md5 from 'js-md5'
export default {
  props: {
    phone: {
      type: String,
      default: null
    },
    steps: {
      type: Number,
      default: null
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          try {
            await postChangePassword({
              phone: this.phone,
              password: md5(this.ruleForm.pass)
            })
            this.$emit('update:steps', 3)
          } catch (err) {
            throw (err)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.change_warp {
  margin-top: 60px;
  .e_btn {
    width: 100px;
    background: #FE6041;
    border: none;
    &:hover {
      opacity: .9;
    }
  }
}
</style>
