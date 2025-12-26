<template>
  <div class="agent-dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ myTickets.length }}</div>
            <div class="stat-label">我的工单</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ activeSessions.length }}</div>
            <div class="stat-label">活跃会话</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-value">{{ resolvedCount }}</div>
            <div class="stat-label">已解决工单</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>我的工单</h3>
          </template>
          <el-table :data="myTickets" style="width: 100%">
            <el-table-column prop="ticketId" label="工单号" width="150" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button link @click="$router.push(`/admin/tickets`)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <h3>活跃会话</h3>
          </template>
          <el-table :data="activeSessions" style="width: 100%">
            <el-table-column prop="sessionId" label="会话ID" width="150" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button link @click="$router.push('/agent/queue')">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { ticketService, type Ticket } from "../../services/ticket.service";
import { chatService, type Session } from "../../services/chat.service";
import { useAuthStore } from "../../stores/index";

const authStore = useAuthStore();
const myTickets = ref<Ticket[]>([]);
const activeSessions = ref<Session[]>([]);

const resolvedCount = computed(() => {
  return myTickets.value.filter((t) => t.status === "resolved").length;
});

const loadMyTickets = async () => {
  try {
    const result = await ticketService.findAll({
      assignedTo: authStore.user?.id,
      page: 1,
      limit: 10
    });
    myTickets.value = result.tickets;
  } catch (error: any) {
    ElMessage.error("加载工单失败");
  }
};

const loadSessions = async () => {
  try {
    const sessions = await chatService.getSessions();
    activeSessions.value = sessions.filter((s) => s.status === "connected");
  } catch (error: any) {
    ElMessage.error("加载会话失败");
  }
};

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    open: "info",
    assigned: "warning",
    in_progress: "primary",
    resolved: "success"
  };
  return map[status] || "";
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    open: "待处理",
    assigned: "已分配",
    in_progress: "处理中",
    resolved: "已解决"
  };
  return map[status] || status;
};

onMounted(() => {
  loadMyTickets();
  loadSessions();
});
</script>

<style scoped lang="scss">
.agent-dashboard {
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

