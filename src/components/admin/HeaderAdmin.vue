<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../../store/auth";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";

const cart = computed(() => useAuthStore().carts);
const store = useAuthStore();
const user = computed(() => store.user);
const isOpen = ref(false);
const logout = store.logout;
const toast = useToast();

const profileImageUrl = computed(() => store.user?.pictureUrl || "");

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
const handleLogout = () => {
  logout();
  toast.error("ออกจากระบบแล้ว");
};
</script>
<template>
  <nav class="border-b border-gray-300">
    <div class="mx-auto px-4 flex justify-end">
      <div class="flex justify-between h-16">
        <div v-if="user" class="flex items-center">
          <div class="flex border rounded-full px-2 py-1 gap-2">
            <div class="flex items-center">
              <p>{{ user.email }}</p>
            </div>
            <div class="flex items-center relative">
              <div v-if="profileImageUrl">
                <img
                  :src="profileImageUrl"
                  alt="Profile"
                  class="w-8 h-8 object-cover rounded-full border"
                />
              </div>
              <div v-else>
                <UserCircleIcon class="w-8 h-8" />
              </div>
              <button class="cursor-pointer" @click="toggleDropdown">
                <ChevronDownIcon class="w-5 h-5" />
              </button>
            </div>
            <div
              v-if="isOpen"
              class="absolute mt-10 right-2 bg-white rounded-xl p-2 border border-gray-300 text-center"
            >
              <router-link to="/user/history">
                <div
                  class="bg-gray-300 px-3 py-1 rounded-xl cursor-pointer hover:bg-gray-400 mb-1"
                >
                  ประวัติการสั่งซื้อ
                </div>
              </router-link>
              <router-link to="/user/profile">
                <div
                  class="bg-blue-300 px-3 py-1 rounded-xl cursor-pointer hover:bg-blue-400 mb-1"
                >
                  แก้ไขโปรไฟล์
                </div>
              </router-link>
              <router-link to="/login">
                <div
                  class="bg-red-400 px-6 py-1 rounded-xl cursor-pointer hover:bg-red-500"
                  @click="handleLogout"
                >
                  ออกระบบ
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="!user" class="flex gap-5 items-center">
          <router-link
            to="/register"
            exact-active-class="bg-red-300"
            class="transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:bg-red-300 hover:shadow-lg hover:scale-105"
            >สมัครสมาชิก</router-link
          >
          <router-link
            to="/login"
            exact-active-class="bg-red-300"
            class="transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:bg-red-300 hover:shadow-lg hover:scale-105"
            >เข้าสู่ระบบ</router-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>
