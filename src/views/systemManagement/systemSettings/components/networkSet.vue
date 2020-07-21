<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>网络设置</h4>
      <el-button
        type="primary"
        class="btn"
        size="small"
        :disabled="!menus.find(e => e.id === 6).enable"
        @click="saveEdit"
      >保存</el-button>
    </div>
    <div class="box_shadow">
      <h5>DNS服务器地址</h5>
      <div class="btn_list">
        <ul>
          <li>
            <span>首选DNS服务器</span>
            <el-input
              v-model="memberList.dns_server1"
              size="small"
              class="item_input"
              placeholder="首选DNS服务器"
            />
          </li>
          <li>
            <span>备选DNS服务器</span>
            <el-input
              v-model="memberList.dns_server2"
              size="small"
              class="item_input"
              placeholder="备选DNS服务器"
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="box_shadow mtop">
      <h5>网卡设置</h5>
      <div class="btn_list">
        <el-table highlight-current-row :data="memberList.network_card_info" size="small">
          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <!-- <el-input v-else v-model="scope.row.name" size="small" /> -->
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.ip }}</span>
              <el-input v-else v-model="scope.row.ip" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="netmask" label="子网掩码">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.netmask }}</span>
              <el-input v-else v-model="scope.row.netmask" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="gateway" label="网关">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.gateway }}</span>
              <el-input v-else v-model="scope.row.gateway" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="125px" align="right">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 6).enable"
                  @click="handlerEdit(scope.row)"
                >
                  <i
                    v-show="!scope.row.isEdit"
                    class="iconfont icon-xiugai blue"
                  />
                </el-button>
              </el-tooltip>
              <el-tooltip content="保存" placement="top">
                <i
                  v-show="scope.row.isEdit"
                  class="iconfont margin_5 icon-zhengque1 green cursor"
                  @click="saveEdit(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="取消" placement="top">
                <i
                  v-show="scope.row.isEdit"
                  class="iconfont margin_5 icon-cuowu1 red cursor"
                  @click="cancelEdit(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getNetwork, postNetwork } from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      placeId: '',
      userInfo: '',
      memberList: {
        dns_server1: '',
        dns_server2: '',
        network_card_info: []
      }
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.handlergGetReceivingMember()
  },
  methods: {
    // 接收成员获取
    async handlergGetReceivingMember() {
      try {
        const res = await getNetwork()
        res.network_info.network_card_info.forEach(e => {
          e.isEdit = false
        })
        this.memberList = res.network_info
      } catch (err) {
        throw err
      }
    },
    cancelEdit(row) {
      row.isEdit = true
      this.handlergGetReceivingMember()
    },
    handlerEdit(row) {
      row.isEdit = true
    },
    async saveEdit(row) {
      try {
        const res = await postNetwork({
          network_info: this.memberList
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        if (row) row.isEdit = false

        this.handlergGetReceivingMember()
      } catch (err) {
        if (row) row.isEdit = false
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/baseTitle.scss";
.btn {
  margin: 20px 0 0 15px;
}
.dashboard-container {
  p {
    font-size: 14px;
    color: #282828;
    margin: 25px 20px 30px;
  }
  h5 {
    color: #333;
    font-weight: 400;
    margin: 0px 0px 25px;
    font-size: 16px;
  }
  .btn_list {
    ul {
      li {
        margin-bottom: 20px;
        span {
          color: #909399;
          font-size: 14px;
          margin-right: 10px;
        }
        .item_input {
          max-width: 300px;
        }
      }
    }
  }
  .gray {
    background: #5087ec;
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
