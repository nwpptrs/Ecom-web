<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../store/auth";
import { getOrdersAdmin, changeOrdersStatus } from "../../api/admin";
import { formatCurrencyTHB } from "../../utils/format";

const store = useAuthStore();
const token = store.token;
const orders = ref([]);
const showProductModal = ref(false);
const selectedProducts = ref([]);

const openProductModal = (products) => {
  selectedProducts.value = products;
  showProductModal.value = true;
};

const handleGetOrders = async () => {
  try {
    const res = await getOrdersAdmin(token);
    orders.value = res.data;
    console.log(orders);
  } catch (error) {
    console.log(error);
  }
};

const handleChangeStatus = async (orderId, status) => {
  try {
    const res = await changeOrdersStatus(token, orderId, status);
    handleGetOrders();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  handleGetOrders();
});
</script>
<template>
  <div
    class="text-md container bg-white mx-auto p-4 shadow-2xs flex items-center justify-center flex-col max-w-screen-2xl rounded-2xl"
  >
    <div class="container mx-auto px-4 py-6 border rounded-2xl">
      <h1 class="text-2xl font-semibold mb-4">รายการสั่งซื้อ</h1>
      <div>
        <table
          class="min-w-full bg-white border border-gray-200 rounded shadow"
        >
          <thead class="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th class="p-3 border-b">ลำดับ</th>
              <th class="p-3 border-b">อีเมลผู้ใช้</th>
              <th class="p-3 border-b">ที่อยู่</th>
              <th class="p-3 border-b">สินค้า</th>
              <th class="p-3 border-b">ทั้งหมด</th>
              <th class="p-3 border-b">สถานะ</th>
              <th class="p-3 border-b text-center">อัปเดต สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, index) in orders"
              :key="order.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="p-3 border-b font-bold">{{ index + 1 }}</td>
              <td class="p-3 border-b font-semibold">
                {{ order.orderedBy.email }}
              </td>
              <td class="p-3 border-b font-semibold">
                {{ order.address }}
              </td>
              <td class="p-3 border-b text-sm">
                <button
                  class="text-blue-600 cursor-pointer"
                  @click="openProductModal(order.products)"
                >
                  ดูสินค้า ({{ order.products.length }})
                </button>
              </td>

              <td class="p-3 border-b font-semibold whitespace-nowrap">
                ฿ {{ formatCurrencyTHB(order.cartTotal) }}
              </td>
              <td class="p-3 border-b">
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium text-white whitespace-nowrap"
                  :class="{
                    'bg-gray-500': order.orderStatus === 'รอดำเนินการ',
                    'bg-blue-500': order.orderStatus === 'กำลังดำเนินการ',
                    'bg-green-500': order.orderStatus === 'เสร็จสิ้น',
                    'bg-red-500': order.orderStatus === 'ยกเลิก',
                  }"
                >
                  {{ order.orderStatus }}
                </span>
              </td>

              <td class="p-3 border-b text-center">
                <select
                  :value="order.orderStatus"
                  @change="handleChangeStatus(order.id, $event.target.value)"
                >
                  <option>รอดำเนินการ</option>
                  <option>กำลังดำเนินการ</option>
                  <option>เสร็จสิ้น</option>
                  <option>ยกเลิก</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div>
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">รายการสินค้า</h2>
          <button
            @click="showProductModal = false"
            class="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>
        <ul class="space-y-2 max-h-[300px] overflow-y-auto">
          <li
            v-for="item in selectedProducts"
            :key="item.id"
            class="text-sm border-b pb-2"
          >
            {{ item.product.title }}<br />
            <span class="text-gray-600">
              {{ item.count }} x {{ formatCurrencyTHB(item.price) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
