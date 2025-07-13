import { useAuthStore } from "../store/auth";
import { useToast } from "vue-toastification";

export const AuthProtect = (to, from, next) => {
  const auth = useAuthStore();
  const toast = useToast();
  const token = auth.token;
  const role = auth?.user?.role;

  if ((to.name === "Login" || to.name === "Register") && token) {
    toast.info("คุณเข้าสู่ระบบอยู่แล้ว");
    return next({ name: "Home" });
  }

  if (to.meta.requiresAuth && !token) {
    toast.warning("กรุณาเข้าสู่ระบบก่อน");
    return next({ name: "Login" });
  }

  if (to.meta.role && to.meta.role !== role) {
    toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
    return next({ name: "Home" });
  }

  next();
};
