<template>
  <div class="warp">
    <div class="nav_bar">
      <div class="lf">
        <div class="logo">
          <img src="./../../assets/appIcon/logo.png" alt>
          <h4>斐海一体化管理平台</h4>
        </div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="rg">
        <router-link to="/login">返回登录页面</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '验证身份'
    }
  }
}
</script>

<style lang="scss" scoped>
.warp {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100px;
  background: #f0f0f0;
  .nav_bar {
    display: flex;
    align-items: center;
    width: 900px;
    justify-content: space-between;
    .lf {
      display: flex;
      align-items: center;
      .logo {
        // width: 235px;
        display: flex;
        align-items: center;
        height: 33px;
        img {
          margin: 0 10px 0 0;
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
        h4 {
          color: #999;
          font-size: 20px;
        }
      }
      .title {
        font-size: 24px;
        color: #30303c;
        margin-left: 50px;
      }
    }
    .rg {
      font-size: 12px;
      color: #828282;
    }
  }
}
</style>
