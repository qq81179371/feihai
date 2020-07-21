<template>
  <div class="warp">
    <el-tabs v-model="activeName" class="t">
      <el-tab-pane label="选择学校" name="first">
        <div class="lists scroll">
          <div v-for="item in serverList" :key="item.school_id" class="item" @click="handleGetLoginInfo(item)">
            <div class="lf">
              <div class="icon">
                <i class="iconfont icon-xuexiao" />
                <div class="sub_script">
                  <i v-if="item.is_online" class="iconfont icon-zhengque1" />
                  <i v-else class="iconfont icon-jinyong" />
                </div>
              </div>
            </div>
            <div class="rg">
              <div class="tit">
                <span>{{ item.name }}</span>
              </div>
              <div class="icon">
                <i v-if="item.is_online" class="iconfont icon-jiantou" />
                <span v-else>离线</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'ChooseSchool',
  props: {
    serverList: {
      type: Array,
      default: () => []
    },
    loginForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleGetLoginInfo(item) {
      const userInfo = {
        login: {
          name: this.loginForm.username,
          password: this.loginForm.code
        },
        school_info: {
          school_id: item.school_id
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
.lists {
  max-height: 220px;
  overflow: auto;
  .item {
    cursor: pointer;
    display: flex;
    align-items: center;
    .lf {
      width: 40px;
      .icon {
        position: relative;
        .icon-xuexiao {
          font-size: 26px;
          color: #666;
        }
        .sub_script {
          background: #fff;
          width: 14px;
          height: 16px;
          border-radius: 50%;
          position: absolute;
          bottom: -3px;
          left: 16px;
          font-size: 12px;
          .icon-jinyong {
            transform: rotate(90deg);
            color: #999;
            display: inline-block;
            font-size: 12px;
          }
          .icon-zhengque1 {
            color: #45B54C;
            font-size: 12px;
          }
        }
      }
    }
    .rg {
      display: flex;
      align-items: center;
      flex: 1;
      border-bottom: 1px solid #ddd;
      justify-content: space-between;
      padding: 22px 20px 15px 0;
      .tit {
        font-size: 16px;
        color: #666;
      }
      .icon {
        font-size: 16px;
        .icon-jiantou {
          display: inline-block;
          color: #c9c9c9;
          transform: rotate(-180deg);
        }
        span {
          color: #666;
        }
      }
    }
  }
}
</style>
