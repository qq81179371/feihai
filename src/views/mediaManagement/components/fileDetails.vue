<template>
  <div class="file_details_warp">
    <div class="file_title">
      {{ fileDetails.file_name }}
    </div>
    <div class="file_content">
      <ul>
        <li v-if="fileDetails.creator">
          <i class="iconfont icon-yonghu1" />
          <span>创建者: {{ fileDetails.creator }}</span>
        </li>
        <li v-if="fileDetails.hasOwnProperty('for_all_users')">
          <i class="iconfont icon-kejian" />
          <span>所有用户可见: {{ fileDetails.for_all_users === 0 ? '是' : '否' }}</span>
        </li>
        <li v-if="fileDetails.create_time">
          <i class="iconfont icon-shangchuan" />
          <span>创建时间: {{ fileDetails.create_time }}</span>
        </li>
        <li v-if="fileDetails.update_time">
          <i class="iconfont icon-gengxin" />
          <span>更新时间: {{ fileDetails.update_time }}</span>
        </li>
        <li v-if="fileDetails.file_size">
          <i class="iconfont icon-daxiao1" />
          <span>文件大小(字节): {{ fileDetails.file_size }}</span>
        </li>
        <li v-if="fileDetails.file_duration">
          <i class="iconfont icon-shijian" />
          <span>文件时长(秒): {{ fileDetails.file_duration }}</span>
        </li>
        <li v-if="fileDetails.video_size">
          <i class="iconfont icon-xianshiqi1" />
          <span>分辨率: {{ fileDetails.video_size }}</span>
        </li>
        <li v-if="fileDetails.sample_rate">
          <i class="iconfont icon-zhexiantu" />
          <span>采样率: {{ fileDetails.sample_rate }}</span>
        </li>
        <li v-if="fileDetails.channels">
          <i class="iconfont icon-shuju" />
          <span>通道数: {{ fileDetails.channels }}</span>
        </li>
        <li v-if="fileDetails.old_file_name">
          <i class="iconfont icon-ziyuan" />
          <span>原文件名: {{ fileDetails.old_file_name }}</span>
        </li>
        <li v-if="fileDetails.place">
          <i class="iconfont icon-weizhi" />
          <span>位置: {{ fileDetails.place }}</span>
        </li>
        <li v-if="fileDetails.select_source">
          <i class="iconfont icon-yuan" />
          <span>采播源输入端口: {{ select_source[fileDetails.select_source] }}</span>
        </li>
        <li v-if="fileDetails.url">
          <i class="iconfont icon-wangzhi" />
          <span>url: {{ fileDetails.url }}</span>
        </li>
        <li v-if="fileDetails.review_reason">
          <i class="iconfont icon-jujueliyou red" />
          <span class="red">拒绝原因: {{ fileDetails.review_reason }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fileDetails: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      select_source: {
        0: 'HDMI1',
        1: 'HDMI2',
        3: '电脑'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file_details_warp {
  border-left: 1px solid #f0f0f0 ;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  .file_title {
    height: 67px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: #fff;
    font-size: 20px;
    font-weight: bold;
    color: #555;
  }
  .file_content {
    padding: 20px 15px 0;
    height: 100%;
    display: flex;
    ul {
      background: #fff;
      border-radius: 4px 4px 0px 0px;
      flex: 1;
      padding: 20px 30px 0;
      li {
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        padding: 10px 10px;
        i {
          margin-right: 10px;
          font-size: 18px;
          color: #666;
        }
        font-size: 14px;
        color: #555;
      }
    }
  }
}
</style>
