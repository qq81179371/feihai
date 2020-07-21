import Cookies from 'js-cookie'

const uiKey = 'uiKey'
const uuKey = 'uuKey'
const userKey = 'userInfo'

export default {
  getUiKey() {
    return Cookies.get(uiKey)
  },
  setUikey(data) {
    return Cookies.set(uiKey, data)
  },
  removeUikey() {
    return Cookies.remove(uiKey)
  },
  getUuKey() {
    return Cookies.get(uuKey)
  },
  setUukey(data) {
    return Cookies.set(uuKey, data)
  },
  removeUukey() {
    return Cookies.remove(uuKey)
  },
  getUserInfo() {
    return Cookies.get(userKey)
  },
  setUserInfo(data) {
    return Cookies.set(userKey, data)
  },
  removeUserInfo() {
    return Cookies.remove(userKey)
  }
}
