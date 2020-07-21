<template>
  <div class="warp">
    <search-bar>
      <info-title :keyword.sync="keyword" />
    </search-bar>
    <div class="lists">
      <p v-if="videoList.length === 0">暂无数据</p>
      <template v-for="(item, index) in videoList" v-else>
        <item :key="index" :item="item" />
      </template>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handlePage"
        @prev-click="prev-click"
        @next-click="prev-click"
      /></div>
  </div>
</template>

<script>
import { getMonitorWall } from '@/api/app.js'
import searchBar from '@/components/searchbar'
import infoTitle from './components/infoTitle'
import item from './components/itemContent'
export default {
  components: {
    searchBar,
    item,
    infoTitle
  },
  data() {
    return {
      videoList: [],
      keyword: '',
      total: 0,
      page: 1
    }
  },
  watch: {
    keyword(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.handleGetMonitorWall()
      }
    }
  },
  mounted() {
    this.handleGetMonitorWall()
  },
  methods: {
    handlePage(page) {
      this.page = page
      this.handleGetMonitorWall()
    },
    async handleGetMonitorWall() {
      try {
        const res = await getMonitorWall({
          page: {
            page: this.page,
            size: 8
          },
          search: {
            keyword: this.keyword
          }
        })
        this.total = res.total
        this.videoList = [...res.video_preview]
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.warp {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  .lists {
    display: flex;
    flex-wrap: wrap;
    p {
      display: flex;
      justify-content: center;
      width: 100%;
      align-items: center;
      font-size: 16px;
      color: #555;
      height: 80vh;
    }
  }
  .pagination {
    padding: 30px 0;
    display: flex;
    justify-content: center;
  }
}
</style>
