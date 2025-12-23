<template>
  <div class="page-shell">
    <el-container>
      <el-aside width="200px">
        <el-menu router>
          <el-menu-item index="/admin">管理端主页</el-menu-item>
          <el-menu-item index="/admin/tickets">工单</el-menu-item>
          <el-menu-item index="/admin/knowledge">知识库</el-menu-item>
          <el-menu-item index="/agent">Agent 工作台</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>客服管理平台（Admin/Agent）</el-header>
        <el-main class="page-main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

