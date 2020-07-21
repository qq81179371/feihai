<template>
  <div class="wrap">
    <search-bar>
      <search :place-id.sync="placeId" />
    </search-bar>
    <div class="content">
      <div class="head_table">
        <status-chart v-if="tableData" :table-data.sync="tableData" />
        <equipmentUtilization v-if="tableData" :table-data.sync="tableData" />
      </div>
      <device-utilization v-if="tableData" :table-data.sync="tableData1" />
    </div>
  </div>
</template>

<script>
import { getDeviceCount } from '@/api/app'
import searchBar from '@/components/searchbar'
import search from './components/search'
import statusChart from './components/statusChart'
import deviceUtilization from './components/deviceUtilization'
import equipmentUtilization from './components/equipmentUtilization'
export default {
  components: {
    equipmentUtilization,
    deviceUtilization,
    statusChart,
    searchBar,
    search
  },
  data() {
    return {
      tableData: null,
      tableData1: null,
      placeId: 0
    }
  },
  watch: {
    placeId() {
      this.handlerGetDeviceCount()
    }
  },
  mounted() {
    this.handlerGetDeviceCount()
  },
  methods: {
    async handlerGetDeviceCount() {
      this.tableData = null
      try {
        const res = await getDeviceCount({
          place_id: this.placeId,
          level: 2
        })
        this.tableData = res.device_states
        this.tableData1 = res.iot_states
      } catch (err) {
        throw (err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 30px;
  height: calc(100vh - 94px);
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #999;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
  .head_table {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }
}
</style>
