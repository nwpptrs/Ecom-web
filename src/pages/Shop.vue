<script setup>
import { computed, onMounted, ref } from "vue";
import ProductCard from "../components/card/ProductCard.vue";
import SearchCard from "../components/card/SearchCard.vue";
import CartCard from "../components/card/CartCard.vue";
import { useAuthStore } from "../store/auth";

const store = useAuthStore();
const getProduct = store.getProduct;

const products = computed(() => store.products);

onMounted(() => {
  getProduct();
});
</script>
<template>
  <div class="flex flex-col lg:flex-row h-auto lg:h-screen">
    <!-- Search (หมวดหมู่) -->
    <aside
      class="w-full lg:w-1/6 bg-white p-4 overflow-y-auto mt-2 rounded-xl shadow-lg border border-gray-300 pr-9 order-1 lg:order-none"
    >
      <SearchCard />
    </aside>

    <!-- Product list -->
    <main class="w-full lg:flex-1 p-4 overflow-y-auto order-2 lg:order-none">
      <h2 class="text-xl font-bold mb-4">สินค้าทั้งหมด</h2>
      <ProductCard :products="products" />
    </main>

    <aside
      class="hidden lg:block lg:w-1/4 bg-white p-4 overflow-y-auto mt-2 rounded-xl shadow-lg border border-gray-300"
    >
      <h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2>
      <CartCard />
    </aside>
  </div>
</template>
