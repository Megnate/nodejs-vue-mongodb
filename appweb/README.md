# web

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# 移动端网站

主要使用以下的工具：

- “工具样式”概念，SASS(SCSS)
- 样式重置
- 网站色彩和字体定义
- 通用 flex 布局样式定义
- 常用边距定义
- 首页顶部轮播图片
- 常用字体图标
- 使用精灵图片
- 卡片组件
- 列表卡片组件
- 首页新闻资讯
- 首页英雄列表
- 新闻详情页
- 英雄详情页

主要是了解**开发的大致流程**

如果一开始的时候不是选择 SASS(SCSS)开发，那么就需要安装对应的模块：`npm i -D sass sass-loader`

# 样式重置

使用 SCSS 可以很方便的给样式进行重置，不需要考虑浏览器的兼容问题，只考虑业务逻辑即可。

SCSS 中使用循环，使其生成不同的 class，在 class 名中使用：`#{变量名}`的方式，在里面直接使用即可

```scss
// 表示一个循环，可以是循环已经定义好的，也可以在现场接着定义
@each $var in (left, center, right) {
  .text-#{$var} {
    text-align: $var;
  }
}
```

将 px 换算成 rem 的插件：px to rem

首先需要 `alt s`设置默认的像素，一般默认的都是 16px，然后写好 px 之后选中`alt z`即可

# 添加路由

给 vue 项目添加路由：`vue add router`，选择 n，不选取历史路由，只是最普通的形式

# 选择样式方法

一般都是去 npm 或 github 中搜索对应的框架+英文即可，星越多越好：vue swiper

# 幻灯片式的播放

此处使用的是已经写好的组件：`npm install swiper vue-awesome-swiper --save`

如果使用地方过多，可以使用全局引用

但是其版本和 vue 版本存在问题，所以直接安装最新版是不能解决问题的：

`npm i swiper@^5.2.0 vue-awesome-swiper --save`

但是也是有问题的，会提示：`Vue.extend is not a function`

# scss

对于 scss 的样式，一般而言变量和实现都是分离开的，也就是放在两个文件夹中，这样在 vue 页面中只需要引入定义好的变量即可，而不需要将实现给复制过去，以免发生什么不可控的因素或增加渲染的负担

分离出来的变量文件，也就是需要被其它文件所包含的，最好是在前面添加下划线: `_variablies.scss`
