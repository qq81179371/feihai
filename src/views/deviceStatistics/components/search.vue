<template>
  <div class="main">
    <div class="block">
      <span class="demonstration">位置:</span>
      <el-select
        v-model="newPlaceId"
        class="item_select"
        collapse-tags
        placeholder="全部"
        size="small"
      >
        <el-option
          v-for="item in placesList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="block">
      <el-button size="small" type="success" icon="el-icon-document" @click="$router.push({ name: 'deviceDetailChart'})">物联使用详情</el-button>
    </div>
    <div class="block">
      <el-button size="small" type="primary" icon="el-icon-sold-out">数据导出</el-button>
    </div>
  </div>
</template>

<script>
import { getDeviceTypeList } from '@/api/app.js'
export default {
  props: {
    placeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      newPlaceId: 0,
      placesList: []
    }
  },
  watch: {
    newPlaceId(val) {
      this.$emit('update:placeId', val)
    }
  },
  created() {
    this.getTypelist()
  },
  methods: {
    async getTypelist() {
      try {
        const res = await getDeviceTypeList()
        this.placesList = res.places
      } catch (err) {
        throw (err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  .block {
    display: flex;
    align-items: center;
    margin-right: 15px;
    height: 44px;
    .demonstration {
      font-size: 14px;
      color: #333;
      margin-right: 5px;
      white-space: nowrap;
    }
    .item_select {
      min-width: 150px;
      width: 150px;
      >>> .el-select__tags {
        height: 24px;
      }
    }
    .input_item {
      min-width: 180px;
      width: 12vw;
    }
  }
}
</style>
