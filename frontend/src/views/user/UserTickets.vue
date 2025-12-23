<template>
  <el-card>
    <h2>我的工单</h2>
    <el-table :data="tickets" style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="status" label="状态" width="120" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tickets = ref([{ id: "TCK-2001", title: "用户示例工单", status: "open" }]);
</script>

