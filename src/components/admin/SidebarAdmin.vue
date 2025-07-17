<script setup>
import {
  ClipboardIcon,
  CogIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
} from "@heroicons/vue/24/solid";
</script>
<template>
  <div class="bg-gray-700 w-64 text-white flex flex-col h-screen">
    <div
      class="h-24 bg-gray-800 text-white flex items-center justify-center font-bold text-2xl"
    >
      ระบบแอดมิน
    </div>
    <nav class="flex-1 px-4 py-4 space-y-2">
      <router-link
        exact
        to="/admin"
        class="flex items-center gap-2 p-2 rounded-md transition font-semibold hover:bg-white hover:text-black"
        exact-active-class="bg-white text-black font-semibold"
      >
        <ClipboardIcon class="w-6 h-6" />
        <span>แดชบอร์ด</span>
      </router-link>
      <router-link
        to="/admin/manage"
        class="flex items-center gap-2 p-2 rounded-md transition font-semibold hover:bg-white hover:text-black"
        exact-active-class="bg-white text-black font-semibold"
      >
        <CogIcon class="w-6 h-6" />
        <span>จัดการผู้ใช้งาน</span>
      </router-link>
      <router-link
        to="/admin/category"
        class="flex items-center gap-2 p-2 rounded-md transition font-semibold hover:bg-white hover:text-black"
        exact-active-class="bg-white text-black font-semibold"
      >
        <SquaresPlusIcon class="w-6 h-6" />
        <span>จัดการหมวดหมู่</span>
      </router-link>
      <router-link
        to="/admin/product"
        class="flex items-center gap-2 p-2 rounded-md transition font-semibold hover:bg-white hover:text-black"
        exact-active-class="bg-white text-black font-semibold"
      >
        <ShoppingCartIcon class="w-6 h-6" />
        <span>จัดการสินค้า</span>
      </router-link>
      <router-link
        to="/admin/orders"
        class="flex items-center gap-2 p-2 rounded-md transition font-semibold hover:bg-white hover:text-black"
        exact-active-class="bg-white text-black font-semibold"
      >
        <ShoppingCartIcon class="w-6 h-6" />
        <span>จัดการออเดอร์</span>
      </router-link>
    </nav>
  </div>
</template>
