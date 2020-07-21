<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>VLAN设置</h4>
      <el-button
        type="success"
        size="small"
        @click="handleAddEvent"
      >添加</el-button>
    </div>
    <div class="box_shadow">
      <el-table
        size="small"
        :data="vlanList"
        element-loading-text="Loading"
        fit
        highlight-current-row
      >
        <el-table-column
          label="VLAN ID(2~2094)"
          align="left"
          width="150px"
          prop="vlanno"
        />
        <el-table-column label="PORT1" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[0]" name="PORT1" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="PORT2" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[1]" name="PORT2" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="PORT3" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[2]" name="PORT3" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="PORT4" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[3]" name="PORT3" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="PORT5" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[4]" name="PORT5" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="PORT6" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[5]" name="PORT6" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="电脑" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[6]" name="电脑" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="中控" align="center">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.ports[7]" name="中控" :label="true">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getVlanSetParams, postVlanSetParams } from '@/api/app'
export default {
  props: {
    deviceId: {
      type: Number || Array,
      default: null
    }
  },
  data() {
    return {
      vlanList: []
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async handleAddEvent() {
      try {
        const res = await postVlanSetParams()
        console.log(res)
      } catch (err) {
        throw err
      }
    },
    async getDetails() {
      try {
        const res = await getVlanSetParams({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.vlanList = [...res.vlan]
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/settings.scss";
@import "~@/styles/dialogBase.scss";
@import "~@/styles/baseTitle.scss";

.operate_bar {
  margin: 25px 0;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  height: 56px;
}
.status {
  display: flex;
  align-items: center;
  color: #282828;
  justify-content: center;
  .zx {
    color: #45b54c;
  }
  .lx {
    color: #666666;
  }
}
.iconfont {
  margin: 0 3px;
}
</style>
