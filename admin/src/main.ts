import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import router from './router'
// 这是通过按需导入的方式
import { ElMessage, ElPopconfirm } from 'element-plus'
// // 导入富文本编辑器 quill
// import { QuillEditor } from '@vueup/vue-quill'
// import "@vueup/vue-quill/dist/vue-quill.snow.css"

import http from './http'

const app = createApp(App).use(router)

// todo 定义一个全局的mixin，给全局的请求都添加一个headers属性
// 相当于就是全局代码块，在每一个vue的实例都拥有这些代码块
// 此时所有的vue实例中都有这个方法，可以在vue页面中任意地方来调用
app.mixin({
    computed: {
        uploadURLMixin() {
            return this.$http.defaults.baseURL + '/upload'
        }
    },
    methods: {
        getAuthHeadersMixin() {
            return {
                Authorization: `Bearer ${sessionStorage.token || ''}`
            }
        },
        // uploadURLMixin() {
        //     return this.$http.defaults.baseURL + '/upload'
        // }
    }
});

// app.component("QuillEditor", QuillEditor);

// 这是通过按需导入的方式
app.component(ElMessage.name, ElMessage);
app.component(ElPopconfirm.name, ElPopconfirm);

// 使用全局的挂载方式进行挂载，然后在组件中使用
app.config.globalProperties.$http = http;
app.config.globalProperties.$router = router;
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$confirm = ElPopconfirm;

installElementPlus(app)
app.mount('#app')