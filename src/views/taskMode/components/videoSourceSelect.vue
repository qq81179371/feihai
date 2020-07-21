<template>
  <div class="warp">
    <div class="screen_layout">
      <div class="box">
        <div class="tit">{{ `布局${screenStyle}` }}</div>
        <div class="layout" :class="`layout_type${screenStyle}`">
          <template v-for="item in videoLayoutList">
            <div
              :key="item.screen"
              class="type"
              :class="[{active: item.screen === newVideoObj.screen, disabled: !!videoList.find(e => e.screen === item.screen) && !videoList.find(e => e.screen === item.screen).checked }, `type${item.screen}`]"
              @click="handleVideoList(item)"
            >
              <span>{{ item.screen }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="main_1">
      <div class="r_item">
        <span>声音:</span>
        <el-radio-group v-model="newVideoObj.has_voice">
          <el-radio :label="1" :disabled="!!videoList.find(e => e.has_voice === 1) && !newVideoObj.has_voice">有</el-radio>
          <el-radio :label="0">无</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="main_2">
      <div class="search_input">
        <div class="input_item">
          <span>广播源类型:</span>
          <el-select
            v-model="newVideoObj.source_type"
            size="small"
            placeholder="请选择"
            @change="changeVideoList"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div class="input_item">
          <span>名称:</span>
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
      </div>
    </div>
  </div>
</template>

<script>
import { getEetworkFile } from '@/api/app'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
export default {
  name: 'VideoSourceSelect',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  props: {
    screenStyle: {
      type: Number,
      default: null
    },
    newVideoObj: {
      type: Object,
      default: () => {}
    },
    videoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [
        { id: 1, name: '视频' },
        { id: 3, name: '在线互联网直播' },
        { id: 4, name: '实时采播' }
      ],
      tableData: [],
      selectAudio: false,
      videoLayoutList: [
        {
          screen: 1
        },
        {
          screen: 2
        },
        {
          screen: 3
        },
        {
          screen: 4
        }
      ],
      page: 1,
      keyword: '',
      videoFileList: []
    }
  },
  watch: {
    newVideoObj: {
      handler(newVal) {
        this.$emit(`update:newVideoObj`, newVal)
      },
      deep: true
    }
  },
  created() {
    this.addFile()
  },
  methods: {
    handleSelectionChange(data) {
      this.newVideoObj.source_url = data
      this.newVideoObj.source_id = data.map(i => i.id)
    },
    handleSearchTask() {
      this.tableData = []
      this.page = 1
      this.addFile()
    },
    changeVideoList() {
      this.tableData = []
      this.page = 1
      this.addFile()
    },
    async addFile() {
      try {
        const res = await getEetworkFile({
          page: {
            page: this.page,
            size: 10
          },
          file: {
            type: this.newVideoObj.source_type,
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
    },
    handleVideoList(item) {
      this.newVideoObj.screen = item.screen
    }
  }
}
</script>

<style lang="scss" scoped>
.input_item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  span {
    width: 100px;
  }
  .input {
    margin: 0 20px 0 0;
    width: 200px;
  }
}
.screen_layout {
  padding-left: 30px;
  background: #fff;
  .box {
    width: 100%;
    display: flex;
    .tit {
      width: 100px;
      font-size: 14px;
    }
    .layout {
      width: 172px;
      height: 93px;
      border: 1px solid #999;
      .type {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          border: 1px solid #999;
          border-radius: 50%;
          font-size: 16px;
          color: #999;
        }
        &.active {
          background: orange;
          span {
            color: #fff;
            border: 1px solid #fff;
          }
        }
        &.disabled {
          pointer-events: none;
          background: #555;
          span {
            border: 1px solid #fff;
            color: #fff;
          }
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
          &3 {
            width: 34%;
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
          &3 {
            height: 34%;
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
            width: 34%;
            border-bottom: 1px solid #999;
          }
          &3 {
            width: 66%;
            height: 34%;
            border-right: 1px solid #999;
          }
          &4 {
            width: 34%;
            height: 34%;
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
            width: 34%;
            height: 33%;
          }
          &4 {
            float: right;
            width: 34%;
            height: 34%;
          }
        }
      }
    }
  }
}
.main_1 {
  padding: 15px 0;
  background: #fff;
  border-radius: 30px;
  .r_item {
    display: flex;
    align-items: center;
    padding: 0 0 0 30px;
    span {
      width: 100px;
    }
  }
}
.main_2 {
  background: #fff;
  border-radius: 30px;
  .search_input {
    padding: 0 30px;
  }
}
</style>
