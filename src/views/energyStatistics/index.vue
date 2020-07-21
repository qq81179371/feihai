<template>
  <div class="warp">
    <search-bar>
      <div class="block">
        时间:
      </div>
      <div class="block">
        <el-select v-model="time" placeholder="最近一天" size="small">
          <el-option
            v-for="item in timeDate"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </div>
    </search-bar>
    <div class="details_box">
      <div class="runlf_box">
        <sidebar @placeId="handlePlaceId" />
      </div>
      <div v-if="showData" class="right_details">
        <div class="title">

          能耗统计趋势图
        </div>
        <div id="echarts1" />
        <div class="title">
          能耗统计详情(kwh)
        </div>
        <div class="table_list">
          <div id="echarts2" />
          <!-- <div class="table_box"> -->
          <!-- <div class="title">
            用电统计详情(kwh)
          </div>
           <el-table :data="tableData" size="small">
            <el-table-column
              align="left"
              prop="name"
              label="设备"
              width="120"
            />
            <el-table-column align="center" prop="number" label="星期一" />
            <el-table-column align="center" label="星期二" />
            <el-table-column align="center" label="星期三" />
            <el-table-column align="center" label="星期四" />
            <el-table-column align="center" label="星期五" />
            <el-table-column align="center" label="星期六" />
            <el-table-column align="center" label="星期天" />
          </el-table> -->
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import searchBar from '@/components/searchbar'
import sidebar from './components/sidebar'
import { nenghaotongji } from '@/api/app'
export default {
  components: {
    sidebar,
    searchBar
  },
  data() {
    return {
      tableData: [],
      time: 1,
      timeDate: [
        {
          id: 1,
          value: '最近一周'
        },
        {
          id: 2,
          value: '最近一个月'
        },
        {
          id: 3,
          value: '最近六个月'
        }
      ],
      placeId: 0,
      chart_title: [],
      showData: true,
      kwh_info_list: [],
      level: 1
    }
  },
  watch: {
    time(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.handlerGetDeviceCount()
      }
    }
  },
  mounted() {
    this.handlerGetDeviceCount()
  },
  methods: {
    handlePlaceId(data) {
      this.placeId = data.placeId
      this.level = data.level
      this.handlerGetDeviceCount()
    },
    async handlerGetDeviceCount() {
      this.showData = false
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await nenghaotongji({
          place_id: this.placeId,
          level: this.level,
          date_type: this.time
        })
        this.showData = true
        this.chart_title = res.chart_title
        this.kwh_info_list = res.kwh_info_list
        this.tableData = res.table_list
        this.$nextTick(() => {
          this.setOptions()
          this.setOptions1()
        })
        msg.close()
      } catch (err) {
        msg.close()
        throw err
      }
    },
    setOptions() {
      const list = this.kwh_info_list.map(e => {
        e.value.unshift(e.name)
        return e.value
      })
      const myChart = echarts.init(document.getElementById(`echarts1`))
      const option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product', ...this.chart_title],
            ...list
            //   ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
            // ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
            // ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
            // ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '45%' },
        series: [
          ...this.kwh_info_list.map(e => {
            return { type: 'line', smooth: true, seriesLayoutBy: 'row' }
          }),
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product'
              // value: '2012',
              // tooltip: '2012'
            }
          }
        ]
      }
      myChart.on('updateAxisPointer', function(event) {
        var xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      })
      myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    setOptions1() {
      const chart = echarts.init(document.getElementById(`echarts2`))
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: this.kwh_info_list.map(e => e.name)
        },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   containLabel: true
        // },
        xAxis: {
          type: 'category',
          data: this.chart_title
        },
        yAxis: {
          type: 'value'
        },
        series: this.kwh_info_list.map(e => {
          const obj =
          {
            name: e.name,
            type: 'bar',
            stack: '总量',
            data: e.value
          }
          return obj
        })
      })
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  margin-left: 20px;
}
.warp {
  height: 100%;
}
.details_box {
  display: flex;
  height: 100%;
  .runlf_box {
    width: 170px;
    height: 100%;
    border-right: 1px solid #ddd;
  }
  .right_details {
    width: 100%;
    overflow-y: scroll;
    height: 100%;
    padding-bottom: 60px;
    .title {
      margin-bottom: 30px;
      height: 50px;
      padding: 0 20px;
      font-size: 15px;
      color: #5d5d5d;
      font-weight: bold;
      display: flex;
      border: 1px solid #ddd {
        left: none;
        right: none;
      }
      align-items: center;
    }
    .m_bottom {
      margin-bottom: 30px;
    }
    #echarts1 {
      width: 100%;
      height: 600px;
    }
    #echarts2 {
      width: 100%;
      height: 500px;
      margin-bottom: 30px;
    }
  }
  .table_list {
    // display: flex;
    .table_box {
      flex: 1;
      margin-left: 30px;
      span {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
