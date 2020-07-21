// 替换功能
<template>
  <div class="replace_warp">
    <el-form ref="form" :model="form" size="small" label-width="80px" label-position="left">
      <el-form-item label="操作">
        <el-radio-group v-model="form.operating">
          <el-radio :label="11">复制</el-radio>
          <el-radio :label="12">替换</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.operating === 11" label="功能">
        <el-checkbox-group v-model="form.features">
          <el-checkbox
            v-for="item in featuresArr"
            :key="item.label"
            :label="item.label"
          >{{ item.value }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="目标设备">
        <el-cascader v-model="form.deviceArr" :options="options" :props="deviceArrProps" collapse-tags clearable />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getReceivingMember } from '@/api/app'
export default {
  props: {
    deviceData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // const levelNum = 1
    return {
      form: {
        operating: 11,
        features: [],
        deviceArr: []
      },
      featuresArr: [
        {
          label: 1,
          name: 'features',
          value: '系统设置'
        },
        {
          label: 2,
          name: 'features',
          value: '高级设置'
        },
        // {
        //   label: 3,
        //   name: 'features',
        //   value: 'VLAN设置'
        // },
        {
          label: 4,
          name: 'features',
          value: '音频设置'
        },
        {
          label: 5,
          name: 'features',
          value: '网络设置'
        }
      ],
      options: [],
      deviceArrProps: {
        // lazy: true,
        emitPath: false,
        multiple: true,
        label: 'r',
        value: 'id',
        children: 'room'
        // async lazyLoad(node, resolve) {
        //   const { level } = node
        //   try {
        //     const res = await getReceivingMember({
        //       place: {
        //         level: levelNum === 3 ? levelNum : ++levelNum,
        //         parent_id: node.value || 0
        //       }
        //     }, 1)
        //     if (res.placelist) {
        //       const nodes = res.placelist.map(e => ({
        //         ...e,
        //         leaf: level >= 1
        //       }))
        //       resolve(nodes)
        //     } else resolve([])
        //   } catch (error) {
        //     throw error
        //   }
        // }
      }
    }
  },
  computed: {
    operating() {
      return this.form.operating
    }
  },
  watch: {
    operating(newValue, oldValue) {
      if (newValue === 11) {
        this.deviceArrProps.multiple = true
      } else if (newValue === 12) {
        this.deviceArrProps.multiple = false
      }
    },
    form: {
      handler(newValue, oldValue) {
        const obj = {
          device_id: this.deviceData.device_id,
          place_id: newValue.operating === 11 ? newValue.deviceArr : newValue.deviceArr,
          menu_ids: newValue.operating === 11 ? newValue.features : undefined,
          cmd: newValue.operating
        }
        this.$emit('update:deviceData', obj)
      },
      deep: true
    }
  },
  mounted() {
    this.handleLazyLoad()
  },
  methods: {
    async handleLazyLoad() {
      try {
        const res = await getReceivingMember({
          // place: {
          //   parent_id: node.value || 0
          // }
        }, 1)
        this.options = res.placelist
      } catch (error) {
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-select {
  width: 170px;
}
/deep/ .el-radio-group {
  width: 100%;
}
</style>
