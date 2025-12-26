import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AdminLayout from "../views/admin/AdminLayout.vue";
import UserLayout from "../views/user/UserLayout.vue";
import { setupRouterGuards } from "./guards";

const routes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ["admin"] },
    children: [
      { path: "", name: "admin-dashboard", component: () => import("../views/admin/AdminDashboard.vue") },
      { path: "tickets", name: "admin-tickets", component: () => import("../views/admin/AdminTickets.vue") },
      { path: "knowledge", name: "admin-knowledge", component: () => import("../views/admin/AdminKnowledge.vue") }
    ]
  },
  {
    path: "/agent",
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ["agent", "admin"] },
    children: [
      { path: "", name: "agent-dashboard", component: () => import("../views/admin/AgentDashboard.vue") },
      { path: "queue", name: "agent-queue", component: () => import("../views/admin/AgentQueue.vue") }
    ]
  },
  {
    path: "/",
    component: UserLayout,
    meta: { requiresAuth: true, roles: ["user", "agent", "admin"] },
    children: [
      { path: "", name: "user-home", component: () => import("../views/user/UserHome.vue") },
      { path: "tickets", name: "user-tickets", component: () => import("../views/user/UserTickets.vue") },
      { path: "chat", name: "user-chat", component: () => import("../views/user/UserChat.vue") }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/403",
    name: "forbidden",
    component: () => import("../views/Forbidden.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

setupRouterGuards(router);

export default router;

