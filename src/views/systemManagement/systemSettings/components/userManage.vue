<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>用户管理</h4>
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
            @click="addUser"
          >添加用户</el-button>
        </div>
        <div class="block">
          <el-button
            size="small"
            type="success"
            icon="el-icon-user"
            :disabled="!menus.find(e => e.id === 6).enable"
            @click="userShow = true"
          >部门与用户类型</el-button>
        </div>
        <div class="block">
          <el-button
            size="small"
            type="success"
            icon="el-icon-folder-opened"
            :disabled="!menus.find(e => e.id === 6).enable"
          >导出</el-button>
        </div>
      </div>
    </div>
    <div class="type_list">
      <i />
      <div class="title_box">
        <el-dropdown trigger="click" placement="bottom" @command="handleDropItem">
          <span class="el-dropdown-link">
            部门-{{ configObj.user_department.find(e => e.id === userDepartment).name === "无" ? '全部' : configObj.user_department.find(e => e.id === userDepartment).name }}({{ total }})
            <i
              class="el-icon-arrow-down el-icon--right"
            />
          </span>
          <el-dropdown-menu slot="dropdown">
            <template v-for="item in configObj.user_department">
              <el-dropdown-item :key="item.id" :command="item">{{ item.id === 0 ? '全部' : item.name }}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="edit_btn">
        <el-button
          type="text"
          :disabled="!menus.find(e => e.id === 6).enable"
          @click="handleEdit"
        >{{ editText }}</el-button>
      </div>
    </div>
    <div class="form_box">
      <el-table
        ref="multipleTable"
        v-el-table-infinite-scroll="handleLoadMore"
        row-key="id"
        :data="tableDataList"
        @selection-change="handleSelectChange($event, tableDataList)"
      >
        <el-table-column
          :class-name="`selection_item ${isedit? 'isedit' : ''}`"
          :class="{isedit: isedit}"
          type="selection"
          width="40px"
        />
        <el-table-column label="用户名" prop="name" />
        <el-table-column label="姓名" prop="xingming" />
        <el-table-column label="部门" prop="department">
          <template
            slot-scope="scope"
          >{{ configObj.user_department.find(e => e.id === scope.row.department).name }}</template>
        </el-table-column>
        <el-table-column label="用户类型" prop="role">
          <template
            slot-scope="scope"
          >{{ configObj.user_role.find(e => e.id === scope.row.role).name }}</template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <el-tooltip :content="`${scope.row.phone}`" placement="top">
              <span>{{ `${scope.row.phone}` | phoneSplice }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70px">
          <template slot-scope="scope">
            <div class="operate_content">
              <el-tooltip content="修改" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 6).enable"
                  @click="handleChangeUser(scope.row)"
                >
                  <i class="iconfont icon-xiugai blue" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 6).enable || scope.row.role_level === 1"
                  @click="handleDeleteUser(scope.row.id)"
                >
                  <i class="iconfont icon-shanchu red" />
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i
              class="el-icon-arrow-right cursor"
              :class="{rotate: scope.row.update}"
              @click="handleGetUserDetails(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1px">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="权限设置">
                <ul>
                  <li v-for="item in scope.row.userDetailsMenu" :key="item.id">{{ item.name }}</li>
                  <li v-if="!scope.row.userDetailsMenu" style="color: #999">暂未授权</li>
                </ul>
              </el-form-item>
              <el-form-item label="设备授权">
                <ul class="admin_list">
                  <li v-for="item in scope.row.userDetailsPlaceList" :key="item.id">
                    <span class="tit">{{ item.name }}</span>
                    <p>
                      <span v-for="e in item.room" :key="e.id">{{ e.name }}</span>
                    </p>
                  </li>
                  <li v-if="!scope.row.userDetailsPlaceList" style="color: #777">暂未授权</li>
                </ul>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="el-dialog-box"
      title="添加用户"
      :visible.sync="timeShow"
      destroy-on-close
      :before-close="handlerCloseRemind"
    >
      <addAdmini
        v-if="configObj && timeShow"
        :config-obj="configObj"
        :member-list="memberList"
        :user-info="userInfo"
        @handlerCloseMask="handlerCloseMask"
      />
    </el-dialog>
    <el-dialog class="el-dialog-box" title="修改菜单权限" :visible.sync="setShow" destroy-on-close>
      <addAdmini1 @handleBatchChangeInfo="handleBatchChangeInfo" />
    </el-dialog>
    <el-dialog class="el-dialog-box" title="修改设备权限" :visible.sync="authShow" destroy-on-close>
      <addAdmini2 @handleBatchChangeInfo="handleBatchChangeInfo" />
    </el-dialog>
    <el-dialog class="el-dialog-box" title="部门与用户类型" :visible.sync="userShow" destroy-on-close>
      <div v-if="userRole" class="user_role">
        <ul>
          <li class="li_title">
            <span>部门</span>
            <el-tooltip content="添加" class="icon" placement="top">
              <i class="iconfont icon-xinjian green" @click="addPartitionNode(1)" />
            </el-tooltip>
          </li>
          <template v-for="(item, index) in userRole.user_department">
            <li :key="index">
              <span v-if="!item.checked">{{ item.name }}</span>
              <el-input v-else v-model="item.new_name" size="mini" placeholder="部门名称" />
              <template v-if="item.checked">
                <el-tooltip content="保存" class="icon" placement="top">
                  <i class="iconfont icon-zhengque1 green" @click="savePartitionName(item, 1)" />
                </el-tooltip>
                <el-tooltip content="取消" class="icon" placement="top">
                  <i class="iconfont icon-cuowu1 red" @click="cancelUser(item, index, 1)" />
                </el-tooltip>
              </template>
              <template v-else>
                <el-tooltip content="修改" class="icon" placement="top">
                  <i class="iconfont icon-xiugai blue" @click="changePartitionName(item)" />
                </el-tooltip>
                <el-tooltip content="删除" class="icon" placement="top">
                  <i class="iconfont icon-shanchu red" @click="remove(item, index, 1)" />
                </el-tooltip>
              </template>
            </li>
          </template>
        </ul>
        <ul>
          <li class="li_title">
            <span>用户类型</span>
            <el-tooltip content="添加" class="icon" placement="top">
              <i class="iconfont icon-xinjian green" @click="addPartitionNode(2)" />
            </el-tooltip>
          </li>
          <template v-for="(item, index) in userRole.user_roles">
            <li :key="index">
              <span v-if="!item.checked">{{ item.name }}</span>
              <el-input v-else v-model="item.new_name" size="mini" placeholder="用户类型名称" />
              <template v-if="item.checked">
                <el-tooltip content="保存" class="icon" placement="top">
                  <i class="iconfont icon-zhengque1 green" @click="savePartitionName(item, 2)" />
                </el-tooltip>
                <el-tooltip content="取消" class="icon" placement="top">
                  <i class="iconfont icon-cuowu1 red" @click="cancelUser(item, index, 2)" />
                </el-tooltip>
              </template>
              <template v-else>
                <el-tooltip content="修改" class="icon" placement="top">
                  <i class="iconfont icon-xiugai blue" @click="changePartitionName(item)" />
                </el-tooltip>
                <el-tooltip content="删除" class="icon" placement="top">
                  <i class="iconfont icon-shanchu red" @click="remove(item, index, 2)" />
                </el-tooltip>
              </template>
            </li>
          </template>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="userShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="userShow = false">确 定</el-button>
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
        <el-tooltip content="菜单授权" class="icon" placement="top">
          <i class="iconfont icon-caidan blue" @click="goBatchSet" />
        </el-tooltip>
        <el-tooltip content="设备授权" class="icon" placement="top">
          <i class="iconfont icon-shouquan blue" @click="handleVolumeAuthorization" />
        </el-tooltip>
        <el-tooltip content="删除" class="icon" placement="top">
          <i class="iconfont icon-shanchu red" @click="handleBatchDelete" />
        </el-tooltip>
      </select-action-bar>
    </transition>
  </div>
</template>

<script>
// 添加用户
import addAdmini from './addAdministrator'
// 批量修改菜单授权
import addAdmini1 from './addAdministrator1'
// 批量修改设备权限
import addAdmini2 from './addAdministrator2'
// // 修个用户
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import {
  getUserList,
  getUserDetails,
  getReceivingMember,
  getAdduserInfo,
  getDeleteUserInfo,
  getUserRoleList,
  putChangeBatchUserInfo,
  postAddUserType,
  postAddDepartment,
  postDeleteUserType,
  postDeleteDepartment
} from '@/api/app'
import handleSelectActionBar from '@/minix/handleSelectActionBar.js'
import { mapGetters } from 'vuex'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    addAdmini,
    addAdmini1,
    addAdmini2
  },
  filters: {
    phoneSplice(val) {
      return `${val.slice(0, 3)}****${val.slice(val.length - 4)}`
    }
  },
  mixins: [handleSelectActionBar],
  props: {
    configObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 批量选择选中数组
      newUserId: null,
      // 用户信息, 用于修改
      userInfo: null,
      userShow: false,
      stepsActive: 1,
      memberList: null,
      total: null,
      setShow: false,
      authShow: false,
      timeShow: false,
      page: 1,
      tableDataList: [],
      userName: '',
      userRole: null,
      userDepartment: 0
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  mounted() {
    this.handleGetUserList()
    this.handlerGetPlaceList()
    this.handlerGetUserRoleList()
  },
  methods: {
    async savePartitionName(e, t) {
      if (!e.new_name) {
        this.$message({
          message: '名称不能为空',
          type: 'warning'
        })
        return false
      }
      if (e.name === e.new_name) {
        this.$message({
          message: '两次名称相同',
          type: 'warning'
        })
        return false
      }
      if (t === 2) {
        try {
          const res = await postAddUserType({
            name: e.new_name,
            id: e.id || null
          })
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.handlerGetUserRoleList()
          this.$emit('handlerGetSystemCofing')
        } catch (err) {
          throw err
        }
      }
      if (t === 1) {
        try {
          const res = await postAddDepartment({
            name: e.new_name,
            id: e.id || null
          })
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.handlerGetUserRoleList()
          this.$emit('handlerGetSystemCofing')
        } catch (err) {
          throw err
        }
      }
    },
    cancelUser(e, n, t) {
      if (e.name) {
        e.checked = false
      } else {
        if (t === 1) this.userRole.user_department.splice(n, 1)
        if (t === 2) this.userRole.user_roles.splice(n, 1)
      }
    },
    addPartitionNode(n) {
      const obj = {
        checked: true,
        name: '',
        new_name: ''
      }
      if (n === 1) {
        this.userRole.user_department.push(obj)
      }
      if (n === 2) {
        this.userRole.user_roles.push(obj)
      }
    },
    changePartitionName(item) {
      item.checked = true
    },
    async remove(e, n, t) {
      try {
        await this.$confirm('此操作将删除当前列, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (t === 2) {
          const res = await postDeleteUserType({
            id: e.id
          })
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.userRole.user_roles.splice(n, 1)
        }
        if (t === 1) {
          const res = await postDeleteDepartment({
            id: e.id
          })
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.userRole.user_department.splice(n, 1)
        }
      } catch {
        return false
      }
    },
    async handlerGetUserRoleList() {
      try {
        const res = await getUserRoleList()
        this.userRole = res
      } catch (err) {
        throw err
      }
    },
    async handlerGetPlaceList() {
      try {
        const res = await getReceivingMember(
          {
            search: {
              keyword: ''
            }
          },
          1
        )
        this.memberList = res.placelist
      } catch (err) {
        throw err
      }
    },
    handlerCloseMask(e, res) {
      this[e] = false
      this.userInfo = null
      // this.setShow = false
      // this.authShow = false
      if (e === 'timeShow' && res.id) {
        this.tableDataList.splice(
          this.tableDataList.map(e => e.id).indexOf(res.id),
          1,
          res
        )
      } else {
        this.tableDataList.push(res)
        this.total++
      }
    },
    async handlerCloseRemind() {
      try {
        await this.$confirm('此操作将清空已输入信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.userInfo = null
        this.timeShow = false
      } catch {
        return false
      }
    },
    handleDropItem(item) {
      this.page = 1
      this.tableDataList = []
      this.userDepartment = item.id
      this.handleGetUserList()
    },
    handleChangeUser(params) {
      this.userInfo = { ...params }
      this.userInfo.place_id = this.userInfo.userDetailsPlaceList
        ? this.userInfo.userDetailsPlaceList
          .map(e => {
            return e.room.map(i => {
              return i.id
            })
          })
          .flat()
        : []
      this.userInfo.menu_id = this.userInfo.userDetailsMenu
        ? this.userInfo.userDetailsMenu.map(e => {
          return e.id
        })
        : []
      this.timeShow = true
    },
    // 添加用户  cmd == 3  用户信息 cmd == 11 菜单权限 cmd == 12 设备权限
    async handleGetAdduserInfo(params) {
      try {
        if (this.stepsActive === 1) {
          const res = await getAdduserInfo(params, 3)
          this.newUserId = res.user_id
          this.stepsActive = 2
        } else if (this.stepsActive === 2) {
          await getAdduserInfo(params, 11)
          this.stepsActive = 3
        } else if (this.stepsActive === 3) {
          const res = await getAdduserInfo(params, 12)
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.timeShow = false
          this.stepsActive = 1
        }
      } catch (err) {
        throw err
      }
    },
    // 删除用户  number 单个删除 array 多个删除
    async handleDeleteUser(data) {
      try {
        await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await getDeleteUserInfo(
          {
            user_info: {
              id: data
            }
          },
          9
        )
        if (res) {
          this.tableDataList = this.tableDataList.filter(e => e.id !== data)
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
      this.page = 1
      this.tableDataList = []
      this.handleGetUserList()
    },
    // 加载更多
    handleLoadMore() {
      if (this.page * 10 < this.total) {
        this.page++
        this.handleGetUserList()
      }
    },
    // 添加用户
    addUser() {
      this.timeShow = true
    },
    uniqueByKey(arr, key) {
      const hash = {}
      const result = arr.reduce((total, currentValue) => {
        if (!hash[currentValue[key]]) {
          // 如果当前元素的key值没有在hash对象里，则可放入最终结果数组
          hash[currentValue[key]] = true // 把当前元素key值添加到hash对象
          total.push(currentValue) // 把当前元素放入结果数组
        }
        return total // 返回结果数组
      }, [])
      return result
    },
    // 获取用户列表
    async handleGetUserList() {
      try {
        const res = await getUserList({
          page: {
            page: this.page,
            size: 10
          },
          search: {
            name: this.userName,
            department: this.userDepartment
          }
        })
        res.user_list.user.forEach(async e => {
          const result = await getUserDetails({
            user_info: {
              id: e.id
            }
          })
          e.userDetailsMenu = result.menu
          e.userDetailsPlaceList = result.place_list
        })
        this.tableDataList = [...this.tableDataList, ...res.user_list.user]
        this.tableDataList = this.uniqueByKey(this.tableDataList, 'id')
        this.total = res.user_list.total
      } catch (err) {
        throw err
      }
    },
    // 获取用户详情
    async handleGetUserDetails(row) {
      row.update = !row.update
      if (row.update) {
        this.$refs.multipleTable.toggleRowExpansion(row, true)
      } else {
        this.$refs.multipleTable.toggleRowExpansion(row, false)
      }
    },
    // 批量删除
    async handleBatchDelete() {
      if (this.batchList.length > 0) {
        try {
          await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const res = await getDeleteUserInfo(
            {
              user_info: {
                id: this.batchList.map(e => e.id)
              }
            },
            21
          )
          if (res) {
            this.isedit = false
            const tableList = this.tableDataList.filter(
              i => this.batchList.map(e => e.id).indexOf(i.id) === -1
            )
            this.tableDataList = tableList
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
    // 批量菜单授权
    async handleBatchChangeInfo(params, cmd) {
      try {
        const res = await putChangeBatchUserInfo(
          {
            user_info: {
              id: this.batchList.map(e => e.id)
            },
            ...params
          },
          cmd
        )
        this.setShow = false
        this.authShow = false
        this.isedit = false
        this.cancelSelect()
        this.$message({
          type: 'success',
          message: res.result.text
        })
      } catch (err) {
        throw err
      }
    },
    // 批量设置
    goBatchSet() {
      this.setShow = true
    },
    handleVolumeAuthorization() {
      this.authShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/dialogBase.scss";
@import "~@/styles/baseTitle.scss";
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(50px);
  opacity: 0;
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
.dashboard-container {
  .header_title {
    display: flex;
    justify-content: space-between;
    .edit_btn {
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }
  }
}
/deep/ .el-table__expand-column {
  .cell {
    display: block;
    width: 0px;
    height: 0px;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }
}
/deep/ .el-table__expanded-cell {
  background: #eefef3;
  &:hover {
    background-color: #eefef3 !important;
  }
  .el-form-item {
    display: flex;
    flex-direction: column;
    .el-form-item__label {
      color: #45b54c;
    }
    .el-form-item__content {
      max-width: 100%;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 20px;
        font-size: 14px;
        // color: #282828;
      }
      &.admin_list {
        display: flex;
        flex-direction: column;
        li {
          width: 100%;
          display: flex;
          align-items: center;
          .tit {
            min-width: 50px;
            padding: 0 10px;
            border-radius: 6px;
            color: #fff;
            background: #666;
            white-space: nowrap;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            height: 20px;
          }
          p {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            span {
              margin-left: 15px;
              white-space: nowrap;
              font-size: 14px;
              // color: #282828;
            }
          }
        }
      }
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
    margin-bottom: 0;
    width: 100%;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100vh - 320px) !important;
  }
  /deep/ .el-table::before {
    display: none;
  }
}
// .operate_content {
//   .iconfont {
//     // cursor: pointer;
//   }
// }
.blue {
  color: #37acfe;
}
.red {
  color: #ff453b;
}
.rotate {
  transform: rotate(90deg);
  transition: all 0.4s;
}
.user_role {
  display: flex;
  justify-content: space-around;
  ul {
    li {
      margin-bottom: 10px;
      font-size: 14px;
      width: 200px;
      color: #666;
      align-items: center;
      display: flex;
      span {
        flex: 1;
      }
      i {
        margin: 0 5px;
        cursor: pointer;
      }
    }
    .li_title {
      // border-bottom: 1px solid #DFDFDF;
      background: #f5f5f5;
      color: #282828;
      padding: 5px 0;
      font-size: 16px;
    }
  }
}
</style>
