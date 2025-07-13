<script setup>
import { ref, onMounted, computed } from "vue";
import { createCategory, removeCategory } from "../../api/category";
import { useAuthStore } from "../../store/auth";
import { useToast } from "vue-toastification";

const toast = useToast();
const auth = useAuthStore();
const name = ref("");
const category = computed(() => auth.categories);
const getCategory = auth.getCategory;

const onSubmit = async () => {
  if (!name.value) {
    return toast.warning("Please Fill Data!!");
  }

  try {
    const res = await createCategory(auth.token, { name: name.value });
    toast.success(`Add Category ${res.data.name} Success`);
    name.value = "";
    await getCategory();
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg);
  }
};

const handleRemove = async (id) => {
  try {
    const res = await removeCategory(auth.token, id);
    toast.success(`Delete Category ${res.data.name} Success`);
    await getCategory();
  } catch (error) {
    const msg = error?.response?.data?.message;
    toast.error(msg);
  }
};
onMounted(() => {
  getCategory();
});
</script>
<template>
  <div
    class="text-md font-semibold container bg-white mx-auto p-4 shadow-2xs flex items-center justify-center flex-col"
  >
    <h1>Category Management</h1>
    <form @submit.prevent="onSubmit" class="my-4">
      <input v-model="name" type="text" class="border mr-2 p-1 rounded" />
      <button class="bg-sky-300 px-4 py-1 rounded hover:bg-sky-400">
        Add Category
      </button>
    </form>
  </div>
  <div class="container mx-auto">
    <ul>
      <li
        v-for="(cat, index) in category"
        :key="cat.id"
        class="flex justify-between items-center my-2 px-5 py-1 bg-white rounded"
      >
        {{ index + 1 }} {{ cat.name }}
        <button
          @click="handleRemove(cat.id)"
          class="bg-red-300 px-4 py-1 rounded hover:bg-red-400"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>
