// 画面布局组件
<template>
  <div>
    <div class="pic_layout_warp">
      <div class="title">
        <i class="iconfont icon-kujialeqiyezhan_zhinengbuju" />
        <span>画面布局</span>
      </div>
      <div class="layout_list">
        <div v-for="item in layoutArr" :key="item.id" class="item">
          <div class="layout" :class="'layout_type' + item.id">
            <div class="type type1">
              <span>1</span>
            </div>
            <div class="type type2">
              <span>2</span>
            </div>
            <div class="type type3">
              <span>3</span>
            </div>
            <div class="type type4">
              <span>4</span>
            </div>
          </div>
          <div class="tit">
            <el-radio
              v-model="taskProperty.screen_style"
              :disabled="item.l < taskProperty.input.length || Math.max(...taskProperty.input.map(e => e.screen)) > item.l"
              :label="item.id"
            >{{ item.name }}</el-radio>
          </div>
        </div>
      </div>
    </div>
    <div class="video_broadcast_wrap">
      <div class="title">
        <i class="iconfont icon-guangbo" />
        <span>广播源</span>
      </div>
      <div class="v_table">
        <el-table
          ref="multipleTable"
          size="small"
          highlight-current-row
          border
          style="max-width: 1000px"
          :data="taskProperty.input"
          @row-click="handleSelectionChange"
        >
          <el-table-column prop="screen" label="画面布局" width="80" align="center">
            <template slot-scope="scope">
              <div class="col">{{ scope.row.screen }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文件名">
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.source_url"
                :key="index"
                class="item"
              >{{ item.name }} </span>
            </template>
          </el-table-column>
          <el-table-column prop="source_type" label="类型" width="150">
            <template slot-scope="scope">{{ source[scope.row.source_type].name }}</template>
          </el-table-column>
          <el-table-column prop="has_voice" label="声音" width="80">
            <template slot-scope="scope">{{ scope.row.has_voice ? '有' : '无' }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="v_operate">
        <el-button
          size="small"
          :disabled="layoutArr.find(e => e.id === taskProperty.screen_style).l <= taskProperty.input.length"
          class="btn btn3"
          :class="{disabled: layoutArr.find(e => e.id === taskProperty.screen_style).l <= taskProperty.input.length}"
          @click="addVideoUrl"
        >添加</el-button>
        <el-button size="small" class="btn btn1" @click="changeVideoUrl">修改</el-button>
        <el-button size="small" class="btn btn2" @click="deleteVideoUrl">删除</el-button>
      </div>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="广播源"
      :visible.sync="outerVisible"
    >
      <video-source-select
        v-if="outerVisible"
        :screen-style="taskProperty.screen_style"
        :new-video-obj.sync="newVideoObj"
        :video-list="taskProperty.input"
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handlerSubmitDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import videoSourceSelect from './videoSourceSelect'
import _ from 'lodash'
export default {
  components: {
    videoSourceSelect
  },
  props: {
    taskProperty: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
      },
      outerVisible: false,
      layoutArr: [
        {
          name: '布局一',
          l: 1,
          id: 1
        },
        {
          name: '布局二',
          l: 2,
          id: 2
        },
        {
          name: '布局三',
          l: 2,
          id: 3
        },
        {
          name: '布局四',
          l: 3,
          id: 4
        },
        {
          name: '布局五',
          l: 3,
          id: 5
        },
        {
          name: '布局六',
          l: 3,
          id: 6
        },
        {
          name: '布局七',
          l: 4,
          id: 7
        },
        {
          name: '布局八',
          l: 4,
          id: 8
        },
        {
          name: '布局九',
          l: 4,
          id: 9
        }
      ],
      newVideoObjCopy: null,
      newVideoObj: {
        source_type: 1, // 源类型 1:视频源 2:音频源 3:互联网直播 4:本地回环
        has_voice: 1, // 是否有声音 1:有 0:无
        screen: 1, // 画面
        checked: false,
        source_url: [],
        source_id: []
      }
    }
  },
  watch: {
    taskProperty: {
      handler(newVal) {
        this.$emit(`update:taskProperty`, newVal)
      },
      deep: true
    },
    outerVisible(newVal) {
      if (!newVal) {
        this.$refs.multipleTable.setCurrentRow()
        this.newVideoObjCopy = null
        this.taskProperty.input.forEach(e => { e.checked = false })
      }
    }
  },
  methods: {
    addVideoUrl() {
      const screen = [1, 2, 3, 4]
      this.newVideoObj = {
        has_voice: this.taskProperty.input.find(e => e.has_voice === 1) ? 0 : 1,
        screen: screen.filter(
          e => this.taskProperty.input.map(e => e.screen).indexOf(e) === -1
        )[0],
        source_id: [],
        source_url: [],
        checked: false,
        source_type: 1
      }
      this.outerVisible = true
    },
    changeVideoUrl() {
      if (this.newVideoObjCopy) {
        this.newVideoObjCopy.checked = true
        this.newVideoObj = _.cloneDeep(this.newVideoObjCopy)
        console.log(this.taskProperty.input)
        this.outerVisible = true
      } else {
        this.$message({
          message: '请先选择文件',
          type: 'warning'
        })
      }
    },
    deleteVideoUrl() {
      if (this.newVideoObjCopy) {
        this.taskProperty.input = this.taskProperty.input.filter(e => e.screen !== this.newVideoObjCopy.screen)
      } else {
        this.$message({
          message: '请先选择文件',
          type: 'warning'
        })
      }
    },
    handleSelectionChange(data) {
      this.newVideoObjCopy = data
    },
    handlerSubmitDialog() {
      if (this.newVideoObj.source_id.length === 0) {
        this.$message({
          message: '请选择至少一个广播源',
          type: 'warning'
        })
        return false
      }
      if (
        this.newVideoObj.source_id.length > 3 &&
        this.newVideoObj.source_type === 1
      ) {
        this.$message({
          message: '最多选择3个广播源',
          type: 'warning'
        })
        return false
      }
      if (
        this.newVideoObj.source_id.length > 1 &&
        this.newVideoObj.source_type === 3
      ) {
        this.$message({
          message: '最多选择1个广播源',
          type: 'warning'
        })
        return false
      }
      if (
        this.newVideoObj.source_id.length > 1 &&
        this.newVideoObj.source_type === 4
      ) {
        this.$message({
          message: '最多选择1个广播源',
          type: 'warning'
        })
        return false
      }
      if (!this.newVideoObj.checked) {
        this.taskProperty.input.push(_.cloneDeep(this.newVideoObj))
      } else {
        this.newVideoObj.checked = false
        this.taskProperty.input.splice(this.taskProperty.input.map(e => e.checked).indexOf(true), 1, this.newVideoObj)
      }
      this.outerVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.pic_layout_warp {
  width: 100%;
  padding: 40px 0;
  border-bottom: 1px dashed #e0e0e0;
  .title {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #33c32e;
      margin-right: 15px;
    }
    span {
      color: #090909;
      font-size: 14px;
      flex-wrap: 400px;
    }
  }
  .layout_list {
    display: flex;
    flex-wrap: wrap;
    .item {
      margin: 30px 30px 0px 0;
      width: 133px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      .tit {
        margin-top: 15px;
        /deep/ .el-radio__input.is-checked + .el-radio__label {
          color: #33c32e;
        }
        /deep/ .el-radio__input.is-checked .el-radio__inner {
          background-color: #33c32e;
          border-color: #33c32e;
        }
      }
      .layout {
        width: 133px;
        height: 70px;
        border: 1px solid #999;
        .type {
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 16px;
            height: 16px;
            border: 1px solid #999;
            border-radius: 50%;
            font-size: 12px;
            color: #999;
          }
          &.active {
            background: orange;
            color: #fff;
          }
          &.not_select {
            background: #9c9c9c;
            color: #fff;
          }
        }
        &_type1 {
          .type {
            &1 {
              width: 100%;
              height: 100%;
            }
            &2,
            &3,
            &4 {
              display: none;
            }
          }
        }
        &_type2 {
          .type {
            &1 {
              border-bottom: 1px solid #999;
            }
            &1,
            &2 {
              width: 100%;
              height: 50%;
            }
            &3,
            &4 {
              display: none;
            }
          }
        }
        &_type3 {
          .type {
            &1 {
              border-right: 1px solid #999;
            }
            &1,
            &2 {
              float: left;
              width: 50%;
              height: 100%;
            }
            &3,
            &4 {
              display: none;
            }
          }
        }
        &_type4 {
          .type {
            &1,
            &2 {
              border-right: 1px solid #999;
            }
            &1,
            &2,
            &3 {
              float: left;
              width: 33%;
              height: 100%;
            }
            &4 {
              display: none;
            }
          }
        }
        &_type5 {
          .type {
            &1,
            &2 {
              border-bottom: 1px solid #999;
            }
            &1,
            &2,
            &3 {
              width: 100%;
              height: 33%;
            }
            &4 {
              display: none;
            }
          }
        }
        &_type6 {
          .type {
            &1 {
              border-right: 1px solid #999;
              width: 50%;
              height: 100%;
              float: left;
            }
            &2 {
              border-bottom: 1px solid #999;
            }
            &2,
            &3 {
              float: right;
              width: 50%;
              height: 50%;
            }
            &4 {
              display: none;
            }
          }
        }
        &_type7 {
          .type {
            &1,
            &2,
            &3,
            &4 {
              float: left;
            }
            &1 {
              border-right: 1px solid #999;
              border-bottom: 1px solid #999;
              width: 66%;
              height: 66%;
            }
            &2 {
              height: 66%;
              width: 33%;
              border-bottom: 1px solid #999;
            }
            &3 {
              width: 66%;
              height: 33%;
              border-right: 1px solid #999;
            }
            &4 {
              width: 33%;
              height: 33%;
            }
          }
        }
        &_type8 {
          .type {
            &1,
            &2,
            &3,
            &4 {
              float: left;
              width: 50%;
              height: 50%;
            }
            &1 {
              border-right: 1px solid #999;
              border-bottom: 1px solid #999;
            }
            &2 {
              border-bottom: 1px solid #999;
            }
            &3 {
              border-right: 1px solid #999;
            }
          }
        }
        &_type9 {
          .type {
            &1 {
              border-right: 1px solid #999;
              height: 100%;
              float: left;
              width: 66%;
            }
            &2,
            &3 {
              border-bottom: 1px solid #999;
            }
            &2,
            &3,
            &4 {
              float: right;
              width: 33%;
              height: 33%;
            }
          }
        }
      }
    }
  }
}
.video_broadcast_wrap {
  width: 100%;
  padding: 40px 0;
  border-bottom: 1px dashed #e0e0e0;
  .title {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #33c32e;
      margin-right: 15px;
    }
    span {
      color: #090909;
      font-size: 14px;
      flex-wrap: 400px;
    }
  }
  .v_table {
    margin-top: 20px;
    width: 100%;
    .col {
      margin: 0 auto;
      width: 20px;
      height: 20px;
      border: 1px solid rgba(153, 153, 153, 1);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      color: #999;
      align-items: center;
      font-size: 12px;
    }
  }
  .v_operate {
    display: flex;
    align-items: center;
    margin-top: 25px;
    .btn {
      background: rgba(54, 182, 249, 1);
      margin-right: 30px;
      color: #fff;
      &1 {
        background: #36b6f9;
      }
      &2 {
        background: #ff3b30;
      }
      &3 {
        background: #45b54c;
        &.disabled {
          background: #999;
        }
      }
    }
  }
}
</style>
