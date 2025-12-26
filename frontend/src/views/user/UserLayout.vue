<template>
  <div class="page-shell">
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h2>客服管理平台</h2>
          <div class="header-actions">
            <el-button @click="$router.push('/tickets')">我的工单</el-button>
            <el-button @click="$router.push('/chat')">在线客服</el-button>
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="authStore.user?.avatar" />
                <span style="margin-left: 8px">{{ authStore.user?.displayName || authStore.user?.username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main class="page-main">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/index";
import { ElMessage } from "element-plus";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.clear();
  router.push("/login");
  ElMessage.success("已退出登录");
};
</script>

<style scoped lang="scss">
.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    h2 {
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}

.page-main {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}
</style>

