<template>
  <div v-if="deviceDetails" class="warp">
    <div class="lists">
      <div
        v-for="item in deviceDetails.iot_module_list"
        :key="item.id"
        class="item"
        :class="{
          one_btn: item.type !== 2,
          kt_box: item.type === 2,
          five_box: item.type === 11,
          four_box: item.module_funtion_list && item.type !== 2,
          chuang_box: item.type === 5 || item.type === 8,
          zong_off: item.type === 0
        }"
      >
        <div class="lf">
          <div class="iconfont_box">
            <i class="iconfont" :class="iconfont[item.type]" />
          </div>
          <span>{{ item.name }}</span>
        </div>
        <div v-if="item.type === 5 || item.type === 8" class="c_box">
          <div class="btn">
            <div class="icon" @click="handlePutDeviceControl(item, 4096)">
              <img
                :src="jiang"
                alt
              >
            </div>
          </div>
          <div class="btn">
            <div class="icon" @click="handlePutDeviceControl(item, 8192)">
              <img
                :src="sheng"
                alt
              >
            </div>
          </div>
          <div class="btn">
            <div class="icon" @click="handlePutDeviceControl(item, 16384)">
              <img
                :src="zanting"
                alt
              >
            </div>
          </div>
        </div>
        <div v-if="item.type !== 5 && item.type !== 8" class="btn">
          <div class="icon" @click="handlePutDeviceControl(item, 2048)">
            <img
              v-if="item.onoff"
              src="./../../../assets/appIcon/kaiguang.png"
              alt
            >
            <img v-else src="./../../../assets/appIcon/kaiguangred.png" alt>
          </div>
        </div>
        <div class="rg_list">
          <div v-if="item.module_funtion_list" class="mode">
            <div
              v-for="(mIten, mIndex) in item.module_funtion_list"
              :key="mIten.function_id"
              class="m_item"
              :class="{
                active:
                  mIten.function_id === item.select_function || item.type === 4,
                disable: !item.onoff
              }"
              @click="
                handlePutDeviceControl(item, 16777216, mIten.function_id, 1)
              "
            >
              <div class="icon">
                <img
                  v-if="
                    mIten.function_id === item.select_function &&
                      item.type !== 4
                  "
                  src="./../../../assets/appIcon/quere.png"
                  alt
                >
                <img
                  v-if="item.type === 4"
                  :src="
                    fengSan[mIndex][
                      mIten.function_id === item.select_function
                        ? 'wxIcon'
                        : 'xzIcon'
                    ]
                  "
                >
                <img
                  v-if="item.type === 2"
                  :src="
                    kongTiao[mIndex][
                      mIten.function_id === item.mode ? 'xzIcon' : 'wxIcon'
                    ]
                  "
                >
              </div>
              <span>{{ mIten.function }}</span>
            </div>
          </div>
          <div v-if="item.type === 2" class="temperature">
            <div class="tp">
              <div
                class="icon"
                :class="{ disable: !item.onoff }"
                @click="temperatureControl(item, '-')"
              >
                <img src="./../../../assets/appIcon/jiang.png" alt>
              </div>
            </div>
            <span>{{ item.temperature }}℃</span>
            <div class="tp">
              <div
                class="icon"
                :class="{ disable: !item.onoff }"
                @click="temperatureControl(item, '+')"
              >
                <img src="./../../../assets/appIcon/jia.png" alt>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { classMaster } from '@/minix/classMaster.js'
import yid from '@/assets/appIcon/yidang.png'
import erd from '@/assets/appIcon/erdang.png'
import sand from '@/assets/appIcon/sandang.png'
import sid from '@/assets/appIcon/sidang.png'
import unyid from '@/assets/appIcon/yidangl.png'
import unerd from '@/assets/appIcon/erdangl.png'
import unsand from '@/assets/appIcon/sandangl.png'
import unsid from '@/assets/appIcon/sidangl.png'
import zl from '@/assets/appIcon/zhilenghui@2x.png'
import zll from '@/assets/appIcon/zhilenghuilu@2x.png'
import zr from '@/assets/appIcon/zhire.png'
import zrl from '@/assets/appIcon/zhirelu@2x.png'
import tf from '@/assets/appIcon/tongfeng@2x.png'
import tfl from '@/assets/appIcon/tongfenglu@2x.png'
import sheng from '@/assets/appIcon/升.png'
import jiang from '@/assets/appIcon/降.png'
import zanting from '@/assets/appIcon/停止 (1) 拷贝.png'
export default {
  mixins: [classMaster],
  data() {
    return {
      sheng,
      jiang,
      zanting,
      iconfont: {
        0: 'icon-weibiaoti--',
        1: 'icon-deng-',
        2: 'icon-kongtiao',
        3: 'icon-shumatubiaozhizuochunsezhuanqu-',
        4: 'icon-fengshan',
        5: 'icon-mubu',
        6: 'icon-diannao1',
        7: 'icon-menjin',
        8: 'icon-chuanglian',
        9: 'icon-diannao',
        11: 'icon-qitashebei'
      },
      fengSan: [
        {
          xzIcon: yid,
          wxIcon: unyid
        },
        {
          xzIcon: erd,
          wxIcon: unerd
        },
        {
          xzIcon: sand,
          wxIcon: unsand
        },
        {
          xzIcon: sid,
          wxIcon: unsid
        }
      ],
      kongTiao: [
        {
          xzIcon: zll,
          wxIcon: zl
        },
        {
          xzIcon: zrl,
          wxIcon: zr
        },
        {
          xzIcon: tfl,
          wxIcon: tf
        }
      ],
      ktControl: {}
    }
  },
  methods: {
    temperatureControl(item, alg) {
      if (alg === '-') {
        item.temperature--
      }
      if (alg === '+') {
        item.temperature++
      }
      this.handlePutDeviceControl(item, 16777216, item.temperature, 2)
    }
  }
}
</script>

<style lang="scss" scoped>
.warp {
  background: #f2f2f2;
  .lists {
    padding: 20px 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      padding: 15px 20px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 15px;
      .lf {
        display: flex;
        flex-direction: column;
        width: 75px;
        .iconfont_box {
          margin-bottom: 5px;
          .iconfont {
            font-size: 30px;
            color: #45b54c;
          }
        }
        span {
          font-size: 14px;
          color: #555;
        }
      }
      .btn {
        margin-left: 15px;
        .icon {
          cursor: pointer;
          width: 37px;
          height: 37px;
          box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
          &:hover {
            opacity: 0.8;
          }
        }
      }
      &.one_btn {
        width: 175px;
      }
      &.zong_off {
        width: 370px;
        display: flex;
        justify-content: space-between;
        padding-right: 28px;
        .rg_list {
          display: none;
        }
      }
      &.chuang_box {
        width: 370px;
        padding-right: 28px;
        .c_box {
          display: flex;
          width: 100%;
          justify-content: space-between;
          margin-right: 0;
        }
      }
      &.kt_box {
        width: 370px;
        .rg_list {
          margin-left: 15px;
          .mode {
            display: flex;
            width: 190px;
            display: flex;
            justify-content: space-between;
            .m_item {
              display: flex;
              cursor: pointer;
              flex-direction: column;
              align-items: center;
              .icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              span {
                margin-top: 5px;
                font-size: 14px;
                color: #999;
              }
            }
          }
          .temperature {
            width: 190px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            .tp {
              cursor: pointer;
              .icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            span {
              margin: 10px 0 0;
              font-size: 16px;
              color: #999;
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
      &.four_box {
        width: 370px;
        .rg_list {
          .mode {
            margin-left: 15px;
            width: 190px;
            display: flex;
            flex-wrap: wrap;
            .m_item {
              display: flex;
              align-items: center;
              cursor: pointer;
              width: 50%;
              margin: 10px 0;
              .icon {
                width: 20px;
                border: 1px solid #999;
                height: 20px;
                margin-right: 10px;
                border-radius: 50%;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              span {
                font-size: 16px;
                color: #999;
                white-space: nowrap;
              }
              &.active {
                .icon {
                  border: none;
                }
              }
            }
          }
        }
      }
      &.five_box {
        width: 370px;
        .rg_list {
          .mode {
            margin-left: 15px;
            width: 190px;
            display: flex;
            flex-wrap: wrap;
            .m_item {
              display: flex;
              align-items: center;
              cursor: pointer;
              width: 50%;
              margin: 10px 0;
              .icon {
                display: none;
                width: 20px;
                border: 1px solid #999;
                height: 20px;
                margin-right: 10px;
                border-radius: 50%;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              span {
                height: 25px;
                display: block;
                font-size: 14px;
                padding: 0 10px;
                display: flex;
                background: #f4f4f4;
                justify-content: center;
                align-items: center;
                color: #45b54c;
                white-space: nowrap;
                border-radius: 4px;
                border: 1px solid #e4e4e4;
              }
              &.active {
                .icon {
                  border: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
.disable {
  pointer-events: none;
}
</style>
