<template>
  <div>
    <template v-if="showData">
      <div class="device_utilization_warp">
        <div class="title">设备状态</div>
        <div class="chart_box">
          <div class="chart_item">
            <div class="tit">累计使用时间(s)</div>
            <div class="chart_content">
              <div id="chart" class="content" />
            </div>
          </div>
          <div class="table_list">
            <div class="tit">累计使用时间(s)</div>
            <el-table :data="tableData" style="width: 100%" size="small">
              <el-table-column align="left" prop="name" label="类型" />
              <el-table-column align="center" prop="open_times" label="使用次数" />
              <el-table-column align="right" prop="last_online_time" label="最近使用时间" />
            </el-table>
          </div>
        </div>
      </div>
      <div class="device_utilization_warp">
        <div class="title">设备利用率</div>
        <div class="chart_box">
          <div v-if="tableData.length > 0" class="chart_list">
            <div v-for="(item, index) in tableData" :key="index" class="item">
              <div class="lf">
                <p>{{ item.name }}</p>
                <p>{{ (item.use_ratio / 100).toFixed(1) }}%</p>
              </div>
              <div :id="`test${index + 1}`" class="rg" />
            </div>
          </div>
          <p v-else class="no_data">暂无数据</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getDeviceCount2 } from '@/api/app'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import EventBus from '@/common/eventBus'
export default {
  data() {
    return {
      showData: true,
      placeId: 0,
      level: 1,
      tableData: []
    }
  },
  mounted() {
    EventBus.$on('placeId', (data) => {
      this.placeId = data.placeId
      this.level = data.level
      this.handlerGetDeviceCount2()
    })
    this.handlerGetDeviceCount2()
  },
  methods: {
    initCharts() {
      this.tableData.forEach((e, i) => {
        const proportion = (e.use_ratio / 100).toFixed(1)
        this.setOptions1(proportion, i)
      })
    },
    timeConversion(val) {
      const result = val
      const h =
        Math.floor(result / 3600) < 10
          ? `0${Math.floor(result / 3600)}`
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? `0${Math.floor((result / 60) % 60)}`
          : Math.floor((result / 60) % 60)
      const s =
        Math.floor(result % 60) < 10
          ? `0${Math.floor(result % 60)}`
          : Math.floor(result % 60)
      return `${h}小时${m}分钟${s}秒`
    },
    setOptions1(e, i) {
      const chart = echarts.init(document.getElementById(`test${i + 1}`))
      chart.setOption({
        series: [
          {
            name: '访问来源',
            startAngle: 180,
            type: 'pie',
            radius: ['100%', '70%'],
            cursor: 'default',
            hoverAnimation: false,
            highlightPolicy: 'none',
            labelLine: {
              show: false
            },
            data: [
              {
                value: e,
                itemStyle: {
                  normal: { color: '#000' }, // 正常颜色
                  emphasis: { color: '#000' } // 鼠标移入颜色
                }
              },
              {
                value: 100 - e,
                itemStyle: {
                  normal: { color: '#eef2f5' }, // 正常颜色
                  emphasis: { color: '#eef2f5' } // 鼠标移入颜色
                }
              }
            ]
          }
        ]
      })
      window.addEventListener('resize', () => {
        chart.resize()
      })
    },
    setOptions() {
      const chart = echarts.init(document.getElementById('chart'))
      chart.setOption({
        backgroundColor: '#fafafa',
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: params => {
            return `${params[0].axisValue}: ${this.timeConversion(
              params[0].data
            )}`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.tableData.map(e => e.name),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '累计使用时长',
            type: 'bar',
            barMaxWidth: 100,
            data: this.tableData.map(e => e.use_duration)
          }
        ]
      })
      window.addEventListener('resize', () => {
        chart.resize()
      })
    },
    async handlerGetDeviceCount2() {
      this.showData = false
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await getDeviceCount2({
          place_id: this.placeId,
          level: this.level
        })
        this.showData = true
        this.tableData = res.iot_unit_statistics || []
        this.$nextTick(() => {
          this.setOptions()
          this.initCharts()
        })
        msg.close()
      } catch (err) {
        msg.close()
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.device_utilization_warp {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 30px;
  .title {
    display: flex;
    align-items: center;
    padding: 0 30px;
    font-weight: bold;
    font-size: 14px;
    height: 46px;
    border-bottom: 1px solid #ccc;
    color: #5d5d5d;
  }
  .chart_box {
    padding: 20px 30px 30px;
    display: flex;
    .chart_item {
      width: 60%;
      .tit {
        font-size: 14px;
        color: #5d5d5d;
        margin: 20px;
      }
      .chart_content {
        width: 100%;
        .content {
          width: 100%;
          height: 400px;
        }
      }
    }
    .table_list {
      .tit {
        font-size: 14px;
        color: #5d5d5d;
        margin: 20px 20px 20px 0;
      }
      margin: 0px 0 0 5%;
      width: 35%;
    }
    /deep/ .el-table__header {
      border-top: 1px solid #ccc;
      /deep/ tr,
      th {
        background-color: #fafafa;
      }
    }
    .s_tit {
      margin-bottom: 15px;
      font-size: 14px;
      color: #5d5d5d;
    }
    .chart_list {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      .item {
        flex-shrink: 0;
        display: flex;
        flex: 1;
        align-items: center;
        .lf {
          width: 60px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          p {
            font-size: 12px;
            margin: 5px 0;
          }
        }
        .rg {
          margin-left: 5px;
          flex: 1;
          // width: 62px;
          height: 100px;
          border-radius: 50%;
        }
      }
    }
    .no_data {
      width: 100%;
      text-align: center;
      color: #999;
    }
  }
}
</style>
