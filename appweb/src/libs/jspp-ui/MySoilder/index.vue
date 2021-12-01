<template>
  <div class="my-soilder">
    <div class="inner" @touchstart="mouseEnter" @touchend="mouseLeave">
      <director dir="prev" @dirClick="dirClick" />
      <director dir="next" @dirClick="dirClick" />
      <dot
        :hasDot="hasDot"
        :itemLength="itemLength"
        :currentIndex="currentIndex"
        :bgColor="bgColor"
        @dotClick="dotClick"
      />
      <div class="solider-f">
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Dot from "./Dot";
import Director from "./Director";
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";

export default defineComponent({
  name: "MySoilder",
  components: { Dot, Director },
  props: {
    autoplay: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
    initial: {
      type: Number,
      default: 0,
    },
    hasDot: {
      type: Boolean,
      default: true,
    },
    hasDirector: {
      type: Boolean,
      default: true,
    },
    tranAction: {
      type: String,
      default: "next",
    },
    bgColor: String,
  },
  setup(props) {
    const state = reactive({
      currentIndex: props.initial,
      itemLength: 0,
      tranAction: props.tranAction,
    });

    // 计时器
    let t = null;

    const autoPlay = () => {
      if (props.autoplay) {
        // 设置定时器
        t = setInterval(() => {
          setIndex(state.tranAction);
        }, props.duration);
      }
    };

    const { slots } = getCurrentInstance();
    // 定义图片的方向，通过指示器的方式
    const setIndex = (dir) => {
      switch (dir) {
        case "next":
          if (state.currentIndex === state.itemLength - 1) {
            state.currentIndex = 0;
          } else {
            state.currentIndex += 1;
            if (state.itemLength === state.currentIndex) {
              state.currentIndex -= 1;
              state.tranAction = "prev";
            }
          }
          break;
        case "prev":
          if (state.currentIndex === 0) {
            state.currentIndex = state.itemLength - 1;
          } else {
            state.currentIndex -= 1;
            if (state.currentIndex === -1) {
              state.currentIndex += 1;
              state.tranAction = "next";
            }
          }
          break;
        default:
          break;
      }
    };

    function _clearIntervalFn() {
      clearInterval(t);
      // 清除完之后要变为null
      t = null;
    }

    const dotClick = (index) => {
      // 此时的index就是子页面传递过来的值
      state.currentIndex = index;
    };

    const dirClick = (dir) => {
      setIndex(dir);
    };

    const mouseEnter = () => {
      _clearIntervalFn();
    };

    const mouseLeave = () => {
      autoPlay();
    };

    // 挂载完成执行计时器
    onMounted(() => {
      state.itemLength = slots.default()[0].children.length;
      autoPlay();
    });

    // 在卸载之前关闭计时器
    onBeforeUnmount(() => {
      _clearIntervalFn();
    });

    // 希望外边获取的是state中的值，而不是state本身，所以需要使用toRefs方法，将其变成一个ref响应式对象
    return {
      ...toRefs(state),
      dotClick,
      dirClick,
      mouseEnter,
      mouseLeave,
    };
  },
});
</script>

<style lang="scss" scoped>
.solider-f {
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  height: 100%;
}
// 为了让其在移动端都是自适应的
.my-soilder {
  // 这里都是100% 是因为在使用这个组件的时候可能会进行定位操作
  position: absolute;
  width: 100%;
  overflow: hidden;

  .inner {
    width: 100%;
    overflow: hidden;
  }
}
</style>