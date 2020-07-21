<template>
  <div v-if="taskDetailsObj" class="details_warp">
    <div v-if="taskDetailsObj.type === 1" class="device_center">
      <div class="title">
        <div class="lf">
          <i class="iconfont icon-shebeiguanli" />
          <span>设备控制</span>
        </div>
      </div>
      <div class="table">
        <div class="item">
          <div class="yuan">名称</div>
          <div class="hm">开关</div>
          <div class="type">本地控制</div>
        </div>
        <div v-for="(item, index) in taskDetailsObj.iot_control" :key="index" class="item item_son">
          <span class="yuan gray">{{ item.name }}</span>
          <span
            class="hm"
            :class="item.state === 1? 'green' : 'gray'"
          >{{ item.state === 1? '开' : '关' }}</span>
          <span
            class="type"
            :class="controlName[item.local_control_id].color"
          >{{ controlName[item.local_control_id].name }}</span>
        </div>
      </div>
    </div>
    <div v-if="taskDetailsObj.type === 2" class="audio_center">
      <div class="title">
        <div class="lf">
          <i class="iconfont icon-guangbo" />
          <span>广播源</span>
        </div>
      </div>
      <div class="lists">
        <div
          v-for="(item, index) in taskDetailsObj.input[0].source_url"
          :key="index"
          class="item"
        >{{ item.name }}</div>
      </div>
    </div>
    <div v-if="taskDetailsObj.type === 3" class="video_center">
      <div class="title">
        <div class="lf">
          <i class="iconfont icon-kujialeqiyezhan_zhinengbuju" />
          <span>画面布局</span>
        </div>
      </div>
      <div class="box">
        <div class="tit">布局{{ taskDetailsObj.screen_style }}</div>
        <div class="icon">
          <img :src="layOutImg[taskDetailsObj.screen_style - 1]" alt>
        </div>
      </div>
    </div>
    <div v-if="taskDetailsObj.type === 3" class="video_box">
      <div class="title">
        <div class="lf">
          <i class="iconfont icon-guangbo" />
          <span>广播源</span>
        </div>
      </div>
      <div class="table">
        <div class="item">
          <div class="hm">画面</div>
          <div class="yuan">广播源</div>
          <div class="type">类型</div>
          <div class="hm no_bor">声音</div>
        </div>
        <div v-for="(item, index) in taskDetailsObj.input" :key="index" class="item item_son">
          <div class="hm">{{ item.screen }}</div>
          <div class="yuan">
            <el-popover placement="left" width="200" trigger="hover">
              <p v-for="(sItem, Iindex) in item.source_url" :key="Iindex">{{ sItem.name }}</p>
              <p slot="reference">
                <span v-for="(sItem, Iindex) in item.source_url" :key="Iindex">{{ sItem.name }}</span>
              </p>
            </el-popover>
          </div>
          <div class="type">
            <el-tooltip :content="source[item.source_type].name" class="icon" placement="right">
              <i class="iconfont" :class="source[item.source_type].icon" />
            </el-tooltip>
          </div>
          <div class="hm no_bor">{{ item.has_voice === 1 ? '有' : '无' }}</div>
        </div>
      </div>
    </div>
    <div class="youxianji">
      <div class="lf">
        <div class="icon">
          <i class="iconfont icon-youxianji" />
        </div>
        <span>优先级</span>
      </div>
      <div class="rg">
        <span>{{ taskDetailsObj.priority }}</span>
      </div>
    </div>
    <div v-if=" taskDetailsObj.placelist" class="receiving_member">
      <div class="title">
        <div class="lf">
          <i class="iconfont icon-morenfanwei" />
          <span>接收成员</span>
        </div>
        <div class="rg" @click="memberShow =true">
          <el-link>查看详情</el-link>
          <i class="iconfont icon-arrow-left" />
        </div>
      </div>
      <div class="lists">
        <div v-for="item in taskDetailsObj.placelist" :key="item.id" class="item">
          <div class="tit">{{ item.r }}</div>
          <p>
            <span v-for="sItem in item.room" :key="sItem.id">{{ sItem.r }}</span>
          </p>
        </div>
      </div>
      <div class="total">
        <span>共{{ taskDetailsObj | memberTotal }}个</span>
      </div>
    </div>
    <div class="execution_time">
      <div class="title">
        <div class="lf">
          <i class="iconfont icon-shijian" />
          <span>执行时间</span>
        </div>
        <div v-if="taskDetailsObj.time_type !== 3" class="rg" @click="timeShow = true">
          <el-link>查看详情</el-link>
          <i class="iconfont icon-arrow-left" />
        </div>
      </div>
      <div v-if="taskDetailsObj.time_type !== 3" class="lists">
        <div class="item">
          <div class="tit">运行</div>
          <p>
            <span v-for="(item, index) in taskDetailsObj.time.time" :key="index">{{ item }}</span>
          </p>
        </div>
      </div>
      <div v-if="taskDetailsObj.time_type === 3" class="manual">手动操作</div>
      <div v-if="taskDetailsObj.time_type !== 3" class="total">
        <span>共{{ taskDetailsObj.time.time.length }}个</span>
      </div>
      <div v-if="taskDetailsObj.type !== 1" class="repeat">
        <div class="item">
          <div class="tit">时长</div>
          <p>{{ taskDetailsObj | timeConversion }}</p>
        </div>
      </div>
      <div v-if="taskDetailsObj.time_type !== 3" class="repeat">
        <div class="item">
          <div class="tit">重复</div>
          <p v-if="taskDetailsObj.time_type === 1">
            <span v-for="(item, index) in taskDetailsObj.time.week" :key="index">{{ week[item] }}</span>
          </p>
          <p v-if="taskDetailsObj.time_type === 2">
            <span v-for="(item, index) in taskDetailsObj.time.date" :key="index">{{ item }}</span>
          </p>
        </div>
        <div v-if="taskDetailsObj.time.date" class="total">
          <span>共{{ taskDetailsObj.time.date.length }}个</span>
        </div>
      </div>
    </div>
    <el-dialog class="el-dialog-box" title="接收成员" :visible.sync="memberShow">
      <div class="receiving_member_tc">
        <div class="lists">
          <div v-for="item in taskDetailsObj.placelist" :key="item.id" class="item">
            <div class="tit">{{ item.r }}</div>
            <p>
              <span v-for="sItem in item.room" :key="sItem.id">{{ sItem.r }}</span>
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="el-dialog-box" title="执行时间" :visible.sync="timeShow">
      <div class="execution_time_tc">
        <div class="lists">
          <div class="item">
            <div class="tit">运行</div>
            <p>
              <span v-for="(item, index) in taskDetailsObj.time.time" :key="index">{{ item }}</span>
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import buju1 from '@/assets/buju/buju1.png'
import buju2 from '@/assets/buju/bujuer.png'
import buju3 from '@/assets/buju/bujusa.png'
import buju4 from '@/assets/buju/bujusi.png'
import buju5 from '@/assets/buju/bujuwu.png'
import buju6 from '@/assets/buju/bujul.png'
import buju7 from '@/assets/buju/bujuqi.png'
import buju8 from '@/assets/buju/bujuba.png'
import buju9 from '@/assets/buju/bujujiu.png'
export default {
  name: 'TaskDetails',
  filters: {
    memberTotal(arr) {
      if (arr) {
        let num = 0
        arr.placelist.forEach(e => {
          num += e.room.length
        })
        return num
      }
    },
    timeConversion(val) {
      if (val) {
        let result = val.time.duration
        const h =
          Math.floor(result / 3600) < 10
            ? '0' + Math.floor(result / 3600)
            : Math.floor(result / 3600)
        const m =
          Math.floor((result / 60) % 60) < 10
            ? '0' + Math.floor((result / 60) % 60)
            : Math.floor((result / 60) % 60)
        const s =
          Math.floor(result % 60) < 10
            ? '0' + Math.floor(result % 60)
            : Math.floor(result % 60)
        return (result = h + ':' + m + ':' + s)
      }
    }
  },
  props: {
    taskDetailsObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      controlName: {
        '-1': {
          name: '默认',
          color: 'gray'
        },
        0: {
          name: '禁用',
          color: 'red'
        },
        1: {
          name: '允许',
          color: 'green'
        }
      },
      timeShow: false,
      memberShow: false,
      taskId: null,
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      taskIcon: {
        0: 'icon-weibiaoti--',
        1: 'icon-deng-',
        2: 'icon-kongtiao',
        3: 'icon-shumatubiaozhizuochunsezhuanqu-',
        4: 'icon-fengshan',
        6: 'icon-diannao1',
        7: 'icon-menjin',
        8: 'icon-chuanglian',
        9: 'icon-diannao',
        11: 'icon-qita'
      },
      layOutImg: [
        buju1,
        buju2,
        buju3,
        buju4,
        buju5,
        buju6,
        buju7,
        buju8,
        buju9
      ],
      // layOutImg: [
      //   'https://www.feihaiyun.com/home/images/buju1.png',
      //   'https://www.feihaiyun.com/home/images/bujuer.png',
      //   'https://www.feihaiyun.com/home/images/bujusa.png',
      //   'https://www.feihaiyun.com/home/images/bujusi.png',
      //   'https://www.feihaiyun.com/home/images/bujuwu.png',
      //   'https://www.feihaiyun.com/home/images/bujuliu.png',
      //   'https://www.feihaiyun.com/home/images/bujuqi.png',
      //   'https://www.feihaiyun.com/home/images/bujuba.png',
      //   'https://www.feihaiyun.com/home/images/bujujiu.png'
      // ],
      source: {
        1: {
          icon: 'icon-duomeiti',
          name: '视频'
        },
        2: {
          icon: 'icon-yinpin',
          name: '音频'
        },
        3: {
          icon: 'icon-zhibo',
          name: '在线互联网直播'
        },
        4: {
          icon: 'icon-guankanzhibo',
          name: '实时采播'
        }
      }
    }
  },
  // onLoad(options) {
  //   if (options) {
  //     this.taskId = Number(options.id)
  //     this.handleGetTaskDetails()
  //   }
  // },
  methods: {}
}
</script>

<style lang="scss" scoped>
.details_warp {
  &::-webkit-scrollbar {
    width: 4px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #999;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  overflow-x: hidden;
  height: calc(100vh - 154px);
  // flex: 1;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  max-width: 400px;
  width: 400px;
  .device_center {
    padding-top: 15px;
    background: #fff;
    border-radius: 15px;
    .lists {
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;
      .item {
        margin-bottom: 15px;
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .iconfont {
          font-size: 30px;
          color: #45b54c;
          margin-bottom: 8px;
        }
        span {
          font-size: 14px;
          color: #555;
        }
      }
    }
  }
  .audio_center {
    padding: 15px 0 0;
    width: 100%;
    background: #fff;
    border-radius: 15px;
    width: 100%;
    .lists {
      display: flex;
      flex-direction: column;
      padding: 15px;
      .item {
        font-size: 14px;
        color: #555;
        font-weight: 500;
        line-height: 24px;
      }
    }
  }
  .video_box {
    padding: 10px 0 15px 0;
    border-radius: 15px;
    margin-top: 10px;
    background: #fff;
    .table {
      width: 100%;
      .item {
        width: 100%;
        height: 30px;
        display: flex;
        border-bottom: 1px solid #e5e5e5;
        .hm,
        .yuan {
          border-right: 1px solid #e5e5e5;
          font-size: 13px;
          color: #555;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hm {
          width: 60px;
          flex-shrink: 0;
        }
        .yuan {
          padding: 0 10px;
          // width: 240px;
          flex: 1;
          flex-shrink: 0;
          p {
            width: 139px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .type {
          flex-shrink: 0;
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #555;
          border-right: 1px solid #e5e5e5;
          width: 60px;
        }
        .no_bor {
          flex-shrink: 0;
          border-right: none;
        }
        &.item_son {
          .hm,
          .yuan {
            font-size: 14px;
            color: #999;
          }
        }
      }
    }
  }
  .device_center {
    padding: 10px 0 15px 0;
    border-radius: 15px;
    margin-top: 10px;
    background: #fff;
    .table {
      width: 100%;
      .item {
        width: 100%;
        height: 30px;
        display: flex;
        border-bottom: 1px solid #e5e5e5;
        .hm,
        .yuan {
          border-right: 1px solid #e5e5e5;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hm {
          flex-shrink: 0;
        }
        .yuan {
          padding: 0 10px;
          flex: 1;
        }
        .type {
          flex-shrink: 0;
          font-size: 13px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #e5e5e5;
          width: 60px;
        }
        .no_bor {
          flex-shrink: 0;
          border-right: none;
        }
        &.item_son {
          .hm,
          .yuan {
            font-size: 14px;
          }
        }
      }
    }
    .table {
      .item {
        .type {
          flex: 1;
          width: auto;
          border-right: none;
        }
        .hm {
          flex: 1;
          width: auto;
        }
      }
    }
  }
  .video_center {
    padding: 10px 0 0 0;
    background: #fff;
    border-radius: 15px;
    .box {
      width: 100%;
      padding: 15px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .icon {
        width: 135px;
        height: 75px;
      }
      .tit {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .youxianji {
    display: flex;
    align-items: center;
    max-width: 370px;
    height: 45px;
    background: rgba(255, 255, 255, 1);
    border-radius: 15px;
    margin-top: 10px;
    padding: 0 15px;
    justify-content: space-between;
    .lf {
      display: flex;
      align-items: center;
      .icon {
        width: 21px;
        color: #4fb956;
        height: 21px;
        margin: 0 15px 0 0;
      }
      span {
        font-size: 14px;
        color: #555;
      }
    }
    .rg {
      font-size: 14px;
      color: #999;
    }
  }
  .receiving_member {
    margin-top: 10px;
    width: 100%;
    padding: 15px 0;
    border-radius: 15px;
    background: #fff;
    .lists {
      padding: 15px 15px 0;
      .item {
        margin-bottom: 7px;
        display: flex;
        align-items: center;
        .tit {
          height: 20px;
          margin-right: 7px;
          flex-shrink: 0;
          padding: 0 4px;
          border-radius: 3px;
          background: #4fb956;
          font-size: 14px;
          line-height: 20px;
          color: #fff;
        }
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: #555;
          span {
            margin-right: 7px;
          }
        }
      }
    }
  }
  .receiving_member_tc {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background: #fff;
    .lists {
      max-height: 100%;
      padding: 10px 10px 0;
      .item {
        margin-bottom: 7px;
        display: flex;
        .tit {
          height: 20px;
          margin-right: 7px;
          flex-shrink: 0;
          padding: 0 4px;
          line-height: 20px;
          border-radius: 3px;
          background: #4fb956;
          font-size: 14px;
          color: #fff;
        }
        p {
          font-size: 14px;
          color: #555;
          line-height: 18px;
          display: flex;
          flex-wrap: wrap;
          span {
            margin-right: 7px;
          }
        }
      }
    }
  }
  .execution_time {
    margin-top: 10px;
    width: 100%;
    padding: 15px 0;
    border-radius: 15px;
    background: #fff;
    .lists {
      padding: 15px 15px 0;
      .item {
        margin-bottom: 7px;
        display: flex;
        .tit {
          height: 20px;
          line-height: 20px;
          margin: 0 7px 0 0;
          flex-shrink: 0;
          padding: 0 4px;
          border-radius: 3px;
          background: #4fb956;
          font-size: 14px;
          color: #fff;
        }
        p {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
          color: #555;
          line-height: 21px;
          span {
            margin-right: 7px;
          }
        }
      }
    }
    .manual {
      padding: 15px;
      font-size: 15px;
      color: #555;
    }
  }
  .execution_time_tc {
    width: 100%;
    border-radius: 15px;
    background: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    .lists {
      flex: 1;
      padding: 10px 10px 0;
      .item {
        margin-bottom: 7px;
        display: flex;
        .tit {
          height: 20px;
          margin: 0px 7px 0 0;
          flex-shrink: 0;
          padding: 0 4px;
          line-height: 20px;
          border-radius: 3px;
          background: #4fb956;
          font-size: 14px;
          color: #fff;
        }
        p {
          display: flex;
          flex-wrap: wrap;
          font-size: 14px;
          color: #555;
          line-height: 21px;
          span {
            margin-right: 7px;
          }
        }
      }
    }
    .manual {
      padding: 15px;
      font-size: 14px;
      color: #555;
    }
  }
  .title {
    width: 100%;
    display: flex;
    padding: 0 15px 15px;
    border-bottom: 1px solid #f5f5f5;
    justify-content: space-between;
    align-items: center;
    .lf {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 21px;
        color: #4fb956;
        margin-right: 15px;
      }
      span {
        font-size: 14px;
        color: #222;
        font-weight: bold;
      }
    }
    .rg {
      display: flex;
      align-items: center;
      span {
        margin-right: 9px;
        font-size: 14px;
        color: #999;
      }
      .iconfont {
        font-size: 15px;
        color: #999;
        transform: rotate(-90deg);
      }
    }
  }
  .repeat {
    margin-top: 10px;
    padding: 10px 15px 0;
    width: 100%;
    border-top: 1px solid #f5f5f5;
    .item {
      display: flex;
      .tit {
        height: 20px;
        margin: 0px 7px 0 0;
        flex-shrink: 0;
        padding: 0 4px;
        line-height: 20px;
        border-radius: 3px;
        background: #4fb956;
        font-size: 14px;
        color: #fff;
      }
      p {
        font-size: 14px;
        color: #555;
        span {
          margin-right: 7px;
        }
      }
    }
  }
  .total {
    width: 100%;
    padding: 0 15px;
    text-align: right;
    font-size: 14px;
    color: #999;
  }
}
.el-dialog-box {
  >>> .el-dialog {
    width: 50%;
    max-width: 750px;
  }
}
/deep/ .el-dialog__body {
  height: 550px;
}
/deep/ .el-select {
  display: block;
}
/deep/ .el-form-item__content {
  max-width: 350px;
}
/deep/ .el-dialog__header {
  padding: 10px;
  margin: 10px;
  background: #efefef;
  transform: translateY(20px);
  .el-dialog__headerbtn {
    top: 15px;
  }
}
</style>
