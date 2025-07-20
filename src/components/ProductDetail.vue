<script setup>
import { onMounted, computed, ref } from "vue";
import { readProduct } from "../api/product";
import { useAuthStore } from "../store/auth";
import { useRoute } from "vue-router";
import { formatCurrencyTHB } from "../utils/format";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

const auth = useAuthStore();
const route = useRoute();
const token = auth.token;
const id = route.params.id;
const product = ref(null);
const loading = ref(true);

const fetchProduct = async () => {
  try {
    const res = await readProduct(token, id);
    product.value = res.data.products;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const currentCount = computed(() => {
  const item = auth.carts.find((item) => item.id === product.value?.id);
  return item ? item.count : 0;
});

const increase = () => {
  if (product.value) auth.increment(product.value.id);
};

const decrease = () => {
  if (product.value) auth.decrement(product.value.id);
};

onMounted(fetchProduct);
</script>

<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white"
  >
    <lottie-player
      src="../../public/Loading Cat.json"
      background="transparent"
      speed="1"
      style="width: 150px; height: 150px; margin: 0 auto"
      loop
      autoplay
    ></lottie-player>
  </div>
  <div v-else class="max-w-6xl mx-auto px-4 py-10">
    <div class="mb-2">
      <ArrowLeftCircleIcon
        class="w-10 absolute top-17 left-3 cursor-pointer md:left-5"
        @click="$router.back()"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <Swiper
          :modules="[Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="10"
          :pagination="{ clickable: true, dynamicBullets: true }"
          :navigation="true"
          class="relative h-80 rounded-xl shadow border"
        >
          <SwiperSlide
            v-for="(img, index) in product.images"
            :key="index"
            class="flex items-center justify-center bg-white"
          >
            <img
              :src="img.url"
              alt="Product image"
              class="object-contain h-full w-full rounded-xl"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div class="flex flex-col justify-between space-y-6 text-gray-800">
        <div>
          <h1 class="text-3xl font-bold text-red-600">{{ product.title }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ product.category.name }}</p>
          <p class="text-base mt-4">{{ product.description }}</p>
          <p class="text-gray-500 rounded-xl text-xs">
            เหลืออยู่: {{ product.quantity }}
          </p>
          <p class="text-3xl font-bold text-red-500 mt-6">
            ฿{{ formatCurrencyTHB(product.price) }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="decrease"
            class="w-10 h-10 rounded-full border border-red-500 text-red-500 hover:bg-red-100"
          >
            -
          </button>
          <span class="text-lg font-medium">{{ currentCount }}</span>
          <button
            :disabled="product.quantity === 0"
            @click="increase"
            class="w-10 h-10 rounded-full border border-red-500 text-red-500 hover:bg-red-100"
          >
            +
          </button>
        </div>
        <router-link to="/cart">
          <button
            :disabled="product.quantity === 0"
            class="w-full text-white py-3 rounded-full transition text-lg font-semibold"
            :class="{
              'bg-gray-400': product.quantity === 0,
              'bg-red-500  hover:bg-red-700': product.quantity,
            }"
          >
            {{ product.quantity ? "ไปยังตะกร้าสินค้า" : "สินค้าหมด" }}
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
