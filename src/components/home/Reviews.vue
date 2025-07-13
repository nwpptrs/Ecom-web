<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import ReviewCard from "../card/ReviewsCard.vue";

const props = defineProps({
  reviews: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="p-5">
    <div class="text-2xl mb-4">รีวิวจากลูกค้า</div>

    <Swiper
      v-if="reviews.length"
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="3"
      :space-between="20"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :breakpoints="{
        '320': { slidesPerView: 1 },
        '640': { slidesPerView: 2 },
        '1024': { slidesPerView: 3 },
        '1440': { slidesPerView: 4 },
      }"
      class="w-full"
    >
      <SwiperSlide v-for="review in reviews" :key="review.id" class="h-auto">
        <ReviewCard :review="review" />
      </SwiperSlide>
    </Swiper>

    <div v-else class="text-gray-500">ยังไม่มีรีวิวจากลูกค้า</div>
  </div>
</template>
