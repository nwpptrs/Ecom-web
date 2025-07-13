<script setup>
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});
console.log(props);
</script>

<template>
  <div
    class="border p-6 rounded-xl shadow-sm border-gray-200 h-full flex flex-col justify-between"
  >
    <div class="text-sm text-gray-700 mb-3">“{{ review.comment }}”</div>
    <div class="flex items-center justify-between mt-auto">
      <div class="text-xs text-gray-500">โดย: {{ review.user.email }}</div>
      <div>
        <span v-for="i in 5" :key="i">
          <span
            :class="
              i <= review.rating ? 'text-yellow-400 text-sm' : 'text-gray-300'
            "
            >★
          </span>
        </span>
      </div>
    </div>
    <div class="flex gap-3 mt-4">
      <div
        v-for="(item, index) in review.order.products"
        :key="index"
        class="flex flex-col items-center"
      >
        <router-link :to="`/product/${item.product.id}`">
          <img
            :src="item.product.images[0].url"
            class="w-15 h-15 object-contain rounded"
            loading="lazy"
          />
        </router-link>
        <div class="text-xs text-center">{{ item.product.title }}</div>
      </div>
    </div>
  </div>
</template>
