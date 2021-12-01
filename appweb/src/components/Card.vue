<template>
  <div class="card bg-white mt-3 p-3">
    <div
      class="card-header d-flex ai-center pb-3"
      :class="{ 'border-bottom': !plain, 'pb-3': !palin }"
    >
      <i :class="`iconfont icon-${icon}`"></i>
      <div class="fs-xl flex-1 px-2">
        <strong>{{ title }}</strong>
      </div>
      <i class="iconfont icon-more" v-if="!plain"></i>
    </div>
    <div class="card-body pt-2">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "my-card",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    plain: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables";

.card {
  border-bottom: 1px solid $border-color;
}
</style>