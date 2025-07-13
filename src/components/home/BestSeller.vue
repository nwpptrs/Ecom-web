<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import SwiperProduct from "../../components/card/SwiperProduct.vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="p-5">
    <div class="text-2xl mb-4">สินค้าขายดี</div>

    <Swiper
      v-if="products.length"
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="4"
      :space-between="20"
      :loop="true"
      :autoplay="{ delay: 2500, disableOnInteraction: false }"
      :breakpoints="{
        '320': { slidesPerView: 1 },
        '640': { slidesPerView: 2 },
        '768': { slidesPerView: 3 },
        '1024': { slidesPerView: 4 },
        '2560': { slidesPerView: 5 },
      }"
      class="w-full"
    >
      <SwiperSlide v-for="product in products" :key="product.id" class="h-auto">
        <SwiperProduct :product="product" />
      </SwiperSlide>
    </Swiper>

    <div v-else class="text-gray-500">ไม่มีสินค้าขายดีในขณะนี้</div>
  </div>
</template>
