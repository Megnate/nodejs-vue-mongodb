<template>
  <!-- <m-card icon="cc-menu-circle" title="新闻资讯">
      <div class="card-body pt-3">
        <div class="nav jc-between">
          <div class="nav-item active">
            <div class="nav-link">热门</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">新闻</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">公告</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">活动</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">赛事</div>
          </div>
        </div>
      </div> -->
  <!-- 此处使用Swiper样式，不适合自定义 -->
  <!-- <div class="pt-3">
        <div class="my-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="m in 5" :key="m">
              <div class="py-2" v-for="n in 5" :key="n">
                <span>[新闻]</span>
                <span>|</span>
                <span>这是第一个vue3和nodejs的项目</span>
                <span>06/02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m-card> -->
  <m-card :icon="icon" :title="title" :class="className">
    <div class="card-body pt-3">
      <div class="nav jc-between">
        <div
          class="nav-item"
          v-for="(category, index) in categories"
          :key="index"
          @click="$refs.list.swiper.slideTo(index + 1)"
          :class="{ active: active === index }"
        >
          <div class="nav-link">{{ category.name }}</div>
        </div>
      </div>
    </div>
    <!-- 此处使用Swiper样式，不适合自定义 -->
    <div class="pt-3">
      <div class="my-swiper" ref="list">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(category, index) in categories"
            :key="index"
          >
            <!-- 此处单纯的slot已经无法满足要求，需要具名slot，并且要来回传值 -->
            <slot name="items" :category="category"></slot>
          </div>
        </div>
      </div>
    </div>
  </m-card>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
// Swiper7
import "swiper/swiper-bundle.css";
import "swiper/swiper.scss";
import Swiper, { Autoplay } from "swiper";
Swiper.use([Autoplay]);

export default defineComponent({
  props: {
    icon: { type: String, require: true },
    title: { type: String, require: true },
    categories: { type: Array, require: true },
    className: { type: String, require: true },
  },
  setup(props, ctx) {
    let active = ref(0);
    // 防止在后续从其它页面跳转回来的时候轮播图报错
    let mySwiper = null;
    if (mySwiper !== null) {
      mySwiper.destroy(true, true);
      mySwiper = null;
    }
    onMounted(() => {
      // 为了实现loop: true，增加了一个定时器
      // 添加一个className，指定了不同的作用域
      setTimeout(() => {
        mySwiper = new Swiper("." + props.className + " .my-swiper", {
          observer: true,
          observeParents: true,
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          // 根据内容来控制高度
          autoHeight: true,
        });
        // 通过.on的方式来定义swiper的各种事件
        // activeIndexChange：表示索引改变即滑动之后的事件
        mySwiper.on("activeIndexChange", () => {
          active.value = mySwiper.realIndex;
        });
      }, 200);
    });

    return {
      active,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>