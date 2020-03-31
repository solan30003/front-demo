import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/views/layout/Layout";
export const constantRouterMap = [
  {
    path: "",
    component: Layout,
    redirect: "loginLogList",
    children: [
      {
        path: "portal",
        component: () => import("@/views/layout/index"),
        name: "portal",
        meta: {
          title: "首页",
          icon: "portal",
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: "loginLogList",
        component: () => import("@/views/layout/log/loginLogList"),
        name: "loginLogList",
        meta: {
          title: "日志列表",
          icon: "loginLogList"
        }
      },
      {
        path: "404",
        component: () => import("@/views/layout/components/404"),
        name: "404",
        meta: {
          title: "front-demo-404",
          icon: "error",
          noCache: true
        }
      },
      {
        path: "500",
        component: () => import("@/views/layout/components/500"),
        name: "500",
        meta: {
          title: "front-demo-500",
          icon: "error",
          noCache: true
        }
      }
    ]
  }
];

const router = new Router({
  mode: "history", // require service support
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export default router;
