<template>
  <div class="user-chat">
    <el-card>
      <template #header>
        <h3>在线客服</h3>
      </template>

      <div class="chat-container" v-if="sessionId">
        <div class="messages" ref="messagesRef">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="[
              'message',
              message.senderId === currentUserId ? 'own' : 'other',
            ]"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.createdAt) }}</div>
          </div>
        </div>
        <div class="input-area">
          <el-input
            v-model="inputMessage"
            @keyup.enter="sendMessage"
            placeholder="输入消息..."
          />
          <el-button
            type="primary"
            @click="sendMessage"
            :disabled="!inputMessage"
            >发送</el-button
          >
        </div>
      </div>

      <div v-else class="start-chat">
        <el-button type="primary" @click="startSession" :loading="connecting">
          开始会话
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../../stores/index";
import { chatService, type Message } from "../../services/chat.service";
import type { Socket } from "socket.io-client";

const authStore = useAuthStore();
const sessionId = ref<string | null>(null);
const messages = ref<Message[]>([]);
const inputMessage = ref("");
const connecting = ref(false);
const currentUserId = ref(authStore.user?.id || "");
const messagesRef = ref<HTMLElement | null>(null);
let socket: Socket | null = null;

const startSession = async () => {
  if (!authStore.user?.id) {
    ElMessage.error("请先登录");
    return;
  }

  connecting.value = true;
  try {
    socket = chatService.connect(authStore.user.id);

    socket.on("connect", () => {
      socket?.emit("session:create", {
        userId: authStore.user?.id,
        channel: "web",
      });
    });

    socket.on("session:created", (data: any) => {
      sessionId.value = data.session.sessionId;
      connecting.value = false;
      loadMessages();
    });

    socket.on("message:received", (data: any) => {
      messages.value.push(data.message);
      scrollToBottom();
    });

    socket.on("error", (error: any) => {
      ElMessage.error(error.message || "连接失败");
      connecting.value = false;
    });
  } catch (error: any) {
    ElMessage.error("启动会话失败");
    connecting.value = false;
  }
};

const loadMessages = async () => {
  if (!sessionId.value) return;
  try {
    const msgs = await chatService.getMessages(sessionId.value);
    messages.value = msgs;
    scrollToBottom();
  } catch (error: any) {
    ElMessage.error("加载消息失败");
  }
};

const sendMessage = () => {
  if (!inputMessage.value.trim() || !sessionId.value || !socket) return;

  socket.emit("message:send", {
    sessionId: sessionId.value,
    content: inputMessage.value,
    type: "text",
  });

  inputMessage.value = "";
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  if (authStore.user?.id) {
    currentUserId.value = authStore.user.id;
  }
});

onUnmounted(() => {
  chatService.disconnect();
});
</script>

<style scoped lang="scss">
.user-chat {
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 600px;

    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 4px;
      margin-bottom: 16px;

      .message {
        margin-bottom: 16px;

        &.own {
          text-align: right;

          .message-content {
            background: #409eff;
            color: white;
            display: inline-block;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 70%;
          }
        }

        &.other {
          .message-content {
            background: white;
            display: inline-block;
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 70%;
          }
        }

        .message-time {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }

    .input-area {
      display: flex;
      gap: 8px;
    }
  }

  .start-chat {
    text-align: center;
    padding: 40px;
  }
}
</style>
