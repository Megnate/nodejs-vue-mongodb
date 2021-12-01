<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <el-form @submit.prevent="save" label-width="120px">
      <el-form-item label="所属分类">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="category in categories"
            :key="category._id"
            :label="category.name"
            :value="category._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <!-- 富文本编辑器 -->
      <el-form-item label="正文">
        <div id="editor"></div>
      </el-form-item>

      <el-form-item style="margin-top: 4rem">
        <el-button
          type="primary"
          native-type="submit"
          @click="model.body = details"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onBeforeMount,
  Ref,
} from "vue";
// 导入富文本编辑器
// import { QuillEditor } from "@vueup/vue-quill";
import Quill from "quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineComponent({
  // components: { QuillEditor },
  props: {
    id: { type: String },
  },
  setup(props, context) {
    let model: Ref<any> = ref({});
    // 获取当前的全局/实例属性
    const { proxy }: any = getCurrentInstance();
    const res_proxy: any = ref(proxy);
    let details: any = ref({});

    const fetch: () => void = async (): Promise<void> => {
      const result: any = await proxy.$http.get(`/rest/articles/${props.id}`);
      model.value = result.data;
      // 获取富文本编辑器中的内容
      defineQuill();
    };

    const defineQuill = () => {
      const quill = new Quill("#editor", {
        theme: "snow",
        placeholder: "默认内容",
        readOnly: false,
      });
      quill.setContents(model.value.body);
      quill.on("text-change", (delta, oldDelta, source) => {
        details.value = quill.getContents();
      });
    };

    let categories: Ref<any> = ref([]);
    const fetch_categories: () => void = async (): Promise<void> => {
      const result: any = await proxy.$http.get(`/rest/categories`);
      categories.value = result.data;
    };

    onBeforeMount(() => {
      fetch_categories();
      props.id && fetch();
    });

    return { model, res_proxy, categories, details };
  },
  methods: {
    async save() {
      if (this.id) {
        await this.res_proxy.$http.put(
          `/rest/articles/edit/${this.id}`,
          this.model
        );
      } else {
        await this.res_proxy.$http.post(`/rest/articles`, this.model);
      }
      this.$router.push("/articles/list");
      this.res_proxy.$message({
        type: "success",
        message: "保存成功",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>