<template>
  <div class="navbar">
    <hamburger
      v-if="false"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <logo class="breadcrumb-container" :collapse="false" />
    <div class="right-menu">
      <div class="school_name">
        <span>{{ schoolName }}</span>
      </div>
      <!-- <div class="notification">
        <el-badge :value="2" :max="99" class="item">
          <el-button class="share-button" icon="el-icon-message-solid" />
        </el-badge>
      </div> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="vertical_line" />
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span>{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/password" target="_blank">
            <el-dropdown-item>
              <span>修改密码</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
// import { postChangePassword } from '@/api/app'
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import logo from './Sidebar/Logo'
export default {
  components: {
    // Breadcrumb,
    Hamburger,
    logo
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
    var validateNewPass = (rule, value, callback) => {
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
      outerVisible: false,
      copyMod: {
        password: '',
        new_password: '',
        new_password_true: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        new_password: [
          { validator: validateNewPass, trigger: 'blur' }
        ],
        new_password_true: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'schoolName'])
  },
  methods: {
    handlerCopyRunMod() {},
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background-image: url('./../../assets/topbar_bg.png');
  // background-size: cover;
  background: #45b54c;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    .notification {
      width: 50px;
      .share-button {
        color: #fff;
        font-size: 24px;
        width: auto;
        height: auto;
        padding: 0;
        background: none;
        border: none;
      }
    }
    &:focus {
      outline: none;
    }
    .school_name {
      font-size: 14px;
      color: #fff;
      margin: 0 20px 0 0;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        height: 50px;
        align-items: center;
        .vertical_line {
          width: 2px;
          height: 11px;
          background: rgba(232, 232, 232, 1);
          margin-right: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        span {
          font-size: 14px;
          color: #fff;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-badge__content.is-fixed {
  right: -10px;
  transform: translateY(0) translateX(0);
}
</style>
