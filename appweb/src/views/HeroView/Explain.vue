<template>
  <div>
    <div class="introduce p-2 bg-white border-bottom">
      <div class="d-flex">
        <!-- 此处不适用 jc-around，需要让其自动增长变大，撑满一行 -->
        <router-link tag="button" to="/" class="btn btn-lg flex-1">
          <i class="iconfont icon-cc-menu-circle"></i>
          英雄介绍视频
        </router-link>
        <router-link tag="button" to="/" class="btn btn-lg flex-1 ml-2">
          <i class="iconfont icon-cc-menu-circle"></i>
          一图识英雄
        </router-link>
      </div>
      <div class="skills bg-white mt-4">
        <div class="d-flex jc-around">
          <img
            class="icon"
            :class="{ active: currentSkillIndex === i }"
            :src="item.icon"
            alt=""
            v-for="(item, i) in info.skills"
            :key="i"
            @click="currentSkillIndex = i"
          />
        </div>
        <div class="name d-flex pt-4 pb-3 ml-3">
          <h3 class="m-0">{{ current.name }}</h3>
          <span class="text-grey ml-4"
            >(冷却值：{{ current.coolDown }} 消耗：{{ current.cost }})</span
          >
        </div>
        <p class="description ml-3">
          {{ current.description }}
        </p>
      </div>
    </div>
    <!-- end of skills introduce -->
    <m-card plain class="hero-items" icon="cc-menu-circle" title="出装推荐">
      <div class="fs-xl">顺风出装</div>
      <div class="d-flex mt-3 jc-around text-center">
        <div v-for="(item, i) in info.items1" :key="i">
          <img :src="item.icon" alt="" class="items" />
          <div class="fs-xs">{{ item.name }}</div>
        </div>
      </div>
      <div class="mt-3 border-bottom"></div>
      <div class="mt-3 fs-xl">逆风出装</div>
      <div class="d-flex pt-3 jc-around text-center">
        <div v-for="(item, i) in info.items2" :key="i">
          <img :src="item.icon" alt="" class="items" />
          <div class="fs-xs">{{ item.name }}</div>
        </div>
      </div>
    </m-card>
    <!-- end of 出装推荐 -->
    <m-card plain class="usage_tips" icon="cc-menu-circle" title="使用技巧">
      <p class="m-0">{{ info.usage_tips }}</p>
    </m-card>
    <!-- end of 使用技巧 -->
    <m-card plain class="battle_tips" icon="cc-menu-circle" title="对抗技巧">
      <p class="m-0">{{ info.battle_tips }}</p>
    </m-card>
    <!-- end of 对抗技巧 -->
    <m-card plain class="team_tips" icon="cc-menu-circle" title="团战思路">
      <p class="m-0">{{ info.team_tips }}</p>
    </m-card>
    <!-- end of 团战思路 -->
    <m-card
      plain
      class="hero-relationships"
      icon="cc-menu-circle"
      title="英雄关系"
    >
      <div class="m-0 fs-xl">最佳搭档</div>
      <div class="partner d-flex mt-3" v-for="(item, i) in info.partners">
        <img width="50" height="50" :src="item.hero.icon" alt="" />
        <p class="flex-1 m-0 ml-3">{{ item.description }}</p>
      </div>
      <div class="border-bottom m-2"></div>
      <div class="m-0 fs-xl">被谁克制</div>
      <div class="partner d-flex mt-3" v-for="(item, i) in info.counters">
        <img width="50" height="50" :src="item.hero.icon" alt="" />
        <p class="flex-1 m-0 ml-3">{{ item.description }}</p>
      </div>
      <div class="border-bottom m-2"></div>
      <div class="m-0 fs-xl">克制谁</div>
      <div class="partner d-flex mt-3" v-for="(item, i) in info.gankers">
        <img width="50" height="50" :src="item.hero.icon" alt="" />
        <p class="flex-1 m-0 ml-3">{{ item.description }}</p>
      </div>
    </m-card>
    <!-- end of 英雄关系 -->
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "explain",
  props: {
    info: { type: Object, default: {} },
  },
  setup(props) {
    const currentSkillIndex = ref(-1);
    let current = ref({});

    let res = computed({
      get: () => {
        current.value = props.info.skills[0];
      },
      set: (val) => {
        current.value = props.info.skills[val];
      },
    });

    setTimeout(() => {
      currentSkillIndex.value = 0;
    }, 100);

    watch(
      [props.info, currentSkillIndex],
      (newValue, oldValue) => {
        res.value = newValue[1];
      },
      { deep: true }
    );
    return { currentSkillIndex, current, res };
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/_variables.scss";

.skills {
  .icon {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 50%;
    &.active {
      border: 2px solid map-get($map: $colors, $key: "primary");
    }
  }
}

.hero-items {
  .items {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>