<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>系统设置</h4>
      <el-button type="primary" size="small" @click="submitSysConfig">保存</el-button>
    </div>
    <el-form
      ref="form"
      class="box_shadow"
      :model="configParams"
      label-width="150px"
      label-position="left"
    >
      <el-form-item v-if="editType" label="设备位置">
        <span
          v-if="!placeShow"
          class="palce_text"
          :class="{color_gray: !configParams.place_name}"
        >{{ configParams.place_name || `未设置` }}</span>
        <el-cascader
          v-if="placeShow"
          ref="cascader"
          v-model="newPlaceId"
          :props="deviceArrProps"
          clearable
          size="small"
          collapse-tags
          @blur="cShow=true"
        />
        <el-button
          class="margin_"
          type="primary"
          size="mini"
          @click="handlerPlaceShow"
        >{{ placeShow? '取消' : '修改' }}</el-button>
      </el-form-item>
      <el-form-item label="模拟广播">
        <el-checkbox-group v-model="configParams.analog_broadcasting">
          <el-checkbox label="开启" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="分辨率">
        <el-select v-model="configParams.resolution" placeholder="分辨率" size="small">
          <template v-for="item in basicData">
            <el-option :key="item.id" :label="item.name" :value="item.id" />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="HDMI音频">
        <el-checkbox-group v-model="configParams.hdmi_audio">
          <el-checkbox label="开启" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getReceivingMember, putDeviceSetting } from '@/api/app'
import _ from 'lodash'
export default {
  name: 'Dashboard',
  props: {
    deviceId: {
      type: Number || Array,
      default: null
    },
    editType: {
      type: Number,
      default: null
    },
    configParams: {
      type: Object,
      default: () => {}
    },
    basicData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      placeShow: false,
      oldPlaceId: null,
      newPlaceId: null,
      deviceArrProps: {
        lazy: true,
        emitPath: false,
        label: 'name',
        value: 'id',
        async lazyLoad(node, resolve) {
          const { level } = node
          try {
            const res = await getReceivingMember({
              place: {
                level: level + 2,
                parent_id: node.value || 0
              }
            })
            if (res.placelist) {
              const nodes = res.placelist.map(e => ({
                ...e,
                leaf: level >= 1
              }))
              resolve(nodes)
            } else resolve([])
          } catch (error) {
            throw error
          }
        }
      },
      form: {
        place_name: '',
        hdmi_audio: '',
        analog_broadcasting: '',
        resolution: ''
      }
    }
  },
  created() {
    this.oldPlaceId = this.configParams.place_id
  },
  methods: {
    handlerPlaceShow() {
      this.placeShow = !this.placeShow
      if (this.placeShow) {
        this.newPlaceId = null
      }
    },
    async submitSysConfig() {
      const system_parameter = _.pick(this.configParams, [
        'analog_broadcasting',
        'hdmi_audio',
        'resolution'
      ])
      system_parameter.place_id = this.placeShow
        ? this.newPlaceId || 0
        : this.configParams.place_id

      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '操作中...'
      })
      try {
        const res = await putDeviceSetting({
          system_parameter,
          device_id: typeof this.deviceId === 'number' ? this.deviceId : null,
          device_ids: typeof this.deviceId === 'object' ? this.deviceId : null
        })
        msg.close()
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        this.$emit('handleGetDevicePlace')
      } catch (err) {
        msg.close()
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/settings.scss";
      // class="box_shadow"
@import "~@/styles/baseTitle.scss";
.operate_bar {
  margin: 25px 0;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  height: 56px;
}
/deep/ .el-input-group__append {
  padding: 0;
  border: none;
  .el-input__inner {
    border-radius: 0px;
    border-left: none;
    /deep/ .el-input__icon {
      width: 40px;
    }
  }
}
.i_cascader {
  width: 200px;
}
.palce_text {
  display: inline-block;
  width: 200px;
  &.color_gray {
    color: #999;
  }
}
.margin_ {
  margin-left: 30px;
}
</style>
