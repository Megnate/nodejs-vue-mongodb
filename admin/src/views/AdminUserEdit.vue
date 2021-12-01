<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}管理员</h1>
    <el-form label-width="120px" @submit.prevent="save">
      <el-form-item label="姓名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <!-- 使用 show-password就可以得到一个可以切换显示隐藏的密码框 -->
        <el-input
          prefix-icon="el-icon-lock"
          show-password
          v-model="model.password"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <!-- 表明原生类型为一个提交按钮 -->
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onBeforeMount } from "vue";

export default defineComponent({
  // 通过id来判断是处于编辑状态还是新增状态，编辑状态需要将数据填入input框
  props: {
    id: { type: String },
  },
  setup(props, context) {
    const bFlag: any = ref(false);
    // 获取当前组件实例，不推荐使用ctx，推荐使用proxy
    const { proxy }: any = getCurrentInstance();
    const res_proxy: any = ref(proxy);
    let model: any = ref({});
    const fetch = async (): Promise<void> => {
      const result = await proxy.$http.get(`/rest/admin_users/${props.id}`);
      model.value = result.data;
    };

    // 需要在created阶段判断是否执行fetch
    onBeforeMount(() => {
      props.id && fetch();
    });

    return { model, res_proxy, bFlag };
  },
  methods: {
    async save() {
      if (this.id) {
        // 存在id，所以是修改
        await this.res_proxy.$http.put(
          `rest/admin_users/edit/${this.id}`,
          this.model
        );
      } else {
        // 将异步的回调函数的写法换成类似的同步的写法，因为其返回的是Promise类型的，所以没有问题
        await this.res_proxy.$http.post("/rest/admin_users", this.model);
      }
      // 提交之后进行页面的跳转
      this.$router.push("/admin_users/list");
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
</style>