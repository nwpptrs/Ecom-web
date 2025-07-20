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
  <div
    class="flex flex-col h-[430px] border p-8 rounded-xl shadow-red-200 shadow-sm border-gray-200"
  >
    <router-link :to="`/product/${product.id}`" class="flex-grow flex flex-col">
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
      <div class="py-2 flex-grow flex flex-col">
        <div class="flex justify-between py-2">
          <div class="font-semibold line-clamp-2">{{ product.title }}</div>
          <p class="text-nowrap text-xs font-medium text-gray-700 pt-1">
            เหลืออยู่: {{ product.quantity }}
          </p>
        </div>
        <div class="py-2">
          <p class="text-sm text-gray-500 line-clamp-2">
            {{ product.description }}
          </p>
        </div>
      </div>
    </router-link>

    <!-- ปุ่มและราคาด้านล่าง -->
    <div class="flex justify-between items-center pt-4 mt-auto">
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
