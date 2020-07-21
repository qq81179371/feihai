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
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" size="small">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="form.name" :disabled="!!userInfo" />
          </el-form-item>
          <el-form-item v-if="!form.id" label="密码" prop="password">
            <el-input v-model="form.password" type="password" show-password />
          </el-form-item>
          <el-form-item label="姓名" prop="xingming">
            <el-input v-model="form.xingming" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.number="form.phone" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-select v-model="form.department" placeholder="请选择部门">
              <template v-for="item in configObj.user_department">
                <el-option :key="item.id" :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="role">
            <el-select
              v-model="form.role"
              placeholder="请选择用户类型"
              :disabled="userInfo && userInfo.role_level === 1"
            >
              <template v-for="item in configObj.user_role">
                <el-option
                  v-if="item.name === '超级管理员' ? userInfo && userInfo.role_level === 1 : false || item.name !== '超级管理员'"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="next_step">
        <el-button type="primary" size="small" @click="submitUserData">下一步</el-button>
      </div>
    </div>
    <div v-if="stepsActive === 2" class="admini_authority">
      <div class="admini_content">
        <el-checkbox-group v-model="form.menu_id" size="small">
          <el-checkbox
            v-for="item in authorityList"
            :key="item.id"
            :label="item.id"
            name="operate"
          >{{ item.operate }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="next_step">
        <el-button type="primary" size="small" @click="submitUserDataBack">上一步</el-button>
        <el-button type="primary" size="small" @click="submitUserData">下一步</el-button>
      </div>
    </div>
    <div v-if="stepsActive === 3" class="device_authorization">
      <div class="admini_content">
        <el-cascader-panel
          v-model="form.place_id"
          :props="options"
          size="small"
          :options="memberList"
          collapse-tags
          clearable
        />
      </div>
      <div class="next_step">
        <el-button type="primary" size="small" @click="submitUserDataBack">上一步</el-button>
        <el-button type="primary" size="small" @click="submitUserData">完成</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { validUsername, validName } from '@/utils/validate'
import { mapGetters } from 'vuex'
import { getAdduserInfo, getUserDetails } from '@/api/app'
import md5 from 'js-md5'
export default {
  props: {
    configObj: {
      type: Object,
      default: null
    },
    userInfo: {
      type: Object,
      default: null
    },
    memberList: {
      type: Array,
      default: null
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!validUsername(value)) {
        callback(new Error('手机号码格式不对'))
      }
      callback()
    }
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      }
      if (value !== '' && !validName(value)) {
        callback(new Error('名称不符合要求'))
      }
      callback()
    }
    return {
      placeList: null,
      options: {
        emitPath: false,
        multiple: true,
        label: 'r',
        value: 'id',
        children: 'room'
      },
      form: {
        name: '',
        id: null,
        password: null,
        xingming: '',
        phone: null,
        department: null,
        role: null,
        menu_id: [],
        place_id: []
      },
      stepsActive: 1,
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
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
      }
    }
  },
  computed: {
    ...mapGetters(['authorityList'])
  },
  created() {
    if (this.userInfo) {
      this.$nextTick(() => {
        this.form.name = this.userInfo.name
        this.form.xingming = this.userInfo.xingming
        this.form.phone = this.userInfo.phone
        this.form.department = this.userInfo.department
        this.form.role = this.userInfo.role
        this.form.menu_id = this.userInfo.menu_id
        this.form.place_id = this.userInfo.place_id
        this.form.id = this.userInfo.id
      })
    }
  },
  methods: {
    submitUserDataBack() {
      this.stepsActive--
    },
    async submitUserData() {
      if (this.stepsActive === 1) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.stepsActive = 2
          } else {
            return false
          }
        })
      } else if (this.stepsActive === 2) {
        this.stepsActive = 3
      } else if (this.stepsActive === 3) {
        try {
          if (!this.form.id) this.form.password = md5(this.form.password)
          const res = await getAdduserInfo(
            {
              user_info: this.form
            },
            3
          )
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          const user_info = res.user_info
          try {
            const result = await getUserDetails({
              user_info: {
                id: user_info.id
              }
            })
            user_info.userDetailsMenu = result.menu
            user_info.userDetailsPlaceList = result.place_list
          } catch (err) {
            throw err
          }
          this.$emit('handlerCloseMask', 'timeShow', user_info)
        } catch (err) {
          throw err
        }
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
    z-index: 3;
    background: #fff;
    width: 100%;
    padding: 15px 30px;
    border-top: 1px solid #d5d5d5;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
/deep/ .el-cascader-menu__wrap {
  height: 350px;
}
</style>
