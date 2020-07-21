<template>
  <div class="low_chart_wrap">
    <div class="title">设备利用率</div>
    <div class="chart_box">
      <div v-for="(item, index) in tableData.utilization" :key="index" class="chart_item">
        <div class="chart_content">
          <div :id="`util${index + 1}`" class="content" />
          <div class="tag_list">
            <div class="item">
              <i :style="`background: ${item.color1}`" />
              <span>{{ item.name1 }}</span>
            </div>
            <div class="item">
              <i :style="`background: ${item.color2}`" />
              <span>{{ item.name2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  props: {
    tableData: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setOptions()
    })
  },
  methods: {
    setOptions() {
      this.tableData.utilization.forEach((e, i) => {
        const chart = echarts.init(document.getElementById(`util${i + 1}`))
        chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '利用率',
              startAngle: 180,
              type: 'pie',
              radius: ['30%', '60%'],
              data: [
                {
                  value: e.number1,
                  name: e.name1,
                  itemStyle: {
                    color: e.color1
                  }
                },
                {
                  value: e.number2,
                  name: e.name2,
                  itemStyle: {
                    color: e.color2
                  }
                }
              ]
            }
          ]
        })
        window.addEventListener('resize', () => {
          chart.resize()
        })
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
    display: flex;
    padding: 20px 30px 30px;
    .chart_item {
      width: 50%;
      .tit {
        font-size: 14px;
        color: #5d5d5d;
        margin: 20px;
      }
      .chart_content {
        width: 100%;
        position: relative;
        .content {
          width: 100%;
          height: 400px;
        }
        .tag_list {
          position: absolute;
          top: 0px;
          left: 0px;
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
