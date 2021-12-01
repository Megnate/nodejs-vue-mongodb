<template>
  <div>
    <!-- 这个div是需要固定的，也就是不随着页面的滑动而消失 -->
    <div class="topbar bg-black py-2 px-3 d-flex ai-center">
      <img src="../../assets/logo.png" height="30" />
      <div class="px-2 flex-1">
        <router-link tag="span" to="/" class="text-white">王者荣耀</router-link>
        <span class="text-white ml-3">攻略站</span>
      </div>
      <router-link tag="button" to="/" class="btn text-light bg-black hero-btn">
        更多英雄 &gt;
      </router-link>
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

  .hero-btn {
    font-size: 1rem;
    font-weight: bolder;
  }
}
</style>