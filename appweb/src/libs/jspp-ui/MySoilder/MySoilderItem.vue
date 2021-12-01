<template>
  <transition>
    <!-- v-if="selfIndex === currentIndex" -->
    <div class="my-soilder-item" v-if="selfIndex === currentIndex">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
} from "vue";

export default defineComponent({
  name: "MySoilderItem",
  setup() {
    // 推荐使用类似的方式来获取当前组件的实例，因为这样可以直接获取里面的值
    // const { proxy }: any = getCurrentInstance();
    // 这种方式是将所有的属性都获取到，不是很推荐
    // const instance: any = getCurrentInstance();
    const { vnode }: any = getCurrentInstance();

    // 此处还是通过当前组件实例上的方法来获取父组件中的属性信息，parent就是父组件的实例
    // 此处一般不获取ctx，而是获取proxy即可获取父组件的属性
    const {
      parent: { proxy },
    }: any = getCurrentInstance();

    const state: any = reactive({
      selfIndex: vnode.key,
      currentIndex: proxy.currentIndex,
    });
    // state中的变量都不是响应式数据，所以需要使用监听，这样在计时器中执行的变化才会提现到DOM上
    watch(
      () => {
        return proxy.currentIndex;
      },
      (value) => {
        state.currentIndex = value;
      }
    );

    return { ...toRefs(state) };
  },
});
</script>

<style lang="scss" scoped>
// 其需要绝对定位，因为其初始位置肯定都是在左上角那个位置的，仅仅只是显示的问题
// 在第二张图需要显示的时候，需要将其初始位置转换到第一张的右边的位置处
.my-soilder-item {
  position: relative;
  min-width: 100%;
}
// img {
//   width: 100%;
// }

.v-enter-active,
.v-leave-active {
  // 所有的样式在300毫秒之后添加linnear动画
  transition: all 0.3s ease-in-out;
}

// 让准备进去的图片的位置变成横向的100%位置处
.v-enter-active {
  transform: translateX(100%);
}
.v-enter-to {
  transform: translateX(0);
}

// 需要离去的图片的位置为横向的0%位置处
.v-leave-to {
  transform: translateX(-100%);
}
</style>