import request from '@/utils/request'
// 获取验证码
export function getPhoneCode(data) {
  return request({
    url: '/shortmessage',
    method: 'post',
    cmd: 1,
    data
  })
}
// 获取服务器key
export function getServerKey(data) {
  return request({
    url: '/cloudserver',
    method: 'post',
    cmd: 88,
    data
  })
}
// 服务器列表
export function getServerList(data) {
  return request({
    url: '/cloudserver',
    method: 'post',
    cmd: 89,
    data
  })
}
// 用户登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    cmd: 1,
    data
  })
}
// 用户登录
export function logout(data) {
  return request({
    url: '/login',
    method: 'post',
    cmd: 2,
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

