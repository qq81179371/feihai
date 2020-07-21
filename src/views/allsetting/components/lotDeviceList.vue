<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>物联设备</h4>
      <el-button
        type="success"
        size="small"
        @click="handleAddEvent"
      >添加</el-button>
    </div>
    <div class="box_shadow">
      <p class="remind">
        提醒:所有外控设备需要设置相关信息 , 点击查看模块与端口信息
        <a
          :href="basicData.instructions"
          target="_blank"
        ><span class="blue">操作说明</span></a>.
      </p>
      <el-table
        :data="iot_device_list"
        element-loading-text="Loading"
        size="small"
        fit
        highlight-current-row
      >
        <el-table-column
          fixed="left"
          label="名称"
          align="left"
          prop="name"
          min-width="140px"
        />
        <el-table-column label="类型" align="center" min-width="140px">
          <template slot-scope="scope">
            <span>{{ deviceTypeName(scope.row.type, "iot_device_type") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="控制模块"
          prop="module_name"
          align="center"
          min-width="140px"
        />
        <el-table-column label="电源控制端口1" align="center" min-width="140px">
          <template slot-scope="scope">
            <span>{{
              deviceTypeName(scope.row.port1, "power_output_port")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电源控制端口2" align="center" min-width="140px">
          <template slot-scope="scope">
            <span>{{
              deviceTypeName(scope.row.port2, "power_output_port")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通信控制端口" align="center" min-width="140px">
          <template slot-scope="scope">
            <span>{{ deviceTypeName(scope.row.uart_port, "comm_port") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌" align="center" min-width="140px" prop="brand_name" />
        <el-table-column label="开机联动" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.boot_sync" disabled />
          </template>
        </el-table-column>
        <el-table-column label="开机时间(s)" align="center" min-width="100px" prop="boot_time" />
        <el-table-column label="关机联动" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.off_sync" disabled />
          </template>
        </el-table-column>
        <el-table-column label="关机时间(s)" align="center" min-width="100px" prop="off_time" />
        <el-table-column label="IP地址" align="center" min-width="100px" prop="ip" />
        <el-table-column label="MAC地址" align="center" min-width="100px" prop="mac" />
        <el-table-column
          fixed="right"
          align="right"
          prop="created_at"
          label="操作"
          width="80px"
        >
          <template slot-scope="scope">
            <el-tooltip content="修改" placement="top">
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
      class="el-dialog-box"
      :close-on-click-modal="false"
      destroy-on-close
      title="添加物联设备"
      :visible.sync="outerVisible"
    >
      <el-form
        ref="deviceForm"
        :model="deviceForm"
        :rules="rules"
        label-position="right"
        label-width="180px"
      >
        <el-form-item label="被控设备名称" prop="name" class="width_100">
          <el-input v-model="deviceForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="被控设备类型" prop="type" class="width_100">
          <el-select
            v-model.number="deviceForm.type"
            placeholder="被控设备类型"
          >
            <template v-for="item in basicData.iot_device_type">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="deviceForm.type !== 10"
          label="控制模块"
          prop="panid"
          class="width_100"
        >
          <el-select v-model="deviceForm.panid" placeholder="控制模块">
            <template v-for="item in basicData.iot_module">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="deviceForm.type !== 10"
          label="电源输出控制端口1"
          prop="port1"
          class="width_100"
        >
          <el-select v-model="deviceForm.port1" placeholder="电源输出控制端口">
            <template v-for="item in basicData.power_output_port">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="deviceForm.type === 5 || deviceForm.type === 8"
          prop="port2"
          label="电源输出控制端口2"
          class="width_100"
        >
          <el-select v-model="deviceForm.port2" placeholder="电源输出控制端口">
            <template v-for="item in basicData.power_output_port">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            deviceForm.type === 2 ||
              deviceForm.type === 3 ||
              deviceForm.type === 6 ||
              deviceForm.type === 11
          "
          label="通信输出控制端口"
          class="width_100"
          prop="uart_port"
        >
          <el-select
            v-model="deviceForm.uart_port"
            placeholder="通信输出控制端口"
          >
            <template v-for="item in basicData.comm_port">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            deviceForm.type === 2 ||
              deviceForm.type === 3 ||
              deviceForm.type === 6 ||
              deviceForm.type === 11
          "
          prop="brand_id"
          label="被控设备品牌"
          class="width_100"
        >
          <el-select v-model="deviceForm.brand_id" placeholder="被控设备品牌">
            <template v-for="item in basicData[brandList[deviceForm.type]]">
              <el-option :key="item.id" :label="item.brand" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="开机联动" class="width_100">
          <el-checkbox v-model="deviceForm.boot_sync" />
        </el-form-item>
        <el-form-item
          v-if="
            deviceForm.type === 2 ||
              deviceForm.type === 3 ||
              deviceForm.type === 5 ||
              deviceForm.type === 6 ||
              deviceForm.type === 7 ||
              deviceForm.type === 8 ||
              deviceForm.type === 9 ||
              deviceForm.type === 11 ||
              deviceForm.type === 10
          "
          prop="boot_time"
          label="开机时间(S)"
          class="width_100"
        >
          <el-input
            v-model.number="deviceForm.boot_time"
            placeholder="开机时间(S)"
          />
        </el-form-item>
        <el-form-item label="关机联动" class="width_100">
          <el-checkbox v-model="deviceForm.off_sync" />
        </el-form-item>
        <el-form-item
          v-if="
            deviceForm.type === 2 ||
              deviceForm.type === 3 ||
              deviceForm.type === 5 ||
              deviceForm.type === 6 ||
              deviceForm.type === 7 ||
              deviceForm.type === 8 ||
              deviceForm.type === 9 ||
              deviceForm.type === 11 ||
              deviceForm.type === 10
          "
          prop="off_time"
          label="关机时间(S)"
          class="width_100"
        >
          <el-input
            v-model.number="deviceForm.off_time"
            placeholder="关机时间(S)"
          />
        </el-form-item>
        <el-form-item
          v-if="
            deviceForm.type === 2 ||
              deviceForm.type === 3 ||
              deviceForm.type === 6 ||
              deviceForm.type === 11
          "
          prop="send_code_times"
          label="发码次数"
          class="width_100"
        >
          <el-input
            v-model.number="deviceForm.send_code_times"
            placeholder="发码次数"
          />
        </el-form-item>
        <el-form-item
          v-if="
            deviceForm.type === 2 ||
              deviceForm.type === 3 ||
              deviceForm.type === 6 ||
              deviceForm.type === 11
          "
          prop="send_code_interval"
          label="发码间隔"
          class="width_100"
        >
          <el-input
            v-model.number="deviceForm.send_code_interval"
            placeholder="发码间隔"
          />
        </el-form-item>
        <el-form-item
          v-if="deviceForm.type === 9"
          prop="ip"
          label="IP"
          class="width_100"
        >
          <el-input v-model="deviceForm.ip" placeholder="IP" />
        </el-form-item>
        <el-form-item
          v-if="deviceForm.type === 9"
          prop="mac"
          label="MAC地址"
          class="width_100"
        >
          <el-input v-model="deviceForm.mac" placeholder="MAC地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitDeviceOperation"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="el-dialog-box"
      destroy-on-close
      title="修改物联设备信息"
      :visible.sync="outerVisible1"
    >
      <el-form label-width="180px" label-position="right">
        <el-form-item label="名称" class="width_100">
          <el-input v-model="selected_list.name" clearable />
        </el-form-item>
        <el-form-item label="开机联动" class="width_100">
          <el-checkbox v-model="selected_list.boot_sync" />
        </el-form-item>
        <el-form-item
          prop="boot_time"
          label="开机时间(S)"
          class="width_100"
        >
          <el-input
            v-model.number="selected_list.boot_time"
            placeholder="开机时间(S)"
          />
        </el-form-item>
        <el-form-item label="关机联动" class="width_100">
          <el-checkbox v-model="selected_list.off_sync" />
        </el-form-item>
        <el-form-item
          prop="off_time"
          label="关机时间(S)"
          class="width_100"
        >
          <el-input
            v-model.number="selected_list.off_time"
            placeholder="关机时间(S)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible1 = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleDeviceNameChange"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validIP, validMAC } from '@/utils/validate'
import {
  getLotDeviceList,
  deleteDevice,
  addLotDevice,
  changeLotDeviceName
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
    const validateIP = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('IP地址不能为空'))
      } else if (!validIP(value)) {
        callback(new Error('IP地址格式错误'))
      }
      callback()
    }
    const handleValidMAC = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Mac地址不能为空'))
      } else if (!validMAC(value)) {
        callback(new Error('Mac地址格式错误!'))
      }
      callback()
    }
    return {
      brandList: {
        2: 'hvac_brand',
        3: 'projector_brand',
        6: 'aiopc_brand',
        11: 'user_define_brand'
      },
      tableHeight: document.body.scrollHeight - 300,
      iot_device_list: null,
      outerVisible: false,
      deviceForm: {
        name: null,
        type: null,
        panid: null,
        port1: null,
        port2: null,
        uart_port: null,
        aiopc_brand: null,
        boot_time: null,
        boot_sync: false,
        off_time: null,
        off_sync: false,
        send_code_times: null,
        send_code_interval: null,
        ip: null,
        mac: null
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        panid: [
          { required: true, message: '请选择控制模块', trigger: 'change' }
        ],
        port1: [
          {
            required: true,
            message: '请选择电源输出控制端口',
            trigger: 'change'
          }
        ],
        port2: [
          {
            required: true,
            message: '请选择电源输出控制端口',
            trigger: 'change'
          }
        ],
        uart_port: [
          {
            required: true,
            message: '请选择通信输出控制端口',
            trigger: 'change'
          }
        ],
        brand_id: [
          { required: true, message: '请选择被控设备品牌', trigger: 'change' }
        ],
        boot_time: [
          { required: true, message: '请输入开机时间', trigger: 'change' }
        ],
        off_time: [
          { required: true, message: '请输入关机时间', trigger: 'change' }
        ],
        send_code_times: [
          { required: true, message: '请输入发码次数', trigger: 'change' }
        ],
        send_code_interval: [
          { required: true, message: '请输入发码间隔', trigger: 'change' }
        ],
        ip: [{ required: true, validator: validateIP, trigger: 'change' }],
        mac: [{ required: true, validator: handleValidMAC, trigger: 'change' }]
      },
      selected_list: { name: '' },
      outerVisible1: false
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    deviceTypeName(val, type) {
      let name
      this.basicData[type].map(i => {
        if (i.id === val) {
          name = i.name
        }
      })
      return name
    },
    addEvnet() {
      this.outerVisible = true
    },
    async getDetails() {
      try {
        const res = await getLotDeviceList({
          device: {
            id: this.deviceId
          }
        })
        this.iot_device_list = res.iot_device_list
      } catch (err) {
        throw err
      }
    }, // 删除设备
    async handleDeleteDeviceMod(row) {
      await this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '操作中...'
      })
      try {
        const res = await deleteDevice({
          device: {
            id: row.id,
            device_id: this.deviceId
          }
        })
        msg.close()
        if (res) {
          this.iot_device_list = this.iot_device_list.filter(
            e => e.id !== row.id
          )
          this.$message({
            type: 'success',
            message: res.result.text
          })
        }
      } catch {
        msg.close()
        return false
      }
    },
    handleEdit(row) {
      this.selected_list = row
      this.outerVisible1 = true
    },
    // 添加模块表单提交
    submitDeviceOperation() {
      this.$refs.deviceForm.validate(async valid => {
        if (valid) {
          const msg = this.$message({
            customClass: 'load_message',
            iconClass: 'el-icon-loading',
            duration: 0,
            center: true,
            message: '操作中...'
          })
          const module_port_add = {
            ...this.deviceForm,
            device_id: this.deviceId
          }
          try {
            const res = await addLotDevice({
              module_port_add
            })
            msg.close()
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            this.getDetails()
            this.$emit('handleGetDeviceParams')
            this.outerVisible = false
          } catch (err) {
            msg.close()
            throw err
          }
        }
      })
    },
    //  修改模块名字表单提交
    async handleDeviceNameChange() {
      try {
        const res = await changeLotDeviceName({
          iot_device: {
            device_id: this.deviceId,
            // iot_device_id: this.selected_list.id,
            // new_name: this.selected_list.name
            ...this.selected_list
          }
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        this.outerVisible1 = false
      } catch (err) {
        throw err
      }
    },
    // async submitForm() {
    //   try {
    //     await putAdvanSetting({
    //       device_id: this.deviceId,
    //       advanced_parameter: this.advanced_parameter
    //     })
    //     this.$message({
    //       message: '保存成功',
    //       type: 'success'
    //     })
    //   } catch (err) {
    //     throw (err)
    //   }
    // },
    handleAddEvent() {
      this.outerVisible = true
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
.el-dialog-box {
  >>> .el-dialog {
    width: 50%;
    max-width: 760px;
  }
}
/deep/ .el-dialog__body {
  // height: 550px;
  overflow-y: scroll;
}
/deep/ .el-select {
  display: block;
}
/deep/ .el-form-item__content {
  max-width: 350px;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  height: auto;
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
