<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const isSubmitting = ref(false);

const form = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  if (isSubmitting.value) return; // ป้องกันการกดรัว
  isSubmitting.value = true;

  try {
    const res = await auth.login(form);
    const userEmail = auth.user.email;
    toast.success(`ยินดีต้อนรับ ${userEmail}`);
    router.push(auth.user?.role === "admin" ? "/admin" : "/");
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg || "เข้าสู่ระบบไม่สำเร็จ");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<template>
  <div class="flex items-start justify-center h-screen mx-auto mt-25 px-4">
    <div
      class="bg-gray-100 p-15 rounded-2xl shadow border border-gray-200 w-90"
    >
      <form
        @submit.prevent="onSubmit"
        class="flex flex-col items-center mx-auto"
      >
        <div class="text-2xl font-bold flex justify-center">เข้าสู่ระบบ</div>
        <div class="mb-5 mt-10">
          <input
            v-model="form.email"
            placeholder="อีเมล"
            type="email"
            id="email"
            class="rounded-xl px-3 py-2 border border-gray-400 w-80 focus:outline-none focus:border-red-700"
          />
        </div>
        <div>
          <input
            v-model="form.password"
            placeholder="รหัสผ่าน"
            type="password"
            id="password"
            class="rounded-xl px-3 py-2 border border-gray-400 w-80 focus:outline-none focus:border-red-700"
          />
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          :class="[
            'w-80 py-2 my-2 rounded-xl cursor-pointer transition-all',
            isSubmitting
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700',
          ]"
        >
          {{ isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
        </button>
      </form>
    </div>
  </div>
</template>
