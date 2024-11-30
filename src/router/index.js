import store from "@/store";
import CartPage from "@/views/CartPage.vue";
import ContactPage from "@/views/ContactPage.vue";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ManageFurniture from "@/views/ManageFurniture.vue";
import ProductPage from "@/views/ProductPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import BlogDetailPage from "../views/BlogDetailPage.vue";
import BlogPage from "../views/BlogPage.vue";
import ManageDelivery from "../views/ManageDeliveryPage.vue";
import ManageBannedWords from "../views/ManageBannedWords.vue";
import ResetPasswordPage from "../views/ResetPasswordPage.vue";
import ImportHistory from "../views/ImportHistoryPage.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/contact", component: ContactPage },
  { path: "/cart", component: CartPage },
  { path: "/profile", component: ProfilePage },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: () => import("@/views/ProductDetailPage.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error404",
    component: () => import("@/views/404Error.vue"),
  },
  {
    path: "/blog",
    name: "BlogPage",
    component: BlogPage,
  },
  {
    path: "/reset-password/:token",
    name: "ResetPassword",
    component: ResetPasswordPage,
  },
  
  {
    path: "/blog/:id",
    name: "BlogDetailPage",
    component: BlogDetailPage,
  },
  {
    path: "/product",
    name: "ProductPage",
    component: ProductPage,
    props: true,
  },
  {
    path: "/manage-delivery",
    name: "ManageDelivery",
    component: ManageDelivery,
    meta: { requiresAuth: true, roles: ["shipper"] },
  },
  {
    path: "/orders",
    name: "OrderHistory",
    component: () => import("../views/OrderHistoryPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin-board",
    name: "AdminBoardPage",
    component: () => import("../views/AdminBoardPage.vue"),
    meta: { requiresAuth: true, roles: ["admin", "employee"] },
  },
  {
    path: "/manage-orders",
    name: "ManageOrderPage",
    component: () => import("../views/ManageOrderPage.vue"),
    meta: { requiresAuth: true, roles: ["admin", "employee"] },
  },
  {
    path: "/manage-employee",
    name: "ManageEmployeesPage",
    component: () => import("../views/ManageEmployeesPage.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/manage-blog",
    name: "ManageBlogPage",
    component: () => import("../views/ManageBlogPage.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/manage-testimonials",
    name: "ManageTestimonials",
    component: () => import("../views/ManageTestmonialsPage.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/manage-carousel",
    name: "ManageCarousel",
    component: () => import("../views/ManageCarouselPage.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/about",
    name: "AboutUsPage",
    component: () => import("../views/AboutUsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "AboutUsPage",
    component: () => import("../views/AboutUsPage.vue"),
  },
  {
    path: "/manage-inventory",
    name: "ManageInventory",
    component: () => import("../views/ManageInventoryPage.vue"),
    meta: { requiresAuth: true, roles: ["admin", "employee"] },
  },
  {
    path: "/manage-hidden-furniture",
    name: "ManageHiddenFurniture",
    component: () => import("@/views/ManageHiddenFurniture.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/manage-furniture",
    component: ManageFurniture,
    meta: { requiresAuth: true, roles: ["admin", "employee"] },
  },
  {
    path:  "/manage-banned-words",
    component: ManageBannedWords,
    meta: { requiresAuth: true, roles: ["admin", "employee"] },
  },
  {
    path:  "/import-history",
    component: ImportHistory,
    meta: { requiresAuth: true, roles: ["admin", "employee"] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" }; // Cuộn về đầu trang
  }

});

// Kiểm tra quyền truy cập trước khi vào route
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  let user = store.state.user;

  // Kiểm tra nếu chưa có user trong Vuex store, tải lại từ token
  if (!user && token) {
    await store.dispatch("loadUserFromToken");
    user = store.state.user;
  }

  if (to.meta.requiresAuth) {
    if (!user) {
      // Nếu không có user, chuyển đến trang đăng nhập
      return next("/login");
    }

    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      // Nếu user không có quyền truy cập vào trang
      return next("/login");
    }
  }

  next();
});

export default router;
