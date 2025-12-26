import { Router } from "vue-router";
import { useAuthStore } from "../stores/index";

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // 检查是否需要认证
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiredRoles = to.meta.roles as string[] | undefined;

    if (requiresAuth && !authStore.isAuthenticated) {
      // 未认证，重定向到登录页
      next({ path: "/login", query: { redirect: to.fullPath } });
      return;
    }

    // 检查角色权限
    if (requiredRoles && requiredRoles.length > 0) {
      if (!authStore.isAuthenticated) {
        next({ path: "/login", query: { redirect: to.fullPath } });
        return;
      }

      const hasRole = requiredRoles.some((role) => {
        if (role === "admin") return authStore.isAdmin;
        if (role === "agent") return authStore.isAgent;
        if (role === "user") return authStore.isUser;
        return false;
      });

      if (!hasRole) {
        next({ path: "/403" }); // 无权限页面
        return;
      }
    }

    next();
  });
}

