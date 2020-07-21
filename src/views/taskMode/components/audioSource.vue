<template>
  <div class="audio_source_wrap">
    <div class="title">
      <i class="iconfont icon-guangbo" />
      <span>广播源</span>
    </div>
    <div class="audio_list">
      <div class="list">
        <template v-for="item in taskProperty.input[0].source_url">
          <p :key="item.id">{{ item.name }}</p>
        </template>
      </div>
      <div class="btn_box">
        <div class="btn" @click="addFile">添加</div>
      </div>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="广播源"
      :visible.sync="outerVisible"
    >
      <div class="input_item">
        <h4>名称</h4>
        <el-input v-model="keyword" size="small" class="input" clearable />
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchTask">搜索</el-button>
      </div>
      <el-table
        ref="multipleTable"
        v-el-table-infinite-scroll="handleLoadMore"
        :height="330"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="name" label="文件名" />
        <el-table-column prop="duration" width="150" label="时长(S)" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handlerSubmitDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getEetworkFile } from '@/api/app'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  props: {
    taskProperty: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      outerVisible: false,
      audioListCopy: [],
      keyword: '',
      total: 0,
      page: 1,
      tableData: []
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
  created() {
    this.taskProperty.input[0] = {
      source_url: []
    }
  },
  methods: {
    handleSelectionChange(data) {
      this.audioListCopy = data
    },
    handlerSubmitDialog() {
      if (this.audioListCopy.length > 3) {
        this.$message({
          message: '最多选择3个广播源',
          type: 'warning'
        })
        return false
      }
      const obj = {
        source_url: this.audioListCopy,
        has_voice: 1,
        source_id: this.audioListCopy.map(e => e.id),
        source_type: 0,
        screen: 2
      }
      this.taskProperty.input[0] = obj
      this.outerVisible = false
    },
    handleSearchTask() {
      this.tableData = []
      this.page = 1
      this.addFile()
    },
    async addFile() {
      this.outerVisible = true
      try {
        const res = await getEetworkFile({
          page: {
            page: this.page,
            size: 10
          },
          file: {
            type: 2,
            keyword: this.keyword
          }
        })
        this.tableData = [...this.tableData, ...res.file_list]
        this.total = res.total
      } catch (err) {
        throw err
      }
    },
    handleLoadMore() {
      if (this.page * 10 < this.total) {
        this.page++
        this.addFile()
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
    max-width: 300px;
    .list {
      p {
        font-size: 14px;
        color: 555;
        margin-bottom: 15px;
      }
    }
    .btn_box {
      margin-top: 10px;
      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        height: 25px;
        border-radius: 8px;
        background: #45b54c;
      }
    }
  }
}
.input_item {
  display: flex;
  align-items: center;
  .input {
    margin: 0 20px;
    width: 300px;
  }
}
</style>
