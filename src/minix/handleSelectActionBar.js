import SelectActionBar from '@/components/SelectActionBar'
export default {
  data() {
    return {
      selectNum: 0,
      indeterminate: false,
      allChcek: false,
      isedit: false,
      batchList: [],
      editText: '编辑'
    }
  },
  components: {
    SelectActionBar
  },
  watch: {
    isedit(newVal) {
      this.editText = newVal ? '取消' : '编辑'
    }
  },
  methods: {
    // 多选钩子
    handleSelectChange(e, arr) {
      this.selectNum = e.length
      if (arr.length === e.length) {
        this.allChcek = true
        this.indeterminate = false
      }
      if (e.length < arr.length && e.length > 0) {
        this.indeterminate = true
        this.allChcek = false
      }
      if (e.length === 0) {
        this.indeterminate = false
        this.allChcek = false
      }
      this.batchList = e
    },
    // 取消选择
    cancelSelect() {
      this.$refs.multipleTable.clearSelection()
      this.isedit = false
      this.batchList = []
    },
    //  全选切换
    toggleSelection() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 处理编辑
    handleEdit() {
      this.isedit = !this.isedit
      if (!this.isedit) {
        this.$refs.multipleTable.clearSelection()
        this.batchList = []
      }
    }
  }
}
