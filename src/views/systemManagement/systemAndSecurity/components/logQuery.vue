<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>系统日志</h4>
    </div>
    <div class="form_box">
      <div class="picker_item">
        <el-select
          v-model="time"
          placeholder="请选择日期"
          size="small"
          @change="handlerGetSystemLogChange"
        >
          <template v-for="item in timeDate">
            <el-option :key="item.id" :label="item.value" :value="item.id" />
          </template>
        </el-select>
      </div>
      <div class="tabs_list">
        <div
          v-for="item in tabsList"
          :key="item.id"
          class="item"
          :class="logId === item.id ? 'active': ''"
          @click="handleListId(item)"
        >{{ item.name }}</div>
      </div>
      <el-table v-if="tableShow" v-el-table-infinite-scroll="handleLoadMore" :data="tableData">
        <el-table-column prop="index" label="序号" align="left" width="80" />
        <el-table-column v-if="logId === 1" prop="user_name" label="用户名称" />
        <el-table-column v-if="logId !== 1" prop="user_name" label="操作用户" />
        <el-table-column v-if="logId === 1" prop="time" label="登录时间" />
        <el-table-column v-if="logId !== 1" prop="time" label="操作时间" />
        <el-table-column v-if="logId === 1" prop="part1" label="登录IP" />
        <el-table-column v-if="logId === 1" prop="part2" label="登录方式" />
        <el-table-column v-if="logId === 2" prop="part1" label="控制对象" />
        <el-table-column v-if="logId !== 1 && logId !== 2" prop="part1" label="操作" />
        <el-table-column v-if="logId !== 1" prop="part2" label="控制内容" />
        <el-table-column v-if="logId !== 1" prop="result" label="结果" width="80" align="right" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSystemLog } from '@/api/app'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data() {
    return {
      time: 1,
      logId: 1,
      tableData: [],
      total: null,
      page: 1,
      tableShow: false,
      tabsList: [
        {
          id: 1,
          name: '用户日志'
        },
        {
          id: 2,
          name: '设备日志'
        },
        {
          id: 3,
          name: '任务日志'
        },
        {
          id: 4,
          name: '系统设置日志'
        }
      ],
      timeDate: [
        {
          id: 1,
          value: '最近一天'
        },
        {
          id: 2,
          value: '最近一周'
        },
        {
          id: 3,
          value: '最近一个月'
        },
        {
          id: 4,
          value: '最近三个月'
        }
      ]
    }
  },
  created() {
    this.handlerGetSystemLog()
  },
  methods: {
    handlerGetSystemLogChange() {
      this.page = 1
      this.tableData = []
      this.tableShow = false
      this.handlerGetSystemLog()
    },
    handleLoadMore() {
      if (this.page * 10 < this.total) {
        this.page++
        this.handlerGetSystemLog()
      }
    },
    handleListId(item) {
      this.logId = item.id
      this.page = 1
      this.tableData = []
      this.tableShow = false
      this.handlerGetSystemLog()
    },
    async handlerGetSystemLog() {
      try {
        const res = await getSystemLog({
          page: {
            page: this.page,
            size: 10
          },
          log_info: {
            type: this.logId,
            time: this.time
          }
        })
        this.total = res.total
        this.tableData = [...this.tableData, ...res.log_list]
        this.tableShow = true
      } catch (err) {
        this.tableShow = true
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
.form_box {
  .picker_item {
    margin: 30px 0;
  }
  .tabs_list {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    .item {
      cursor: pointer;
      position: relative;
      font-size: 14px;
      color: #282828;
      margin-right: 40px;
      padding-bottom: 15px;
      &::after {
        content: "";
        width: 56px;
        height: 2px;
        background: #fff;
        bottom: 0;
        left: 50%;
        position: absolute;
        transform: translateX(-50%);
      }
      &.active {
        &::after {
          background: rgba(69, 181, 76, 1);
        }
      }
    }
  }
}
/deep/ .el-table__body-wrapper {
  height: calc(100vh - 380px) !important;
}
/deep/ .el-table::before {
  display: none;
}
</style>

