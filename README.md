# nodejs-vue-mongodb

第一个使用 node 和 vue 的项目

server: 是所有 node.js 存放的地方，服务端的项目，负责给 admin 后台和 web 前台提供接口

admin、web: vue3 项目

# 项目的初始化

通过 github 创建一个新的仓库来保存所有的文件

创建两个 vue 项目：web 和 admin，使用的是 vue-cli 来创建，选择了 Babel、typescript、sass、vue3

新建的文件夹 server 是存放 node.js 代码的地方

在 server 中通过`npm init-y`新建了一个`package.json`文件，作为 nodejs 项目的开端，在其中修改启动项，增加语句：`"serve": "nodemon index.js"`

使用的是`nodemon`，是一个 node 开发工具，使用`npm i -g nodemon`进行全局的安装

# tsconfig.json 修改

因为此次是使用的`vue-cli4.x` + `typescript`，所以需要对这个文件进行一定的配置和修改：

添加以下两点：

```json
    "typeRoots": [
      "src/globalDeclare"
    ],
    "noImplicitAny": false,
```

# Typescript 定义全局/实例属性

与不使用 typesctipt 的方式完全不同，在不使用的时候可以直接挂载：`Vue.prototype.$http`

使用之后就必须要按照官网给出的方法：`globalProperties`来扩充类型：

```typescript
import http from "./http";

const app = createApp(App).use(router);

// 在全局中进行挂载，然后再组件中进行使用
app.config.globalProperties.$http = http;
app.config.globalProperties.$validate = (data: object, rule: object) => {
  检验对象是否合规;
};
```

组件中的使用：

```typescript
import { getCurrentInstance, ref } from "vue";

// 推荐使用proxy，ctx只在生产环境起作用
const { proxy }: any = getCurrentInstance();
const res: any = ref(proxy);

return { res };

res.$http; // 在 setup内部如此使用
this.res.$http; // 在setup外面如此使用
```

为了告诉 Typescript 这些新的 property，需要进行模块补充，这些类型声明都可以放在一个文件中

```typescript
/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // 定义Vue的全局/实例属性
  interface Vue {
    $https: any;
    $urls: any;
    $message: any;
  }
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

# 跨域连接

跨域的时候，所有的`URL`地址都必须一一对应：

```typescript
{
  path: '/categories/edit/:id',
  component: () => import('../views/CategoryEdit.vue'),
  props: true
}
上面这个需要和正确的url访问地址对应，下面的两个需要确实对应

router.put('/categories/edit/:id', async(req, res) => {
  // 这个是提交的路由，需要将数据存入数据库中，所以此时就需要数据库了
  // 通过第一个参数找到一个新的数据，然后第二个参数就是他修改的值
  const model = await Category.findByIdAndUpdate(req.params.id, req.body);
  // 发回客户端，让客户端知道创建完成了
  res.send(model)
})
await this.res_proxy.$http.put(`categories/edit/${this.id}`,this.model);
```

# 管理后台

## Element UI

查看其后台管理界面的实例代码，使用的是`el-container`作为最外层的容器，`el-aside`作为侧边栏，`el-menu`为菜单的代码

## 管理后台的基础界面

基于`Element UI`的后台管理基础界面的搭建

`Element UI`官网：https://element.faas.ele.me/#/zh-CN/component/installation

优先使用官网例子进行复制，便于建立自己的后台管理界面，使用的是`Container 布局容器`

在 vue 项目中使用：`vue add element`进行 UI 的安装

目前来说：`vue-cli4.x`版本和 `Element UI`不匹配，所以最好还是使用 `vue-cli3.6.0`版本

**Tips：**如果是从 4.x 降低至 3.x，会报一个错：
`Please delete it and re-run vue-cli in manual mode.`

此时需要在 C 盘 中的 user/admin 文件夹中找到一个 `.vuerc`的文件，将其删除即可

### Element-plus

因为此时我们使用的是 vue3，所以已经是不兼容`Element UI`了，所以需要使用其升级版本：`Element-plus`

`Element Plus`官网：https://element-plus.gitee.io/#/zh-CN/component/installation

全局安装：`npm install element-plus --save`

`vue-cli4.x`中使用：`vue add element-plus`

### 添加路由

使用`vue add router`

对于 `index.ts`而言，其中需要改变其布局方式，如果是需要新开路由的可以直接在下面进行指定，也可以给路由添加一个新的子路由

在元素中，需要添加一个属性：`router`，表明它包含的元素是通过路由来进行控制其出现与消失的

在`Element-plus`中，一般都是写在`el-menu`这个元素标签内

### el-form

在表单控件中，可以添加`el-input`，和正常的表单控件的用法是一致的，需要注意的是：在`el-form`元素中需要添加一个属性：

`@submit.native.prevent=""`：表明提交之后执行的方法

    native：指的是原生的表单
    prevent：指的是阻止默认提交，不要跳转页面

### axios

通过这一项功能来提交数据，这样也是最常用的，类似于普通 JavaScript 中的`ajax`方法

# server 文件夹

其中需要安装一些模块：`npm -i express@next mongoose cors`

    mongoose：数据库
    cors：允许跨域请求

创建 `express` 的实例，调用端口启动后台的项目

需要创建一个文件夹`routes`来管理我们的项目中不同菜单的路由：

一般都是一个项目一个路由文件夹，比如此时我有`admin`项目，那么就需要这个文件夹，以及其中的`index.js`文件来管理其中的路由

在最外层的`index.js`文件中，使用`require('./routes/admin)(app)`将 app 传给 admin 中的`index.js`，在其中的`index.js`中这样使用：

```javascript
module.exports = (app) => {};
```

需要创建一个新的文件夹来存放关于数据库的东西：`plugins/db.js`

同样是需要在 `index.js`中进行引用和传入 app

在`db.js`中进行一定的连接：

```javascript
module.exports = (app) => {
  const mongoose = require("mongoose");

  // 连接 mongoose 数据库，连接的端口如上，数据库名称为node-vue-moba，连接参数为后面那个
  mongoose.connect("mongodb://127.0.0.1:27017/node-vue-moba", {
    useNewUrlParser: true,
  });
};
```

数据库已经连接好了，需要模型，所以需要新建一个`models`文件来存放模型

```javascript
const mongoose = require("mongoose");

// 定义模型的字段有什么
const schema = new mongoose.Schema({
  name: { type: String },
});

// 导出模型
module.exports = mongoose.model("Category", schema);
```

其中需要中间件来添加数据，也需要进行跨域的连接

```javascript
// 引入跨域模块
app.use(require("cors")());

// 加上中间件，使用Category模型的create方法来添加数据
app.use(express.json());
```

# setup 中使用 async

一般在这种情况下使用 `async await`都是在请求数据，需要的是在`created`生命周期的时候要加载好

在`setup`中实际中不存在`created`，但是可以使用这个生命周期钩子函数：`onBeforeMount`来使请求成功

```typescript
const { proxy }: any = getCurrentInstance();
let items: any = ref([]);
onBeforeMount(async (): Promise<void> => {
  const res = await proxy.$http.get("categories");
  items.value = res.data;
});
```

# 编辑按钮的地址跳转

```html
<el-button
  type="primary"
  size="small"
  @click="$router.push(`/categories/edit/${scope.row._id}}`)"
  >编辑</el-button
>
```

通过`$router.push()`来跳转路由，其中不是普通的引号，而是 HTML 的符号，`${}`表示传递过去的参数，前面的都是地址，`scope.row._id`表示当前的每一行的数据，`scope`是插槽的名字，不是默认的`default`

在路由中是这样定义带有参数的路径的：

```typescript
children: [
  {
    path: "/categories/create",
    component: () => import("../views/CategoryEdit.vue"),
  },
  {
    path: "/categories/list",
    component: () => import("../views/CategoryList.vue"),
  },
  // 使用的是:id的方式
  {
    path: "/categories/edit/:id",
    component: () => import("../views/CategoryEdit.vue"),
    props: true,
  },
];
```

`props`表示将`id`这个参数的值直接注入到`CategoryEdit.vue`这个页面中，这样的话在这个页面中就可以直接使用`id`的值

在该页面中也需要进行接收，使用`props: {id: String}`的方式，也就是父组件给子孙组件传递参数的方式

好处：可以和路由进行解耦

通过 id 来获取数据，是需要再写一种`get`方法的：

```typescript
// 通过id来获取详细的值
router.get("/categories/:id", async (req, res) => {
  // 获取数据，限制十条
  const model = await Category.findById(req.params.id);
  // 发回客户端，让客户端获取数据
  res.send(model);
});
```

在跳转之后的页面通过`id`进行判断请求的方法来获取不同的数据：

```typescript
  setup(props, context) {
    // 获取当前组件实例，不推荐使用ctx，推荐使用proxy
    const { proxy }: any = getCurrentInstance();
    const res: any = ref(proxy);
    let model: any = ref({});
    const fetch = async (): Promise<void> => {
      const res = await proxy.$http.get(`categories/${props.id}`);
      model.value = res.data;
    };

    return { model, res };
  },
```

这里需要的是 Props 中的参数，所以需要给`setup`加上参数

# 修改数据

同样是通过`id`来对应的数据库中找到对应的数据，然后通过`post`请求将`id`和新的数据`model`传回去

在数据库中通过`findOneAndUpdate(携带的id，携带的model)`的方式进行改变

在 `methods`方法中如果想使用`props`中的数据，获取静态数据的话直接使用`this`就可以获取了，如果是动态数据的话，就必须要使用`watch`进行监听之后才能获取

# 添加上级单位

通过的是`_id`来获取上级单位的具体信息，并将上级单位的`_id`存放在数据库中，此时就需要增加一个字段：`parent`，其数据类型应该是指数据库中的一个 ObjectId，而不是一个简单的 String 类型：`mogoose.SchemaTypes.ObjectId`，还需要指明其关联的模型是哪一个：`ref: 'Category'`

展示其具体的值，这样就需要修改获取数据的接口的方法，添加：`populate()`

```javascript
const items = await Category.find().populate("parent").limit(10);
```

# 书写通用接口

`CRUD`接口：表示增删改查

因为拼接参数之后参数不是大写，所以需要让其变成类名的形式，就需要一个模块：`inflection`

这个模块可以用于：单复数的转换，下划线，单词的格式转换等，主要是用于类名的转换

` const modelName = require('inflection').classify(req.params.resource);`

小写的复数形式 转换成 大写的单数形式

将以下代码做成中间件，做成每一个请求接口的前置处理：

```javascript
const modelName = require("inflection").classify(req.params.resource);
const Model = require(`../../models/${modelName}`);
```

使用的就是在 `express`中的链式操作

```javascript
// 加上rest，表明这是一个通用接口，:resource表示的是数据库中的模型
// 添加一个中间件函数，作为统一的前置处理，调用next()方法的时候会去处理下一个
app.use(
  "/admin/api/rest/:resource",
  async (req, res, next) => {
    const modelName = require("inflection").classify(req.params.resource);
    req.Model = require(`../../models/${modelName}`);
    next();
  },
  router
);
```

路由其实也算是中间件，但是因为其只需要返回数据就算完成，也就是最后一步操作，所以就不需要`next`这个参数了

对于存在的需要进行联动查询的字段，需要特殊处理，使用`setOptions({})`的形式做处理

```javascript
let queryOptions = {},
if (req.Model.modelName === "Category") {
    queryOptions.populate = 'parent';
}
// 通过添加populate展示出数据库中的关联字段的具体值，而不是Id值
const items = await req.Model.find().setOptions(queryOptions).limit(10)
```

# 上传数据

`Express`本身是无法获取上传的数据的，需要通过中间件来获取，使用的是模块`multer`

```typescript
const multer = require("multer");
// 上传到上传文件夹，dest是一个路径，__dirname表示当前文件所在的文件夹绝对地址
const upload = multer({ dest: __dirname + "/../../uploads" });
// 表示接收单个文件夹的上传，上传的时候，自动的键值的名字就是file，所以此处使用file
app.post("/admin/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  // 这样获取的file就是一大堆的描述该文件的键值对，是无法展示成图片的，所以需要返回的是url
  // 所有的必须想要访问的，都必须要定义路由，这是node的写法，可以定义一个静态路由
  res.send(file);
});
```

## 托管静态文件

```javascript
// 托管静态文件，让后面路径中的文件都可以通过/uploads这个路径来访问
app.use("/uploads", express.static(__dirname + "/uploads"));
```

# 多层嵌套属性定义

在定义多层嵌套属性的时候，容易发生：`Cannot read property 'xxx' of undefined`

所以一定要在`data/setup`中定义一下，保证其存在

如果服务端和客户端的属性发生了冲突，可以使用对象属性的合并方法：`Object.assign({}, 现有的数据, 要插入的数据)`

使用以上的那个方法是相当于重新定义了一个新的对象，但是原本的对象的键值对还是没有更新，所以需要以下的操作：

```javascript
Object.assign(现有的数据, 要插入的数据);
```

# 富文本编辑器

所见即所得编辑器，相当于就是一个功能简单的，小型的`word`

这里使用的是：`vue-quill`，以下方式进行安装：

```bush
npm install @vueup/vue-quill@alpha --save
```

它们的官网是：https://vueup.github.io/vue-quill/guide/usage.html

在`main.js/main.ts`中如下的导入：

```javascript
import { createApp } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const app = createApp();
app.component("QuillEditor", QuillEditor);
```

或者在需要使用的地方进行导入就可以了

```html
<QuillEditor theme="snow" toolbar="full" />
```

以上就是一个简单的使用方式

在其中上传自己文件夹中的图片，而不是使用网

如果使用的是这个编辑器自带的图片上传功能，有一个坏处：因为它将图片的信心保存为`base64`的编码，所以在保存的时候整个页面会非常的庞大，不利于传输

所以需要自己定义图片上传，而不是直接使用 base64 的方式

这个组件有一个问题：无法获取其中写入的数据，也就是无法将其写入的值保存在数据库中，此时也可以使用另一个：`$ vue create tinymce-vue-demo`

也可以使用一个国人开发的轻量级的组件：`npm i wangeditor --save`，这个需要是在`mount`周期函数内完成，也就是在挂载阶段完成，这个也有一个坏处，目前还没有解决，在`form`中，会将上面的下拉选择框中的内容挡住

# 权限

在建立一个新的资源的时候，都应该先去建立一个数据模型，然后再去做前端界面

首先建立管理员用户的模型：`AdminUser.js`

# 密码加密

使用的是`bcrypt.js`，通过`npm i bcrypt`进行安装

在定义字段的时候，可以如此进行定义：

```javascript
    password: { type: String, select: false, set(value) {
        return require('bcrypt').hashSync(value, 10)
    } },
```

长度一般都是为 10，也可以超过 10，就是越长散列的时间也就越长

需要改变默认在编辑界面的时候不进行散列

# token

需要安装一个新的模块`jsonwebtoken`，但是此时更换成`@types/jsonwebtoken`这个了

`npm install --save @types/jsonwebtoken`

这是应用于`typescript`的，如果提示没有找到对应的模块，那么可以使用以下方式安装：

`npm install jsonwebtoken`

# http-assert

`npm install http-assert`

在测试的时候进行验证是否存在，第一个参数是满足的条件，第二个参数是不满足时抛出的状态码，第三个参数是文字信息

```javascript
try {
  assert(username === "admin", 401, "authentication failed");
} catch (err) {
  ok(err.status === 401);
  ok(err.message === "authentication failed");
  ok(err.expose);
}
```

# 设置 token 之后图片上传错误原因

在对应的上传 vue 页面，图片的上传是使用自带的默认的 ajax 进行请求，所以不存在我们在请求拦截器中添加的请求头。

所以需要添加：`:headers` ，给请求头增加 token。

更为正常的做法：在全局添加这个 token 属性

```typescript
// todo 定义一个全局的mixin，给全局的请求都添加一个headers属性
// 相当于就是全局代码块，在每一个vue的实例都拥有这些代码块
// 此时所有的vue实例中都有这个方法，可以在vue页面中任意地方来调用
app.mixin({
  methods: {
    getAuthHeadersMixin() {
      return {
        Authorization: `Bearer ${sessionStorage.token || ""}`,
      };
    },
  },
});
```

此时发现，所有的 action 都是一样的，所以也可以定义在公共的代码块中。只有在点击上传这个事件的时候才会调用这个方法，而不是在一开始就调用，所以可以将这个方法写在`computed`属性中

```javascript
computed: {
    uploadURLMixin() {
        return this.$http.defaults.baseURL + '/upload'
    }
},
```

在调用的时候也是有所不同的，computed 是不能添加（）的，但是 methods 中的方法是必须带上的

# 在计算属性中添加参数

使用的是 `return function（参数）` 的方式，这样就可以添加参数了，在调用的时候还是只需要写其名字即可
