import {
  putDeviceControl
} from '@/api/app.js'
import _ from 'lodash'
import {
  getDeviceDetails
} from '@/api/app.js'
// import EventBus from '@/common/eventBus'
export const classMaster = {
  props: {
    deviceDetailsProps: {
      type: Object,
      default: () => ({ iot_module_list: [] })
    }
  },
  // computed: {
  //   deviceDetails() {
  //     return _.cloneDeep(this.deviceDetailsProps)
  //   }
  // },
  data() {
    return {
      deviceDetails: null
    }
  },
  mounted() {
    this.deviceDetails = _.cloneDeep(this.deviceDetailsProps)
    // this.deviceDetails = { ...this.deviceDetails, ...this.deviceDetailsProps }
    console.log(this.deviceDetails)
  },
  methods: {
    async handleGetDeviceDetails() {
      try {
        const res = await getDeviceDetails({
          device: {
            id: this.deviceDetails.device_id
          }
        })
        this.deviceDetails = { ...this.deviceDetails, ...res.device_control_info }
      } catch (err) {
        throw err
      }
    },
    async handlePutDeviceControl(item, cmd, mIten, kt) {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await putDeviceControl({
          id: this.deviceDetails.device_id,
          device_control: {
            control_cmd: cmd,
            device_mute: cmd === 33554432 ? item : 0,
            speaker_volume: cmd === 32 ? item : 0,
            microphone_volume: cmd === 8 ? item : 0,
            device_input_source: cmd === 32768 ? item.index : 0,
            live_input_source: cmd === 524288 ? item.index : 0,
            device_state: cmd === 2 ? item === 0 ? 1 : 0 : 0,
            control_module_info: {
              id: item.id,
              type: item.type,
              onoff: cmd === 2048 ? !item.onoff : item.onoff,
              mode: item.type === 2 && kt === 1 ? mIten : item.mode,
              temperature: item.type === 2 && kt === 2 ? mIten : item.temperature,
              select_function: item.type !== 2 ? mIten : item.select_function
            }
          }
        })
        if (res) {
          msg.close()
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          // EventBus.$emit('onHandleGetDeviceDetails')
          this.handleGetDeviceDetails()
        }
      } catch (err) {
        msg.close()
        // EventBus.$emit('onHandleGetDeviceDetails')
        this.handleGetDeviceDetails()
        throw err
      }
    }
  }
}
