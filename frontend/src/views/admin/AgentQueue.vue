<template>
  <div class="agent-queue">
    <el-card>
      <template #header>
        <h3>排队管理</h3>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="待分配工单" name="tickets">
          <el-table :data="unassignedTickets" v-loading="loading" style="width: 100%">
            <el-table-column prop="ticketId" label="工单号" width="180" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="priority" label="优先级" width="120">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)">{{ row.priority }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="assignToMe(row)">领取</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="排队会话" name="sessions">
          <el-table :data="queuingSessions" v-loading="loading" style="width: 100%">
            <el-table-column prop="sessionId" label="会话ID" width="180" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag>{{ row.status === "queuing" ? "排队中" : row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="acceptSession(row)">接入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { ticketService, type Ticket } from "../../services/ticket.service";
import { chatService, type Session } from "../../services/chat.service";
import { useAuthStore } from "../../stores/index";

const authStore = useAuthStore();
const activeTab = ref("tickets");
const loading = ref(false);
const unassignedTickets = ref<Ticket[]>([]);
const queuingSessions = ref<Session[]>([]);

const loadUnassignedTickets = async () => {
  loading.value = true;
  try {
    const result = await ticketService.findAll({
      status: "open",
      page: 1,
      limit: 50
    });
    unassignedTickets.value = result.tickets.filter((t) => !t.assignedTo);
  } catch (error: any) {
    ElMessage.error("加载工单失败");
  } finally {
    loading.value = false;
  }
};

const loadQueuingSessions = async () => {
  loading.value = true;
  try {
    const sessions = await chatService.getSessions();
    queuingSessions.value = sessions.filter((s) => s.status === "queuing");
  } catch (error: any) {
    ElMessage.error("加载会话失败");
  } finally {
    loading.value = false;
  }
};

const assignToMe = async (ticket: Ticket) => {
  if (!authStore.user?.id) {
    ElMessage.error("用户信息不存在");
    return;
  }

  try {
    await ticketService.assign(ticket._id, authStore.user.id);
    ElMessage.success("工单领取成功");
    loadUnassignedTickets();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "领取失败");
  }
};

const acceptSession = async (session: Session) => {
  if (!authStore.user?.id) {
    ElMessage.error("用户信息不存在");
    return;
  }

  try {
    const socket = chatService.getSocket();
    if (socket) {
      socket.emit("session:assign", {
        sessionId: session.sessionId,
        agentId: authStore.user.id
      });
      ElMessage.success("会话接入成功");
      loadQueuingSessions();
    } else {
      ElMessage.error("WebSocket未连接");
    }
  } catch (error: any) {
    ElMessage.error("接入失败");
  }
};

const getPriorityType = (priority: string) => {
  const map: Record<string, string> = {
    low: "info",
    medium: "",
    high: "warning",
    urgent: "danger"
  };
  return map[priority] || "";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("zh-CN");
};

onMounted(() => {
  loadUnassignedTickets();
  loadQueuingSessions();
});
</script>

<style scoped lang="scss">
.agent-queue {
  // 样式占位
}
</style>

