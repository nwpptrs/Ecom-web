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
  <div class="flex h-screen">
    <aside
      class="w-1/6 bg-white p-4 overflow-y-auto mt-2 rounded-xl shadow-lg border border-gray-300 pr-9"
    >
      <SearchCard />
    </aside>
    <main class="flex-1 p-4 overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">สินค้าทั้งหมด</h2>
      <div>
        <ProductCard :products="products" />
      </div>
    </main>
    <aside
      class="w-1/4 bg-white p-4 overflow-y-auto mt-2 rounded-xl shadow-lg border border-gray-300"
    >
      <h2 class="text-lg font-semibold mb-4">ตะกร้าสินค้า</h2>
      <CartCard />
    </aside>
  </div>
</template>
