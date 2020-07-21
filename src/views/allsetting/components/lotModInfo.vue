<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>物联模块</h4>
      <el-button
        type="success"
        size="small"
        @click="handleAddEvent"
      >添加</el-button>
    </div>
    <div class="box_shadow">
      <p class="remind">
        提醒:物联模块使用前请先配对 , 点击查看模块与端口信息
        <a
          target="_blank"
          :href="basicData.instructions"
        ><span class="blue">操作说明</span></a>.
      </p>
      <el-table
        v-loading="listLoading"
        size="small"
        :data="iot_module_list"
        element-loading-text="Loading"
        :max-height="tableHeight"
        fit
        highlight-current-row
      >
        <el-table-column align="left" label="名称" prop="name" />
        <el-table-column label="类型" align="center" prop="type" />
        <el-table-column label="系列号" align="center" prop="sn" />
        <el-table-column label="版本" align="center" prop="module_version" />
        <el-table-column label="状态" align="center" width="125px">
          <template slot-scope="scope">
            <p v-if="scope.row.module_state === 0" class="status">
              <i class="iconfont zx icon-zhengque1" />
              在线
            </p>
            <p v-else class="status">
              <i class="iconfont lx icon-cuowu1" />
              离线
            </p>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          prop="created_at"
          label="操作"
          width="125px"
        >
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <i
                v-if="scope.row.panid !== 1"
                class="iconfont icon-xiugai blue cursor"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="配置" placement="top">
              <i
                class="iconfont icon-peizhiguanli navy cursor"
                @click="handerGetLotConfig(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <i
                v-if="scope.row.panid !== 1"
                class="iconfont icon-shanchu red cursor"
                @click="handleDeleteDeviceMod(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="添加物联模块"
      destroy-on-close
      :visible.sync="outerVisible"
    >
      <el-form
        ref="addForm"
        :rules="rules"
        :model="device_module"
        size="small"
        label-width="180px"
        label-position="right"
      >
        <el-form-item label="名称" class="width_100" prop="name">
          <el-input v-model="device_module.name" clearable />
        </el-form-item>
        <el-form-item label="模块类型" class="width_100" prop="type">
          <el-select
            v-model="device_module.type"
            clearable
            placeholder="选择模块类型"
          >
            <template v-for="item in basicData.iot_module_types">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="模块系列号" class="width_100" prop="module_sn">
          <el-input v-model.number="device_module.module_sn" placeholder="模块系列号" clearable />
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
      title="修改模块名称"
      :visible.sync="outerVisible1"
    >
      <el-form label-width="180px" label-position="right">
        <el-form-item label="名称" class="width_100">
          <el-input v-model="selected_list.name" clearable />
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
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="模块信息"
      destroy-on-close
      :visible.sync="outerVisible2"
    >
      <el-table :data="function_code_list" size="small" fit>
        <el-table-column label="端口" align="left" prop="port" width="80px" />
        <el-table-column label="波特率" align="left" prop="baudrate">
          <template slot-scope="scope">
            <span v-if="scope.row.changeShow">{{ scope.row.baudrate }}</span>
            <el-select
              v-else
              v-model="scope.row.baudrateCopy"
              size="small"
              clearable
              placeholder="波特率"
            >
              <template v-for="item in baudrateList">
                <el-option
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                />
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="数据位"
          align="left"
          prop="databits"
          width="80px"
        />
        <el-table-column
          label="停止位"
          align="left"
          prop="stopbits"
          width="80px"
        />
        <el-table-column label="奇偶校验" align="left" prop="code">
          <template slot-scope="scope">
            <span v-if="scope.row.changeShow">{{
              parity_options.find(e => e.value === scope.row.parity).label
            }}</span>

            <el-select
              v-else
              v-model="scope.row.parityCopy"
              size="small"
              clearable
              placeholder="波特率"
            >
              <template v-for="item in parity_options">
                <el-option
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.changeShow"
              content="编辑"
              placement="top"
            >
              <i
                class="iconfont icon-xiugai blue cursor"
                @click="handleEditChange(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="!scope.row.changeShow"
              content="保存"
              placement="top"
            >
              <i
                class="iconfont icon-zhengque1 blue cursor"
                @click="handleSaveEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="!scope.row.changeShow"
              content="取消"
              placement="top"
            >
              <i
                class="iconfont icon-cuowu1 blue cursor"
                @click="handleCancelEdit(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible2 = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="outerVisible2 = false"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validModuleSn } from '@/utils/validate'
import { mapGetters } from 'vuex'
import {
  getLotList,
  putLotModule,
  deleteDeviceMod,
  postLotConfig,
  getLotConfig,
  changeDeviceMod
} from '@/api/app'
export default {
  props: {
    deviceId: {
      type: Number,
      default: null
    },
    basicData: {
      type: Object,
      default: () => []
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value !== '' && !validModuleSn(value)) {
        callback(new Error('物联设备号格式不对!'))
      }
      callback()
    }
    return {
      outerVisible2: false,
      function_code_list: [],
      parity_options: [
        {
          value: 0,
          label: 'NONE'
        },
        {
          value: 1,
          label: 'ODD'
        },
        {
          value: 2,
          label: 'EVEN'
        }
      ],
      tableHeight: document.body.scrollHeight - 300,
      device_module: {
        name: '',
        type: '',
        module_sn: ''
      },
      iot_module_list: null,
      listLoading: false,
      outerVisible: false,
      outerVisible1: false,
      selected_list: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        module_sn: [
          { required: false, validator: validatePhone, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['baudrateList'])
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async handerGetLotConfig(row) {
      try {
        const res = await getLotConfig({
          module_id: row.id
        })
        this.function_code_list = res.uart_info.map(e => {
          e.changeShow = true
          e.baudrateCopy = ''
          e.parityCopy = ''
          return e
        })
        this.outerVisible2 = true
      } catch (err) {
        throw err
      }
    },
    handleEditChange(row) {
      row.baudrateCopy = row.baudrate
      row.parityCopy = row.parity
      row.changeShow = false
    },
    async handleSaveEdit(row) {
      try {
        const res = await postLotConfig({
          uart_info: {
            port: row.port,
            databits: row.databits,
            stopbits: row.stopbits,
            baudrate: row.baudrateCopy,
            parity: row.parityCopy,
            id: row.id
          }
        })
        this.$message({
          type: 'success',
          message: res.result.text
        })
        row.baudrate = row.baudrateCopy
        row.parity = row.parityCopy
        row.changeShow = true
      } catch (err) {
        throw err
      }
    },
    handleCancelEdit(row) {
      row.changeShow = true
    },
    // 删除设备
    async handleDeleteDeviceMod(row) {
      await this.$confirm('此操作将永久删除模块, 是否继续?', '提示', {
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
        const res = await deleteDeviceMod({
          device_id: this.deviceId,
          module_id: row.id,
          panid: row.panid
        })
        if (res) {
          this.iot_module_list = this.iot_module_list.filter(
            e => e.id !== row.id
          )
          msg.close()
          this.$message({
            type: 'success',
            message: res.result.text
          })
        }
      } catch {
        msg.close()
        return false
      }
      // this.selected_list = row
    },
    handleEdit(row) {
      this.selected_list = row
      this.outerVisible1 = true
    },
    // 添加模块表单提交
    submitDeviceOperation() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const msg = this.$message({
            customClass: 'load_message',
            iconClass: 'el-icon-loading',
            duration: 0,
            center: true,
            message: '操作中...'
          })
          const device_module = {
            ...this.device_module,
            device_id: this.deviceId
          }
          try {
            const res = await putLotModule({
              device_module
            })
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            msg.close()
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
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '操作中...'
      })
      try {
        const res = await changeDeviceMod({
          device_module: {
            device_id: this.deviceId,
            module_id: this.selected_list.id,
            new_name: this.selected_list.name
          }
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        msg.close()
        this.outerVisible1 = false
      } catch (err) {
        msg.close()
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
    },
    async getDetails() {
      try {
        const res = await getLotList({
          device_id: this.deviceId
        })
        this.iot_module_list = res.iot_module_list
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
