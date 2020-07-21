import request from '@/utils/request'

// 任务列表获取
export function getTaskList(data) {
  return request({
    url: '/task',
    method: 'post',
    cmd: 10,
    data
  })
}
// 任务列表类型获取
export function getTaskTypeList(data) {
  return request({
    url: '/task',
    method: 'post',
    cmd: 21,
    data
  })
}
// 当前任务详情
export function getTaskDetails(data) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: 7,
    data
  })
}

