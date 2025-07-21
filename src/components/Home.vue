<script setup>
import { onMounted, ref } from "vue";
import BestSeller from "./home/BestSeller.vue";
import Reviews from "./home/Reviews.vue";
import { productBy } from "../api/product";
import { listReviews } from "../api/user";
import { useAuthStore } from "../store/auth";

const store = useAuthStore();
const getProduct = store.getProduct;
const getCategory = store.getCategory;
const bestSellerProducts = ref([]);
const reviews = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res1 = await productBy({ sort: "sold", order: "desc", limit: 5 });
    bestSellerProducts.value = res1.data.products;

    const res2 = await listReviews();
    reviews.value = res2.data;
    getProduct();
    getCategory();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white"
  >
    <lottie-player
      src="/Loading-Cat.json"
      background="transparent"
      speed="1"
      style="width: 150px; height: 150px; margin: 0 auto"
      loop
      autoplay
    ></lottie-player>
  </div>
  <div v-else>
    <BestSeller :products="bestSellerProducts" />
    <Reviews :reviews="reviews" />
  </div>
</template>
