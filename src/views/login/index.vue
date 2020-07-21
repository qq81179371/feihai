<template>
  <div class="login-container">
    <div class="container">
      <div class="logo_title">
        <!-- <img src="./../../assets/login_img/logo32.png" alt> -->
        <img src="./../../assets/appIcon/logo.png" alt>
        <h4>斐海一体化管理平台</h4>
      </div>
      <localhostLogin v-if="source === 3" />
      <el-tabs v-if="!loginStatus && source !== 3" v-model="activeName">
        <el-tab-pane label="短信登录" name="first">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入内容"
                class="input-with-select"
                :class="{bgfff: loginForm.username}"
              >
                <el-select slot="prepend" v-model="select" placeholder="请选择">
                  <el-option label value="+86" />
                </el-select>
              </el-input>
            </el-form-item>
            <slider ref="slider" class="slider_vac" :confirm-success.sync="confirmSuccess" />
            <el-form-item v-if="confirmSuccess" class="verify_code">
              <el-input
                v-model="loginForm.code"
                type="text"
                placeholder="验证码"
                @keyup.enter.native="handleLogin"
              />
              <el-button
                :loading="loading"
                class="get_code"
                :disabled="buttonType === 'info'"
                :type="buttonType"
                @click.native.prevent="handleGetPhoneCode"
              >{{ count ? `请稍后(${count}s)` : '获取验证码' }}</el-button>
            </el-form-item>
            <el-button
              :type="!loginForm.username || !loginForm.code ? 'info' : 'success'"
              style="width:100%"
              :disabled="!loginForm.username || !loginForm.code"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="扫码登录" name="second">扫码登录</el-tab-pane>
      </el-tabs>
      <choose-school v-if="loginStatus && source !== 3" :server-list="serverList" :login-form="loginForm" />
    </div>
    <div class="footer">
      <p class="gray" style="font-size: 14px">
        <a href="http://gd.beian.miit.gov.cn" target="_blank" class="gray">粤ICP备18101430号</a> Copyright 2017-2020 All Rights Reserved
      </p>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getPhoneCode, getServerKey, getServerList } from '@/api/user'
import slider from './components/slider'
import chooseSchool from './components/chooseSchool'
import localhostLogin from './components/localhostLogin'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: {
    slider,
    chooseSchool,
    localhostLogin
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      loginStatus: false,
      activeName: 'first',
      loginForm: {
        username: '',
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ]
      },
      select: '+86',
      loading: false,
      redirect: undefined,
      count: '',
      serverList: [],
      buttonType: 'success',
      confirmSuccess: false
    }
  },
  computed: {
    ...mapGetters(['source'])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    const data = Cookies.get('count')
    if (data) {
      const s = JSON.parse(data)
      if (Date.now() / 1000 - s.data < s.count) {
        this.count = ~~(s.count - (Date.now() / 1000 - s.data))
      } else {
        this.count = ''
      }
    }
    this.handleCountdown()
  },
  methods: {
    async handleLogin() {
      const { username, code } = this.loginForm
      const key = await getServerKey({
        login: {
          name: username,
          code: code
        }
      })
      try {
        const res = await getServerList({
          login: {
            name: key.key
          }
        })
        Cookies.set('count', '')
        this.serverList = res.school
        this.loginStatus = true
      } catch (error) {
        console.log(error)
      }
    },
    async handleGetPhoneCode() {
      const TIME_COUNT = 60
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const res = await getPhoneCode({
            phone_login: {
              phone: this.loginForm.username
            }
          })
          if (!this.timer && res) {
            this.count = TIME_COUNT
            this.handleCountdown()
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
    handleCountdown() {
      if (this.count > 0) {
        this.buttonType = 'info'
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
            Cookies.set('count', JSON.stringify({ count: this.count, data: Date.now() / 1000 }))
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.buttonType = 'success'
            this.count = ''
          }
        }, 1000)
      } else {
        this.buttonType = 'success'
        this.count = ''
      }
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #282828;
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      box-sizing: border-box;
    }
  }
  .el-form-item {
    border: 1px solid #ccc;
    background: #f4f4f4;
    border-radius: 4px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: url("~@/assets/login_img/组图.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
  .container {
    box-shadow: 0px 0px 24px rgba(228, 238, 246, 1);
    background: #fff;
    position: fixed;
    width: 400px;
    padding: 0px 30px;
    border-radius: 4px;
    right: 300px;
    height: 560px;
    @media screen and (max-width: 1400px) {
      right: 50px;
    }
    @media screen and (max-width: 1600px) {
      right: 200px;
    }
    top: 130px;
    .logo_title {
      display: flex;
      // justify-content: center;
      align-items: center;
      margin: 60px 0 60px;
      img {
        max-width: 50px;
        margin-right: 10px;
      }
      h4 {
        font-size: 20px;
        color: #888;
      }
    }
    .login-form {
      max-width: 100%;
      margin: 0 auto;
      .input-with-select {
        display: flex;
        align-items: center;
        width: 100%;
        >>> .el-select {
          width: 70px;
          padding: 0;
          flex-shrink: 0;
          background: #f4f4f4;
          border-right: 1px solid #ddd;
        }
        >>> .el-input-group__prepend {
          width: auto;
          /deep/ .el-input__inner {
            background: #f4f4f4 !important;
          }
        }
        &.bgfff {
          /deep/ .el-input__inner {
            background: #fff;
          }
        }
      }
    }
    /deep/ .el-tabs__header {
      margin-bottom: 30px;
    }
    >>> .el-tabs__item {
      // height: 75px;
      // line-height: 75px;
      font-size: 16px;
      color: #666;
    }
    /deep/ .is-active {
      color: #47b34f;
    }
    >>> .el-tabs__active-bar {
      background-color: #47b34f;
    }
    >>> .slider_vac {
      margin-bottom: 20px;
    }
    .verify_code {
      background: none;
      border: none;
      >>> .el-form-item__content {
        display: flex;
        align-items: center;
        width: 100%;
        /deep/ .el-input {
          width: 116px;
          height: 42px;
          border: 1px solid rgba(221, 221, 221, 1);
          border-radius: 4px;
          margin-right: 10px;
        }
        .get_code {
          width: 112px;
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    .container {
      right: 50%;
      transform: translateX(50%);
    }
  }
}
.footer {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
