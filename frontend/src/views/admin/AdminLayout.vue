<template>
  <div class="page-shell">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <div class="logo">客服管理平台</div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/admin">
            <el-icon><Odometer /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/admin/tickets">
            <el-icon><Document /></el-icon>
            <span>工单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/knowledge">
            <el-icon><Collection /></el-icon>
            <span>知识库</span>
          </el-menu-item>
          <el-menu-item index="/agent" v-if="authStore.isAgent || authStore.isAdmin">
            <el-icon><User /></el-icon>
            <span>坐席工作台</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <span>管理后台</span>
            <div class="header-actions">
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
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Odometer, Document, Collection, User } from "@element-plus/icons-vue";
import { useAuthStore } from "../../stores/index";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activeMenu = computed(() => route.path);

const handleLogout = () => {
  authStore.clear();
  router.push("/login");
  ElMessage.success("已退出登录");
};
</script>

<style scoped lang="scss">
.sidebar {
  background: #304156;
  min-height: 100vh;

  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: white;
    font-weight: bold;
    border-bottom: 1px solid #434a55;
  }
}

.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .header-actions {
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

