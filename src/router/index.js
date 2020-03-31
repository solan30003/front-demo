import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/views/layout/Layout";
export const constantRouterMap = [
  {
    path: "",
    component: Layout,
    redirect: "prePlanTmplList",
    children: [
      {
        path: "portal",
        component: () => import("@/views/portal/index"),
        name: "portal",
        meta: {
          title: "首页",
          icon: "portal",
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: "plansManage",
        component: () => import("@/views/portal/plan/tmpl/prePlanTmplManage"),
        name: "plansManage",
        meta: {
          title: "预案模板管理",
          icon: "plansManage"
        }
      },
      {
        path: "prePlanTmplList",
        component: () => import("@/views/portal/plan/tmpl/prePlanTmplList"),
        name: "prePlanTmplList",
        meta: {
          title: "预案模板",
          icon: "prePlanTmplList"
        }
      },
      {
        path: "prePlanDetail",
        component: () => import("@/views/portal/plan/tmpl/prePlanDetail"),
        name: "prePlanDetail",
        meta: {
          title: "预案详情",
          icon: "prePlanTmplList"
        }
      },
      {
        path: "caseStart",
        component: () => import("@/views/portal/case/caseStart"),
        name: "caseStart",
        meta: {
          title: "启动预案",
          icon: "caseStart",
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: "sysDictList",
        component: () => import("@/views/portal/sys/sysDictList"),
        name: "sysDictList",
        meta: {
          title: "参数配置",
          icon: "sysDictList",
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: "caseExecute",
        component: () => import("@/views/portal/case/caseExecute"),
        name: "caseExecute",
        meta: {
          title: "执行预案",
          icon: "caseExecute",
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: "prePlanInstcList",
        component: () => import("@/views/portal/plan/instc/prePlanInstcList"),
        name: "prePlanInstcList",
        meta: {
          title: "预案列表",
          icon: "caseExecute",
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: "404",
        component: () => import("@/views/layout/components/404"),
        name: "404",
        meta: {
          title: "预案系统",
          icon: "error",
          noCache: true
        }
      },
      {
        path: "500",
        component: () => import("@/views/layout/components/500"),
        name: "500",
        meta: {
          title: "预案系统",
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
