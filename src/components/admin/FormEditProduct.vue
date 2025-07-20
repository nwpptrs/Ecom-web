<script setup>
import { onMounted, computed, reactive, ref } from "vue";
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
const loading = ref(true);
const submitloading = ref(false);

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
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  submitloading.value = true;
  try {
    const res = await updateProduct(token, id, form);
    toast.success(`Update Product ${res.data.product.title} Success`);
    setTimeout(() => {
      router.push("/admin/product");
    }, 300);
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg);
  } finally {
    submitloading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>
<template>
  <div v-if="loading" class="text-center py-10">
    <svg
      class="animate-spin h-8 w-8 mx-auto text-red-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    กำลังโหลดข้อมูลสินค้า...
  </div>
  <div
    v-else
    class="text-md font-semibold container bg-white mx-auto p-4 shadow-2xs flex items-center justify-center flex-col"
  >
    <h1>แก้ไขสินค้า</h1>
    <form @submit.prevent="onSubmit" class="my-4 flex-col flex gap-2">
      <input
        v-model="form.title"
        placeholder="ชื่อสินค้า"
        type="text"
        class="border p-1 rounded"
        name="title"
        required
      />
      <input
        v-model="form.description"
        placeholder="รายละเอียด"
        type="text"
        class="border p-1 rounded"
        name="description"
      />
      <input
        v-model="form.price"
        placeholder="ราคา"
        type="number"
        class="border p-1 rounded"
        name="price"
        required
      />
      <input
        v-model="form.quantity"
        placeholder="จำนวน"
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
        <option value="" disabled>เลือกหมวดหมู่</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <Uploadfile v-model="form.images" />
      <button
        :disabled="submitloading"
        class="bg-sky-300 px-4 py-2 rounded hover:bg-sky-400 disabled:bg-gray-300"
      >
        {{ submitloading ? "กำลังอัพเดทสินค้า..." : "อัพเดทสินค้า" }}
      </button>
    </form>
  </div>
</template>
