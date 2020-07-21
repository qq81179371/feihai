<template>
  <div class="sidebar_wrap scroll">
    <div class="list">
      <el-tree :data="data" node-key="id" :default-expand-all="true" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
  </div>
</template>

<script>
import EventBus from '@/common/eventBus'
import { getReceivingMember } from '@/api/app'
export default {
  data() {
    return {
      data: [
        {
          r: '全部',
          id: 0,
          level: 1,
          room: []
        }
      ],
      defaultProps: {
        children: 'room',
        label: 'r'
      }
    }
  },
  mounted() {
    this.handlerGetReceivingMember()
  },
  methods: {
    handleNodeClick(row) {
      console.log(row)

      EventBus.$emit('placeId', { placeId: row.id, level: row.level })
    },
    async handlerGetReceivingMember() {
      try {
        const res = await getReceivingMember({
          search: {
            keyword: ''
          }
        }, 1)
        this.data[0].room = [...res.placelist]
      } catch (err) {
        throw err
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sidebar_wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  height: 100%;
  overflow-x: hidden;
  padding-bottom: 50px;
  .list {
    padding: 20px;
    width: 100%;
  }
}
</style>
