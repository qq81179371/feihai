import axios from 'axios'
import {
  Message
} from 'element-ui'
const os = require('os')
import store from '@/store/index.js'
import jsCookie from '@/utils/auth'

const source = 4 // 云端
// const source = 3 // 本地
function getNetworkIp() {
  let needHost = '' // 打开的host
  try {
    // 获得网络接口列表
    const network = os.networkInterfaces()
    for (const dev in network) {
      const iface = network[dev]
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          needHost = alias.address
        }
      }
    }
  } catch (e) {
    needHost = 'localhost'
  }
  return needHost
}

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: source === 3 ? getNetworkIp() : process.env.VUE_APP_BASE_API,
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    if (store.getters.uu || store.getters.ui) {
      let api_url = 'app'
      if (config.type === 2) api_url = 'upload'
      config.url = `/${api_url}${config.url}?source=${source}&cmd=${config.cmd}&uu=${jsCookie.getUuKey()}&ui=${jsCookie.getUiKey()}`
    } else {
      config.url = `/app${config.url}?source=${source}&cmd=${config.cmd}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.result.code !== 0) {
      if (res.result.code === 1) {
        Message({
          message: res.result.text || 'warning',
          type: 'warning',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.result.text || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      if (res.result.code === 1102) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: '连接超时,请刷新页面',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
