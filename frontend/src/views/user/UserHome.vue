<template>
  <div class="user-home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <h3>欢迎使用客服管理平台</h3>
          </template>
          <p>您可以提交工单、查看工单状态、与客服在线沟通或查阅知识库。</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card class="quick-action-card" @click="$router.push('/tickets?action=create')">
          <el-icon :size="48"><DocumentAdd /></el-icon>
          <h3>提交工单</h3>
          <p>创建新的工单，描述您的问题</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="quick-action-card" @click="$router.push('/tickets')">
          <el-icon :size="48"><Document /></el-icon>
          <h3>我的工单</h3>
          <p>查看和管理您的工单</p>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="quick-action-card" @click="$router.push('/chat')">
          <el-icon :size="48"><ChatLineRound /></el-icon>
          <h3>在线客服</h3>
          <p>与客服实时沟通</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { DocumentAdd, Document, ChatLineRound } from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
.user-home {
  .quick-action-card {
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    h3 {
      margin: 16px 0 8px;
    }

    p {
      color: #909399;
      margin: 0;
    }
  }
}
</style>

