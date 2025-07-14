<script setup>
import { ShoppingCartIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../store/auth";
import { formatCurrencyTHB } from "../../utils/format";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const store = useAuthStore();
const addCart = store.actionAddtoCart;
</script>

<template>
  <div
    v-if="products.length === 0"
    class="text-2xl text-center text-gray-500 py-10"
  >
    ไม่พบสินค้า
  </div>
  <div
    v-else
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-screen-xl mx-auto"
  >
    <div
      v-for="product in props.products"
      :key="product.id"
      class="border p-8 rounded-xl shadow-red-200 shadow-sm border-gray-200"
    >
      <router-link :to="`/product/${product.id}`">
        <div
          class="mb-2 overflow-hidden rounded h-48 flex items-center justify-center"
        >
          <img
            v-if="product.images && product.images.length > 0"
            :src="product.images[0].url"
            class="w-full h-full object-contain hover:scale-110"
          />
          <span
            v-else
            class="flex items-center justify-center text-gray-400 text-lg"
            >No image</span
          >
        </div>
        <div class="py-2">
          <h3 class="font-semibold">{{ product.title }}</h3>
          <div class="flex justify-between py-2">
            <p class="text-sm text-gray-500">{{ product.description }}</p>
            <p class="whitespace-nowrap text-xs font-medium text-gray-700">
              เหลืออยู่: {{ product.quantity }}
            </p>
          </div>
        </div>
      </router-link>
      <div class="flex justify-between items-center mt-auto">
        <p class="font-semibold text-sm text-red-600">
          ฿{{ formatCurrencyTHB(product.price) }}
        </p>
        <div v-if="product.quantity === 0" class="text-gray-500">สินค้าหมด</div>
        <button
          v-if="product.quantity"
          class="rounded bg-red-300 px-2 py-1 hover:bg-red-400 cursor-pointer"
          @click="addCart(product)"
        >
          <ShoppingCartIcon class="w-6" />
        </button>
      </div>
    </div>
  </div>
</template>
