<template>
  <div>
    <h1>文章列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="240"> </el-table-column>
      <el-table-column prop="title" label="文章标题" width="120">
      </el-table-column>

      <el-table-column fixed="right" prop="prop" label="操作" width="180">
        <template v-slot="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/articles/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, onBeforeMount } from "vue";

export default defineComponent({
  // components: { QuillEditor },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const res_proxy = ref(proxy);
    let items: any = ref([]);

    const fetch = async (): Promise<void> => {
      const res = await proxy.$http.get(`/rest/articles`);
      items.value = res.data;
    };

    const fetch_func = ref(fetch);

    onBeforeMount(() => {
      fetch();
    });

    return { res_proxy, fetch_func, items };
  },
  methods: {
    async remove(row: any) {
      this.res_proxy
        .$confirm(`是否确定删除分类"${row.title}"`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await this.res_proxy.$http.delete(`/rest/articles/${row._id}`);
          this.res_proxy.$message({
            type: "success",
            message: "删除成功！",
          });
          this.fetch_func();
        });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>