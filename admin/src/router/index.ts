import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'

// 一个是登录页面之后的页面的路由，一个是登录页面的路由
// !添加一个参数，表明是可以被公开访问的，如果没有加的就无法被访问：meta: { isPublic: true}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { isPublic: true}
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/categories/create',
        component: () => import('../views/CategoryEdit.vue')
      },
      {
        path: '/categories/list',
        component: () => import('../views/CategoryList.vue')
      },
      {
        path: '/categories/edit/:id',
        component: () => import('../views/CategoryEdit.vue'),
        props: true
      },
      {
        path: '/items/create',
        component: () => import('../views/ItemEdit.vue')
      },
      {
        path: '/items/list',
        component: () => import('../views/ItemList.vue')
      },
      {
        path: '/items/edit/:id',
        component: () => import('../views/ItemEdit.vue'),
        props: true
      },
      {
        path: '/heroes/create',
        component: () => import('../views/HeroEdit.vue')
      },
      {
        path: '/heroes/list',
        component: () => import('../views/HeroList.vue')
      },
      {
        path: '/heroes/edit/:id',
        component: () => import('../views/HeroEdit.vue'),
        props: true
      },
      {
        path: '/articles/create',
        component: () => import('../views/ArticleEdit.vue')
      },
      {
        path: '/articles/list',
        component: () => import('../views/ArticleList.vue')
      },
      {
        path: '/articles/edit/:id',
        component: () => import('../views/ArticleEdit.vue'),
        props: true
      },
      {
        path: '/ads/create',
        component: () => import('../views/AdEdit.vue')
      },
      {
        path: '/ads/list',
        component: () => import('../views/AdList.vue')
      },
      {
        path: '/ads/edit/:id',
        component: () => import('../views/AdEdit.vue'),
        props: true
      },
      {
        path: '/admin_users/create',
        component: () => import('../views/AdminUserEdit.vue')
      },
      {
        path: '/admin_users/list',
        component: () => import('../views/AdminUserList.vue')
      },
      {
        path: '/admin_users/edit/:id',
        component: () => import('../views/AdminUserEdit.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// todo 进行前端路由的限制
// !全局路由守卫，表明在每一次切换路由的时候做什么
router.beforeEach((to, from, next) => {
  // *登录页面会返回一个true，所以只有登录页面的时候才进行路由的跳转
  if (!to.meta.isPublic && !sessionStorage.token){
    return next('/login');
  }

  next();
})

export default router
