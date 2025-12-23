import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AdminLayout from "../views/admin/AdminLayout.vue";
import UserLayout from "../views/user/UserLayout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", name: "admin-dashboard", component: () => import("../views/admin/AdminDashboard.vue") },
      { path: "tickets", name: "admin-tickets", component: () => import("../views/admin/AdminTickets.vue") },
      { path: "knowledge", name: "admin-knowledge", component: () => import("../views/admin/AdminKnowledge.vue") }
    ]
  },
  {
    path: "/agent",
    component: AdminLayout,
    children: [
      { path: "", name: "agent-dashboard", component: () => import("../views/admin/AgentDashboard.vue") },
      { path: "queue", name: "agent-queue", component: () => import("../views/admin/AgentQueue.vue") }
    ]
  },
  {
    path: "/",
    component: UserLayout,
    children: [
      { path: "", name: "user-home", component: () => import("../views/user/UserHome.vue") },
      { path: "tickets", name: "user-tickets", component: () => import("../views/user/UserTickets.vue") },
      { path: "chat", name: "user-chat", component: () => import("../views/user/UserChat.vue") }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

