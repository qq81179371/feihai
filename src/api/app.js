import request from '@/utils/request'

// 设备列表
export function getDeviceList(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 61,
    data
  })
}
// 设备控制
export function putDeviceControl(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 60,
    data
  })
}
// 设备分类项
export function getDeviceTypeList(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 16,
    data
  })
}
// 设备详情
export function getDeviceDetails(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 59,
    data
  })
}
// 系统管理-系统设置
export function updateSystemName(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 11,
    data
  })
}
// 系统管理-系统名称获取
export function getSystemName(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 13,
    data
  })
}

// 接收成员获取
export function getReceivingMember(data, cmd) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: cmd || 8,
    data
  })
}
/*
设备参数复制与替换
cmd = 11  复制
cmd = 12  替换
*/
export function putDeviceChange(data, cmd) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: cmd,
    data
  })
}
// 批量设备删除
export function deleteDeviceList(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 48,
    data
  })
}
// 批量设备删除
export function getOnlineDevice(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 17,
    data
  })
}
// 设备系统位置获取
export function getDevicePlace(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 2,
    data
  })
}
//  获取分区列表
export function getPartitionSetList(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 7,
    data
  })
}
//  添加节点
export function putAddPartitionNode(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 删除节点
export function deletePartitionNode(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 4,
    data
  })
}
// 修改节点
export function changePartitionNode(data) {
  return request({
    url: '/place',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 用户管理 - 获取用户列表
export function getUserList(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 7,
    data
  })
}
// 用户管理 - 获取用户详情
export function getUserDetails(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 20,
    data
  })
}
// 用户管理 - 添加用户信息  添加用户菜单权限  添加用户设备权限
export function getAdduserInfo(data, cmd) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: cmd,
    data
  })
}
// 用户管理 - 删除用户信息
export function getDeleteUserInfo(data, cmd) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: cmd,
    data
  })
}
// 用户管理 - 删除用户信息
export function putChangeBatchUserInfo(data, cmd) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: cmd,
    data
  })
}
// 设备设置 - 设备系统设置
export function putDeviceSetting(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 1,
    data
  })
}
// 设备设置 - 获取设备高级设置
export function getAdvanSetting(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 4,
    data
  })
}
// 设备设置 - 修改设备高级设置
export function putAdvanSetting(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 设备设置 - 物联模块列表获取
export function getLotList(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 5,
    data
  })
}
// 设备设置 - 物联模块添加
export function putLotModule(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 设备设置 - 物联模块删除
export function deleteDeviceMod(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 7,
    data
  })
}
// 设备设置 - 物联模块名字修改
export function changeDeviceMod(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 8,
    data
  })
}
// 获取设备公众参数
export function getDeviceParams(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 15,
    data
  })
}
// 设备设置 - 物联设备获取
export function getLotDeviceList(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 13,
    data
  })
}
// 设备设置 - 物联设备删除
export function deleteDevice(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 14,
    data
  })
}

// 设备设置 - 物联设备删除
export function addLotDevice(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 16,
    data
  })
}

// 设备设置 - 设备网络信息获取
export function getDeviceNetworkInfo(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 18,
    data
  })
}
// 设备设置 - 设备网络信息设置
export function changeDeviceNetworkInfo(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 19,
    data
  })
}
// 设备设置 - 获取设备详情
export function getDeviceDetailsInfo(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 20,
    data
  })
}
// 设备设置 - 获取物联控制码
export function getLotControlCode(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 1,
    data
  })
}

// 设备设置 - 物联控制码删除
export function deleteLotControlCode(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 设备设置 - 物联控制码删除
export function addLotControlCode(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 设备设置 - 物联控制码删除
export function changeLotControlCode(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 4,
    data
  })
}
// 设备设置 - 物联控制码删除
export function addCustomizeControl(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 5,
    data
  })
}
// 设备设置 - 物联控制码删除
export function deleteOneControlCode(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 媒体管理 - 文件夹列表获取
export function getMultimediaList(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 14,
    data
  })
}
// 媒体管理 - 文件夹添加
export function addMultimediaFolder(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 11,
    data
  })
}
// 媒体管理 - 文件夹删除
export function deleteMultimediaFolder(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 13,
    data
  })
}
// 媒体管理 - 文件夹名称修改
export function changeMultimediaFolderName(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 12,
    data
  })
}
// 媒体管理 - 文件配置文件获取
export function getMultimediaConfig(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 17,
    data
  })
}
// 媒体管理 - 文件列表获取
export function getMultimediaFileList(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 媒体管理 - 文件审核
export function getFileReview(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 18,
    data
  })
}
// 媒体管理 - 文件删除
export function deleteFilePort(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 媒体管理 - 在线互联网直播媒体源添加与修改
export function addInternetLiveMediaSource(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 15,
    data
  })
}
// 媒体管理 - 实时踩播媒体源添加与修改
export function addBroadcastMediaSource(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 16,
    data
  })
}
// 媒体管理 - 实时踩播媒体源添加与修改
export function changeMediaSource(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 20,
    data
  })
}
// 媒体管理 - 实时踩播媒体源添加与修改
export function postRemindReview(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 19,
    data
  })
}
// 运行模式 - 运行模式列表获取
export function getRunModList(data) {
  return request({
    url: '/task/scene',
    method: 'POST',
    cmd: 1,
    data
  })
}
// 运行模式 - 运行模式列表详情获取
export function getRunModDetails(data) {
  return request({
    url: '/task/scene',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 运行模式 - 运行模式列表添加与修改
export function addRunMod(data) {
  return request({
    url: '/task/scene',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 运行模式 - 运行模式列表状态改变
export function changeRunModStatus(data) {
  return request({
    url: '/task/scene',
    method: 'POST',
    cmd: 6,
    data
  })
}

// 运行模式 - 复制运行模式
export function copyRunMod(data) {
  return request({
    url: '/task/scene',
    method: 'POST',
    cmd: 7,
    data
  })
}

// 运行模式 - 复制运行模式
export function deleteRunMod(data) {
  return request({
    url: '/task/scene',
    method: 'POST',
    cmd: 5,
    data
  })
}
// 任务模式 - 播放任务   6 - 播放  14 - 停止
export function postPlayerTask(data, cmd) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: cmd,
    data
  })
}
// 删除任务
export function deleteTask(data) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: 4,
    data
  })
}
// 任务状态更新
export function changeTaskStatus(data) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: 9,
    data
  })
}
// 获取广播源
export function getEetworkFile(data) {
  return request({
    url: '/file',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 添加任务
export function addTask(data) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: 1,
    data
  })
}
// 添加任务 物联任务控制项获取
export function addTaskLot(data) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: 20,
    data
  })
}
// 添加任务 任务克隆
export function cloneTask(data) {
  return request({
    url: '/task',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 设备统计 1
export function getDeviceCount(data) {
  return request({
    url: '/data',
    method: 'POST',
    cmd: 5,
    data
  })
}
// 设备统计 2
export function getDeviceCount2(data) {
  return request({
    url: '/data',
    method: 'POST',
    cmd: 1,
    data
  })
}
// 消息中心 - 字幕消息
export function postCaptionMessage(data) {
  return request({
    url: '/notices',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 消息中心 - 字幕消息
export function postLedMessage(data) {
  return request({
    url: '/notices',
    method: 'POST',
    cmd: 14,
    data
  })
}
// 上传
export function uploadAction(data) {
  return request({
    url: '/file',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    cmd: 9,
    type: 2,
    data
  })
}
// 上传
export function uploadVideo(data) {
  return request({
    url: '/file',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    cmd: 4,
    type: 2,
    data
  })
}
// 获取设备类型
export function getDeviceType(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 42,
    data
  })
}
// 推送系统升级
export function pushSystemUpgrade(data) {
  return request({
    url: '/file',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    cmd: 7,
    type: 2,
    data
  })
}
// 推送设备升级
export function pushDeviceUpgrade(data) {
  return request({
    url: '/file',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    cmd: 8,
    type: 2,
    data
  })
}
// 获取网络设置
export function getNetwork(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 16,
    data
  })
}
// 获取网络设置
export function postNetwork(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 15,
    data
  })
}
// 获取网络设置
export function getMessageList(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 17,
    data
  })
}
// 获取系统配置
export function getSystemCofing(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 10,
    data
  })
}
// 消息接收人员
export function getMsgUserList(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 19,
    data
  })
}
// 消息接收人员
export function getUserRoleList(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 添加消息
export function postAddMsgSet(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 18,
    data
  })
}
// 添加消息
export function postDeleteMsgSet(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 19,
    data
  })
}
// 一卡通文件列表
export function getIdCardList(data) {
  return request({
    url: '/iccard',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 删除一卡通文件列表
export function deleteIdCardList(data) {
  return request({
    url: '/iccard',
    method: 'POST',
    cmd: 5,
    data
  })
}
// 添加一卡通文件列表
export function addIdCardList(data) {
  return request({
    url: '/iccard',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 一卡通信息同步
export function getIdCardListSync(data) {
  return request({
    url: '/iccard',
    method: 'POST',
    cmd: 7,
    data
  })
}
// 一卡通信息导入
export function pushIdCard(data) {
  return request({
    url: '/iccard',
    method: 'POST',
    cmd: 8,
    data
  })
}
// 设备获取一卡通
export function getDeviceIdCard(data) {
  return request({
    url: '/iccard',
    method: 'POST',
    cmd: 2,
    data
  })
}
// 用户管理 - 添加用户类型
export function postAddUserType(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 10,
    data
  })
}
// 用户管理 - 添加部门
export function postAddDepartment(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 12,
    data
  })
}
// 用户管理 - 删掉用户类型
export function postDeleteUserType(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 11,
    data
  })
}
// 用户管理 - 删掉用户类型
export function postDeleteDepartment(data) {
  return request({
    url: '/login',
    method: 'POST',
    cmd: 5,
    data
  })
}
// 用户管理 - 获取手机号码
export function getPhoneCode(data) {
  return request({
    url: '/user',
    method: 'POST',
    cmd: 13,
    data
  })
}
// 用户管理 - 获取验证码
export function getPhoneVerifyCode(data) {
  return request({
    url: '/user',
    method: 'POST',
    cmd: 8,
    data
  })
}
// 用户管理 - 验证码验证
export function postPhoneVerifyCode(data) {
  return request({
    url: '/user',
    method: 'POST',
    cmd: 14,
    data
  })
}
// 用户管理 - 修改密码
export function postChangePassword(data) {
  return request({
    url: '/user',
    method: 'POST',
    cmd: 15,
    data
  })
}

// 系统设置 - 获取时间
export function getTime(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 9,
    data
  })
}
// 系统设置 - 设置时间
export function postTime(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 14,
    data
  })
}
// 系统设置 - 获取时间
export function getTimeSync(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 8,
    data
  })
}
// 设备设置 - 空调红外学校
export function postHvacStyle(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 7,
    data
  })
}
// 设备设置 - 获取空调红外范围
export function getHvacNum(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 7,
    data
  })
}

// 设备设置 - 空调红外学校
export function postHvacNum(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 8,
    data
  })
}

// 设备设置 - 空调红外学校
export function getLotConfig(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 9,
    data
  })
}

// 设备设置 - 空调红外学校
export function postLotConfig(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 10,
    data
  })
}

// 系统设置 - 获取系统日志
export function getSystemLog(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 21,
    data
  })
}

//  获取端口说明
export function getInstructions(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 10,
    data
  })
}
//  获取端口说明
export function getResetLogo(data) {
  return request({
    url: '/server',
    method: 'POST',
    cmd: 20,
    data
  })
}
// 设备批量控制项获取
export function getDeviceManageType(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 设备批量控制
export function putDeviceAllControl(data) {
  return request({
    url: '/device-manage',
    method: 'POST',
    cmd: 9,
    data
  })
}
// 音频参数获取
export function getAudioSetParams(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 23,
    data
  })
}
// 音频参数设置
export function postAudioSetParams(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 24,
    data
  })
}
// 音频参数获取
export function getMonitoringSetParams(data) {
  return request({
    url: '/live',
    method: 'POST',
    cmd: 13,
    data
  })
}
// 音频参数设置
export function postMonitoringSetParams(data) {
  return request({
    url: '/live',
    method: 'POST',
    cmd: 12,
    data
  })
}
// Vlan参数获取
export function getVlanSetParams(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 21,
    data
  })
}
// Vlan参数设置
export function postVlanSetParams(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 22,
    data
  })
}
// 传感器列表
export function getMonitoringList(data) {
  return request({
    url: '/sensor',
    method: 'POST',
    cmd: 6,
    data
  })
}
// 传感器添加
export function addMonitoringList(data) {
  return request({
    url: '/sensor',
    method: 'POST',
    cmd: 3,
    data
  })
}
// 传感器删除
export function deleteMonitoringList(data) {
  return request({
    url: '/sensor',
    method: 'POST',
    cmd: 4,
    data
  })
}
// 物联设备名称修改
export function changeLotDeviceName(data) {
  return request({
    url: '/device-setting',
    method: 'POST',
    cmd: 17,
    data
  })
}
// 获取监控墙
export function getMonitorWall(data) {
  return request({
    url: '/live',
    method: 'POST',
    cmd: 11,
    data
  })
}
// 获取监控墙
export function kongtiaotianjiaxiugai(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 11,
    data
  })
}
// 获取监控墙
export function kongtiaoshanchu(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 10,
    data
  })
}
export function knogtiaohuoqu(data) {
  return request({
    url: '/device/code',
    method: 'POST',
    cmd: 9,
    data
  })
}
export function nenghaotongji(data) {
  return request({
    url: '/data',
    method: 'POST',
    cmd: 4,
    data
  })
}
