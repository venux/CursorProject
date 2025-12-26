<template>
  <div class="admin-tickets">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>工单管理</h3>
          <el-space>
            <el-select v-model="filters.status" placeholder="状态筛选" clearable @change="loadTickets">
              <el-option label="待处理" value="open" />
              <el-option label="已分配" value="assigned" />
              <el-option label="处理中" value="in_progress" />
              <el-option label="已解决" value="resolved" />
              <el-option label="已关闭" value="closed" />
            </el-select>
            <el-button @click="loadTickets">刷新</el-button>
          </el-space>
        </div>
      </template>

      <el-table :data="tickets" v-loading="loading" style="width: 100%">
        <el-table-column prop="ticketId" label="工单号" width="180" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="120">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assignedTo" label="处理人" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link @click="viewTicket(row)">查看</el-button>
            <el-button link @click="assignTicket(row)" v-if="!row.assignedTo">分配</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        @current-change="loadTickets"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 分配工单对话框 -->
    <el-dialog v-model="showAssignDialog" title="分配工单" width="400px">
      <el-select v-model="selectedAgent" placeholder="请选择坐席" style="width: 100%">
        <el-option
          v-for="agent in agents"
          :key="agent.id"
          :label="agent.displayName || agent.username"
          :value="agent.id"
        />
      </el-select>
      <template #footer>
        <el-button @click="showAssignDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign" :loading="assigning">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ticketService, type Ticket } from "../../services/ticket.service";
import { userService, type Agent } from "../../services/user.service";

const tickets = ref<Ticket[]>([]);
const agents = ref<Agent[]>([]);
const loading = ref(false);
const assigning = ref(false);
const showAssignDialog = ref(false);
const selectedAgent = ref("");
const currentTicket = ref<Ticket | null>(null);

const filters = ref({
  status: ""
});

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0
});

const loadTickets = async () => {
  loading.value = true;
  try {
    const result = await ticketService.findAll({
      status: filters.value.status as any,
      page: pagination.value.page,
      limit: pagination.value.limit
    });
    tickets.value = result.tickets;
    pagination.value.total = result.total;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "加载工单失败");
  } finally {
    loading.value = false;
  }
};

const loadAgents = async () => {
  try {
    agents.value = await userService.getAgents();
  } catch (error: any) {
    ElMessage.error("加载坐席列表失败");
  }
};

const viewTicket = async (ticket: Ticket) => {
  try {
    const detail = await ticketService.findOne(ticket._id);
    await ElMessageBox.alert(
      `<p><strong>标题：</strong>${detail.title}</p><p><strong>描述：</strong>${detail.description}</p>`,
      `工单详情 - ${detail.ticketId}`,
      {
        dangerouslyUseHTMLString: true
      }
    );
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("加载工单详情失败");
    }
  }
};

const assignTicket = (ticket: Ticket) => {
  currentTicket.value = ticket;
  showAssignDialog.value = true;
};

const confirmAssign = async () => {
  if (!selectedAgent.value || !currentTicket.value) return;

  assigning.value = true;
  try {
    await ticketService.assign(currentTicket.value._id, selectedAgent.value);
    ElMessage.success("工单分配成功");
    showAssignDialog.value = false;
    selectedAgent.value = "";
    loadTickets();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "分配失败");
  } finally {
    assigning.value = false;
  }
};

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    open: "info",
    assigned: "warning",
    in_progress: "primary",
    resolved: "success",
    closed: ""
  };
  return map[status] || "";
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    open: "待处理",
    assigned: "已分配",
    in_progress: "处理中",
    waiting_user: "待用户",
    resolved: "已解决",
    closed: "已关闭",
    reopened: "已重新打开"
  };
  return map[status] || status;
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
  loadTickets();
  loadAgents();
});
</script>

<style scoped lang="scss">
.admin-tickets {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }
  }
}
</style>

