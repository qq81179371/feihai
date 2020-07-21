<template>
  <div class="warp_run">
    <search-bar>
      <search />
    </search-bar>
    <div class="content">
      <div class="runlf_box">
        <sidebar />
      </div>
      <div class="runright_box">
        <div class="details_box">
          <div class="lf_box">
            <device-list />
            <div v-if="!rightShow" class="open_up_left" @click="rightShow = !rightShow">
              <i class="iconfont icon-hou" />
            </div>
          </div>
          <transition name="slide-fade">
            <div v-show="rightShow" class="rg_box" :class="{an_1: rightShow, an_2: !rightShow}">
              <!-- <device-details /> -->
              <div v-if="rightShow" class="open_up_right" @click="rightShow = !rightShow">
                <i class="iconfont icon-hou" />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchbar'
import deviceList from './components/table'
import sidebar from './components/sidebar'
import search from './components/search'
export default {
  components: {
    deviceList,
    searchBar,
    sidebar,
    search
  },
  data() {
    return {
      rightShow: true
    }
  }
}
</script>

<style lang="scss" scoped>
.warp_run {
  .content {
    display: flex;
    .runlf_box {
      position: relative;
      padding: 30px 0 0;
      flex-shrink: 0;
      width: 160px;
      height: calc(100vh - 94px);
      border-right: 1px solid #ddd;
    }
    .runright_box {
      flex: 1;
      .details_box {
        display: flex;
        height: 100%;
        .lf_box {
          position: relative;
          background: #fff;
          height: 100%;
          flex: 1;
          transition: all 0.4s;
        }
        .rg_box {
          position: relative;
          flex-shrink: 0;
          background: #e5e5e5;
          width: 400px;
          &.an_1 {
            animation: widthSize 0.4s ease;
          }
          &.an_2 {
            animation: widthSizeL 0.4s ease;
          }
        }
        .open_up_right,
        .open_up_left {
          position: absolute;
          z-index: 2;
          right: 388px;
          top: 50%;
          margin-top: -40px;
          height: 80px;
          background: #d0d0d0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 12px;
          border-radius: 10px 0 0px 10px;
          transform: rotate(180deg);
          cursor: pointer;
          .iconfont {
            font-size: 12px;
            color: #656565;
          }
          &.open_up_left {
            transform: rotate(0deg);
            right: 0px;
          }
          &.open_up_right {
            animation: open_up_right_an 0.4s ease;
          }
        }
      }
      @keyframes widthSize {
        0% {
          width: 0px;
        }
        100% {
          width: 400px;
        }
      }
      @keyframes widthSizeL {
        0% {
          width: 400px;
        }
        100% {
          width: 0px;
        }
      }
      @keyframes open_up_right_an {
        0% {
          right: 0px;
        }
        100% {
          right: 388px;
        }
      }
    }
  }
  /deep/ .el-dialog__header {
    padding: 10px;
    margin: 10px;
    background: #EFEFEF;
    transform: translateY(20px);
    .el-dialog__headerbtn {
      top: 15px;
    }
  }
}
</style>
