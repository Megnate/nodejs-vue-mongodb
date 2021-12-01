<template>
  <div>
    <!-- 这个div是需要固定的，也就是不随着页面的滑动而消失 -->
    <div class="topbar bg-black py-2 px-3 d-flex ai-center">
      <img src="../assets/logo.png" height="30" />
      <div class="px-2 flex-1">
        <div class="text-white">王者荣耀</div>
        <div class="text-dark-1 text-grey fs-xs">团队成就更多</div>
      </div>
      <button type="button" class="btn bg-primary">立即下载</button>
    </div>
    <div class="bg-primary py-2">
      <!-- 因为左右都还有空间，所以使用的是around -->
      <div class="nav pb-1 jc-around nav-inverse">
        <div class="nav-item active">
          <!-- 表示一个链接，to指向地址 -->
          <router-link class="nav-link text-white" to="/">首页</router-link>
        </div>
        <div class="nav-item">
          <!-- 表示一个链接，to指向地址 -->
          <router-link class="nav-link text-white" to="/">攻略中心</router-link>
        </div>
        <div class="nav-item">
          <!-- 表示一个链接，to指向地址 -->
          <router-link class="nav-link text-white" to="/">赛事中心</router-link>
        </div>
      </div>
    </div>
    <!-- 子路由的一个替代 -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.topbar {
  // 表示吸顶的效果
  position: sticky;
  top: 0;
  // 层级较低，需要使其置顶
  z-index: 999;
}
</style>