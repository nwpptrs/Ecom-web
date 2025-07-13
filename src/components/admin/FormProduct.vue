<script setup>
import { onMounted, computed, reactive } from "vue";
import { createProduct, removeProduct } from "../../api/product";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../../store/auth";
import Uploadfile from "./Uploadfile.vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { formatCurrencyTHB, formatDate } from "../../utils/format";

const toast = useToast();
const auth = useAuthStore();
const token = auth.token;
const categories = computed(() => auth.categories);
const getProduct = auth.getProduct;
const products = computed(() => auth.products);

const initialstate = {
  title: "",
  description: "",
  price: "",
  quantity: "",
  categoryId: "",
  images: [],
};

const form = reactive({ ...initialstate });

const onSubmit = async () => {
  try {
    const res = await createProduct(token, form);
    console.log(res);
    toast.success(`Add Product ${res.data.product.title} Success`);
    await getProduct();
    Object.assign(form, initialstate);
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg);
  }
};
const handleRemove = async (id) => {
  try {
    const res = await removeProduct(token, id);
    toast.success(`Delete Product ${res.data.product.title} Success`);
    await getProduct();
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg);
  }
};

onMounted(() => {
  getProduct(20);
});
</script>
<template>
  <div
    class="max-w-screen-2xl mx-auto px-6 py-8 space-y-10 bg-white rounded-2xl"
  >
    <div
      class="text-md font-semibold p-4 flex items-center justify-center flex-col shadow border rounded-2xl"
    >
      <h1 class="text-xl font-semibold mb-2">Product Management</h1>
      <form @submit.prevent="onSubmit" class="my-4 flex-col flex gap-2">
        <input
          v-model="form.title"
          placeholder="Name Product"
          type="text"
          class="border p-1 rounded"
          name="title"
          required
        />
        <input
          v-model="form.description"
          placeholder="Description"
          type="text"
          class="border p-1 rounded"
          name="description"
        />
        <input
          v-model="form.price"
          placeholder="Price"
          type="number"
          class="border p-1 rounded"
          name="price"
          required
        />
        <input
          v-model="form.quantity"
          placeholder="Quantity"
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
          Add Product
        </button>
      </form>
    </div>
    <div class="container mx-auto px-4 py-6 shadow border rounded-2xl bg-white">
      <h1 class="text-2xl font-semibold mb-6">Product List</h1>

      <table
        class="min-w-full bg-white border border-gray-200 rounded overflow-hidden"
      >
        <thead class="bg-gray-100 text-gray-700 text-left font-bold">
          <tr>
            <th class="p-3 border-b">No.</th>
            <th class="p-3 border-b">Picture</th>
            <th class="p-3 border-b">Title</th>
            <th class="p-3 border-b">Price</th>
            <th class="p-3 border-b">Quantity</th>
            <th class="p-3 border-b">Category</th>
            <th class="p-3 border-b">Sold</th>
            <th class="p-3 border-b">Update At</th>
            <th class="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in products"
            :key="product.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="p-3 border-b font-bold">{{ index + 1 }}</td>
            <td class="p-3 border-b">
              <img
                v-if="product.images.length"
                :src="product.images[0].url"
                alt="Product Image"
                class="w-16 h-16 object-cover rounded"
              />
              <span v-else class="text-gray-400">No image</span>
            </td>
            <td class="p-3 border-b font-medium">{{ product.title }}</td>
            <td class="p-3 border-b text-green-600 font-semibold">
              ฿ {{ formatCurrencyTHB(product.price) }}
            </td>
            <td class="p-3 border-b">{{ product.quantity }}</td>
            <td class="p-3 border-b">{{ product.category?.name || "-" }}</td>
            <td class="p-3 border-b">{{ product.sold }}</td>
            <td class="p-3 border-b">{{ formatDate(product.updatedAt) }}</td>
            <td class="p-3 border-b text-center">
              <router-link
                :to="`/admin/product/${product.id}`"
                class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 inline-flex items-center justify-center m-1"
              >
                <PencilSquareIcon class="w-5 h-5" />
              </router-link>

              <button
                @click="handleRemove(product.id)"
                class="bg-red-500 cursor-pointer text-white p-2 rounded-full hover:bg-red-600 inline-flex items-center justify-center"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="products.length === 0" class="text-center text-gray-500 mt-4">
      No products found.
    </div>
  </div>
</template>
