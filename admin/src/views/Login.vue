<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <!-- 登录表单，通过label-position来对齐字体：left,right,top，必须和label-width一起使用，除非使用top -->
      <el-form label-position="top" @submit.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input show-password v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, getCurrentInstance } from "vue";

export default defineComponent({
  setup() {
    const model: Ref<any> = ref({});
    const { proxy }: any = getCurrentInstance();
    const res_proxy: Ref<any> = ref(proxy);
    return {
      model,
      res_proxy,
    };
  },
  methods: {
    async login() {
      // 获取的是一个token
      const res = await this.res_proxy.$http.post("login", this.model);
      // 此时需要将获取到的token保存下拉，可以使用cookie或者是localStorage保存
      // 使用这个的话，在关闭浏览器之后再打开还是存在的
      // localStorage.token = res.data.token;
      // 可以使用sessionStorage，这样在浏览器关闭之后就不存在了
      sessionStorage.token = res.data.token;

      // 跳转到首页，也就是登录之后的页面
      this.res_proxy.$router.push("/");
      this.res_proxy.$message({
        type: "success",
        message: "登录成功",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.login-container {
  // 通过margin赋予10个字的高度，获得一定高度的合适
  .login-card {
    width: 30rem;
    margin: 6rem auto;
  }
}
</style>