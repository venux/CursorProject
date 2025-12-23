<template>
  <el-card>
    <h2>工单管理</h2>
    <el-table :data="tickets" style="width: 100%">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="assignee" label="处理人" width="160" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tickets = ref([
  { id: "TCK-1001", title: "示例工单", status: "open", assignee: "AgentA" }
]);
</script>

