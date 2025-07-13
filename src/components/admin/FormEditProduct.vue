<script setup>
import { onMounted, computed, reactive } from "vue";
import { updateProduct, readProduct } from "../../api/product";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../store/auth";
import Uploadfile from "./Uploadfile.vue";
import { useRoute, useRouter } from "vue-router";

const toast = useToast();
const auth = useAuthStore();
const token = auth.token;
const categories = computed(() => auth.categories);
const router = useRouter();
const route = useRoute();
const id = route.params.id;

const initialstate = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const form = reactive({ ...initialstate });

const fetchProduct = async () => {
  try {
    const res = await readProduct(token, id);
    Object.assign(form, {
      title: res.data.products.title,
      description: res.data.products.description,
      price: res.data.products.price,
      quantity: res.data.products.quantity,
      categoryId: res.data.products.categoryId,
      images: res.data.products.images,
    });
  } catch (error) {
    console.log(error);
  }
};

const onSubmit = async () => {
  try {
    const res = await updateProduct(token, id, form);
    console.log(res);
    toast.success(`Update Product ${res.data.product.title} Success`);
    setTimeout(() => {
      router.push("/admin/product");
    }, 300);
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg);
  }
};

onMounted(() => {
  fetchProduct();
});
</script>
<template>
  <div
    class="text-md font-semibold container bg-white mx-auto p-4 shadow-2xs flex items-center justify-center flex-col"
  >
    <h1>Product Management</h1>
    <form @submit.prevent="onSubmit" class="my-4 flex-col flex gap-2">
      <input
        v-model="form.title"
        type="text"
        class="border p-1 rounded"
        name="title"
        required
      />
      <input
        v-model="form.description"
        type="text"
        class="border p-1 rounded"
        name="description"
      />
      <input
        v-model="form.price"
        type="number"
        class="border p-1 rounded"
        name="price"
        required
      />
      <input
        v-model="form.quantity"
        type="number"
        class="border p-1 rounded"
        name="quantity"
        required
      />
      <select
        v-model="form.categoryId"
        name="categoryId"
        class="border rounded p-1"
        required
      >
        <option value="" disabled>Please Select</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <Uploadfile v-model="form.images" />
      <button class="bg-sky-300 px-4 py-1 rounded hover:bg-sky-400">
        Update Product
      </button>
    </form>
  </div>
</template>
