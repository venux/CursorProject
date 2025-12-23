<template>
  <div class="page-shell">
    <el-container>
      <el-header>
        用户端入口（SSO 登录后展示），可放快捷入口：提交工单、会话、知识库
      </el-header>
      <el-main class="page-main">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

