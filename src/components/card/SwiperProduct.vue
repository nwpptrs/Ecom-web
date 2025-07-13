<script setup>
import { ShoppingCartIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../store/auth";
import { formatCurrencyTHB } from "../../utils/format";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const store = useAuthStore();
const addCart = store.actionAddtoCart;
</script>

<template>
  <div class="border p-8 rounded-xl shadow-red-200 shadow-sm border-gray-200">
    <router-link :to="`/product/${product.id}`">
      <div
        class="mb-2 overflow-hidden rounded h-48 flex items-center justify-center"
      >
        <img
          v-if="product.images && product.images.length > 0"
          :src="product.images[0].url"
          class="w-full h-full object-contain hover:scale-110 transition duration-300"
          loading="lazy"
        />
        <span
          v-else
          class="flex items-center justify-center text-gray-400 text-lg"
        >
          No image
        </span>
      </div>
      <div class="py-2">
        <h3 class="font-semibold">{{ product.title }}</h3>
        <div class="flex justify-between py-2">
          <p class="text-sm text-gray-500">{{ product.description }}</p>
          <p class="text-xs font-medium text-gray-700">
            เหลืออยู่: {{ product.quantity }}
          </p>
        </div>
      </div>
    </router-link>

    <div class="flex justify-between items-center mt-4">
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
</template>
