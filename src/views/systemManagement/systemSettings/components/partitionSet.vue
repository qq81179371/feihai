<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>分区设置</h4>
      <el-button
        type="primary"
        size="small"
        :disabled="!menus.find(e => e.id === 6).enable"
        @click="addnode"
      >添加</el-button>
    </div>
    <div class="box_tree box_shadow">
      <div class="block">
        <el-tree
          v-if="treeShow"
          ref="tree"
          node-key="id"
          :props="props"
          :load="handleGetPartitionSetList"
          lazy
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-tooltip content="添加" class="icon" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 6).enable"
                  @click="addPartitionNode(node)"
                >
                  <i
                    v-if="node.level === 1"
                    class="iconfont icon-xinjian green"
                  />
                </el-button>
              </el-tooltip>
              <el-tooltip content="修改" class="icon" placement="top">
                <el-button
                  type="text"
                  :disabled="!menus.find(e => e.id === 6).enable"
                  @click="changePartitionName(node)"
                >
                  <i class="iconfont icon-xiugai blue" />
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" class="icon" placement="top">
                <i class="iconfont icon-shanchu red" @click="remove(node)" />
              </el-tooltip>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      class="el-dialog-box"
      :title="titleName"
      :visible.sync="outerVisible"
      destroy-on-close
    >
      <el-form ref="form" label-width="130px">
        <el-form-item label="名称" prop="age">
          <el-input v-model="partitionName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPartitionParentNode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPartitionSetList,
  putAddPartitionNode,
  deletePartitionNode,
  changePartitionNode
} from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      titleName: '添加分区',
      handleType: 1,
      treeShow: true,
      outerVisible: false,
      nodes: null,
      partitionName: '',
      props: {
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    ...mapGetters(['menus'])
  },
  methods: {
    // 添加父节点
    addnode() {
      this.titleName = '添加分区'
      this.outerVisible = true
      this.nodes = null
      this.handleType = 1
    },
    // 获取分区数据
    async handleGetPartitionSetList(node, resolve) {
      this.resolves = resolve
      if (node.level === 0) {
        try {
          const res = await getPartitionSetList({
            place: {
              parent_id: 0,
              level: 2
            }
          })
          resolve(res.place_list)
        } catch (err) {
          throw err
        }
      }
      if (node.level === 1) {
        const res = await getPartitionSetList({
          place: {
            parent_id: node.data.id,
            level: 3
          }
        })
        if (res.place_list) {
          resolve(res.place_list.map(e => ({ ...e, leaf: true })))
        } else {
          resolve([])
        }
      }
    },
    // 添加子节点
    changePartitionName(node) {
      this.titleName = '修改分区'
      this.outerVisible = true
      this.handleType = 3
      this.nodes = node
    },
    // 添加节点
    async addPartitionParentNode() {
      if (!this.partitionName) {
        this.$message({
          message: '名字不能为空',
          type: 'warning'
        })
        return false
      }
      if (this.handleType !== 3) {
        try {
          const res = await putAddPartitionNode({
            place: {
              parent_id: this.nodes ? this.nodes.data.id : 0,
              level: this.handleType + 1,
              name: this.partitionName
            }
          })
          if (this.handleType === 1) {
            if (res) {
              this.treeShow = false
              this.outerVisible = false
              setTimeout(() => {
                this.treeShow = true
              }, 1000)
            }
          }
          if (this.handleType === 2) {
            this.$refs.tree.append(
              { ...res.new_place, leaf: true },
              this.nodes
            )
            this.outerVisible = false
          }
        } catch (err) {
          throw err
        }
      } else {
        try {
          const res = await changePartitionNode({
            place: {
              id: this.nodes.data.id,
              name: this.partitionName
            }
          })
          if (res) {
            this.nodes.data.name = this.partitionName
            this.outerVisible = false
          }
        } catch (err) {
          throw err
        }
      }
    },
    addPartitionNode(node) {
      this.titleName = '添加分区'
      node.expanded = true
      node.loadData()
      this.handleType = 2
      this.nodes = node
      this.outerVisible = true
    },
    async remove(node) {
      try {
        await this.$confirm(
          `此操作将永久删除 "${node.data.name}", 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const res = await deletePartitionNode({
          place: [
            {
              id: node.data.id,
              level: node.level + 1
            }
          ]
        })
        if (res) {
          this.$refs.tree.remove(node)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      } catch {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "~@/styles/systemManage.scss";
@import "~@/styles/baseTitle.scss";
.dashboard-container {
  .iconfont {
    margin: 0 15px;
  }
  p {
    font-size: 14px;
    color: #282828;
    margin: 25px 20px 30px;
  }
  .btn_list {
    padding: 0 20px;
  }
  .gray {
    background: #5087ec;
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
  .box_tree {
    width: 100%;
    height: calc(100vh - 300px);
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(69, 181, 76, 1);
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .block {
    width: 550px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.red_btn {
  color: #ff3b30;
}
.grenn_btn {
  color: #45b54c;
}
/deep/ .el-dialog__header {
  padding: 10px;
  margin: 10px;
  background: #efefef;
  transform: translateY(20px);
  .el-dialog__headerbtn {
    top: 15px;
  }
}
.el-dialog-box {
  >>> .el-dialog {
    width: 50%;
    max-width: 750px;
  }
}
/deep/ .el-select {
  display: block;
}
/deep/ .el-form-item__content {
  max-width: 350px;
}
</style>
