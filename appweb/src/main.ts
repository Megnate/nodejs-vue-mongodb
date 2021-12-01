import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

import '@/assets/scss/style.scss'
import '@/assets/iconfont/iconfont.css'

// 引入自己定义的组件
import MySoilder from '@/libs/jspp-ui';
import Card from './components/Card.vue';
import ListCard from './components/ListCard.vue';

const app = createApp(App);

app.use(router);
app.use(MySoilder);
app.component("m-card", Card);
app.component("m-list-card", ListCard);
app.config.globalProperties.$http = axios.create({
    baseURL: 'http://localhost:1999/web/api'
});

app.mount('#app');
