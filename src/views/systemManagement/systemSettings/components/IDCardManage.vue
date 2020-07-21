<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>一卡通管理</h4>
      <div class="search_bar">
        <div class="block">
          <el-input
            v-model="userName"
            clearable
            class="input_item"
            size="small"
            placeholder="请输入关键字"
          />
        </div>
        <div class="block">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleSearchDeviceList"
          >搜索</el-button>
        </div>
        <div class="block">
          <el-button
            size="small"
            type="warning"
            icon="el-icon-circle-plus-outline"
            :disabled="!menus.find(e => e.id === 6).enable"
            @click="outerVisible = true"
          >添加一卡通</el-button>
        </div>
        <div class="block">
          <el-button
            size="small"
            type="success"
            icon="el-icon-bank-card"
            :disabled="!menus.find(e => e.id === 6).enable"
            @click="outerVisible1 = true"
          >导入一卡通</el-button>
        </div>
        <div class="block">
          <a :href="cardStencilDownloadUrl" download>
            <el-button
              size="small"
              type="success"
              :disabled="!menus.find(e => e.id === 6).enable"
              icon="el-icon-download"
            >模版下载</el-button>
          </a>
          <!-- <el-button size="small" type="success" icon="el-icon-download">模版下载</el-button> -->
        </div>
        <div class="block">
          <el-button
            size="small"
            type="success"
            icon="el-icon-set-up"
            :disabled="!menus.find(e => e.id === 6).enable"
            @click="handlerGetIdCardListSync"
          >设备同步</el-button>
        </div>
      </div>
    </div>
    <div class="type_list">
      <i />
      <div class="title_box">
        <el-dropdown trigger="click" placement="bottom" @command="handleDropItem">
          <span class="el-dropdown-link">
            一卡通-{{ configObj.user_department.find(e => e.id === userDepartment).name }}({{ total }})
            <i
              class="el-icon-arrow-down el-icon--right"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <template v-for="item in configObj.user_department">
              <el-dropdown-item :key="item.id" :command="item">{{ item.name }}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="edit_btn" @click="handleEdit">{{ editText }}</div>
    </div>
    <div class="form_box">
      <el-table
        v-if="tableShow"
        v-el-table-infinite-scroll="handleLoadMore"
        :data="tableData"
        size="small"
        row-key="id"
        @selection-change="handleSelectChange($event, tableData)"
      >
        <el-table-column
          :class-name="`selection_item ${isedit? 'isedit' : ''}`"
          :class="{isedit: isedit}"
          type="selection"
          width="40px"
        />
        <el-table-column label="姓名" prop="name" align="left" />
        <el-table-column label="部门" prop="department" />
        <el-table-column label="一卡通" prop="iccard" />
        <el-table-column label="关联系统用户名" prop="user_name" />
        <el-table-column label="操作" align="right" width="125px">
          <template slot-scope="scope">
            <el-tooltip content="删除" placement="top">

              <el-button
                type="text"
                :disabled="!menus.find(e => e.id === 6).enable"
                @click="handleDeleteUser(scope.row)"
              >
                <i
                  class="iconfont margin_5 icon-shanchu red "
                /></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="el-dialog-box" title="添加一卡通用户" :visible.sync="outerVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="small">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="卡号" prop="card_id">
          <el-input v-model="form.card_id" placeholder="请输入卡号" />
          <el-button
            type="primary"
            size="mini"
            class="cyan_blue"
            @click="handlerGetDeviceIdCard"
          >从设备读取</el-button>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择部门">
            <template v-for="item in configObj.user_department">
              <el-option v-if="item.id !== 0" :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定系统用户">
          <el-select v-model="form.user_id" placeholder="请选择系统用户">
            <el-option
              v-for="item in memberList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerAddIdCardList">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="el-dialog-box"
      title="导入一卡通"
      :visible.sync="outerVisible1"
      @close="closeUpload"
    >
      <el-form ref="card_info" :model="form" :rules="rules" label-width="150px" size="small">
        <el-form-item label="导入模式">
          <el-radio-group v-model="card_info.mode">
            <el-radio :label="2">追加</el-radio>
            <el-radio :label="1">替换</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加载文件" required>
          <el-upload
            ref="upload"
            action
            :show-file-list="true"
            :on-change="readExcel"
            :auto-upload="false"
            :limit="1"
            accept=".xls, .xlsx"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过1M</div>
            <el-progress v-show="inportPercentageShow" slot="tip" :percentage="inportPercentage" />
            <div slot="tip" class="el-upload__tip">
              <span class="orange">共{{ sheetArray.length }}条数据,有效数据{{ card_info.data.length }}条</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible1 = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handlerPushSystemUpgrade">确 定</el-button>
      </div>
    </el-dialog>
    <transition name="slide-fade">
      <select-action-bar
        v-if="isedit"
        :checked.sync="allChcek"
        :indeterminate.sync="indeterminate"
        :select-num="selectNum"
        @selected="toggleSelection"
        @cancel="cancelSelect"
      >
        <el-tooltip content="删除" class="icon" placement="top">
          <i class="iconfont icon-shanchu red" @click="handleBatchDelete" />
        </el-tooltip>
      </select-action-bar>
    </transition>
  </div>
</template>

<script>
import { validName } from '@/utils/validate'
import XLSX from 'xlsx'
import {
  getIdCardList,
  deleteIdCardList,
  getMsgUserList,
  addIdCardList,
  getDeviceIdCard,
  getIdCardListSync,
  pushIdCard
} from '@/api/app'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import handleSelectActionBar from '@/minix/handleSelectActionBar.js'
import { mapGetters } from 'vuex'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  mixins: [handleSelectActionBar],
  props: {
    configObj: {
      type: Object,
      default: null
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('名称不能为空'))
      }
      if (value !== '' && !validName(value)) {
        callback(new Error('名称不符合要求'))
      }
      callback()
    }
    return {
      cardStencilDownloadUrl: '/home/fh/iccard/一卡通模板.xls',
      memberList: null,
      tableShow: true,
      userDepartment: 0,
      total: 1,
      userName: '',
      card_info: {
        mode: 2,
        data: []
      },
      sheetArray: [],
      inportPercentage: 0,
      inportPercentageShow: false,
      outerVisible: false,
      outerVisible1: false,
      form: {
        name: null,
        card_id: null,
        department: null,
        user_id: null
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        card_id: [{ required: true, message: '请输入卡号', trigger: 'change' }],
        department: [
          { required: true, message: '请选择接部门', trigger: 'blur' }
        ]
      },
      page: 1,
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  created() {
    this.handlerGetMsgUserList()
    this.handlerGetIdCardList()
  },
  methods: {
    closeUpload() {
      this.card_info = {
        mode: 2,
        data: []
      }
      this.sheetArray = []
      this.inportPercentage = 0
      this.inportPercentageShow = false
      this.$refs.upload.clearFiles()
    },
    processPercentage(i, total) {
      const intValue = Math.floor(((i + 1) * 1000) / total)
      this.inportPercentage = Number((intValue / 10).toFixed(1))
    },
    readExcel(file) {
      this.inportPercentageShow = true
      const fileReader = new FileReader()
      const reg = /(^[a-f0-9]{8}$)|(^[A-F0-9]{8}$)/g
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          for (const sheet in workbook.Sheets) {
            this.sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            this.sheetArray.forEach((e, i) => {
              this.processPercentage(i, this.sheetArray.length)
              if (e['用户名'] && reg.test(e['一卡通ID']) && e['部门']) {
                this.card_info.data.push({
                  user_name: e['用户名'],
                  iccard: e['一卡通ID'],
                  department: e['部门']
                })
              }
            })
          }
        } catch (e) {
          this.$message.warning('文件类型不正确！')
          return false
        }
      }
      fileReader.readAsBinaryString(file.raw)
    },
    async handlerPushSystemUpgrade() {
      if (this.card_info.data.length !== 0) {
        try {
          const res = await pushIdCard({
            card_info: this.card_info
          })
          this.$message({
            type: 'success',
            message: res.result.text
          })
        } catch (err) {
          throw err
        }
      } else {
        this.$message.warning('请选择文件')
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 一卡通同步
    async handlerGetIdCardListSync() {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '同步中...'
      })
      try {
        const res = await getIdCardListSync()
        this.$message({
          type: 'success',
          message: res.result.text
        })
        msg.close()
      } catch (err) {
        msg.close()
        throw err
      }
    },
    // 从设备获取卡号
    async handlerGetDeviceIdCard() {
      const msg = this.$message({
        customClass: 'load_message',
        iconClass: 'el-icon-loading',
        duration: 0,
        center: true,
        message: '加载中...'
      })
      try {
        const res = await getDeviceIdCard()
        this.form.card_id = res.card_number
        this.$message({
          type: 'success',
          message: res.result.text
        })
        msg.close()
      } catch (err) {
        msg.close()
        throw err
      }
    },
    // 添加一卡通
    async handlerAddIdCardList() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const res = await addIdCardList({
              card: this.form
            })
            this.$message({
              type: 'success',
              message: res.result.text
            })
            this.tableShow = false
            this.page = 1
            this.tableData = []
            this.handlerGetIdCardList()
            this.outerVisible = false
          } catch (err) {
            throw err
          }
        }
      })
    },
    // 接收成员获取
    async handlerGetMsgUserList() {
      try {
        const res = await getMsgUserList()
        this.memberList = res.user
      } catch (err) {
        throw err
      }
    },
    // 删除用户  number 单个删除 array 多个删除
    async handleDeleteUser(e) {
      try {
        await this.$confirm('此操作将永久删除一卡通, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteIdCardList(
          {
            cards: [
              {
                id: e.id,
                card: e.iccard
              }
            ]
          },
          9
        )
        if (res) {
          this.tableData = this.tableData.filter(i => i.id !== e.id)
          this.$message({
            type: 'success',
            message: res.result.text
          })
        }
      } catch {
        return false
      }
    },
    // 搜索
    handleSearchDeviceList() {
      this.tableShow = false
      this.page = 1
      this.tableData = []
      this.handlerGetIdCardList()
    },
    addUser() {},
    handleDropItem(item) {
      this.tableShow = false
      this.page = 1
      this.tableData = []
      this.userDepartment = item.id
      this.handlerGetIdCardList()
    },
    // 加载更多
    handleLoadMore() {
      if (this.page * 10 < this.total) {
        this.page++
        this.handlerGetIdCardList()
      }
    },
    // 批量删除
    async handleBatchDelete() {
      if (this.batchList.length > 0) {
        try {
          await this.$confirm('此操作将永久删除一卡通, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const res = await deleteIdCardList({
            cards: this.batchList.map(e => {
              return {
                id: e.id,
                card: e.iccard
              }
            })
          })
          if (res) {
            this.isedit = false
            const tableList = this.tableData.filter(
              i => this.batchList.map(e => e.id).indexOf(i.id) === -1
            )
            this.tableData = tableList
            this.cancelSelect()
            this.$message({
              type: 'success',
              message: res.result.text
            })
          }
        } catch {
          return false
        }
      } else {
        this.$message({
          message: '未选择设备',
          type: 'warning'
        })
      }
    },
    async handlerGetIdCardList() {
      try {
        const res = await getIdCardList({
          page: {
            page: this.page,
            size: 6
          },
          search: {
            name: this.userName,
            department: this.userDepartment
          }
        })
        if (!this.tableShow) this.tableShow = true
        this.tableData = [...this.tableData, ...res.card_list.card]
        this.total = res.card_list.total
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
@import "~@/styles/baseTitle.scss";
.cyan_blue {
  background: #37cbcb;
  border: none;
  color: #fff;
  &:hover {
    opacity: 0.8;
  }
}
/deep/ .selection_item {
  /deep/ .cell {
    transition: all 0.4s;
    opacity: 0;
  }
  &.isedit {
    /deep/ .cell {
      opacity: 1;
      transition: all 0.4s;
    }
  }
}
.form_box {
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    width: 100%;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100vh - 320px) !important;
  }
  /deep/ .el-table::before {
    display: none;
  }
}
</style>
