// import { ElMessage } from 'element-plus';
// import http from './http';
// import router from './router';
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 定义Vue的全局/实例属性
  interface Vue{
    $http: any,
    $urls: any,
    $message: any,
    // $router: any
  }
  const component: DefineComponent<{}, {}, any>
  export default component
}
