<script setup>
import HeaderAdmin from "../components/admin/HeaderAdmin.vue";
import SidebarAdmin from "../components/admin/SidebarAdmin.vue";
</script>
<template>
  <div class="flex h-screen">
    <SidebarAdmin />
    <div class="flex-1 flex flex-col">
      <HeaderAdmin />
      <main class="flex-1 p-4 overflow-y-auto bg-gray-200">
        <router-view />
      </main>
    </div>
  </div>
</template>
