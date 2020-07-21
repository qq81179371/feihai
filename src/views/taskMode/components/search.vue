<template>
  <div class="main">
    <div class="block">
      <!-- <span class="demonstration">名称:</span> -->
      <el-input v-model="keyword" class="input_item" size="small" placeholder="请输入内容" />
    </div>
    <div class="block">
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchTask">搜索</el-button>
    </div>
    <div class="block">
      <el-dropdown
        trigger="click"
        :disabled="!menus.find(e => e.id === 2).enable"
        placement="bottom-start"
        @command="handleNavAddTask"
      >
        <span class="el-dropdown-link">
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
          >新建任务</el-button>
        </span>
        <el-dropdown-menu slot="dropdown" class="dropdown_list">
          <template v-for="item in addTaskNavList">
            <el-dropdown-item :key="item.id" class="item" :command="item">
              <i class="iconfont" :class="item.icon" />
              {{ item.name }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="block">
      <el-button size="small" type="warning" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="block flex1">
      <el-tooltip effect="dark" content="暂无权限" placement="left">
        <i v-if="!menus.find(e => e.id === 1).enable" class="iconfont red icon-quanxian" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { getDeviceTypeList } from '@/api/app.js'
import EventBus from '@/common/eventBus'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      keyword: '',
      sceneId: null,
      placesList: [],
      statesList: [],
      addTaskNavList: [
        {
          icon: 'icon-kongzhi',
          pathName: 'addTask',
          id: 1,
          name: '物联控制任务'
        },
        {
          icon: 'icon-yinpin',
          pathName: 'addTask',
          id: 2,
          name: '音频广播任务'
        },
        {
          icon: 'icon-bofang',
          pathName: 'addTask',
          id: 3,
          name: '视频广播任务'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  created() {
    this.getTypelist()
    EventBus.$on('handleSceneId', val => {
      this.sceneId = val
    })
  },
  methods: {
    async getTypelist() {
      try {
        const res = await getDeviceTypeList()
        this.placesList = res.places
        this.statesList = res.states
      } catch (err) {
        throw err
      }
    },
    handleRefresh() {
      this.$emit('handleRefresh')
    },
    handleSearchTask() {
      this.$emit('handleSearchTask', this.keyword)
    },
    handleNavAddTask(command) {
      this.$router.push({
        name: command.pathName,
        query: { id: command.id, sceneId: this.sceneId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin-left: 40px;
  display: flex;
  align-items: center;
  .block {
    display: flex;
    align-items: center;
    margin-right: 15px;
    height: 44px;
    .demonstration {
      font-size: 14px;
      color: #333;
      margin-right: 5px;
      white-space: nowrap;
    }
    .item_select {
      min-width: 150px;
      width: 150px;
      >>> .el-select__tags {
        height: 24px;
      }
    }
    .input_item {
      min-width: 180px;
      width: 12vw;
    }
  }
}
.dropdown_list {
  .item {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
</style>
