<template>
  <div class="admini_wrap">
    <div class="admini_title">
      <el-steps :space="`50%`" :active="stepsActive" finish-status="success" align-center>
        <el-step title="用户信息" />
        <el-step title="权限设置" />
        <el-step title="设备授权" />
      </el-steps>
    </div>
    <div v-if="stepsActive === 1" class="admini_info">
      <div class="admini_content">
        <el-form ref="form" :model="userInfo" label-width="100px" :rules="rules">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="userInfo.name" size="small" />
          </el-form-item>
          <el-form-item label="姓名" prop="xingming">
            <el-input v-model="userInfo.xingming" size="small" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.number="userInfo.phone" size="small" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-select v-model="userInfo.department" size="small" placeholder="请选择部门">
              <el-option label="管理处" :value="1" />
              <el-option label="管理处" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="role">
            <el-select v-model="userInfo.role" size="small" placeholder="请选择用户类型">
              <el-option label="管理员" :value="1" />
              <el-option label="管理员" :value="2" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="next_step">
        <el-button type="primary" size="small" @click="submitUserData('form')">下一步</el-button>
      </div>
    </div>
    <div v-if="stepsActive === 2" class="admini_authority">
      <div class="admini_content">
        <el-checkbox-group v-model="formAuthority">
          <el-checkbox
            v-for="item in authorityList"
            :key="item.id"
            :label="item.id"
            name="operate"
          >{{ item.operate }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="next_step">
        <el-button type="primary" size="small" @click="submitUserData('form')">下一步</el-button>
      </div>
    </div>
    <div v-if="stepsActive === 3" class="device_authorization">
      <div class="admini_content">
        <el-cascader-panel v-model="deviceArr" :props="options" collapse-tags clearable />
      </div>
      <div class="next_step">
        <el-button type="primary" size="small" @click="submitUserData">完成</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { validUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { getPartitionSetList } from '@/api/app'
import _ from 'lodash'
export default {
  props: {
    stepsActive: {
      type: Number,
      default: 1
    },
    // newUserId: {
    //   type: Number,
    //   default: null
    // }
    userInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    let levelNum = 1
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!validUsername(value)) {
        callback(new Error('手机号码格式不对'))
      }
      callback()
    }
    return {
      options: {
        lazy: true,
        emitPath: false,
        multiple: true,
        label: 'name',
        value: 'id',
        async lazyLoad(node, resolve) {
          const { level } = node
          try {
            const res = await getPartitionSetList({
              place: {
                level: levelNum === 3 ? levelNum : ++levelNum,
                parent_id: node.value || 0
              }
            })
            if (res.place_list) {
              const nodes = res.place_list.map(e => ({
                ...e,
                leaf: level >= 1
              }))
              resolve(nodes)
            } else resolve([])
          } catch (error) {
            throw error
          }
        }
      },
      formAuthority: [],
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        xingming: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        role: [{ required: true, message: '请选择用户类型', trigger: 'change' }]
      },
      deviceArr: []
    }
  },
  computed: {
    ...mapGetters(['authorityList'])
  },
  methods: {
    submitUserData(formName) {
      if (this.stepsActive === 1) {
        const user_info = _.pick(this.userInfo, [
          'name',
          'id',
          'role',
          'phone',
          'xingming',
          'department'
        ])
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$emit('handleChangeUserInfo', {
              user_info
            })
          } else {
            return false
          }
        })
      } else if (this.stepsActive === 2) {
        this.$emit('handleChangeUserInfo', {
          authority_id: this.formAuthority,
          user_id: this.newUserId
        })
      } else if (this.stepsActive === 3) {
        this.$emit('handleChangeUserInfo', {
          authority_id: this.deviceArr,
          user_id: this.newUserId
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.admini_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .admini_title {
    margin: 20px 0 30px 0;
    width: 100%;
    /deep/ .el-step__title {
      font-size: 14px;
    }
  }
  // .admini_info {
  // /deep/ .el-form-item {
  //   margin-bottom: 10px;
  // }
  // }
  .admini_content {
    overflow-x: hidden;
    height: 400px;
    .el-checkbox-group {
      display: flex;
      flex-direction: column;
      .el-checkbox {
        margin: 20px 0;
      }
    }
  }
  .next_step {
    margin: 30px 0 20px;
    display: flex;
    justify-content: center;
  }
}
/deep/ .el-cascader-menu__wrap {
  height: 350px;
}
</style>
