<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation } from "swiper/modules";

import ReviewCard from "../card/ReviewsCard.vue";

const props = defineProps({
  reviews: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="p-5" v-if="reviews.length">
    <div class="text-2xl mb-4">รีวิวจากผู้ใช้งาน</div>

    <Swiper
      :modules="[Navigation]"
      slides-per-view="auto"
      :allowTouchMove="false"
      :loop="false"
      navigation
      :breakpoints="{
        '320': { slidesPerView: 1 },
        '640': { slidesPerView: 2 },
        '1024': { slidesPerView: 3 },
        '1440': { slidesPerView: 4 },
      }"
      class="w-full"
    >
      <SwiperSlide
        v-for="review in reviews"
        :key="review.id"
        class="h-auto px-4"
      >
        <ReviewCard :review="review" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<style scoped>
:deep(.swiper-button-prev) {
  left: -2px;
  color: red;
}

:deep(.swiper-button-next) {
  right: -2px;
  color: red;
}
</style>
