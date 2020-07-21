import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/instructions',
    component: () => import('@/views/operationGuide/index'),
    hidden: true
  },

  {
    path: '/allSetting',
    component: Layout,
    redirect: '/deviceDetailChart/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'allSetting',
        component: () => import('@/views/allsetting/index'),
        meta: {
          hasGoBack: true
        }
      }
    ]
  },
  {
    path: '/deviceDetailChart',
    component: Layout,
    redirect: '/deviceDetailChart/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'deviceDetailChart',
        component: () => import('@/views/deviceStatistics/deviceDetailChart'),
        meta: {
          hasGoBack: true
        }
      }
    ]
  },
  // {
  //   path: '/monitorWall',
  //   component: Layout,
  //   redirect: '/monitorWall/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'monitorWall',
  //       component: () => import('@/views/monitorWall/index'),
  //       meta: {
  //         hasGoBack: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/refresh',
    meta: {
      title: '设备管理',
      icon: 'home'
    },
    children: [
      {
        path: 'refresh',
        name: 'Refresh',
        component: () => import('@/views/home/index'),
        meta: {
          title: '物联设备',
          icon: 'sz'
        }
      },
      {
        path: 'energyStatistics',
        name: 'EnergyStatistics',
        component: () => import('@/views/energyStatistics/index'),
        meta: {
          title: '能耗统计',
          icon: 'sz'
        }
      },
      {
        path: 'equipmentStatistics',
        name: 'EquipmentStatistics',
        component: () => import('@/views/deviceStatistics/index'),
        meta: {
          title: '设备统计',
          icon: 'sz'
        }
      },
      {
        path: 'monitorWall',
        name: 'monitorWall',
        component: () => import('@/views/monitorWall/index'),
        meta: {
          // hasGoBack: true,
          icon: 'sz',
          title: '监控墙'
        }
      }
    ]
  },

  {
    path: '/taskMode',
    component: Layout,
    redirect: '/taskMode/task',
    name: 'taskMode',
    meta: {
      title: '任务模式',
      icon: 'task'
    },
    children: [
      {
        path: 'task',
        name: 'task',
        component: () => import('@/views/taskMode/index'),
        meta: {
          title: '任务模式',
          icon: 'sz'
        }
      },
      {
        path: 'addTask',
        name: 'addTask',
        component: () => import('@/views/taskMode/addTask'),
        hidden: true,
        meta: {
          hasGoBack: true
        }
      },
      {
        path: 'run',
        name: 'run',
        component: () => import('@/views/taskMode/index'),
        meta: {
          title: '运行模式',
          icon: 'sz'
        }
      }
    ]
  },

  {
    path: '/mediaManagement',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'mediaManagement',
        component: () => import('@/views/mediaManagement/index'),
        meta: {
          title: '媒体管理',
          icon: 'dmt'
        }
      }
    ]
  },

  {
    path: '/systemManagement',
    component: Layout,
    redirect: '/systemManagement/systemAndSecurity',
    name: 'systemManagement',
    meta: {
      title: '系统管理',
      icon: 'seting'
    },
    children: [
      {
        path: 'systemAndSecurity',
        component: () =>
          import('@/views/systemManagement/systemAndSecurity/index'), // Parent router-view
        name: 'systemAndSecurity',
        meta: {
          title: '系统与安全',
          icon: 'sz'
        }
      },
      {
        path: 'systemSettings',
        component: () =>
          import('@/views/systemManagement/systemSettings/index'),
        meta: {
          title: '系统设置',
          icon: 'sz'
        }
      }
    ]
  },
  {
    path: '/messageCenter',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'messageCenter',
        component: () => import('@/views/messageCenter/index'),
        meta: {
          title: '消息中心',
          icon: 'xiaoxi'
        }
      }
    ]
  },
  {
    path: '/password',
    component: () => import('@/views/changePassword/index'),
    hidden: true
  },
  {
    path: '/forgetPassword',
    component: () => import('@/views/forgetPassword/index'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    mode: 'history',
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
