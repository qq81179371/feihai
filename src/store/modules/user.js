import { login, logout, getInfo } from '@/api/user'
import jsCookie from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const state = {
  ui: jsCookie.getUiKey(),
  uu: jsCookie.getUuKey(),
  source: 4,
  name: Cookies.get('name') || '',
  schoolName: Cookies.get('schoolName') || '',
  schoolLogo: Cookies.get('schoolLogo') || '',
  menus: Cookies.get('menus') ? JSON.parse(Cookies.get('menus')) : [],
  avatar: 'https://www.feihaiyun.com/home/images/toux.png',
  authorityList: [
    {
      id: 1,
      operate: '物联设备'
    },
    {
      id: 2,
      operate: '任务'
    },
    {
      id: 3,
      operate: 'IP广播'
    },
    {
      id: 4,
      operate: '发布信息'
    },
    {
      id: 5,
      operate: '媒体文件审批'
    },
    {
      id: 6,
      operate: '系统设置'
    }
  ],
  // 波特率
  baudrateList: [
    {
      value: 2400
    },
    {
      value: 4800
    },
    {
      value: 9600
    },
    {
      value: 14400
    },
    {
      value: 19200
    },
    {
      value: 38400
    },
    {
      value: 56000
    },
    {
      value: 57600
    },
    {
      value: 115200
    },
    {
      value: 128000
    }
  ],
  weekText: {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    0: '周日'
  },
  weekList: [
    {
      id: 1,
      name: '周一'
    },
    {
      id: 2,
      name: '周二'
    },
    {
      id: 3,
      name: '周三'
    },
    {
      id: 4,
      name: '周四'
    },
    {
      id: 5,
      name: '周五'
    },
    {
      id: 6,
      name: '周六'
    },
    {
      id: 0,
      name: '周日'
    }
  ],
  // 自定义图标
  customIcon: {
    1: '1'
  }
}
const mutations = {
  SET_UU: (state, uu) => {
    state.uu = uu
  },
  SET_UI: (state, ui) => {
    state.ui = ui
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 设置学校名字
  SET_SCHOOLNAME: (state, name) => {
    state.schoolName = name
  },
  // 设置学校logo
  SET_SCHOOLLOGO(state, logo) {
    state.schoolLogo = logo
  },
  // 设置菜单权限
  SET_MENUS(state, menus) {
    state.menus = menus
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  changeSchoolName({ commit }, data) {
    commit('SET_SCHOOLNAME', data)
  },
  changeSchoolLogo({ commit }, data) {
    commit('SET_SCHOOLLOGO', data)
  },
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then(response => {
          commit('SET_UU', response.login_info.token)
          commit('SET_UI', response.login_info.ui)
          commit('SET_NAME', response.login_info.name)
          commit('SET_SCHOOLNAME', response.school.name)
          commit('SET_SCHOOLLOGO', response.school.logo)
          commit('SET_MENUS', response.menus)
          jsCookie.setUukey(response.login_info.token)
          jsCookie.setUikey(response.login_info.ui)
          Cookies.set('menus', JSON.stringify(response.menus))
          Cookies.set('schoolName', response.school.name)
          Cookies.set('schoolLogo', response.school.logo)
          Cookies.set('name', response.login_info.name)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response
          if (!data) {
            reject('验证失败，请重新登录')
          }
          const { name, avatar } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_UU', '')
          commit('SET_UI', '')
          jsCookie.removeUikey()
          jsCookie.removeUukey()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_UU', '')
      commit('SET_UI', '')
      jsCookie.removeUikey()
      jsCookie.removeUukey()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
