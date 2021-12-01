<template>
  <div class="page-hero">
    <!-- 因为字和图片是嵌在一起的，所以不能单纯的使用img标签 -->
    <div class="top" :style="{ 'background-image': `url(${hero.banner})` }">
      <div class="attribute text-white p-3 d-flex flex-column h-100 jc-end">
        <div class="title fs-sm">{{ hero.title }}</div>
        <h2 class="name my-2">{{ hero.name }}</h2>
        <div class="location fs-sm">{{ cats }}</div>
        <div class="d-flex jc-between pt-2">
          <!-- 全局上下对齐居中:d-flex ai-center -->
          <div class="scores d-flex ai-center" v-if="hero.scores">
            <span class="text-primary-2">难度</span>
            <span class="badge bg-primary-1">{{ hero.scores.difficult }}</span>
            <span class="text-primary-2">技能</span>
            <span class="badge bg-blue">{{ hero.scores.skills }}</span>
            <span class="text-primary-2">攻击</span>
            <span class="badge bg-danger">{{ hero.scores.attack }}</span>
            <span class="text-primary-2">生存</span>
            <span class="badge bg-dark-1">{{ hero.scores.service }}</span>
          </div>
          <router-link tag="span" to="/" class="skins fs-sm"
            >皮肤：8 &gt;</router-link
          >
        </div>
      </div>
    </div>
    <!-- end of top -->
    <div>
      <div class="mid px-3 bg-white">
        <div class="nav d-flex pt-3 pb-2 border-bottom jc-around">
          <div
            class="nav-item"
            :class="{ active: active === 0 }"
            @click="$refs.heroSwiper.swiper.slideTo(1)"
          >
            <div class="nav-link explain">英雄初识</div>
          </div>
          <div
            class="nav-item"
            :class="{ active: active === 1 }"
            @click="$refs.heroSwiper.swiper.slideTo(2)"
          >
            <div class="nav-link strategy">进阶攻略</div>
          </div>
        </div>
      </div>
      <div class="my-swiper" ref="heroSwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <explain :info="hero"></explain>
          </div>
          <div class="swiper-slide">
            <strategy></strategy>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onBeforeMount,
  ref,
} from "vue";
// Swiper7
import "swiper/swiper-bundle.css";
import "swiper/swiper.scss";
import Swiper from "swiper";

// 两个页面的引入
import Explain from "./Explain.vue";
import Strategy from "./Strategy.vue";

export default defineComponent({
  components: { Explain, Strategy },
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const { proxy } = getCurrentInstance();
    const hero = ref({});
    const cats = ref("");
    let active = ref(0);
    // 防止在后续从其它页面跳转回来的时候轮播图报错
    let mySwiper = null;
    if (mySwiper !== null) {
      mySwiper.destroy(true, true);
      mySwiper = null;
    }

    const fetch = async () => {
      const res = await proxy.$http.get(`/heroes/${props.id}`);
      hero.value = res.data;
      cats.value = hero.value.categories.map((v) => v.name).join("/");
    };

    onBeforeMount(() => {
      fetch();
      // 为了实现loop: true，增加了一个定时器
      setTimeout(() => {
        mySwiper = new Swiper(".my-swiper", {
          observer: true,
          observeParents: true,
          loop: true,
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

    return { hero, cats, active };
  },
});
</script>

<style lang="scss">
.page-hero {
  .top {
    height: 60vw;
    // 宽度自动，高度100%，必须要强制执行样式，不然可能失效
    background-size: auto 100% !important;
    // 图片垂直方向上往上靠，水平方向上尽量居中
    background: #fff no-repeat top center;
  }

  .attribute {
    // 背景是从全透明渐变到全黑
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

    .scores {
      .badge {
        margin: 0 0.5rem;
        // 需要配置宽高，所以是inline-block
        display: inline-block;
        width: 1rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        // 使其变成一个圆形
        border-radius: 50%;
        font-size: 0.7rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
}
</style>