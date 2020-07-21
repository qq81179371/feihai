// 播放时间组件
<template>
  <div class="player_time_warp">
    <div class="title">
      <i class="iconfont icon-shijian" />
      <span>播放时间</span>
    </div>

    <el-form
      ref="taskProperty"
      label-position="left"
      :model="taskProperty"
      label-width="100px"
      :rules="rules"
    >
      <div v-if="taskProperty.type !== 1" class="i_item">
        <!-- <div class="tit">播放时长</div> -->
        <div class="i_box">
          <el-form-item prop="time.duration" label="播放时长">
            <el-input
              v-model.number="taskProperty.time.duration"
              :disabled="playerEnd"
              type="input"
              size="small"
              placeholder="请输入28800内整数秒"
            />
          </el-form-item>
        </div>
        <div class="radio">
          <el-checkbox v-model="playerEnd">文件播放完结束</el-checkbox>
        </div>
      </div>
      <div class="r_item">
        <el-form-item prop="priority" label="重复">
          <el-radio-group v-model="taskProperty.time_type">
            <template v-for="item in cycleTypeList">
              <el-radio
                :key="item.runType"
                :disabled="!!taskProperty.scene_id && item.runType !== taskProperty.time_type"
                :label="item.runType"
              >{{ item.name }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-show="taskProperty.time_type === 1" class="w_item">
        <div class="w_list">
          <el-form-item prop="time.week" label="执行星期" :rules="[{ required: true, validator: validTime, trigger: 'change' }]">
            <el-checkbox-group v-model="taskProperty.time.week">
              <template v-for="item in weekList">
                <el-checkbox
                  :key="item.id"
                  :label="item.id"
                  :disabled="!!taskProperty.scene_id && taskProperty.weekArr && taskProperty.weekArr.indexOf(item.id) === -1"
                >{{ item.name }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </div>
      <div v-show="taskProperty.time_type === 2" class="t_time">
        <div class="item">
          <el-form-item label="播放日期">
            <el-date-picker
              v-model="taskProperty.time.date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="dates"
              size="small"
              placeholder="选择一个或多个日期"
            />
          </el-form-item>
          <div v-if="taskProperty.time.date" class="dayLen">
            已选择
            {{ taskProperty.time.date ? taskProperty.time.date.length : '0' }}
            天
          </div>
        </div>
      </div>
      <div class="t_time">
        <div class="item item_start">
          <ul>
            <li v-for="(item, index) in taskProperty.time.time" :key="index">
              <el-form-item
                :prop="`time.time[${index}]`"
                :rules="{ required: true, message: '请选择播放时间', trigger: 'blur' }"
                :label="`播放时间${index + 1}`"
              >
                <el-time-picker
                  v-model="taskProperty.time.time[index]"
                  size="small"
                  value-format="HH:mm:ss"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:00:00'
                  }"
                  placeholder="任意时间点"
                />
              </el-form-item>
              <div v-if="index === 0" class="add" @click="addTiemList">添加</div>
              <div v-else class="del" @click="delTimeList(index)">删除</div>
            </li>
          </ul>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
let dateArr
export default {
  props: {
    taskProperty: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      playerEnd: false,
      pickerOptions: {
        disabledDate(time) {
          if (dateArr.scene_id) {
            const year = time.getFullYear()
            const month = time.getMonth()
            const date = time.getDate()
            const t = `${year}-${
              month + 1 >= 10 ? month + 1 : '0' + (month + 1)
            }-${date + 1 <= 10 ? '0' + date : date}`
            return dateArr.dateArr.indexOf(t) === -1
          } else {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      rules: {
        'time.duration': [
          {
            required: true,
            type: 'number',
            max: 28800,
            min: 0,
            message: '请输入有效时长',
            trigger: 'blur'
          }
        ]
      },
      cycleTypeList: [
        {
          name: '按周重复',
          runType: 1,
          active: true
        },
        {
          name: '指定日期',
          runType: 2,
          active: false
        },
        {
          name: '手动控制',
          runType: 3,
          active: false
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['weekList'])
  },
  watch: {
    playerEnd(val) {
      if (val) {
        this.taskProperty.time.duration = 0
      } else {
        this.taskProperty.time.duration = ''
      }
    },
    taskProperty: {
      handler(newVal) {
        this.$emit(`update:taskProperty`, newVal)
      },
      deep: true
    }
  },
  mounted() {
    dateArr = this.taskProperty
  },
  methods: {
    validTime(rule, value, callback) {
      if (this.taskProperty.time_type === 1 && value.length === 0) {
        callback(new Error('请选择星期'))
      } else {
        callback()
      }
    },
    addTiemList() {
      this.taskProperty.time.time.push('')
    },
    delTimeList(index) {
      this.taskProperty.time.time.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.player_time_warp {
  padding: 40px 0;
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
  .i_item {
    display: flex;
    align-items: center;
    margin-top: 25px;
    .tit {
      font-size: 14px;
      color: #5d5d5d;
      margin-right: 10px;
    }
    .i_box {
      margin-right: 20px;
    }
    .radio {
      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #33c32e;
        border-color: #33c32e;
      }
      /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #33c32e;
      }
      /deep/ .el-checkbox__inner {
        &:hover {
          border-color: #33c32e;
        }
      }
      /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #33c32e;
      }
    }
  }
  .r_item {
    margin-top: 20px;
    display: flex;
    align-items: center;
    .tit {
      font-size: 14px;
      color: #5d5d5d;
      margin-right: 35px;
    }
    /deep/ .el-radio__input.is-checked + .el-radio__label {
      color: #33c32e;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner {
      background-color: #33c32e;
      border-color: #33c32e;
    }
  }
  .w_item {
    display: flex;
    align-items: center;
    margin: 20px 0 0 0;
    .tit {
      font-size: 14px;
      color: #5d5d5d;
      margin-right: 15px;
    }
    .w_list {
      display: flex;
      align-items: center;
      .w {
        margin-right: 30px;
        cursor: pointer;
        span {
          display: flex;
          align-items: center;
          font-size: 14px;
          height: 20px;
          color: #555;
          white-space: nowrap;
          padding: 0 8px;
          border: 1px solid #fff;
          border-radius: 4px;
          transition: all 0.4s;
        }
        &.active {
          span {
            color: #4fb956;
            transition: all 0.4s;
            border: 1px solid #4fb956;
          }
        }
      }
    }
  }
  .t_time {
    .item {
      display: flex;
      align-items: center;
      margin-top: 20px;
      &.item_start {
        align-items: flex-start;
      }
      .tit {
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #4fb956;
        font-size: 14px;
        height: 20px;
        min-width: 75px;
        border-radius: 4px;
        color: #fff;
      }
      .dayLen {
        margin-left: 20px;
        font-size: 14px;
        color: #5d5d5d;
        span {
          color: #ffa54f;
        }
      }
      .add,
      .del {
        cursor: pointer;
        margin-left: 20px;
        width: 50px;
        height: 25px;
        background: rgba(69, 181, 76, 1);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
        &.del {
          background: #ff3b30;
        }
      }
      ul {
        margin-top: -5px;
        li {
          display: flex;
          margin-bottom: 15px;
          align-items: center;
        }
      }
    }
  }
  .el-form-item {
    margin-bottom: 0;
    min-width: 320px;
  }
}
</style>
