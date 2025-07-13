import { createRouter, createWebHistory } from "vue-router";
import { AuthProtect } from "./AuthProtect";
import Home from "../pages/Home.vue";
import Shop from "../pages/Shop.vue";
import Cart from "../pages/Cart.vue";
import ProductDetail from "../components/ProductDetail.vue";
//auth
import Login from "../pages/auth/Login.vue";
import Register from "../pages/auth/Register.vue";
//admin
import Dashboard from "../pages/admin/Dashboard.vue";
import Category from "../pages/admin/Category.vue";
import Product from "../pages/admin/Product.vue";
import EditProduct from "../pages/admin/EditProduct.vue";
import Manage from "../pages/admin/Manage.vue";
import ManageOrder from "../pages/admin/ManageOrder.vue";
//user
import HomeUser from "../pages/user/HomeUser.vue";
import History from "../pages/user/History.vue";
import Checkout from "../pages/Checkout.vue";
import Payment from "../pages/user/Payment.vue";
import Profile from "../pages/user/Profile.vue";
//Layout
import Layout from "../Layouts/Layout.vue";
import LayoutAdmin from "../Layouts/LayoutAdmin.vue";
import LayoutUser from "../Layouts/LayoutUser.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: "shop",
        name: "Shop",
        component: Shop,
        meta: { requiresAuth: true },
      },
      {
        path: "product/:id",
        name: "ProductDetail",
        component: ProductDetail,
        meta: { requiresAuth: true },
      },

      {
        path: "cart",
        name: "Cart",
        component: Cart,
        meta: { requiresAuth: true },
      },
      {
        path: "checkout",
        name: "Checkout",
        component: Checkout,
        meta: { requiresAuth: true },
      },
      {
        path: "login",
        name: "Login",
        component: Login,
      },
      {
        path: "register",
        name: "Register",
        component: Register,
      },
    ],
  },
  {
    path: "/admin",
    component: LayoutAdmin,
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: Dashboard,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "category",
        name: "Category",
        component: Category,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "product",
        name: "Product",
        component: Product,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "product/:id",
        name: "ProductEdit",
        component: EditProduct,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "manage",
        name: "Manage",
        component: Manage,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "orders",
        name: "Orders",
        component: ManageOrder,
        meta: { requiresAuth: true, role: "admin" },
      },
    ],
  },
  {
    path: "/user",
    component: LayoutUser,
    children: [
      {
        path: "",
        name: "HomeUser",
        component: HomeUser,
      },
      {
        path: "payment",
        name: "Payment",
        component: Payment,
        meta: { requiresAuth: true },
      },
      {
        path: "history",
        name: "History",
        component: History,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(AuthProtect);
export default router;
