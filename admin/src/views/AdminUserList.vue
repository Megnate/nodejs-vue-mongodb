<template>
  <div>
    <h1>管理员列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="220"></el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="140"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template v-slot="scope">
          <!-- primary表示带颜色的按钮  text表示普通的按钮-->
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/admin_users/edit/${scope.row._id}`)"
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
      const res = await proxy.$http.get("/rest/admin_users");
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
        .$confirm(`是否确定删除 "${row.username}" 管理员`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await this.res_proxy.$http.delete(`/rest/admin_users/${row._id}`);
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