<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>客服管理平台</h2>
      </template>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="Token">
          <el-input
            v-model="form.token"
            type="password"
            placeholder="请输入Token（开发模式）"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <el-alert
        title="开发模式提示"
        type="info"
        :closable="false"
        style="margin-top: 20px"
      >
        <p>
          开发模式下，可以使用任意用户名和Token登录。Token将作为用户ID使用。
        </p>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/index";
import api from "../services/api";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  username: "",
  token: "",
});

const loading = ref(false);

const handleLogin = async () => {
  if (!form.value.username || !form.value.token) {
    ElMessage.warning("请输入用户名和Token");
    return;
  }

  loading.value = true;
  try {
    // 开发模式：直接使用Token验证
    const response = await api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${form.value.token}` },
    });

    if (response.data) {
      // 获取用户信息
      const userResponse = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${form.value.token}` },
      });

      authStore.setAuth({
        token: form.value.token,
        role: userResponse.data.role || "user",
        user: userResponse.data,
      });

      const redirect = (route.query.redirect as string) || "/";
      router.push(redirect);
      ElMessage.success("登录成功");
    } else {
      ElMessage.error("Token验证失败");
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-card {
    width: 400px;

    h2 {
      text-align: center;
      margin: 0;
    }
  }
}
</style>
