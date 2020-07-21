/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(phone) {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)
}

// 验证模块系列号
export function validModuleSn(val) {
  return /^(IOT[0-9]{2}(-?)([0-9a-fA-F]{8}))/.test(val)
}
// 验证IP
export function validIP(val) {
  return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(val)
}
// 验证mac
export function validMAC(val) {
  return /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/.test(val)
}
// 验证控制码
export function validCode(val) {
  return /^([0-9a-fA-F]{2})( ([0-9a-fA-F]{2})){1,}$/.test(val)
}
// 验证姓名
export function validName(val) {
  return /^[a-zA-Z0-9_\u4E00-\u9FA5]{2,12}$/.test(val)
}
// 验证url
export function validUrl(val) {
  return /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(val)
}
