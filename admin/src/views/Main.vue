<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <!-- default-active 表示的跟随着路径进行高亮显示 -->
      <!-- unique-opened 表示默认只展开一个 -->
      <!-- default-openeds 表示展开的是哪一项，此处应该用数组变量，不然会一直展开第一项 -->
      <el-menu
        router
        :default-openeds="openeds"
        unique-opened
        :default-active="$route.path"
      >
        <el-submenu index="1">
          <template #title><i class="el-icon-message"></i>内容管理</template>
          <el-menu-item-group>
            <template #title>物品</template>
            <el-menu-item index="/items/create">新建物品</el-menu-item>
            <el-menu-item index="/items/list">物品列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>英雄</template>
            <el-menu-item index="/heroes/create">新建英雄</el-menu-item>
            <el-menu-item index="/heroes/list">英雄列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>文章</template>
            <el-menu-item index="/articles/create">新建文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template #title><i class="el-icon-message"></i>运营管理</template>
          <el-menu-item-group>
            <template #title>广告</template>
            <el-menu-item index="/ads/create">新建广告</el-menu-item>
            <el-menu-item index="/ads/list">广告列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template #title><i class="el-icon-message"></i>系统设置</template>
          <el-menu-item-group>
            <template #title>分类</template>
            <el-menu-item index="/categories/create">新建分类</el-menu-item>
            <el-menu-item index="/categories/list">分类列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>管理员</template>
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>梅桂楠</span>
      </el-header>

      <el-main>
        <!-- 默认使用组件来区分，但是此时两个页面使用同一个组件，所以此处就不会区分，新建和编辑的时候数据会重叠 -->
        <!-- 此时就需要使用另一个两个页面不一致的来区分 -->
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";

export default defineComponent({
  setup() {
    const openeds: Ref<any> = ref([]);
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    };

    const tableData = ref(Array(20).fill(item));

    return {
      tableData,
      openeds,
    };
  },
});
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  line-height: 60px;
}

.el-aside {
  color: var(--el-text-color-primary);
}
</style>
