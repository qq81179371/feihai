<template>
  <div class="warp">
    <search-bar>
      <info-title />
    </search-bar>
    <div class="details_box">
      <div class="runlf_box">
        <sidebar />
      </div>
      <div class="right_details">
        <device-detail-status />
        <div class="m_bottom" />
      </div>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchbar'
import infoTitle from './components/infoTitle'
import sidebar from './components/sidebar'
import deviceDetailStatus from './components/deviceDetailStatus'
export default {
  components: {
    sidebar,
    searchBar,
    infoTitle,
    deviceDetailStatus
  },
  data() {
    return {
      tabPosition: 'left'
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.warp {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0px;
  width: 100%;
  .details_box {
    display: flex;
    height: 100%;
    .runlf_box {
      width: 170px;
      height: 100%;
      border-right: 1px solid #ddd;
    }
    .right_details {
      width: 100%;
      padding: 30px;
      overflow-y: scroll;
      .m_bottom {
        margin-bottom: 30px;
      }
    }
  }
}
</style>
