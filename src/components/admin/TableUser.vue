<script setup>
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../store/auth";
import {
  getListUserAdmin,
  changeUserStatus,
  changeUserRole,
} from "../../api/admin";
import { onMounted, ref } from "vue";
import { formatDate } from "../../utils/format";

const store = useAuthStore();
const token = store.token;
const users = ref([]);
const tost = useToast();
const isLoading = ref(true);

const handleGetUsers = async () => {
  isLoading.value = true;
  try {
    const res = await getListUserAdmin(token);
    users.value = res.data.users;
  } catch (error) {
    tost.error("เกิดข้อผิดพลาด");
  } finally {
    isLoading.value = false;
  }
};

const handleChangeUserStatus = async (id, status) => {
  try {
    const payload = {
      id: id,
      enabled: !status,
    };
    const res = await changeUserStatus(token, payload);
    const user = res.data.user.email;
    tost.success(`เปลี่ยนสถานะ ${user} เรียบร้อย `);
    handleGetUsers();
  } catch (error) {
    tost.error(
      error.response.data.message || "เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนได้"
    );
  }
};

const handleChangeUserRole = async (id, role) => {
  try {
    const res = await changeUserRole(token, { id: id, role: role });
    const user = res.data.user.email;
    tost.clear();
    tost.success(`เปลี่ยนสิทธิ์ ${user} เรียบร้อย`);
    handleGetUsers();
  } catch (error) {
    tost.error(
      error.response.data.message || "เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนได้"
    );
  }
};

onMounted(() => {
  handleGetUsers();
});
</script>
<template>
  <div class="max-w-screen-2xl mx-auto px-6 py-8 bg-white rounded-2xl">
    <div class="container px-4 py-6 shadow border rounded-2xl">
      <h1 class="text-xl font-semibold mb-2">จัดการผู้ใช้งาน</h1>

      <table
        class="min-w-full bg-white border border-gray-200 rounded overflow-hidden"
      >
        <thead class="bg-gray-100 text-gray-700 text-left font-bold">
          <tr>
            <th class="p-3 border-b">ลำดับ</th>
            <th class="p-3 border-b">อีเมล</th>
            <th class="p-3 border-b">อัปเดตล่าสุด</th>
            <th class="p-3 border-b">สิทธิ์การใช้งาน</th>
            <th class="p-3 border-b">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="py-10 text-center text-gray-500">
              <svg
                class="animate-spin h-6 w-6 mx-auto mb-2 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              กำลังโหลดผู้ใช้งาน...
            </td>
          </tr>

          <tr v-else-if="users.length === 0">
            <td colspan="5" class="py-10 text-center text-gray-400">
              ไม่พบผู้ใช้งาน
            </td>
          </tr>
          <tr
            v-else
            v-for="(user, index) in users"
            :key="user.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="p-3 border-b font-bold">{{ index + 1 }}</td>
            <td class="p-3 border-b font-medium">{{ user.email }}</td>
            <td class="p-3 border-b">{{ formatDate(user.updatedAt) }}</td>
            <td class="p-3 border-b">
              <select
                v-model="user.role"
                @change="handleChangeUserRole(user.id, user.role)"
                class="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td
              class="p-3 border-b"
              :class="{
                'text-green-500': user.enabled,
                'text-red-500': !user.enabled,
              }"
            >
              <button
                @click="handleChangeUserStatus(user.id, user.enabled)"
                :class="[
                  'px-4 py-1 rounded-full text-sm font-semibold',
                  user.enabled
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200',
                ]"
              >
                {{ user.enabled ? "เปิดใช้งาน" : "ถูกระงับ" }}
              </button>
            </td>
            <!-- <td>
              <button @click="handleChangeUserStatus(user.id)">
                เปลี่ยนสถานะ
              </button>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
