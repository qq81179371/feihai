<template>
  <div class="dashboard-container">
    <div class="header_title">
      <h4>物联设备控制代码</h4>
      <div class="search_bar">
        <el-button
          type="primary"
          size="small"
          @click="handleAddEvent"
        >添加</el-button>
        <el-button
          v-if="typeId === 2"
          type="primary"
          size="small"
          @click="handlerSetBrand"
        >品牌添加</el-button>
        <el-button
          v-if="typeId === 2"
          type="primary"
          size="small"
          @click="handlerSet"
        >红外设置</el-button>
      </div>
    </div>
    <div class="">
      <div class="operate_bar">
        <span>品牌:</span>
        <el-select
          v-model="keyword"
          class="input_item"
          filterable
          size="small"
          clearable
          placeholder="品牌选择"
          @change="searchList"
        >
          <template v-for="item in basicData[brandList[typeId]]">
            <el-option :key="item.id" :label="item.brand" :value="item.id" />
          </template>
        </el-select>
      </div>
      <div class="ul_tabs">
        <ul>
          <li
            v-for="item in tabsList"
            :key="item.id"
            :class="{ active: typeId === item.id }"
            @click="handleSwitchTypeId(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <el-table
        v-if="tableShow && typeId !== 2"
        v-loading="listLoading"
        v-el-table-infinite-scroll="handleLoadMore"
        :data="function_code_list"
        element-loading-text="Loading"
        :height="tableHeight"
        :span-method="arraySpanMethod"
        size="small"
        fit
      >
        <el-table-column
          label="名称"
          align="left"
          prop="brand_name"
          width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.changeShow">{{ scope.row.brand_name }}</span>
            <el-input v-else v-model="scope.row.brand_nameCopy" size="small" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeId === 11"
          label="控制方式"
          align="left"
          prop="transmit_mode"
          width="120px"
        />
        <el-table-column
          label="波特率"
          align="left"
          prop="baudrate"
          width="120px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.changeShow">{{ scope.row.baudrate }}</span>
            <el-select
              v-else
              v-model="scope.row.baudrateCopy"
              size="small"
              clearable
              placeholder="波特率"
            >
              <template v-for="item in baudrateList">
                <el-option
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                />
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="控制内容"
          align="left"
          prop="function"
          width="120px"
        />
        <el-table-column label="16 进制控制代码" align="left" prop="code">
          <template slot-scope="scope">
            <span v-if="scope.row.changeShow">{{ scope.row.code }}</span>
            <p v-else class="code_list">
              <el-tooltip content="删除" placement="top">
                <i
                  v-if="
                    scope.row.function !== '开机' &&
                      scope.row.function !== '关机' &&
                      typeId === 11
                  "
                  class="iconfont icon-shanchu red cursor"
                  @click="handleDeleteOneCode(scope.row)"
                />
              </el-tooltip>
              <el-input v-model="scope.row.codeCopy" size="small" />
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.changeShow"
              content="编辑"
              placement="top"
            >
              <i
                class="iconfont icon-xiugai blue cursor"
                @click="handleEdit(scope)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="!scope.row.changeShow"
              content="保存"
              placement="top"
            >
              <i
                class="iconfont icon-zhengque1 blue cursor"
                @click="handleSaveEdit(scope)"
              />
            </el-tooltip>
            <el-tooltip
              v-if="!scope.row.changeShow"
              content="取消"
              placement="top"
            >
              <i
                class="iconfont icon-cuowu1 blue cursor"
                @click="handleCancelEdit(scope)"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <i
                class="iconfont icon-shanchu red cursor"
                @click="handleDeleteDeviceMod(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-if="tableShow && typeId === 2"
        v-loading="listLoading"
        v-el-table-infinite-scroll="handleLoadMore"
        :data="function_code_list"
        element-loading-text="Loading"
        :height="tableHeight"
        size="small"
        fit
      >
        <el-table-column
          label="品牌"
          align="left"
          prop="brand_name"
          width="60px"
        />
        <el-table-column label="功能" prop="function" width="60px" />
        <el-table-column label="温度" prop="function_value" width="60px" />
        <el-table-column
          label="红外码"
          align="left"
          prop="code"
          show-overflow-tooltip
        />
        <el-table-column align="center" label="操作" width="50px">
          <template slot-scope="scope">
            <el-tooltip content="删除" placement="top">
              <i
                class="iconfont icon-shanchu red cursor"
                @click="handleDeleteDeviceMod(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        class="el-dialog-box"
        title="空调品牌"
        :visible.sync="userShow"
        destroy-on-close
      >
        <div v-if="userRole" class="user_role">
          <ul>
            <li class="li_title">
              <span>品牌</span>
              <el-tooltip content="添加" class="icon" placement="top">
                <i
                  class="iconfont icon-xinjian green"
                  @click="addPartitionNode()"
                />
              </el-tooltip>
            </li>
            <template v-for="(item, index) in userRole">
              <li :key="index">
                <span v-if="!item.checked">{{ item.name }}</span>
                <el-input
                  v-else
                  v-model="item.new_name"
                  size="mini"
                  placeholder="品牌名称"
                />
                <template v-if="item.checked">
                  <el-tooltip content="保存" class="icon" placement="top">
                    <i
                      class="iconfont icon-zhengque1 green"
                      @click="savePartitionName(item)"
                    />
                  </el-tooltip>
                  <el-tooltip content="取消" class="icon" placement="top">
                    <i
                      class="iconfont icon-cuowu1 red"
                      @click="cancelUser(item, index)"
                    />
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-tooltip content="修改" class="icon" placement="top">
                    <i
                      class="iconfont icon-xiugai blue"
                      @click="changePartitionName(item)"
                    />
                  </el-tooltip>
                  <el-tooltip content="删除" class="icon" placement="top">
                    <i
                      class="iconfont icon-shanchu red"
                      @click="remove(item, index)"
                    />
                  </el-tooltip>
                </template>
              </li>
            </template>
          </ul>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="userShow = false">取 消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="userShow = false"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="添加物联设备控制代码"
      destroy-on-close
      :visible.sync="outerVisible"
    >
      <el-form
        ref="addForm"
        :rules="rules"
        :model="function_code_update"
        size="small"
        label-width="180px"
        label-position="right"
      >
        <el-form-item label="名称" class="width_100" prop="brand_name">
          <el-input v-model="function_code_update.brand_name" clearable />
        </el-form-item>
        <el-form-item label="波特率" class="width_100" prop="baudrate">
          <el-select
            v-model="function_code_update.baudrate"
            clearable
            placeholder="波特率"
          >
            <template v-for="item in baudrateList">
              <el-option
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </template>
          </el-select>
        </el-form-item>
        <template v-for="(item, index) in function_code_update.code_texts">
          <el-form-item
            :key="item.id"
            :label="item.function"
            class="width_100"
            :prop="`code_texts[${index}].code`"
            :rules="{
              required: true,
              validator: handlevValidCode,
              trigger: 'blur'
            }"
          >
            <el-input v-model="item.code" clearable />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitDeviceOperation"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="添加物联设备控制代码"
      destroy-on-close
      :visible.sync="outerVisible1"
    >
      <el-form
        ref="addForm1"
        :model="customize"
        size="small"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="名称" class="width_100" prop="brand_name">
          <el-input v-model="customize.brand_name" clearable />
        </el-form-item>
        <el-form-item
          label="控制方式"
          class="width_100"
          prop="transmit_mode_id"
        >
          <el-select
            v-model="customize.transmit_mode_id"
            clearable
            placeholder="控制方式"
          >
            <template v-for="item in basicData.udfc_transmit_mode">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="波特率" class="width_100" prop="baudrate">
          <el-select
            v-model="customize.baudrate"
            :disabled="customize.transmit_mode_id === 1"
            clearable
            placeholder="波特率"
          >
            <template v-for="item in baudrateList">
              <el-option
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开机控制代码"
          prop="open_code"
          class="width_100 display_flex"
        >
          <el-input
            v-model="customize.open_code"
            :disabled="customize.transmit_mode_id === 1"
            clearable
          />
          <el-button
            v-if="customize.transmit_mode_id === 1"
            type="primary"
            class="study"
          >学 习</el-button>
        </el-form-item>
        <el-form-item
          label="关机控制代码"
          prop="close_code"
          class="width_100 display_flex"
        >
          <el-input
            v-model="customize.close_code"
            :disabled="customize.transmit_mode_id === 1"
            clearable
          />
          <el-button
            v-if="customize.transmit_mode_id === 1"
            type="primary"
            class="study"
          >学 习</el-button>
        </el-form-item>
        <el-form-item label="功能1名称" class="width_100" prop="function1_name">
          <el-input v-model="customize.function1_name" clearable />
        </el-form-item>
        <el-form-item
          label="功能1控制代码"
          prop="function1_code"
          class="width_100 display_flex"
        >
          <el-input
            v-model="customize.function1_code"
            :disabled="customize.transmit_mode_id === 1"
            clearable
          />
          <el-button
            v-if="customize.transmit_mode_id === 1"
            type="primary"
            class="study"
          >学 习</el-button>
        </el-form-item>
        <el-form-item label="功能2名称" prop="function2_name" class="width_100">
          <el-input v-model="customize.function2_name" clearable />
        </el-form-item>
        <el-form-item
          label="功能2控制代码"
          prop="function2_code"
          class="width_100 display_flex"
        >
          <el-input
            v-model="customize.function2_code"
            :disabled="customize.transmit_mode_id === 1"
            clearable
          />
          <el-button
            v-if="customize.transmit_mode_id === 1"
            type="primary"
            class="study"
          >学 习</el-button>
        </el-form-item>
        <el-form-item label="功能3名称" class="width_100" prop="function3_name">
          <el-input v-model="customize.function3_name" clearable />
        </el-form-item>
        <el-form-item
          label="功能3控制代码"
          prop="function3_code"
          class="width_100 display_flex"
        >
          <el-input
            v-model="customize.function3_code"
            :disabled="customize.transmit_mode_id === 1"
            clearable
          />
          <el-button
            v-if="customize.transmit_mode_id === 1"
            type="primary"
            class="study"
          >学 习</el-button>
        </el-form-item>
        <el-form-item label="功能4名称" class="width_100" prop="function4_name">
          <el-input v-model="customize.function4_name" clearable />
        </el-form-item>
        <el-form-item
          label="功能4控制代码"
          prop="function4_code"
          class="width_100 display_flex"
        >
          <el-input
            v-model="customize.function4_code"
            :disabled="customize.transmit_mode_id === 1"
            clearable
          />
          <el-button
            v-if="customize.transmit_mode_id === 1"
            type="primary"
            class="study"
          >学 习</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible1 = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitDeviceOperation1"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="红外学习"
      destroy-on-close
      :visible.sync="outerVisible2"
    >
      <el-form
        ref="addForm2"
        :model="device_info"
        size="small"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="物联模块" class="width_100" prop="pandid">
          <el-select
            v-model="device_info.pandid"
            clearable
            placeholder="物联模块"
          >
            <template v-for="item in basicData.iot_module">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="空调品牌" class="width_100" prop="brand_id">
          <el-select
            v-model="device_info.brand_id"
            clearable
            placeholder="空调品牌"
          >
            <template v-for="item in basicData.hvac_brand">
              <el-option :key="item.id" :label="item.brand" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="功能" class="width_100" prop="function_id">
          <el-select
            v-model="device_info.function_id"
            clearable
            placeholder="功能"
          >
            <template v-for="item in basicData.hvac_function_type">
              <el-option
                :key="item.value"
                :label="item.name"
                :value="item.id"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="温度" class="width_100" prop="temperature">
          <el-select
            v-model="device_info.temperature"
            :disabled="
              device_info.function_id === 5 || device_info.function_id === 6
            "
            clearable
            placeholder="功能"
          >
            <template v-for="item in 30">
              <el-option
                v-if="item >= 20"
                :key="item"
                :label="item"
                :value="item"
              />
            </template>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible2 = false">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitDeviceOperation2"
        >学习</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="el-dialog-box"
      title="空调红外值设置"
      destroy-on-close
      :visible.sync="outerVisible3"
    >
      <el-form
        ref="addForm3"
        :model="hvac"
        size="small"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="空调品牌" class="width_100" prop="brand_id">
          <el-select
            v-model="hvac.brand_id"
            clearable
            placeholder="空调品牌"
            @change="handlerGetHvacNum"
          >
            <template v-for="item in basicData.hvac_brand">
              <el-option :key="item.id" :label="item.brand" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="范围" class="width_100">
          <span>{{ hvac.min }} ~ {{ hvac.max }}</span>
        </el-form-item>
        <el-form-item
          label="当前值"
          class="width_100"
          prop="brand_value"
          :rules="[
            { required: true, message: '请输入值', trigger: 'blur' },
            {
              type: 'number',
              min: hvac.min,
              max: hvac.max,
              message: `值范围 ${hvac.min} 到 ${hvac.max} 之间`,
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model.number="hvac.brand_value" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="outerVisible3 = false">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitDeviceOperation3"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validCode, validName } from '@/utils/validate'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import {
  getLotControlCode,
  addLotControlCode,
  deleteLotControlCode,
  changeLotControlCode,
  deleteOneControlCode,
  postHvacStyle,
  knogtiaohuoqu,
  getHvacNum,
  postHvacNum,
  kongtiaotianjiaxiugai,
  kongtiaoshanchu,
  addCustomizeControl
} from '@/api/app'
import { mapGetters } from 'vuex'
export default {
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  props: {
    deviceId: {
      type: Number,
      default: null
    },
    basicData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      }
      if (value !== '' && !validName(value)) {
        callback(new Error('名称不符合要求'))
      }
      callback()
    }
    const validateCode = (rule, value, callback) => {
      if (value !== '' && !validCode(value)) {
        callback(new Error('代码不符合要求'))
      }
      callback()
    }
    return {
      userRole: [],
      device_info: {
        device_id: null,
        pandid: null,
        brand_id: null,
        function_id: null,
        temperature: null,
        brand_type: null
      },
      userShow: false,
      tableShow: true,
      hvac: {
        brand_id: 1,
        brand_value: null,
        min: 0,
        max: 0
      },
      changeShow: true,
      outerVisible2: false,
      outerVisible3: false,
      brandList: {
        2: 'hvac_brand',
        3: 'projector_brand',
        6: 'aiopc_brand',
        11: 'user_define_brand'
      },
      tabsList: [
        {
          id: 3,
          name: '投影机'
        },
        {
          id: 2,
          name: '空调'
        },
        {
          id: 6,
          name: '大屏一体机'
        },
        {
          id: 11,
          name: '自定义'
        }
      ],
      customize: {
        brand_name: '',
        baudrate: '',
        transmit_mode_id: '',
        open_code: '',
        close_code: '',
        function1_name: '',
        function1_code: '',
        function2_name: '',
        function2_code: '',
        function3_name: '',
        function3_code: '',
        function4_name: '',
        function4_code: ''
      },
      module_function_type: null,
      typeId: 3,
      total: null,
      tableHeight: document.body.scrollHeight - 390,
      function_code_update: {
        brand_name: '',
        baudrate: '',
        code_texts: null
      },
      changeFunctionList: [],
      keyword: null,
      function_code_list: [],
      listLoading: false,
      page: 1,
      outerVisible: false,
      outerVisible1: false,
      selected_list: null,
      rules: {
        pandid: [
          { required: true, message: '请选择物联模块', trigger: 'blur' }
        ],
        brand_id: [
          { required: true, message: '请选择空调品牌', trigger: 'blur' }
        ],
        function_id: [
          { required: true, message: '请选择功能', trigger: 'blur' }
        ],
        temperature: [
          { required: true, message: '请选择温度', trigger: 'blur' }
        ],
        brand_name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        baudrate: [
          { required: true, message: '请选择波特率', trigger: 'blur' }
        ],
        transmit_mode_id: [
          { required: true, message: '请选择控制方式', trigger: 'blur' }
        ],
        open_code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        close_code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        function1_code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        function2_code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        function3_code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        function4_code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        function1_name: [
          { required: false, validator: validateName, trigger: 'blur' }
        ],
        function2_name: [
          { required: false, validator: validateName, trigger: 'blur' }
        ],
        function3_name: [
          { required: false, validator: validateName, trigger: 'blur' }
        ],
        function4_name: [
          { required: false, validator: validateName, trigger: 'blur' }
        ]
      },
      spanArr: [],
      pod: 0
    }
  },
  computed: {
    ...mapGetters(['baudrateList'])
  },
  watch: {
    customize: {
      handler(newVal) {
        if (newVal.transmit_mode_id === 1) {
          newVal.baudrate = 38400
        }
      },
      deep: true
    },
    device_info: {
      handler(newVal) {
        if (newVal.function_id === 5 || newVal.function_id === 6) {
          newVal.temperature = 27
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    async handlerSetBrand() {
      try {
        const res = await knogtiaohuoqu()
        this.userShow = true
        this.userRole = res.hvac_brand.map(e => {
          e.checked = false
          e.new_name = e.name
          return e
        })
      } catch (err) {
        throw (err)
      }
    },
    addPartitionNode() {
      const obj = {
        checked: true,
        name: '',
        new_name: ''
      }
      this.userRole.unshift(obj)
    },
    cancelUser(e, n) {
      if (e.name) {
        e.checked = false
      } else {
        this.userRole.splice(n, 1)
      }
    },
    changePartitionName(item) {
      item.checked = true
    },
    async savePartitionName(e) {
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
      try {
        const res = await kongtiaotianjiaxiugai({
          name: e.new_name,
          id: e.id || null
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        this.handlerSetBrand()
        this.$emit('handleGetDeviceParams')
      } catch (err) {
        throw err
      }
    },
    async remove(e, n) {
      try {
        await this.$confirm('此操作将删除当前列, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await kongtiaoshanchu({
          id: e.id
        })
        this.$message({
          message: res.result.text,
          type: 'success'
        })
        this.userRole.splice(n, 1)
        this.$emit('handleGetDeviceParams')
      } catch {
        return false
      }
    },
    handlerSet() {
      this.outerVisible3 = true
      this.handlerGetHvacNum()
    },
    async handlerGetHvacNum() {
      try {
        const res = await getHvacNum({
          brand_id: this.hvac.brand_id
        })
        this.hvac.brand_value = res.hvac.brand_value
        this.hvac.min = res.hvac.min
        this.hvac.max = res.hvac.max
      } catch (err) {
        throw err
      }
    },
    async submitDeviceOperation3() {
      this.$refs.addForm3.validate(async valid => {
        if (valid) {
          try {
            const res = await postHvacNum({
              hvac: {
                brand_id: this.hvac.brand_id,
                brand_value: this.hvac.brand_value
              }
            })
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            // this.selected_list = null
            this.outerVisible3 = false
            this.$emit('handleGetDeviceParams')
            this.resetGetDetails()
          } catch (err) {
            throw err
          }
        }
      })
    },
    async submitDeviceOperation2() {
      this.$refs.addForm2.validate(async valid => {
        if (valid) {
          const msg = this.$message({
            customClass: 'load_message',
            iconClass: 'el-icon-loading',
            duration: 0,
            center: true,
            message: '学习中...'
          })
          try {
            const res = await postHvacStyle({
              device_info: {
                device_id: this.deviceId,
                panid: this.device_info.pandid,
                brand_id: this.device_info.brand_id,
                function_id: this.device_info.function_id,
                temperature: this.device_info.temperature,
                brand_type: this.typeId
              }
            })
            msg.close()
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            // this.selected_list = null
            this.outerVisible2 = false
            this.$emit('handleGetDeviceParams')
            this.resetGetDetails()
          } catch (err) {
            msg.close()
            throw err
          }
        }
      })
    },
    handlevValidCode(rule, value, callback) {
      if (!validCode(value)) {
        callback(new Error('格式错误!'))
      }
      callback()
    },
    // 加载更多
    handleLoadMore() {
      if (this.page * 12 < this.total) {
        this.page++
        this.getDetails()
      }
    },
    getSpanArr(data) {
      this.spanArr = []
      this.pos = 0
      data.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          if (data[index].id === data[index - 1].id) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = index
          }
        }
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.typeId !== 11) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      } else {
        if (
          columnIndex === 0 ||
          columnIndex === 1 ||
          columnIndex === 2 ||
          columnIndex === 5
        ) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    handleSwitchTypeId(item) {
      this.tableShow = false
      this.typeId = item.id
      this.function_code_list = []
      this.page = 1
      this.keyword = null
      this.getDetails()
    },
    // 删除设备
    async handleDeleteDeviceMod(row) {
      try {
        await this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteLotControlCode({
          module_type: this.typeId,
          id: row.id
        })
        if (res) {
          this.function_code_list = this.function_code_list.filter(
            e => e.id !== row.id
          )
          this.getSpanArr(this.function_code_list)
          this.$message({
            type: 'success',
            message: res.result.text
          })
          this.$emit('handleGetDeviceParams')
        }
      } catch {
        return false
      }
    },
    // 删除设备
    async handleDeleteOneCode(row) {
      try {
        await this.$confirm('此操作将永久删除设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteOneControlCode({
          function_id: row.function_id
        })
        if (res) {
          this.function_code_list = this.function_code_list.filter(
            e => e.function_id !== row.function_id
          )
          this.getSpanArr(this.function_code_list)
          this.$message({
            type: 'success',
            message: res.result.text
          })
        }
        this.$emit('handleGetDeviceParams')
      } catch {
        return false
      }
    },
    handleEdit(scope) {
      this.function_code_list[scope.$index].changeShow = false
      this.function_code_list[scope.$index].codeCopy = this.function_code_list[
        scope.$index
      ].code
      this.function_code_list[
        scope.$index
      ].baudrateCopy = this.function_code_list[scope.$index].baudrate
      this.function_code_list[
        scope.$index
      ].brand_nameCopy = this.function_code_list[scope.$index].brand_name
      if (
        this.function_code_list[scope.$index + 1] &&
        this.function_code_list[scope.$index].id ===
          this.function_code_list[scope.$index + 1].id
      ) {
        scope.$index++
        this.handleEdit(scope)
      }
      this.function_code_list.splice(0, 0)
    },
    handleSuccessChange(scope) {
      this.function_code_list[scope.$index].changeShow = true
      this.function_code_list[scope.$index].code = this.function_code_list[
        scope.$index
      ].codeCopy
      this.function_code_list[scope.$index].baudrate = this.function_code_list[
        scope.$index
      ].baudrateCopy
      this.function_code_list[
        scope.$index
      ].brand_name = this.function_code_list[scope.$index].brand_nameCopy
      if (
        this.function_code_list[scope.$index - 1] &&
        this.function_code_list[scope.$index].id ===
          this.function_code_list[scope.$index - 1].id
      ) {
        scope.$index--
        this.handleSuccessChange(scope)
      }
      this.function_code_list.splice(0, 0)
    },
    async handleSaveEdit(scope) {
      const newParams = {
        baudrate: this.function_code_list[scope.$index].baudrateCopy,
        brand_name: this.function_code_list[scope.$index].brand_nameCopy,
        code: this.function_code_list[scope.$index].codeCopy,
        function: this.function_code_list[scope.$index].function,
        function_id: this.function_code_list[scope.$index].function_id,
        id: this.function_code_list[scope.$index].id
      }
      this.changeFunctionList.push(newParams)
      if (
        this.function_code_list[scope.$index + 1] &&
        this.function_code_list[scope.$index].id ===
          this.function_code_list[scope.$index + 1].id
      ) {
        scope.$index++
        this.handleSaveEdit(scope)
      } else {
        try {
          const res = await changeLotControlCode({
            module_type: this.typeId,
            function_code_list: this.changeFunctionList
          })
          this.$message({
            message: res.result.text,
            type: 'success'
          })
          this.changeFunctionList = []
          this.handleSuccessChange(scope)
          this.$emit('handleGetDeviceParams')
        } catch (err) {
          this.changeFunctionList = []
          throw err
        }
      }
      this.function_code_list.splice(0, 0)
    },
    handleCancelEdit(scope) {
      this.function_code_list[scope.$index].changeShow = true
      if (
        this.function_code_list[scope.$index + 1] &&
        this.function_code_list[scope.$index].id ===
          this.function_code_list[scope.$index + 1].id
      ) {
        scope.$index++
        this.handleCancelEdit(scope)
      }
      this.function_code_list.splice(0, 0)
    },
    // 添加模块表单提交
    submitDeviceOperation() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          try {
            const res = await addLotControlCode({
              module_type: this.typeId,
              id: this.selected_list ? this.selected_list.id : '',
              function_code_update: this.function_code_update
            })
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            this.selected_list = null
            this.outerVisible = false
            this.$emit('handleGetDeviceParams')
            this.resetGetDetails()
          } catch (err) {
            throw err
          }
        }
      })
    },
    // 添加模块表单提交
    submitDeviceOperation1() {
      this.$refs.addForm1.validate(async valid => {
        if (valid) {
          try {
            const res = await addCustomizeControl({
              module_type: this.typeId,
              customize_function_add: this.customize
            })
            this.$message({
              message: res.result.text,
              type: 'success'
            })
            this.selected_list = null
            this.outerVisible1 = false
            this.$emit('handleGetDeviceParams')
            this.resetGetDetails()
          } catch (err) {
            throw err
          }
        }
      })
    },
    handleAddEvent() {
      if (this.typeId === 3 || this.typeId === 6) {
        this.outerVisible = true
      }
      if (this.typeId === 2) {
        this.outerVisible2 = true
      }
      if (this.typeId === 11) {
        this.outerVisible1 = true
      }
      this.function_code_update.brand_name = ''
      this.function_code_update.baudrate = ''
      this.function_code_update.code_texts.forEach(e => (e.code = ''))
    },
    resetGetDetails() {
      this.tableShow = false
      this.function_code_list = []
      this.page = 1
      this.getDetails()
    },
    async getDetails() {
      try {
        const res = await getLotControlCode({
          module_type: this.typeId,
          page: {
            page: this.page,
            size: 12
          },
          id: this.keyword
        })
        this.tableShow = true
        if (res.function_code_list) {
          this.function_code_list = [
            ...this.function_code_list,
            ...res.function_code_list.map(e => {
              e.changeShow = true
              e.codeCopy = ''
              e.brand_nameCopy = ''
              e.baudrateCopy = ''
              return e
            })
          ]
          this.getSpanArr(this.function_code_list)
        }
        if (res.module_function_type) {
          this.function_code_update.code_texts = res.module_function_type.map(
            e => {
              e.code = ''
              return e
            }
          )
        }
        this.total = res.total
      } catch (err) {
        this.tableShow = true
        throw err
      }
    },
    searchList() {
      this.tableShow = false
      this.page = 1
      // this.keyword = null
      this.function_code_list = []
      this.getDetails()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/settings.scss";
@import "~@/styles/dialogBase.scss";
@import "~@/styles/baseTitle.scss";

.operate_bar {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  .input_item {
    width: 200px;
    margin: 0 10px;
  }
}
.ul_tabs {
  ul {
    display: flex;
    li {
      cursor: pointer;
      font-size: 14px;
      color: #282828;
      margin: 0 50px 20px 0;
      padding: 0px 0 15px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        display: block;
        width: 50%;
        height: 2px;
        background: #fff;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      &.active {
        &::after {
          background: rgba(69, 181, 76, 1);
        }
      }
    }
  }
}
.study {
  margin-left: 15px;
}
.display_flex {
  /deep/ .el-input {
    flex-shrink: 0;
    width: 330px;
  }
}
.status {
  display: flex;
  align-items: center;
  color: #282828;
  justify-content: center;
  .zx {
    color: #45b54c;
  }
  .lx {
    color: #666666;
  }
}
.iconfont {
  margin: 0 3px;
}
.code_list {
  display: flex;
  align-items: center;
  i {
    margin-right: 10px;
  }
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
