import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Main from '../views/Main.vue';
import Home from '../views/Home.vue';
import Article from '../views/Article.vue';
import HeroMain from '../views/HeroView/HeroMain.vue';
import Hero from '../views/HeroView/Hero.vue';

// 有些首页的上部的边框是不变的，有些是变得，所以不能简单地将上部边框放在App.vue中
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children:[
      {
        path: '/',
        name: 'home',
        component: Home
      },
      // 显示的是某一篇文章，所以需要传递文章的动态id
      // 在对应的页面中使用的参数都会被映射成组件参数
      {
        path: '/articles/:id',
        name: 'article',
        component: Article,
        props: true
      },
    ]
  },
  {
    path: '/hero',
    name: 'heroMain',
    component: HeroMain,
    children: [
      // 显示的是英雄的详情页，不适用首页的布局
      {
        path: '/heroes/:id',
        name: 'hero',
        component: Hero,
        props: true
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
