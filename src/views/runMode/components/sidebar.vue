<template>
  <div class="sidebar_wrap scroll">
    <right-click-menu-mod ref="right_menu" :menu-visible.sync="menuVisible">
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handlerRunModStatusChange(1)"
        >启用</el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handlerRunModStatusChange(0)"
        >禁用</el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="outerVisible1 = true"
        >复制</el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handlerRunModChange"
        >修改</el-button>
      </li>
      <li class="menu__item">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 2).enable"
          @click="handlerDeleteRunMod"
        >删除</el-button>
      </li>
    </right-click-menu-mod>
    <div class="btn_box">
      <el-button
        class="btn"
        :disabled="!menus.find(e => e.id === 2).enable"
        @click="addEvnet"
      >添加模式</el-button>
    </div>
    <div class="list">
      <template v-for="item in folder_list">
        <div
          :key="item.id"
          class="item"
          :class="{ active: folderId === item.id, disable: disable }"
          @click="handlerToggleFolderId(item)"
          @contextmenu.prevent="rightClickMenu($event, item)"
        >
          <i
            class="iconfont icon-yuan1"
            :class="{ green: item.state === 1, light_gray: item.state === 0 }"
          />
          <div class="text">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </template>
    </div>
    <div v-if="modeDetails" class="top_border">
      <div class="item name">
        <span class="green">{{ modeDetails.name }}</span>
      </div>
      <div v-if="false" class="item item1 cursor">
        <i class="iconfont" />
        优先级
        <span>{{ modeDetails.priority }}</span>
      </div>
      <el-popover placement="right" width="500" trigger="hover">
        <div class="item_info">
          <div v-if="modeDetails.time.type === 1" class="item_title">
            <i class="iconfont icon-shijian gray" />
            <span class="gray">按周重复</span>
          </div>
          <div v-if="modeDetails.time.type === 2" class="item_title">
            <i class="iconfont icon-riqi gray" />
            <span class="gray">指定日期</span>
          </div>
          <ul>
            <li v-if="modeDetails.time.type === 1">
              <p>执行星期</p>
              <template v-for="item in modeDetails.time.week">
                <span :key="item">{{ weekText[item] }}</span>
              </template>
            </li>
            <li v-if="modeDetails.time.type === 2">
              <p>执行日期</p>
              <template v-for="item in modeDetails.time.date">
                <span :key="item">{{ item }}</span>
              </template>
            </li>
          </ul>
        </div>
        <div slot="reference" class="item item2 cursor">
          <p>
            <i class="iconfont icon-gengxin blue" />
            <el-badge
              :value="modeDetails.time.time_number"
              class="item_badge"
            >重复</el-badge>(
            <span class="blue">{{
              taskTimeType.find(e => e.id === modeDetails.time.type).name
            }}</span>)
          </p>
        </div>
      </el-popover>
      <el-popover placement="right" width="200" trigger="hover">
        <div>
          <p>{{ modeDetails.time.start_time }} - {{ modeDetails.time.end_time }}</p>
        </div>
        <div slot="reference" class="item item3 cursor">
          <p>
            <i class="iconfont icon-shijian orange" />
            时间
          </p>
        </div>
      </el-popover>
      <el-popover placement="right" width="500" trigger="hover">
        <div class="item_info">
          <div class="item_title">
            <i class="iconfont icon-chengyuan  gray" />
            <span class="gray">接收成员</span>
          </div>
          <ul>
            <template v-for="item in modeDetails.place_list">
              <li :key="item.id">
                <p>{{ item.name }}</p>
                <template v-for="sitem in item.room">
                  <span :key="sitem.id">{{ sitem.name }}</span>
                </template>
              </li>
            </template>
          </ul>
        </div>
        <div slot="reference" class="item item3 cursor">
          <p>
            <i class="iconfont icon-chengyuan orange" />
            <el-badge
              :value="modeDetails.place_number"
              class="item_badge"
            >接收成员</el-badge>
          </p>
        </div>
      </el-popover>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="添加模式"
      :visible.sync="outerVisible"
    >
      <el-form
        ref="fileForm"
        :rules="rules"
        :model="task_scene_info"
        label-width="80px"
        size="small"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="task_scene_info.name" clearable />
        </el-form-item>
        <el-form-item v-if="false" label="优先级" prop="priority">
          <el-input v-model.number="task_scene_info.priority" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="task_scene_info.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重复" prop="time.type">
          <el-radio-group v-model="task_scene_info.time.type">
            <el-radio :label="1">按周重复</el-radio>
            <el-radio :label="2">指定日期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="task_scene_info.time.type === 2"
          label="日期"
          prop="time.date"
        >
          <el-date-picker
            v-model="task_scene_info.time.date"
            clearable
            :picker-options="pickerOptions"
            type="dates"
            value-format="yyyy-MM-dd"
            placeholder="选择一个或多个日期"
          />
        </el-form-item>
        <el-form-item
          v-if="task_scene_info.time.type === 1"
          label="星期"
          prop="time.week"
        >
          <el-select
            v-model="task_scene_info.time.week"
            multiple
            collapse-tags
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in weekList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="time.start_time">
          <el-time-select
            v-model="task_scene_info.time.start_time"
            placeholder="起始时间"
            :picker-options="{
              start: '05:00',
              step: '00:10',
              end: '23:50'
            }"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="time.end_time">
          <el-time-select
            v-model="task_scene_info.time.end_time"
            placeholder="结束时间"
            :picker-options="{
              start: '05:00',
              step: '00:10',
              end: '23:50',
              minTime: task_scene_info.time.start_time
            }"
          />
        </el-form-item>
        <el-form-item label="位置" prop="place_id">
          <el-cascader
            v-model="task_scene_info.place_id"
            :options="memberList"
            :props="deviceArrProps"
            collapse-tags
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handlerAddMultimediaFolder"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="复制模式"
      :visible.sync="outerVisible1"
    >
      <el-form
        ref="fileForm"
        :rules="rules"
        :model="copyMod"
        label-width="80px"
        size="small"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="copyMod.name"
            clearable
            placeholder="请输入一个名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="handlerCopyRunMod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validName } from '@/utils/validate'
import {
  addRunMod,
  copyRunMod,
  deleteRunMod,
  getRunModList,
  getRunModDetails,
  getReceivingMember,
  changeRunModStatus
} from '@/api/app'
import rightClickMenuMod from '@/components/RightClickMenu'
import EventBus from '@/common/eventBus'
import { mapGetters } from 'vuex'
export default {
  components: {
    rightClickMenuMod
  },
  props: {
    folderType: {
      type: Number,
      default: null
    },
    taskTimeType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      }
      if (value !== '' && !validName(value)) {
        callback(new Error('名称不符合要求'))
      }
      callback()
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      modeDetailsCopy: null,
      memberList: [],
      copyMod: {
        name: ''
      },
      deviceArrProps: {
        emitPath: false,
        label: 'r',
        multiple: true,
        value: 'id',
        children: 'room'
      },
      modeDetails: null,
      folderId: null,
      disable: false,
      menuVisible: false,
      folder_list: [],
      pending_review_number: 0,
      outerVisible: false,
      outerVisible1: false,
      task_scene_info: {
        name: '',
        priority: 1,
        state: 0,
        time: {
          type: 1,
          date: null,
          start_time: null,
          end_time: null,
          week: null
        },
        place_id: '',
        id: null
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        priority: [
          { required: true, message: '优先级不能为空', trigger: 'blur' }
        ],
        'time.date': [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        'time.week': [
          { required: true, message: '请选择星期', trigger: 'blur' }
        ],
        'time.start_time': [
          { required: true, message: '请选择起始时间', trigger: 'blur' }
        ],
        'time.end_time': [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        place_id: [{ required: true, message: '请选择位置', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['weekText', 'weekList', 'menus'])
  },
  watch: {
    folderId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('update:folderType', newVal)
      }
    }
  },
  mounted() {
    this.handlergGetReceivingMember()
    this.handlerGetList()
    EventBus.$on('pending_review_number', data => {
      this.pending_review_number = data
    })
  },
  methods: {
    // 运行模式状态更改
    async handlerRunModStatusChange(status) {
      try {
        const res = await changeRunModStatus({
          task_scene_id: this.modeDetailsCopy.id,
          state: status
        })
        this.$message({
          type: 'success',
          message: res.result.text
        })
        this.handlerGetList()
      } catch (err) {
        throw err
      }
    },
    // 获取运行模式详情
    async handlerGetRunModDetails() {
      try {
        const res = await getRunModDetails({
          task_mode_id: this.folderId
        })
        this.modeDetails = res
      } catch (err) {
        throw err
      }
    },
    // 接收成员获取
    async handlergGetReceivingMember() {
      try {
        const res = await getReceivingMember(
          {
            search: {
              keyword: ''
            }
          },
          1
        )
        this.memberList = res.placelist
      } catch (err) {
        throw err
      }
    },
    // 获取文件夹列表
    async handlerGetList() {
      try {
        const res = await getRunModList()
        this.folder_list = res.task_mode
        this.folderId = res.task_mode[0].id
        EventBus.$emit('handleSceneId', res.task_mode[0].id)
        this.handlerGetRunModDetails()
      } catch (err) {
        throw err
      }
    },
    // 切换运行模式类型
    handlerToggleFolderId(item) {
      this.disable = true
      setTimeout(() => {
        this.disable = false
      }, 300)
      this.folderId = item.id
      this.handlerGetRunModDetails()
      EventBus.$emit('handleSceneId', item.id)
    },
    // 打开添加弹窗
    addEvnet() {
      this.outerVisible = true
      const defaultObj = {
        name: '',
        priority: 1,
        state: 0,
        time: {
          type: 1,
          date: null,
          week: null
        },
        place_id: '',
        id: null
      }
      this.task_scene_info = defaultObj
    },
    handlerRunModChange() {
      this.task_scene_info = this.modeDetailsCopy
      this.outerVisible = true
    },
    // 右键菜单
    async rightClickMenu(event, item) {
      try {
        const res = await getRunModDetails({
          task_mode_id: item.id
        })
        this.modeDetailsCopy = res
        this.modeDetailsCopy['state'] = item.state
        const placeId = []
        res.place_list.forEach(e => {
          e.room.forEach(i => placeId.push(i.id))
        })
        this.modeDetailsCopy['place_id'] = placeId
      } catch (err) {
        throw err
      }
      this.$refs.right_menu.$emit('rightClickMenu', event, 'menu1')
    },
    // 添加文件夹
    async handlerAddMultimediaFolder() {
      this.$refs.fileForm.validate(async valid => {
        if (valid) {
          try {
            const res = await addRunMod({
              task_scene_info: this.task_scene_info
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.handlerGetList()
            this.outerVisible = false
          } catch (err) {
            throw err
          }
        }
      })
    },
    // 删除模式
    async handlerDeleteRunMod() {
      try {
        await this.$confirm(
          `此操作将永久删除"${this.modeDetailsCopy.name}", 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const res = await deleteRunMod({
          task_mode_id: this.modeDetailsCopy.id
        })
        this.handlerGetList()
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch {
        return false
      }
    },
    // 复制运行模式
    async handlerCopyRunMod() {
      try {
        const res = await copyRunMod({
          srs_id: this.modeDetailsCopy.id,
          priority: this.modeDetailsCopy.priority,
          name: this.copyMod.name
        })
        this.$message({
          type: 'success',
          message: res.result.text
        })
        this.outerVisible1 = false
        this.handlerGetList()
      } catch (err) {
        throw err
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
.sidebar_wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  padding: 50px 0 320px 0;
  overflow-x: hidden;
  .btn_box {
    position: absolute;
    top: 30px;
    z-index: 1;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    background: #fff;
    .btn {
      background: #5087ec;
      color: #fff;
      flex-shrink: 0;
      opacity: 1;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .list {
    width: 100%;
    padding: 10px 0;
    .item {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 15px 0 30px;
      cursor: pointer;
      color: #5d5d5d;
      font-size: 14px;
      &:hover,
      &.active {
        background: #e6fded;
      }
      .iconfont {
        font-size: 12px;
        &.icon-guanliyuan {
          color: #45b54c;
        }
        &.icon-yonghu1 {
          color: #f13025;
        }
      }
      .text {
        position: relative;
        margin: 0 5px;
        p {
          position: absolute;
          height: 15px;
          padding: 0 3px;
          border-radius: 8px;
          color: #fff;
          font-size: 12px;
          background: #ff3b30;
          display: flex;
          justify-content: center;
          align-items: center;
          top: -10px;
          right: -15px;
        }
      }
      &.disable {
        pointer-events: none;
      }
      .icon_box {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
  .top_border {
    background: #fff;
    width: 100%;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: 0;
    padding: 20px 15px;
    height: 300px;
    left: 0;
    .item {
      font-size: 14px;
      color: #5d5d5d;
      padding: 20px 0;
      line-height: 18px;
      .iconfont {
        width: 20px;
        font-size: 12px;
        display: inline-block;
      }
      &.name {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .item_badge {
        /deep/ .is-fixed {
          top: -10px;
          left: -12px;
          right: auto !important;
        }
      }
      &.item2,
      &.item1 {
        span {
          font-size: 12px;
        }
      }
    }
  }
  .el-dialog-box {
    >>> .el-dialog {
      width: 50%;
      max-width: 750px;
    }
  }
  /deep/ .el-select {
    display: block;
  }
  /deep/ .el-form-item__content {
    max-width: 300px;
    /deep/ .el-cascader {
      display: block;
    }
  }
}
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.item_info {
  padding: 5px;
  min-height: 150px;
  .item_title {
    display: flex;
    padding: 0 15px;
    align-items: center;
    height: 40px;
    background: #efefef;
    border-radius: 4px;
    .iconfont {
      margin-right: 10px;
    }
  }
  ul {
    li {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 10px 0 0;
      p {
        padding: 2px 4px;
        font-size: 12px;
        color: #fff;
        background: #a3a3a3;
        border-radius: 6px;
        margin-bottom: 10px;
      }
      span {
        margin-bottom: 10px;
        margin-left: 15px;
        font-size: 12px;
        color: #555;
      }
    }
  }
}
</style>
