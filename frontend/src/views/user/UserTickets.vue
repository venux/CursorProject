<template>
  <div class="user-tickets">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>我的工单</h3>
          <el-button type="primary" @click="showCreateDialog = true">创建工单</el-button>
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
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link @click="viewTicket(row)">查看</el-button>
            <el-button link v-if="row.status === 'closed'" @click="reopenTicket(row)">重新打开</el-button>
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

    <!-- 创建工单对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建工单" width="600px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="createForm.title" placeholder="请输入工单标题" />
        </el-form-item>
        <el-form-item label="描述" required>
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="5"
            placeholder="请详细描述您的问题"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="createForm.priority" placeholder="请选择优先级">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="createForm.tags" multiple placeholder="请选择标签">
            <el-option label="技术问题" value="technical" />
            <el-option label="账户问题" value="account" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createTicket" :loading="creating">创建</el-button>
      </template>
    </el-dialog>

    <!-- 工单详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="工单详情" width="800px">
      <div v-if="currentTicket">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单号">{{ currentTicket.ticketId }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentTicket.status)">
              {{ getStatusText(currentTicket.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="标题">{{ currentTicket.title }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(currentTicket.priority)">{{ currentTicket.priority }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">
            {{ formatDate(currentTicket.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ currentTicket.description }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ticketService, type Ticket } from "../../services/ticket.service";

const route = useRoute();

const tickets = ref<Ticket[]>([]);
const loading = ref(false);
const creating = ref(false);
const showCreateDialog = ref(false);
const showDetailDialog = ref(false);
const currentTicket = ref<Ticket | null>(null);

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
});

const createForm = ref({
  title: "",
  description: "",
  priority: "medium" as const,
  tags: [] as string[]
});

const loadTickets = async () => {
  loading.value = true;
  try {
    const result = await ticketService.findAll({
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

const createTicket = async () => {
  if (!createForm.value.title || !createForm.value.description) {
    ElMessage.warning("请填写标题和描述");
    return;
  }

  creating.value = true;
  try {
    await ticketService.create(createForm.value);
    ElMessage.success("工单创建成功");
    showCreateDialog.value = false;
    createForm.value = { title: "", description: "", priority: "medium", tags: [] };
    loadTickets();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "创建工单失败");
  } finally {
    creating.value = false;
  }
};

const viewTicket = async (ticket: Ticket) => {
  try {
    const detail = await ticketService.findOne(ticket._id);
    currentTicket.value = detail;
    showDetailDialog.value = true;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "加载工单详情失败");
  }
};

const reopenTicket = async (ticket: Ticket) => {
  try {
    await ElMessageBox.confirm("确定要重新打开此工单吗？", "提示", {
      type: "warning"
    });
    await ticketService.reopen(ticket._id);
    ElMessage.success("工单已重新打开");
    loadTickets();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.response?.data?.message || "操作失败");
    }
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
  if (route.query.action === "create") {
    showCreateDialog.value = true;
  }
  loadTickets();
});
</script>

<style scoped lang="scss">
.user-tickets {
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

