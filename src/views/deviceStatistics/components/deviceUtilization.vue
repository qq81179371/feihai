<template>
  <div class="device_utilization_warp">
    <div class="title">物联状态</div>
    <div class="chart_box">
      <div v-if="tableData.type" class="chart_item">
        <div class="chart_content">
          <div id="te2st" ref="te2st" class="content" />
        </div>
      </div>
      <div v-if="tableData.type" class="chart_item">
        <div class="tit">物联状态详情</div>
        <div class="chart_content">
          <div class="table_list">
            <el-table :data="tableData.list" style="width: 100%" size="small">
              <el-table-column align="left" prop="name" label="名称" />
              <el-table-column align="center" prop="number1" label="开机(占比)">
                <template
                  slot-scope="scope"
                >{{ `${scope.row.number1} (${(scope.row.number1 * 100 / (scope.row.number1 + scope.row.number2 + scope.row.number3)).toFixed(1) }%)` }}</template>
              </el-table-column>
              <el-table-column align="center" prop="number1" label="关机(占比)">
                <template
                  slot-scope="scope"
                >{{ `${scope.row.number2} (${(scope.row.number2 * 100 / (scope.row.number1 + scope.row.number2 + scope.row.number3)).toFixed(1) }%)` }}</template>
              </el-table-column>
              <el-table-column align="right" prop="number1" label="离线(占比)">
                <template
                  slot-scope="scope"
                >{{ `${scope.row.number3} (${(scope.row.number3 * 100 / (scope.row.number1 + scope.row.number2 + scope.row.number3)).toFixed(1) }%)` }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-else class="no_data">暂无数据</div>
    </div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  props: {
    tableData: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.setOptions()
  },
  methods: {
    setOptions() {
      // const chart = echarts.init(document.getElementById('te2st'))
      const myChart = this.$refs.te2st
      if (myChart) {
        const chart = echarts.init(myChart)
        chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: this.tableData.data.map(e => e.name)
          },
          xAxis: {
            type: 'category',
            data: this.tableData.type
          },
          yAxis: {
            type: 'value'
          },
          series: this.tableData.data.map(e => {
            e = {
              name: e.name,
              barMaxWidth: 100,
              type: 'bar',
              stack: '总量',
              label: {
                show: false,
                position: 'inside'
              },
              itemStyle: {
                color: e.color
              },
              data: e.data
            }
            return e
          })
        })
        window.addEventListener('resize', () => {
          chart.resize()
        })
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
    display: flex;
    padding: 20px 30px 30px;
    .chart_item {
      width: 50%;
      .tit {
        font-size: 14px;
        color: #5d5d5d;
        margin: 0 0 20px;
      }
      .chart_content {
        width: 100%;
        height: 100%;
        position: relative;
        .content {
          width: 100%;
          height: 400px;
        }
        .tag_list {
          position: absolute;
          top: 15px;
          left: 280px;
          .item {
            display: flex;
            align-items: center;
            i {
              display: block;
              width: 28px;
              height: 10px;
              background: rgba(59, 160, 253, 1);
              border-radius: 4px;
            }
            span {
              margin-left: 20px;
              font-size: 14px;
              color: #5d5d5d;
            }
          }
        }
      }
    }
    .no_data {
      width: 100%;
      display: flex;
      justify-content: center;
      height: 100%;
      align-items: center;
      color: #9d9d9d;
      font-weight: bold;
    }
  }
}
/deep/ .el-table__header {
  border-top: 1px solid #ccc;
  /deep/ tr,
  th {
    background-color: #fafafa;
  }
}
</style>
