<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>传感器设置</h4>
      <el-button
        type="success"
        size="small"
        @click="handleAddEvent"
      >添加</el-button>
    </div>
    <div class="box_shadow">
      <el-table
        size="small"
        :data="sensorList"
        element-loading-text="Loading"
        fit
        highlight-current-row
      >
        <el-table-column align="left" label="名称" prop="name" />
        <el-table-column label="传感器类型" align="center" prop="type">
          <template slot-scope="scope">
            {{
              basicData.sensor_type.find(item => item.id === scope.row.type)
                .name
            }}
          </template>
        </el-table-column>
        <el-table-column label="控制模块" align="center">
          <template slot-scope="scope">
            {{
              basicData.iot_module.find(item => item.id === scope.row.module_id)
                .name
            }}
          </template>
        </el-table-column>
        <el-table-column label="通信控制端口" align="center" prop="uart_port">
          <template slot-scope="scope">
            {{
              basicData.comm_port.find(item => item.id === scope.row.uart_port)
                .name
            }}
          </template></el-table-column>
        <el-table-column
          label="数据上报频率(s)"
          align="center"
          width="125px"
          prop="frequency"
        />
        <el-table-column
          align="right"
          prop="created_at"
          label="操作"
          width="125px"
        >
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <i
                class="iconfont icon-xiugai blue cursor"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <i
                class="iconfont icon-shanchu red cursor"
                @click="handleDeleteDeviceMod(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      destroy-on-close
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="添加传感器"
      :visible.sync="outerVisible1"
    >
      <el-form
        ref="fileForm"
        :rules="rules"
        :model="sensor"
        label-width="150px"
        size="small"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="sensor.name" clearable placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="传感器类型" prop="sensor_type">
          <el-select v-model="sensor.type" placeholder="传感器类型">
            <template v-for="item in basicData.sensor_type">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="控制模块" prop="iot_module">
          <el-select v-model="sensor.module_id" placeholder="控制模块">
            <template v-for="item in basicData.iot_module">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="通信控制端口" prop="comm_port">
          <el-select v-model="sensor.uart_port" placeholder="通信控制端口">
            <template v-for="item in basicData.comm_port">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="数据上报频率(s)" prop="frequency">
          <el-input
            v-model.number="sensor.frequency"
            clearable
            placeholder="数据上报频率(s)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="handlerCopyRunMod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validName } from '@/utils/validate'
import {
  getMonitoringList,
  addMonitoringList,
  deleteMonitoringList
} from '@/api/app'
export default {
  props: {
    deviceId: {
      type: Number,
      default: null
    },
    basicData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      }
      if (value !== '' && !validName(value)) {
        callback(new Error('名称不符合要求'))
      }
      callback()
    }
    return {
      sensor: {
        name: '',
        type: null,
        module_id: null,
        uart_port: null,
        frequency: null
      },
      outerVisible1: false,
      sensorList: [],
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        module_id: [{ required: true, message: '请选择控制模块', trigger: 'blur' }],
        type: [{ required: true, message: '请选择传感器类型', trigger: 'blur' }],
        uart_port: [{ required: true, message: '请选择通信控制端口', trigger: 'blur' }],
        frequency: [
          { required: true, message: '数据上报频率', trigger: 'blur' },
          {
            type: 'number',
            min: 5,
            max: 120,
            message: '频率范围5~120秒',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async handleDeleteDeviceMod(row) {
      try {
        await this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteMonitoringList({
          sensor_id: row.sensor_id
        })
        this.$message({
          type: 'success',
          message: res.result.text
        })
        this.getDetails()
      } catch (err) {
        throw err
      }
    },
    handleEdit(row) {
      this.sensor = row
      this.outerVisible1 = true
    },
    handlerCopyRunMod() {
      this.$refs.fileForm.validate(async valid => {
        if (valid) {
          try {
            const res = await addMonitoringList({
              device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
              device_ids: typeof this.deviceId === 'object' ? this.deviceId : null,
              sensor: this.sensor
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.getDetails()
            this.outerVisible1 = false
          } catch (err) {
            throw err
          }
        }
      })
    },
    handleAddEvent() {
      this.sensor = {
        name: '',
        type: null,
        module_id: null,
        uart_port: null,
        frequency: null
      }
      this.outerVisible1 = true
    },
    async getDetails() {
      try {
        const res = await getMonitoringList({
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        this.sensorList = res.sensor
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "~@/styles/settings.scss";
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
