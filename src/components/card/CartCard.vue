<script setup>
import { TrashIcon } from "@heroicons/vue/24/solid";
import { ShoppingCartIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "../../store/auth";
import { computed } from "vue";
import { formatCurrencyTHB } from "../../utils/format";

const store = useAuthStore();
const cart = computed(() => store.carts);
</script>

<template>
  <!-- Cart Items -->
  <div class="space-y-3">
    <!-- Item Card -->
    <div
      v-if="!cart || cart.length === 0"
      class="text-lg text-center text-gray-500"
    >
      <div class="flex items-center justify-center gap-1 mt-5">
        <p class="text-lg">ยังไม่มีสินค้าในตะกร้า</p>
        <ShoppingCartIcon class="w-6 h-6" />
      </div>
    </div>
    <div
      v-for="product in cart"
      :key="product.id"
      class="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
    >
      <!-- Item Info Row -->
      <div class="flex justify-between items-start gap-3">
        <!-- Product Image -->
        <img
          v-if="product.images.length"
          :src="product.images[0].url"
          alt="Product Image"
          class="w-16 h-16 object-cover rounded"
        />
        <div
          v-else
          class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <span class="text-xs text-gray-400">No image</span>
        </div>

        <!-- Product Details -->
        <div class="flex-1">
          <div class="flex justify-between">
            <h3 class="font-medium">{{ product.title }}"</h3>
            <button
              class="text-red-500 hover:text-red-600 transition-colors"
              @click="store.removeFromCart(product.id)"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ product.description }}</p>
        </div>
      </div>

      <!-- Quantity & Price Row -->
      <div class="flex justify-between items-center mt-3">
        <!-- Quantity Selector -->
        <div class="flex items-center border rounded-full">
          <button
            class="px-3 py-1 text-gray-500 hover:bg-red-200 rounded-l-full"
            @click="store.decrement(product.id)"
          >
            -
          </button>
          <span class="px-2">{{ product.count }}</span>
          <button
            class="px-3 py-1 text-gray-500 hover:bg-gray-200 rounded-r-full"
            @click="store.increment(product.id)"
          >
            +
          </button>
        </div>

        <!-- Price -->
        <span class="font-bold text-red-600"
          >฿{{ formatCurrencyTHB(product.price * product.count) }}</span
        >
      </div>
    </div>
  </div>

  <!-- Order Summary -->
  <div class="mt-6 bg-gray-50 p-4 rounded-lg" v-if="cart && cart.length > 0">
    <div class="flex justify-between font-bold">
      <span>รวมทั้งหมด</span>
      <span class="text-red-600"
        >฿{{ formatCurrencyTHB(store.cartSubtotal) }}</span
      >
    </div>
  </div>

  <!-- Checkout Button -->
  <router-link to="/cart" v-if="cart && cart.length > 0">
    <button
      class="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-medium transition-colors"
    >
      ดูสินค้าในตะกร้า
    </button>
  </router-link>
</template>
