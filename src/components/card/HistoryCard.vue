<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../store/auth";
import { listUserOrder, createUserReview } from "../../api/user";
import { formatCurrencyTHB, formatDate } from "../../utils/format";
import { useToast } from "vue-toastification";

const store = useAuthStore();
const token = store.token;
const toast = useToast();

const orders = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const showModal = ref(false);
const selectedOrderId = ref(null);
const comment = ref("");
const rating = ref(5);

const setRating = (num) => {
  rating.value = num;
};

const handleGetOrder = async () => {
  isLoading.value = true;
  try {
    const res = await listUserOrder(token);
    orders.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const openReviewModal = (orderId) => {
  selectedOrderId.value = orderId;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrderId.value = null;
  rating.value = 5;
  comment.value = "";
};

const handleSubmitReview = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const res = await createUserReview(token, {
      orderId: selectedOrderId.value,
      rating: rating.value,
      comment: comment.value,
    });
    toast.success(res.data.message);
    await handleGetOrder();
    closeModal();
  } catch (err) {
    console.log(err);
    const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการส่งรีวิว";
    toast.error(msg);
  }
};

onMounted(() => {
  handleGetOrder();
});
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center text-gray-500 py-10">
      กำลังโหลดข้อมูล...
    </div>

    <!-- No Orders -->
    <div v-else-if="!orders.length" class="text-2xl font-light text-gray-700">
      ยังไม่เคยมีประวัติการสั่งซื้อ!!
    </div>

    <!-- Orders List -->
    <div v-else>
      <h1 class="text-2xl font-bold mb-6">ประวัติการสั่งซื้อ</h1>
      <div
        v-for="item in orders"
        :key="item.id"
        class="bg-white p-6 rounded-2xl shadow border mb-6"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-sm text-gray-500">สั่งซื้อวันที่</p>
            <p class="font-medium text-gray-700">
              {{ formatDate(item.createdAt.toLocaleString()) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="item.orderStatus === 'เสร็จสิ้น' && !item.review"
              @click="openReviewModal(item.id)"
              class="bg-yellow-500 px-2 py-1 rounded-full text-white text-sm font-medium cursor-pointer"
            >
              รีวิวการสั่งซื้อ
            </button>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium text-white"
              :class="{
                'bg-gray-500': item.orderStatus === 'รอดำเนินการ',
                'bg-blue-500': item.orderStatus === 'กำลังดำเนินการ',
                'bg-green-500': item.orderStatus === 'เสร็จสิ้น',
                'bg-red-500': item.orderStatus === 'ยกเลิก',
              }"
            >
              {{ item.orderStatus }}
            </span>
          </div>
        </div>

        <!-- Table -->
        <table class="w-full text-sm text-left border-t border-gray-200">
          <thead class="bg-gray-50 text-gray-600 uppercase">
            <tr>
              <th class="py-2">สินค้า</th>
              <th class="py-2">ราคา</th>
              <th class="py-2">จำนวน</th>
              <th class="py-2">ทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in item.products"
              :key="p.id"
              class="border-t border-gray-200"
            >
              <td class="py-2">{{ p.product.title }}</td>
              <td class="py-2">{{ formatCurrencyTHB(p.product.price) }}</td>
              <td class="py-2">{{ p.count }}</td>
              <td class="py-2">
                {{ formatCurrencyTHB(p.count * p.product.price) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Summary -->
        <div class="text-right mt-4">
          <p class="text-gray-500 text-sm">ราคารวมทั้งหมด</p>
          <p class="text-lg font-semibold text-gray-800">
            ฿ {{ formatCurrencyTHB(item.cartTotal) }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative border"
    >
      <h2 class="text-xl font-bold mb-4">รีวิวการสั่งซื้อ</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >ให้คะแนน</label
          >
          <div>
            <button
              v-for="num in 5"
              :key="num"
              @click="setRating(num)"
              class="mx-1 px-3 py-1 rounded-full border"
              :class="rating === num ? 'bg-blue-500 text-white' : ''"
            >
              {{ num }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >ความคิดเห็น</label
          >
          <textarea
            v-model="comment"
            rows="3"
            class="mt-1 w-full border rounded px-3 py-2"
          ></textarea>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-2">
        <button
          class="px-6 py-2 border rounded-full text-gray-600 hover:bg-gray-100"
          @click="closeModal"
        >
          ยกเลิก
        </button>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
          @click="handleSubmitReview"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">กำลังส่ง...</span>
          <span v-else>ส่งรีวิว</span>
        </button>
      </div>
    </div>
  </div>
</template>
