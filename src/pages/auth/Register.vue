<script setup>
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import axios from "axios";
import { ref } from "vue";

const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

const registerSchema = z
  .object({
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องอย่างน้อย 8 ตัว"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "รหัสผ่านไม่ตรงกัน",
  });

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");

const onSubmit = handleSubmit(async (formData) => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/register`,
      payload
    );
    toast.success(res.data);
    setTimeout(() => {
      router.push("/login");
    }, 500);
  } catch (error) {
    const msg = error?.response?.data?.message || "เกิดข้อผิดพลาด";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="flex items-start justify-center h-screen mx-auto mt-25">
    <div
      class="bg-gray-100 p-15 rounded-2xl shadow border border-gray-200 w-90"
    >
      <form
        @submit.prevent="onSubmit"
        class="flex flex-col items-center mx-auto"
      >
        <div class="text-2xl font-bold flex justify-center">ลงทะเบียน</div>
        <div class="mb-5 mt-10 w-80">
          <input
            v-model="email"
            placeholder="อีเมล"
            type="email"
            class="rounded-xl px-3 py-2 border border-gray-400 w-full focus:outline-none focus:border-red-700"
          />
          <p class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div class="mb-2 w-80">
          <input
            v-model="password"
            placeholder="รหัสผ่าน (8 ตัวขึ้นไป)"
            type="password"
            class="rounded-xl px-3 py-2 border border-gray-400 w-full focus:outline-none focus:border-red-700"
          />
          <p class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div class="mb-4 w-80">
          <input
            v-model="confirmPassword"
            placeholder="ยืนยันรหัสผ่าน"
            type="password"
            class="rounded-xl px-3 py-2 border border-gray-400 w-full focus:outline-none focus:border-red-700"
          />
          <p class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting || Object.keys(errors).length > 0"
          class="bg-red-600 text-white w-80 py-2 rounded-xl transition-all hover:bg-red-700 cursor-pointer disabled:opacity-60"
        >
          {{ isSubmitting ? "กำลังสมัคร..." : "สมัครสมาชิก" }}
        </button>
      </form>
    </div>
  </div>
</template>
