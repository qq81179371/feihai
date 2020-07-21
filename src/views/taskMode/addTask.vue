<template>
  <div class="add_task_warp">
    <search-bar>
      <info-title :task-type="task_property.type" />
    </search-bar>
    <div class="add_list">
      <basic-info ref="basicInfo" :task-property.sync="task_property" />
      <lot-source v-if="task_property.type === 1" :task-property.sync="task_property" />
      <audio-source
        v-if="task_property.type === 2"
        ref="audioSource"
        :task-property.sync="task_property"
      />
      <picture-layout v-if="task_property.type === 3" :task-property.sync="task_property" />
      <receiving-member
        v-if="!sceneId"
        ref="receivingMember"
        :task-property.sync="task_property"
      />
      <player-time ref="playerTime" :task-property.sync="task_property" />
      <div class="submit">
        <el-button class="btn" type="success" size="small" @click="handlerSubmit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addTask, getRunModDetails } from '@/api/app'
import pictureLayout from './components/pictureLayout'
import receivingMember from './components/receivingMember'
import audioSource from './components/audioSource'
import basicInfo from './components/basicInfo'
import searchBar from '@/components/searchbar'
import infoTitle from './components/infoTitle'
import playerTime from './components/playerTime'
import lotSource from './components/lotSource'
export default {
  components: {
    basicInfo,
    receivingMember,
    searchBar,
    playerTime,
    audioSource,
    infoTitle,
    lotSource,
    pictureLayout
  },
  data() {
    return {
      sceneId: null,
      task_property: {
        dateArr: null,
        weekArr: null,
        name: '', // 任务名称
        type: 1, // 任务类型 1:控制任务 2:音频任务 3:视频任务
        screen_style: 1, // 画面布局
        priority: 1, // 优先级
        time_type: 1, // 时间模式 1:按星期 2:按日期 3:手动执行
        scene_id: null, // 模式ID
        // 物联控制
        iot_control: [
          // {
          //   id: 1, // 控制项ID
          //   type: 1, // 控制项类型
          //   state: 0, // 开关状态 0:关 1:开
          //   local_control_id: 1 // 本地控制项 -1:默认 0:禁用 1:允许
          // }
        ],
        // 任务时间
        time: {
          duration: null, // 时长
          week: [], // 星期
          date: [], // 日期
          time: [''] // 时间
        },
        // 广播源
        input: [
          // {
          //   source_type: 1, // 源类型 1:视频源 2:音频源 3:互联网直播 4:本地回环
          //   has_voice: 1, // 是否有声音 1:有 0:无
          //   screen: 1, // 画面
          //   source_id: [] // 源文件
          // }
        ],
        place_id: null
      }
    }
  },
  created() {
    this.task_property.type = +this.$route.query.id
    if (this.$route.query.sceneId) {
      this.sceneId = +this.$route.query.sceneId
      this.handlerGetRunModDetails(this.sceneId)
    }
    if (this.$route.query.param) {
      this.task_property = { ...this.task_property, ...JSON.parse(this.$route.query.param) }
    }
  },
  methods: {
    // 获取运行模式详情
    async handlerGetRunModDetails(id) {
      try {
        const res = await getRunModDetails({
          task_mode_id: id
        })
        this.task_property.scene_id = res.id
        this.task_property.time_type = res.time.type
        this.task_property.weekArr = res.time.week || []
        if (res.time.date) {
          this.task_property.dateArr = res.time.date.map(e => {
            if (this.handlerDateSize(e)) {
              return e
            }
          }).filter(e => e)
        }
      } catch (err) {
        throw err
      }
    },
    // 判断日期大小
    handlerDateSize(date) {
      const d = new Date(date)
      const t = d.getTime(d)
      const dateNow = Date.now()
      return dateNow < t
    },
    async handlerSubmit() {
      const basicInfo = this.$refs.basicInfo.$refs.taskProperty
      const receivingMember = this.$refs.receivingMember ? this.$refs.receivingMember.$refs.taskProperty : basicInfo
      const playerTime = this.$refs.playerTime.$refs.taskProperty
      Promise.all(
        [basicInfo, receivingMember, playerTime].map(this.getFormPromise)
      ).then(async res => {
        const validateResult = res.every(item => !!item)
        if (validateResult) {
          if (
            this.task_property.type !== 1 &&
            this.task_property.input.length === 0
          ) {
            this.$message({
              message: '请选择广播源',
              type: 'warning'
            })
            return false
          }
          if (
            this.task_property.type === 1 &&
            this.task_property.iot_control.length === 0
          ) {
            this.$message({
              message: '请选择物联控制',
              type: 'warning'
            })
            return false
          }
          if (
            this.task_property.scene_id && this.task_property.time_type === 2 && this.task_property.dateArr.length === 0
          ) {
            this.$message({
              message: '日期无效,请返回添加有效日期',
              type: 'warning'
            })
            return false
          }
          if (
            this.task_property.time_type === 2 && this.task_property.time.date.length === 0
          ) {
            this.$message({
              message: '请选择日期',
              type: 'warning'
            })
            return false
          }
          try {
            const res = await addTask({
              task_property: this.task_property
            })
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            this.$router.back()
          } catch (err) {
            throw err
          }
        }
      })
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add_list {
  height: calc(100vh - 94px);
  padding: 0 30px 60px;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    // border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c4c4c4;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
.submit {
  display: flex;
  justify-content: center;
  .btn {
    width: 200px;
  }
}
</style>
