// 物联控制组件
<template>
  <div class="audio_source_wrap">
    <div class="title">
      <i class="iconfont icon-shebeiguanli" />
      <span>物联控制</span>
    </div>
    <div class="audio_list">
      <div class="list">
        <el-table
          ref="multipleTable"
          size="small"
          highlight-current-row
          border
          style="max-width: 800px"
          :data="taskProperty.iot_control"
          @row-click="handleSelectionChange"
        >
          <el-table-column prop="name" label="类型" />
          <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <span :class="scope.row.state === 1? 'green' : 'gray'">{{ scope.row.state === 1? '开' : '关' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="local_control_id" label="本地控制">
            <template slot-scope="scope">
              <span :class="controlName[scope.row.local_control_id].color">{{ controlName[scope.row.local_control_id].name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn_box">
        <el-button class="btn" type="success" size="small" @click="showLot">添加</el-button>
      </div>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="物联控制"
      :visible.sync="outerVisible"
    >
      <el-table
        ref="multipleTable"
        :height="330"
        row-key="name"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="name" label="开关" width="150">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="small" :type="scope.row.state === 1 ? 'success': ''" @click="hanlderToggleSwitch(scope.row, 1)">开</el-button>
              <el-button size="small" :type="scope.row.state === 0 ? 'danger': ''" @click="hanlderToggleSwitch(scope.row, 0)">关</el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="本地控制" width="200">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="small" :type="scope.row.local_control_id === -1 ? 'info': ''" @click="hanlderToggleControl(scope.row, -1)">默认</el-button>
              <el-button size="small" :type="scope.row.local_control_id === 1 ? 'success': ''" @click="hanlderToggleControl(scope.row, 1)">允许</el-button>
              <el-button size="small" :type="scope.row.local_control_id === 0 ? 'danger': ''" @click="hanlderToggleControl(scope.row, 0)">禁用</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handlerSubmitDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTaskLot } from '@/api/app'
import _ from 'lodash'
export default {
  props: {
    taskProperty: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      outerVisible: false,
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
      audioListCopy: []
    }
  },
  watch: {
    taskProperty: {
      handler(newVal) {
        this.$emit(`update:taskProperty`, newVal)
      },
      deep: true
    }
  },
  methods: {
    hanlderToggleSwitch(row, val) {
      this.$refs.multipleTable.toggleRowSelection(row, true)
      row.state = val
    },
    hanlderToggleControl(row, val) {
      this.$refs.multipleTable.toggleRowSelection(row, true)
      row.local_control_id = val
    },
    showLot() {
      this.addFile()
    },
    handleSelectionChange(data) {
      data.forEach(e => {
        if (e.state === null) {
          e.state = 1
        }
      })
      this.audioListCopy = data
    },
    handlerSubmitDialog() {
      if (this.audioListCopy.length === 0) {
        this.$message({
          message: '请至少选择一项',
          type: 'warning'
        })
        return false
      }
      this.taskProperty.iot_control = _.cloneDeep(this.audioListCopy)
      this.outerVisible = false
    },
    async addFile() {
      try {
        const res = await addTaskLot()
        this.tableData = res.iot_control_items.map(e => {
          if (this.taskProperty.iot_control.find(i => i.name === e.name)) {
            e = this.taskProperty.iot_control.find(i => i.name === e.name)
          } else {
            e.state = null
            e.local_control_id = -1
          }
          return e
        })
        setTimeout(() => {
          this.taskProperty.iot_control.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }, 0)
        this.outerVisible = true
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.audio_source_wrap {
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
  .audio_list {
    margin-top: 25px;
    .list {
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        .tit {
          font-size: 14px;
          color: #5d5d5d;
          margin: 0 25px 0 0;
        }
        .i_lot {
          cursor: pointer;
          margin-right: 25px;
        }
        &.item_1 {
          .i_lot {
            font-size: 14px;
            color: #5d5d5d;
            .iconfont {
              color: #45b54c;
              font-size: 14px;
            }
          }
        }
        &.item_3 {
          .i_lot {
            font-size: 14px;
            &.color_red {
              color: #ff564c;
            }
            &.color_green {
              color: #45B54C;
            }
            &.color_gray {
              color: #5d5d5d;
            }
          }
        }
      }
    }
    .btn_box {
      margin-top: 10px;
    }
  }
}
</style>
