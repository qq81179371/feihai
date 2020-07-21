<template>
  <div class="warp">
    <div class="tit">
      <p>
        手机验证码验证 账户
        <span>{{ phone }}</span>为确认是你本人操作,请完成以下验证
      </p>
    </div>
    <ul class="form">
      <li>
        <span class="lable">手机号码:</span>
        <p>{{ phone }}</p>
      </li>
      <li>
        <span class="lable">验证码:</span>
        <el-input v-model="code" class="i_item" size="small" placeholder="验证码" />
        <el-button
          :loading="loading"
          size="small"
          class="get_code"
          :disabled="buttonType === 'info'"
          :type="buttonType"
          @click.native.prevent="handleGetPhoneCode"
        >{{ count ? `请稍后(${count}s)` : '获取验证码' }}</el-button>
        <div v-if="vShow" class="point">
          <i class="iconfont icon-zhengque1 green" />
          验证码已发送, 15分钟内输入有效
        </div>
      </li>
      <li class="btn_li">
        <span class="lable" />
        <el-button
          class="e_btn"
          size="small"
          :disabled="code === ''"
          type="warning"
          @click.native.prevent="handleSubmitPhoneCode"
        >确定</el-button>
      </li>
    </ul>
    <div class="bottom-tips">
      <div class="bottom-tips-title">没收到短信验证码？</div>
      <ul class="ui-list ui-list-nosquare">
        <li class="ui-list-item">
          <span class="ui-list-item-text">1、网络通讯异常可能会造成短信丢失，请重新获取或稍后再试。</span>
        </li>
        <li class="ui-list-item">
          <span class="ui-list-item-text">2、请核实手机是否已欠费停机，或者屏蔽了系统短信。</span>
        </li>
        <li class="ui-list-item">
          <span class="ui-list-item-text">3、如果手机已丢失或停用， 请选择其他验证方式 。</span>
        </li>
        <li class="ui-list-item">
          <span class="ui-list-item-text">4、您也可以尝试将SIM卡移动到另一部手机，然后重试。</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getPhoneVerifyCode, postPhoneVerifyCode } from '@/api/app'
import Cookies from 'js-cookie'
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
    return {
      count: 0,
      vShow: false,
      loading: false,
      buttonType: 'success',
      code: ''
    }
  },
  created() {
    const data = Cookies.get('count1')
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
    async handleGetPhoneCode() {
      const TIME_COUNT = 60
      try {
        this.loading = true
        await getPhoneVerifyCode({
          phone: this.phone
        })
        this.count = TIME_COUNT
        this.loading = false
        this.vShow = true
        this.handleCountdown()
      } catch (err) {
        this.loading = false
        throw (err)
      }
    },
    async handleSubmitPhoneCode() {
      try {
        await postPhoneVerifyCode({
          phone: this.phone,
          code: `${this.code}`
        })
        this.$emit('update:steps', 2)
      } catch (err) {
        throw (err)
      }
    },
    handleCountdown() {
      if (this.count > 0) {
        this.buttonType = 'info'
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= 60) {
            this.count--
            Cookies.set('count1', JSON.stringify({ count: this.count, data: Date.now() / 1000 }))
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

<style lang="scss" scoped>
.tit {
  margin: 60px 0 30px;
  p {
    font-size: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    color: #666;
    span {
      color: sandybrown;
    }
  }
}
ul.form {
  li {
    position: relative;
    display: flex;
    margin-bottom: 40px;
    align-items: center;
    .lable {
      width: 100px;
      flex-shrink: 0;
      text-align: right;
      font-size: 14px;
      color: #555;
      margin-right: 15px;
    }
    p {
      font-size: 14px;
      color: #333;
    }
    .i_item {
      width: 100px;
      margin-right: 15px;
    }
    .e_btn {
      width: 100px;
    }
    .point {
      position: absolute;
      left: 115px;
      bottom: -20px;
      font-size: 12px;
      color: #888;
      white-space: nowrap;
    }
  }
}
.bottom-tips {
  margin-top: 50px;
  width: 600px;
  padding: 30px;
  background: #fffbed;
  .bottom-tips-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  .ui-list {
    .ui-list-item {
      .ui-list-item-text {
        font-size: 12px;
        color: #666;
      }
      line-height: 24px;
    }
  }
}
</style>
