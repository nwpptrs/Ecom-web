<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import Uploadfile from "../components/admin/Uploadfile.vue";
import { useAuthStore } from "../store/auth";
import { saveUserAddress } from "../api/user";

const toast = useToast();
const auth = useAuthStore();
const isLoading = ref(false);

// local refs แยกออกจาก auth.user
const nameRef = ref("");
const addressRef = ref("");

// โหลดข้อมูลจาก auth.user ลง form ครั้งเดียว
const loadInitialForm = () => {
  nameRef.value = auth.user?.name || "";
  addressRef.value = auth.user?.address || "";
};

const profileImageUrl = computed(() => auth.user?.pictureUrl || "");

// บันทึกข้อมูลชื่อ + ที่อยู่
const onSubmit = async () => {
  try {
    const payload = {
      name: nameRef.value,
      address: addressRef.value,
    };
    await saveUserAddress(auth.token, payload);
    toast.success("อัปเดตข้อมูลผู้ใช้เรียบร้อย");

    // รีเฟรชข้อมูลผู้ใช้จาก backend
    await auth.fetchUser();
    loadInitialForm(); // sync ค่าฟอร์มให้ตรงหลังบันทึก
  } catch (err) {
    console.error(err);
    toast.error("เกิดข้อผิดพลาดในการอัปเดต");
  }
};

// โหลดข้อมูลผู้ใช้ครั้งแรกตอนเข้าหน้า
onMounted(async () => {
  isLoading.value = true;
  await auth.fetchUser();
  loadInitialForm();
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="text-center text-gray-500 py-10">
    กำลังโหลดข้อมูล...
  </div>
  <div
    v-else
    class="max-w-xl mx-auto p-6 bg-white rounded-xl shadow border border-gray-400 mt-6"
  >
    <h1 class="text-xl font-bold mb-4">โปรไฟล์ของคุณ</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- ชื่อ -->
      <input
        v-model="nameRef"
        type="text"
        placeholder="ชื่อ"
        class="border p-2 rounded w-full"
        required
      />

      <!-- ที่อยู่ -->
      <input
        v-model="addressRef"
        type="text"
        placeholder="ที่อยู่"
        class="border p-2 rounded w-full"
      />

      <!-- อัปโหลดรูป -->
      <Uploadfile :single="true" @uploaded="auth.fetchUser" />

      <!-- แสดงรูป -->
      <div v-if="profileImageUrl" class="flex justify-center">
        <img
          :src="profileImageUrl"
          alt="Profile"
          class="w-32 h-32 object-cover rounded-full border"
        />
      </div>

      <!-- ปุ่มบันทึก -->
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        บันทึกข้อมูล
      </button>
    </form>
  </div>
</template>
