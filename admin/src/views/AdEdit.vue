<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}广告</h1>
    <el-form label-width="120px" @submit.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="广告">
        <el-button size="small" @click="model.ads.push({})">
          <i class="el-icon-plus"></i>添加广告
        </el-button>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :span="24" v-for="(ad, i) in model.ads" :key="i">
            <el-form-item label="广告链接">
              <el-input v-model="model.url"></el-input>
            </el-form-item>
            <el-form-item label="广告图">
              <!-- :before-upload="beforeAvatarUpload"是上传之前做的验证 -->
              <el-upload
                class="avatar-uploader"
                :action="uploadURLMixin"
                :headers="getAuthHeadersMixin()"
                :show-file-list="false"
                :on-success="afterUpload"
              >
                <img v-if="ad.icon" :src="ad.icon" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <!-- 通过对skills数组的切片实现删除 -->
              <el-button type="danger" @click="model.ads.splice(i, 1)"
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <!-- 表明原生类型为一个提交按钮 -->
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onBeforeMount,
  reactive,
} from "vue";

export default defineComponent({
  // 通过id来判断是处于编辑状态还是新增状态，编辑状态需要将数据填入input框
  props: {
    id: { type: String },
  },
  setup(props, context) {
    // 获取当前组件实例，不推荐使用ctx，推荐使用proxy
    const { proxy }: any = getCurrentInstance();
    const res_proxy: any = ref(proxy);
    let model: any = reactive({
      ads: [
        {
          url: { type: String },
          icon: { type: String },
        },
      ],
    });
    const fetch = async (): Promise<void> => {
      const result = await proxy.$http.get(`/rest/ads/${props.id}`);
      model = Object.assign(model, result.data);
    };

    // 需要在created阶段判断是否执行fetch
    onBeforeMount(() => {
      props.id && fetch();
    });

    return { model, res_proxy };
  },
  methods: {
    // 服务端返回的数据
    afterUpload(res: any) {
      // 如果没有赋值上新的键值对，那么可以使用显式赋值的方式
      this.model.icon = res.url;
    },
    async save() {
      if (this.id) {
        // 存在id，所以是修改
        await this.res_proxy.$http.put(`rest/ads/edit/${this.id}`, this.model);
      } else {
        // 将异步的回调函数的写法换成类似的同步的写法，因为其返回的是Promise类型的，所以没有问题
        await this.res_proxy.$http.post("/rest/ads", this.model);
      }
      // 提交之后进行页面的跳转
      this.$router.push("/ads/list");
      // 使用的是Element-plus中的ElMessage
      this.res_proxy.$message({
        type: "success",
        message: "保存成功",
      });
    },
  },
});
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>