<script setup>
import { ListBulletIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "../../store/auth";
import { createUserCart } from "../../api/user";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { formatCurrencyTHB } from "../../utils/format";
import { ref } from "vue";

const store = useAuthStore();
const token = store.token;
const cart = store.carts;
const router = useRouter();
const toast = useToast();
const isProcessing = ref(false);

const handlelistToSum = async () => {
  try {
    isProcessing.value = true;
    await createUserCart(token, { cart });
    toast.clear();
    toast.info("กำลังไปยังหน้าสรุปรายการ...");
    setTimeout(() => {
      router.push("/checkout");
    }, 3000);
  } catch (error) {
    const msg = error?.response?.data?.message;
    msg.forEach((err) => {
      toast.error(err || "เกิดข้อผิดพลาด");
    });
  }
};
</script>
<template>
  <div class="bg-gray-300 rounded mt-2 p-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- left -->
      <div class="lg:col-span-2">
        <!-- top -->
        <div class="flex gap-2 items-center">
          <ListBulletIcon class="w-6 h-6" />
          <p class="font-bold text-2xl">
            รายการสินค้า {{ cart.length }} สินค้า
          </p>
        </div>
        <div
          v-for="product in cart"
          :key="product.id"
          class="bg-white p-5 rounded-2xl my-3 flex gap-4 items-center"
        >
          <img
            v-if="product.images.length"
            :src="product.images[0].url"
            alt="Product Image"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-1">
            <h3 class="font-bold">{{ product.title }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ formatCurrencyTHB(product.price) }} x {{ product.count }}
            </p>
          </div>
          <div class="font-semibold text-red-600">
            ฿{{ formatCurrencyTHB(product.price * product.count) }}
          </div>
        </div>
      </div>
      <!-- right -->
      <div v-if="cart.length > 0" class="bg-white h-70 lg:mt-10 rounded-xl p-6">
        <div class="space-y-5">
          <div class="font-bold text-2xl my-2">ยอดรวม</div>
          <div class="flex justify-between font-semibold">
            <div>รวมสุทธิ:</div>
            <div class="text-red-600">
              ฿{{ formatCurrencyTHB(store.cartSubtotal) }}
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <button
              :disabled="isProcessing"
              @click="handlelistToSum"
              class="rounded-lg px-6 py-3 text-white w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                v-if="isProcessing"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>
                {{ isProcessing ? "กำลังสรุปรายการ" : "ดำเนินการสั่งซื้อ" }}
              </span>
            </button>

            <router-link to="shop">
              <button
                class="border border-gray-400 w-full py-2 rounded-xl hover:border-gray-600"
              >
                แก้ไขรายการ
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
