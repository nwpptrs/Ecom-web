<script setup>
import { computed, ref, watch } from "vue";
import { useAuthStore } from "../store/auth";
import {
  ChevronDownIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/vue/24/solid";
import { useToast } from "vue-toastification";
import debounce from "lodash/debounce";
import { useRoute } from "vue-router";

const store = useAuthStore();
const cart = computed(() => store.carts);
const user = computed(() => store.user);
const isOpen = ref(false);
const logout = store.logout;
const toast = useToast();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const profileImageUrl = computed(() => store.user?.pictureUrl || "");

const getProduct = store.getProduct;
const actionSearchFilter = store.actionSearchFilter;

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (val) => (store.searchQuery = val),
});

const showSearchBar = computed(() => route.path === "/shop");

const debouncedSearch = debounce(() => {
  if (!showSearchBar.value) return;

  const search = store.searchQuery.trim();
  const categoryId = [...store.selectedCategories];
  const priceRange = [...store.priceSelected];

  const isDefault =
    !search &&
    categoryId.length === 0 &&
    priceRange[0] === 0 &&
    priceRange[1] === store.maxPrice;

  if (isDefault) {
    getProduct();
  } else {
    actionSearchFilter({ search, categoryId, priceRange });
  }
}, 300);

watch(searchQuery, debouncedSearch);

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath === "/shop" && newPath !== "/shop") {
      store.resetFilters();
    }
    isOpen.value = false;
  }
);

const handleLogout = () => {
  logout();
  toast.error("ออกจากระบบแล้ว");
  store.searchQuery = "";
};
</script>

<template>
  <nav class="border-b border-gray-300">
    <div class="mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-gray-700 cursor-pointer"
        >
          <Bars3Icon class="w-8" />
        </button>

        <div class="hidden md:flex gap-5 items-center">
          <router-link to="/" class="text-2xl font-bold">
            <img src="../../public/logo.png" alt="logo" class="w-32" />
          </router-link>

          <router-link
            to="/"
            exact-active-class="text-red-500"
            class="whitespace-nowrap transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:text-red-400 hover:scale-105"
            >หน้าแรก</router-link
          >
          <router-link
            to="/shop"
            exact-active-class="text-red-500"
            class="whitespace-nowrap transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:text-red-400 hover:scale-105"
            >ร้านค้า</router-link
          >
          <router-link
            to="/cart"
            exact-active-class="text-red-500"
            class="whitespace-nowrap transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:text-red-400 hover:scale-105"
          >
            <div class="relative">
              ตะกร้าสินค้า
              <span
                v-if="cart.length > 0"
                class="absolute -top-2 -right-5 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
                >{{ cart.length }}</span
              >
            </div>
          </router-link>
        </div>
        <div v-if="showSearchBar" class="ml-2 lg:pr-30 pt-3 relative">
          <MagnifyingGlassIcon
            class="w-5.5 absolute top-5.5 left-2 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาสินค้า"
            class="px-10 py-2 mb-4 rounded-full border border-gray-400 w-40 md:w-50 lg:w-full"
          />
        </div>
        <div v-if="user" class="flex items-center">
          <div class="flex border rounded-full px-2 py-1 gap-2 items-center">
            <div class="hidden lg:flex">
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
              class="absolute top-6 mt-9 right-2 bg-white rounded-xl p-2 border border-gray-300 text-center z-50"
            >
              <div class="font-semibold flex lg:hidden px-3 py-1 mb-1">
                <p>{{ user.email }}</p>
              </div>
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
                  ออกจากระบบ
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-else class="flex gap-5 items-center">
          <router-link
            to="/register"
            exact-active-class="text-red-500"
            class="transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:text-red-400 hover:scale-105"
            >สมัครสมาชิก</router-link
          >
          <router-link
            to="/login"
            exact-active-class="text-red-500"
            class="transition-all duration-300 ease-in-out px-3 py-1 rounded-lg hover:text-red-400 hover:scale-105"
            >เข้าสู่ระบบ</router-link
          >
        </div>
      </div>
    </div>
  </nav>

  <!-- Backdrop -->
  <div
    v-if="isMobileMenuOpen"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="toggleMobileMenu"
  ></div>

  <!-- Sidebar -->
  <div
    class="fixed top-0 left-0 h-full w-64 bg-white z-50 p-5 transition-transform duration-300 md:hidden"
    :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex justify-between items-center mb-4">
      <img src="../../public/logo.png" alt="logo" class="w-24" />
      <button @click="toggleMobileMenu" class="text-gray-600 text-xl">✕</button>
    </div>

    <nav>
      <div class="flex flex-col gap-3">
        <router-link
          to="/"
          class="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
          @click="toggleMobileMenu"
        >
          หน้าแรก
        </router-link>
        <router-link
          to="/shop"
          class="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
          @click="toggleMobileMenu"
        >
          ร้านค้า
        </router-link>
        <router-link
          to="/cart"
          class="text-gray-700 py-2 px-3 rounded hover:bg-gray-100"
          @click="toggleMobileMenu"
        >
          <div class="relative">
            ตะกร้าสินค้า
            <span
              v-if="cart.length > 0"
              class="absolute -top-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
              >{{ cart.length }}</span
            >
          </div>
        </router-link>
      </div>
    </nav>
  </div>
</template>
