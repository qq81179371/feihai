<template>
  <div class="low_chart_wrap">
    <div class="title">设备状态</div>
    <div class="chart_box">
      <div class="s_tit">数占比</div>
      <div class="chart_list">
        <div v-for="(item, index) in tableData.data" :key="index" class="item">
          <div class="lf">
            <p>{{ item.name }}</p>
            <p>{{ tableData.total > 0 ? ((item.number * 100) / tableData.total).toFixed(1) : 0 }}%</p>
          </div>
          <div :id="`test${index + 1}`" class="rg" />
        </div>
      </div>
    </div>
    <div class="status_table">
      <div class="table_title">
        <div class="lf">详情</div>
        <div class="rg">总数: {{ tableData.total }}</div>
      </div>
      <div class="table_list">
        <el-table :data="tableData.data" style="width: 100%" size="small">
          <el-table-column align="center" prop="name" label="名称" width="50" />
          <el-table-column align="center" prop="number" label="数量" />
          <el-table-column align="center" label="占比" width="60">
            <template slot-scope="scope">{{ tableData.total > 0 ? ((scope.row.number * 100) / tableData.total).toFixed(1) : 0 }}%</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
export default {
  props: {
    tableData: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      if (this.tableData.total > 0) {
        this.tableData.data.forEach((e, i) => {
          this.chart = echarts.init(document.getElementById(`test${i + 1}`))
          const proportion = ((e.number * 100) / this.tableData.total).toFixed(1)
          this.setOptions(proportion, e.color)
        })
      } else {
        this.tableData.data.forEach((e, i) => {
          this.chart = echarts.init(document.getElementById(`test${i + 1}`))
          this.setOptions(0, '#00000')
        })
      }
    },
    setOptions(e, color) {
      this.chart.setOption({
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
                  normal: { color: color }, // 正常颜色
                  emphasis: { color: color } // 鼠标移入颜色
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
    }
  }
}
</script>
<style lang="scss" scoped>
.low_chart_wrap {
  width: 49%;
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
    padding: 20px 25px 20px;
    .s_tit {
      margin-bottom: 15px;
      font-size: 14px;
      color: #5d5d5d;
    }
    .chart_list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item {
        display: flex;
        align-items: center;
        .lf {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          p {
            font-size: 12px;
            margin: 5px 0;
          }
        }
        .rg {
          margin-left: 5px;
          width: 62px;
          height: 62px;
          border-radius: 50%;
        }
      }
    }
  }
  .status_table {
    padding: 20px 25px 30px;
    .table_title {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .lf {
        font-size: 14px;
        color: #5d5d5d;
      }
      .rg {
        font-size: 12px;
        color: #5087ec;
      }
    }
    /deep/ .el-table__header {
      border-top: 1px solid #ccc;
      /deep/ tr,
      th {
        background-color: #fafafa;
      }
    }
  }
}
</style>
