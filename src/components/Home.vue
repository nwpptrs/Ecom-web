<script setup>
import { onMounted, ref } from "vue";
import BestSeller from "./home/BestSeller.vue";
import Reviews from "./home/Reviews.vue";
import { productBy } from "../api/product";
import { listReviews } from "../api/user";

const bestSellerProducts = ref([]);
const reviews = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [res1, res2] = await Promise.all([
      productBy({ sort: "sold", order: "desc", limit: 5 }),
      listReviews(),
    ]);
    bestSellerProducts.value = res1.data.products;
    reviews.value = res2.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="text-center text-gray-500 py-10">
    กำลังโหลดข้อมูล...
  </div>
  <template v-else>
    <BestSeller :products="bestSellerProducts" />
    <Reviews :reviews="reviews" />
  </template>
</template>
