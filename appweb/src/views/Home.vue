<template>
  <div class="home">
    <div class="container">
      <div class="one-soilder">
        <my-soilder
          :autoplay="true"
          :duration="3000"
          :initial="0"
          :hasDot="true"
          :hasDirector="true"
          :tranAction="'next'"
        >
          <my-soilder-item v-for="(item, index) of myData" :key="index">
            <img
              class="w-100"
              :src="require(`@/assets/img/${item.img_name}`)"
            />
          </my-soilder-item>
        </my-soilder>
      </div>
    </div>
    <!-- end of swiper -->
    <div class="nav-icons bg-white mt-3 text-center pt-3 text-dark">
      <div class="d-flex flex-wrap">
        <div class="nav-item mb-3" v-for="n in 9" :key="n">
          <i :class="`sprite sprite-${icons_names[n - 1]}`"></i>
          <div class="py-2">{{ icons_values[n - 1] }}</div>
        </div>
      </div>
      <div class="bg-light py-2 fs-lg">
        <i class="sprite sprite-arrow"></i>
        收起
      </div>
    </div>
    <!-- end of nav icons -->
    <m-list-card
      icon="cc-menu-circle"
      title="新闻资讯"
      :categories="newsCats.value"
      className="news"
    >
      <!-- 在父组件中不通过循环，拿到子组件中循环体的某一个变量，在父组件中就不需要循环 -->
      <!-- 作用域插槽，可以让插槽访问子组件的数据 -->
      <template #items="{ category }">
        <!-- 需要做成可以跳转的标签，所以原先的div变成了router-link -->
        <!-- router-link默认是a标签，不符合for in 的规则，所以需要改标签 -->
        <router-link
          tag="div"
          :to="`/articles/${item._id}`"
          class="py-2 fs-lg d-flex"
          v-for="(item, index) in category.newsList"
          :key="index"
        >
          <span class="text-info">[{{ item.categoryName }}]</span>
          <span class="px-2">|</span>
          <span class="flex-1 text-dark text-ellipsis pr-2">
            {{ item.title }}
          </span>
          <span class="text-grey fs-sm">{{ date(item.createdAt) }}</span>
        </router-link>
      </template>
    </m-list-card>
    <!-- end of nav news -->
    <m-list-card
      icon="card-hero"
      title="英雄列表"
      :categories="heroesCats.value"
      className="heroes"
    >
      <template #items="{ category }">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem">
          <router-link
            tag="div"
            :to="`/heroes/${item._id}`"
            class="p-2 text-center"
            style="width: 20%"
            v-for="(item, index) in category.heroList"
            :key="index"
          >
            <img :src="item.icon" alt="" class="w-100" />
            <div>{{ item.name }}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>
    <!-- end of nav heroes -->
    <m-card icon="card-hero" title="精彩视频"></m-card>
    <m-card icon="card-hero" title="图文攻略"></m-card>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  getCurrentInstance,
  onBeforeMount,
} from "vue";
import myData from "@/public/data/mySoilder";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const newsCats = reactive([]);
    const heroesCats = reactive([]);

    const fetchNewsCats = async () => {
      const res = await proxy.$http.get("news/list");
      newsCats.value = res.data;
    };

    const fetchHeroesCats = async () => {
      const res = await proxy.$http.get("heroes/list");
      heroesCats.value = res.data;
    };

    // 在created阶段执行的代码都放在这里面
    onBeforeMount(() => {
      fetchNewsCats();
      fetchHeroesCats();
    });

    const icons_events = {
      news: "爆料站",
      story: "故事站",
      store: "周边商场",
      try: "体验服",
      newperson: "新人专区",
      honor: "荣耀 传承",
      wangzhe: "王者营地",
      wechat: "公众号",
      version: "版本介绍",
    };
    const icons_names = reactive(Object.getOwnPropertyNames(icons_events));
    const icons_values = reactive(Object.values(icons_events));

    const date = (val) => {
      return dayjs(val).format("MM/DD");
    };
    return {
      myData,
      icons_names,
      icons_values,
      newsCats,
      date,
      heroesCats,
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/_variables";
.container {
  position: relative;
  height: 100%;
  width: 100%;
  .one-soilder {
    position: relative;
    height: 12.5rem;
  }
}
// end of swipper

.nav-icons {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  .nav-item {
    // 一行显示四个
    width: 25%;

    border-right: 1px solid $border-color;
    &:nth-child(4n) {
      border-right: none;
    }
  }
}

.my-swiper {
  overflow: hidden;
}
</style>