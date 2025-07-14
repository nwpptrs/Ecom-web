<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "../../store/auth";
import debounce from "lodash/debounce";
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";

const store = useAuthStore();
const getProduct = store.getProduct;
const actionSearchFilter = store.actionSearchFilter;

const selectedCategories = computed({
  get: () => store.selectedCategories,
  set: (val) => (store.selectedCategories = val),
});

const priceSelected = computed({
  get: () => store.priceSelected,
  set: (val) => (store.priceSelected = val),
});

const categories = computed(() => store.categories);
const getCategory = store.getCategory;

const debouncedSearch = debounce(() => {
  const search = store.searchQuery.trim();
  const categoryId = [...store.selectedCategories];
  const priceRange = [...store.priceSelected];

  const isDefault =
    !search &&
    categoryId.length === 0 &&
    priceRange[0] === 0 &&
    priceRange[1] === 30000;

  if (isDefault) {
    getProduct();
  } else {
    actionSearchFilter({ search, categoryId, priceRange });
  }
}, 300);

watch(
  [selectedCategories, priceSelected],
  () => {
    debouncedSearch();
  },
  { deep: true }
);

onMounted(() => {
  getCategory();
});

onUnmounted(() => {
  debouncedSearch.cancel();
});
</script>

<template>
  <div class="text-lg mb-2">หมวดหมู่</div>
  <div class="whitespace-nowrap flex flex-row gap-2 lg:flex-col">
    <label
      v-for="cat in categories"
      :key="cat.id"
      class="flex items-center space-x-2"
    >
      <input
        type="checkbox"
        :value="cat.id"
        v-model="selectedCategories"
        class="w-5 h-5 accent-red-300"
      />
      <span>{{ cat.name }}</span>
    </label>
  </div>
  <div class="mt-16">
    <Slider
      v-model="priceSelected"
      :min="0"
      :max="30000"
      range
      class="w-full"
    />
  </div>
</template>
