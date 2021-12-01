<template>
  <div class="page-article">
    <div class="d-flex py-3 px-2 border-bottom">
      <router-link tag="div" class="iconfont icon-back text-news" to="/">
      </router-link>
      <strong class="flex-1 text-news">{{ articles.title }}</strong>
      <div class="text-grey fs-xs">{{ date }}</div>
    </div>
    <div class="page-body px-4 fs-xxl" v-html="articles.body"></div>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onBeforeMount, ref } from "vue";
import dayjs from "dayjs";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export default defineComponent({
  props: {
    id: { required: true },
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance();
    const articles = ref({});
    let date = ref("");

    // 获取数据
    const fetchArticles = async () => {
      const res = await proxy.$http.get(`/articles/${props.id}`);
      // 将 quill-delta 数据转化成正常的 HTML 标签
      const converter = new QuillDeltaToHtmlConverter(res.data.body.ops, {});
      articles.value = res.data;
      date.value = dayjs(articles.value.createdAt).format("YYYY-MM-DD");
      articles.value.body = converter.convert();
    };

    // 页面一进入便请求数据
    onBeforeMount(() => {
      // 请求获取文章的数据
      fetchArticles();
    });
    return {
      articles,
      date,
    };
  },
});
</script>

<style lang="scss">
.page-article {
  .page-body {
    img {
      max-width: 100%;
      height: auto;
    }
    // 部分存在视频
    iframe {
      width: 100%;
      height: auto;
    }
  }
}
</style>
