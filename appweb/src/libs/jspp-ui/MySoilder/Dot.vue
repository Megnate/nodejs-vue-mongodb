<template>
  <div class="dot-wrapper" v-if="hasDot">
    <div class="dot-item" v-for="item in itemLength" :key="item">
      <a
        href="javascript:;"
        class="dot-link"
        @click="dotClick(item - 1)"
        :style="{
          backgroundColor: item - 1 === currentIndex ? bgColor : '#fff',
        }"
      ></a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dot",
  props: {
    itemLength: Number,
    currentIndex: Number,
    hasDot: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: "#ff5000",
    },
  },
  setup(props, ctx) {
    const dotClick: Function = (index: any) => {
      // 在setup中通过将事件抛出到上下文中，父页面就可以获取子页面传递的值和其函数
      ctx.emit("dotClick", index);
    };

    return {
      dotClick,
    };
  },
});
</script>

<style lang="scss" scoped>
$bgColor: (
  "focus": #ff5000,
  "blur": #fff,
);

@each $bgKey, $bgValue in $bgColor {
  .dot-#{$bgKey} {
    background-color: $bgValue;
  }
}

.dot-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  font-size: 0;
  left: 0;
  margin-top: 145px;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0);

  .dot-item {
    display: inline-block;
    margin: 3px;

    .dot-link {
      display: block;
      padding-top: 8px;
      width: 8px;
      height: 0;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
</style>