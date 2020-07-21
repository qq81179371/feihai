<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>消息设置</h4>
      <el-button
        size="small"
        type="primary"
        :disabled="!menus.find(e => e.id === 6).enable"
        @click="outerVisible = true"
      >添加</el-button>
    </div>
    <div class="btn_list box_shadow">
      <div class="qr_box">
        <div class="img_box">
          <img src="./../../../../assets/home/qr.jpg" alt srcset>
          <span>斐海科技安全助手</span>
        </div>
        <p>
          提醒：消息接收人员，请设置手机号与关注斐海科技安全助手微信公众号 , 点击查看
          <router-link target="_blank" to="/instructions">操作指引</router-link>。
        </p>
      </div>
      <el-table highlight-current-row :data="taskList" size="small">
        <el-table-column label="消息">
          <template
            slot-scope="scope"
          >{{ configObj.system_notice_types.find(e => e.id === scope.row.msg_id).name }}</template>
        </el-table-column>
        <el-table-column label="阈值">
          <template
            slot-scope="scope"
          >{{ scope.row.msg_id ===1 ||scope.row.msg_id ===5 ? configObj[threshold[scope.row.msg_id]].find(e => e.id === scope.row.threshold).name : '无' }}</template>
        </el-table-column>
        <el-table-column prop="user_name" label="接收人员" />
        <el-table-column prop="frequency" label="消息频率">
          <template
            slot-scope="scope"
          >{{ configObj.system_notice_frequency.find(e => e.id === scope.row.frequency).name }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="right" width="125px">
          <template slot-scope="scope">
            <el-tooltip content="删除" placement="top">
              <i
                class="iconfont margin_5 icon-shanchu red cursor"
                @click="handlerPostDeleteMsgSet(scope.row)"
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
      title="添加消息"
      :visible.sync="outerVisible"
    >
      <el-form
        ref="fileForm"
        :rules="rules"
        :model="server_msg_info"
        label-width="150px"
        size="small"
      >
        <el-form-item label="消息类型" prop="msg_id">
          <el-select v-model="server_msg_info.msg_id" collapse-tags clearable placeholder="请选择">
            <el-option
              v-for="item in configObj.system_notice_types"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="server_msg_info.msg_id === 1 || server_msg_info.msg_id === 5"
          label="阈值"
          prop="threshold"
        >
          <el-select v-model="server_msg_info.threshold" collapse-tags clearable placeholder="请选择">
            <el-option
              v-for="item in configObj[threshold[server_msg_info.msg_id]]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接收人员" prop="user_id">
          <el-select v-model="server_msg_info.user_id" collapse-tags clearable placeholder="请选择">
            <el-option
              v-for="item in memberList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消息频率" prop="frequency">
          <el-select v-model="server_msg_info.frequency" collapse-tags clearable placeholder="请选择">
            <el-option
              v-for="item in configObj.system_notice_frequency"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handlerCopyRunMod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMessageList,
  getMsgUserList,
  postAddMsgSet,
  postDeleteMsgSet
} from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  props: {
    configObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      server_msg_info: {
        msg_id: '',
        threshold: 1,
        user_id: '',
        frequency: ''
      },
      outerVisible: false,
      taskList: null,
      memberList: null,
      threshold: {
        1: 'system_notice_device_threshold',
        5: 'system_notice_off_threshold'
      },
      deviceArrProps: {
        emitPath: false,
        label: 'r',
        multiple: true,
        value: 'id',
        children: 'room'
      },
      rules: {
        msg_id: [
          { required: true, message: '请选择消息类型', trigger: 'blur' }
        ],
        threshold: [{ required: true, message: '请选择阈值', trigger: 'blur' }],
        user_id: [
          { required: true, message: '请选择接收人员', trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: '请选择报警频率', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.handlerGetMsgUserList()
    this.handlerGetMessageList()
  },
  methods: {
    // 接收成员获取
    async handlerGetMsgUserList() {
      try {
        const res = await getMsgUserList()
        this.memberList = res.user
      } catch (err) {
        throw err
      }
    },
    async handlerGetMessageList() {
      const res = await getMessageList()
      this.taskList = res.server_msg_info
    },
    async handlerPostDeleteMsgSet(e) {
      try {
        await this.$confirm(`此操作将永久删除该消息, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await postDeleteMsgSet({
          id: e.id
        })
        this.$message({
          type: 'success',
          message: res.result.text
        })
        this.taskList.splice(this.taskList.map(i => i.id).indexOf(e.id), 1)
      } catch (err) {
        throw err
      }
    },
    async handlerCopyRunMod() {
      this.$refs.fileForm.validate(async valid => {
        if (valid) {
          try {
            const res = await postAddMsgSet({
              server_msg_info: this.server_msg_info
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.handlerGetMessageList()
            this.outerVisible = false
          } catch (err) {
            throw err
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
@import "~@/styles/baseTitle.scss";
.dashboard-container {
  p {
    font-size: 14px;
    color: #282828;
    margin: 25px 20px 30px;
  }
  .btn_list {
    .qr_box {
      img {
        width: 114px;
        height: 114px;
      }
      span {
        font-size: 14px;
        color: #bababa;
      }
      .img_box {
        width: 114px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      p {
        height: 30px;
        background: rgba(238, 254, 243, 1);
        border: 1px solid rgba(181, 233, 184, 1);
        width: 100%;
        margin: 20px 0;
        line-height: 30px;
        font-size: 12px;
        color: #666;
        padding: 0 10px;
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
