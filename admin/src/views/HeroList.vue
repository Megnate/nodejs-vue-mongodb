<template>
  <div>
    <h1>英雄列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="220"></el-table-column>
      <el-table-column
        prop="name"
        label="英雄名称"
        width="140"
      ></el-table-column>
      <el-table-column prop="title" label="称号" width="140"></el-table-column>
      <!-- 需要自定义显示图片，而不是显示一个字符串地址 -->
      <el-table-column prop="icon" label="英雄图标" width="140">
        <!-- 一般都是通过template和插槽的方式来自定义其中的内容 -->
        <template v-slot="icon_scope">
          <img :src="icon_scope.row.icon" alt="" style="height: 3rem" />
        </template>
      </el-table-column>
      <el-table-column
        prop="categories"
        label="类型"
        width="140"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template v-slot="scope">
          <!-- primary表示带颜色的按钮  text表示普通的按钮-->
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/heroes/edit/${scope.row._id}`)"
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
  setup() {
    const { proxy }: any = getCurrentInstance();
    let items: any = ref([]);
    const res_proxy = ref(proxy);

    const fetch = async (): Promise<void> => {
      const res = await proxy.$http.get("/rest/heroes");
      items.value = res.data;
    };
    const fetch_func = ref(fetch);
    onBeforeMount(() => {
      fetch();
    });
    return { items, fetch_func, res_proxy };
  },
  methods: {
    async remove(row: any) {
      this.res_proxy
        .$confirm(`是否确定删除分类 "${row.name}"`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await this.res_proxy.$http.delete(`/rest/heroes/${row._id}`);
          this.res_proxy.$message({
            type: "success",
            message: "删除成功!",
          });
          this.fetch_func();
        });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>