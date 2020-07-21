<template>
  <div>
    <navbar class="nav_bar" :title="title" />
    <div class="warp p_top">
      <el-steps :space="300" :active="steps" align-center finish-status="success">
        <el-step title="验证身份" />
        <el-step title="修改登录密码" />
        <el-step title="完成" />
      </el-steps>
      <verifyIdentidy v-if="steps === 1" :phone.sync="phone" :steps.sync="steps" />
      <changeLoginpassword v-if="steps === 2" :phone="phone" :steps.sync="steps" />
      <div v-if="steps === 3" class="change_complete">
        <i class="iconfont icon-zhengque1 green" />
        <div>
          <h5>修改成功,请牢记新的登录密码</h5>
          <p @click="logout">重新登录</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '@/components/PassworkNav'
import verifyIdentidy from './components/verifyIdentidy'
import changeLoginpassword from './components/changeLoginpassword'
import Cookies from 'js-cookie'
export default {
  components: {
    Navbar,
    verifyIdentidy,
    changeLoginpassword
  },
  data() {
    return {
      steps: 1,
      phone: '',
      title: '验证身份'
    }
  },
  watch: {
    steps(newVal) {
      if (newVal === 1) {
        this.title = '验证身份'
      }
      if (newVal === 2) {
        this.title = '修改登录密码'
      }
      if (newVal === 3) {
        this.title = '完成'
      }
      Cookies.set('steps', newVal)
    }
  },
  created() {
    this.steps = +Cookies.get('steps') || 1
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      Cookies.set('steps', 1)
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.warp {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .el-steps {
    min-width: 900px;
  }
  &.p_top {
    padding-top: 100px;
  }
  .change_complete {
    display: flex;
    align-items: center;
    margin-top: 60px;
    width: 700px;
    align-items: center;
    background: #EDFED0;
    padding: 20px 50px;
    .iconfont {
      font-size: 50px;
      margin-right: 20px;
    }
    h5 {
      margin: 5px 0 5px 0;
      font-size: 18px;
    }
    p {
      margin: 5px 0 5px 0;
      cursor: pointer;
      font-size: 14px;
      color: #FE6041;
    }
  }
}
</style>
