// 此时不能通过vue的全局变量来实现信息的弹出，
import { ElMessage } from 'element-plus';
// 针对于使用 axios 的时候进行数据的请求的配置
import axios from 'axios';
import router from './router';

// 此处配置一个后台的接口
const http: any = axios.create({
    baseURL: 'http://localhost:1999/admin/api'
});

// 添加一个请求的拦截器，如果发现没有登录，那么就阻止请求数据
http.interceptors.request.use(function (config) {
    // 添加一个请求头，是这样传，但是不符合规范
    // config.headers.Authorization = sessionStorage.token;
    // 更加标准的格式
    // 只有当token不为空的时候才添加这个headers
    if (sessionStorage.token){
        config.headers.Authorization = 'Bearer ' + sessionStorage.token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加一个网页的请求的拦截器
// 可以查看官方的文档，在npm官网搜索axios可以查看对应的方法
http.interceptors.response.use(function (response){
    return response;
}, function(error) {
    // 使用了if语句，那么就可以不需要监听是否错误，只需要知道是否有message值就可以了
    if (error.response.data.message){
        // 可以进行错误的弹出，使用的是Vue的方式
        ElMessage({
            type: 'error',
            message: error.response.data.message
        });
        // 根据状态码来返回页面，表示需要先登录
        if(error.response.status === 401){
            router.push('/login');
        }
    }
    
    return Promise.reject(error);
})

export default http;