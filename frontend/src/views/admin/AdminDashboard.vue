<template>
  <div class="admin-dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.tickets?.total || 0 }}</div>
            <div class="stat-label">总工单数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.tickets?.open || 0 }}</div>
            <div class="stat-label">待处理工单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ stats.agents?.active || 0 }}</div>
            <div class="stat-label">在线坐席</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ Math.round(stats.tickets?.resolutionRate || 0) }}%</div>
            <div class="stat-label">解决率</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>工单统计</h3>
          </template>
          <div v-loading="loading">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="已解决">{{ stats.tickets?.resolved || 0 }}</el-descriptions-item>
              <el-descriptions-item label="总坐席数">{{ stats.agents?.total || 0 }}</el-descriptions-item>
              <el-descriptions-item label="总会话数">{{ stats.sessions?.total || 0 }}</el-descriptions-item>
              <el-descriptions-item label="活跃会话">{{ stats.sessions?.active || 0 }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>快速操作</h3>
          </template>
          <el-space direction="vertical" style="width: 100%">
            <el-button type="primary" @click="$router.push('/admin/tickets')" style="width: 100%">
              管理工单
            </el-button>
            <el-button @click="$router.push('/admin/knowledge')" style="width: 100%">
              管理知识库
            </el-button>
            <el-button @click="$router.push('/agent')" style="width: 100%">
              坐席工作台
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { reportingService, type DashboardStats } from "../../services/reporting.service";

const stats = ref<DashboardStats>({
  tickets: { total: 0, open: 0, resolved: 0, resolutionRate: 0 },
  sessions: { total: 0, active: 0 },
  agents: { total: 0, active: 0 }
});
const loading = ref(false);

const loadStats = async () => {
  loading.value = true;
  try {
    const data = await reportingService.getDashboard();
    stats.value = data;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "加载统计数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped lang="scss">
.admin-dashboard {
  .stat-item {
    text-align: center;

    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #409eff;
      margin-bottom: 8px;
    }

    .stat-label {
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>

