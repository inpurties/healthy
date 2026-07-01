import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import PermissionEdit from '../components/PermissionEdit.vue'
import SportKnowledgeTest from '../components/sport/SportKnowledgeTest.vue'
import SportKnowledgeSimple from '../components/sport/SportKnowledgeSimple.vue'
import SportScienceModule from '../components/sport/SportScienceModule.vue'
import ArticleDetail from '../components/sport/ArticleDetail.vue' 

Vue.use(VueRouter)

const routes = [
 {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children:[
      {
        path: "/welcome",
        component: Welcome
      },
      { path:'/userlist', component: UserList},
      { path:'/permissionset', component: PermissionEdit},
      { 
        path: '/sportdata',  // 这里的路径必须和菜单配置一致
        component: () => import('../components/sport/SportModule.vue') 
      },
      { 
        path: '/sportknowledge',
        component: SportKnowledgeSimple 
      },
      { 
        path: '/sporttest',
        component: SportKnowledgeTest 
      },
      { 
        path: '/platformintro',
        component: SportScienceModule 
      }
    ]
  },
  {
      path: '/rights', 
      name: 'PermissionEdit',
      component: PermissionEdit
    },
  {
    path: '/sport-knowledge/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
    
]

const router = new VueRouter({
  routes
})

// 修复 Vue Router 中 push 方法的重复导航错误问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// 挂载路由导航守卫
// 当用户访问页面时，先进行判断，如果用户访问的是登录页，直接放行
// 如果用户访问的是其他页面，先判断用户是否登录，如果登录了，直接放行，如果没有登录，则跳转到登录页
//用于安全退出
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪里访问的路径
  // next:之后要做的任务，是一个函数
  //    next（）放行， next（'/URL'）强制跳转的路径。
   if (to.path === '/login') return next();
  // 从 sessionStorage 取 user 对应的值，存到 flagStr
  const flagStr = window.sessionStorage.getItem("user"); 
  // 这里用 flagStr 判断，之前错用成 userFlag 了
  if (!flagStr) return next('/login'); 
  next(); 
})

export default router
