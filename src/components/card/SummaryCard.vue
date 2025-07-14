<script setup>
import { useAuthStore } from "../../store/auth";
import { saveUserAddress, listUserCart } from "../../api/user";
import { useToast } from "vue-toastification";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { formatCurrencyTHB } from "../../utils/format";

const store = useAuthStore();
const token = store.token;
const address = ref("");
const name = ref("");
const products = ref([]);
const cartTotal = ref(0);
const savedAddress = ref(false);
const isProcessing = ref(false);
const toast = useToast();
const router = useRouter();
const isLoading = ref(true);

const handleSaveAddress = async () => {
  try {
    if (!address.value && !name.value) {
      return toast.warning("กรุณากรอกชื่อและที่อยู่");
    }
    const res = await saveUserAddress(token, {
      name: name.value,
      address: address.value,
    });
    toast.success("บันทึกเรียบร้อย");
    savedAddress.value = true;
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const handleUserCart = async () => {
  isLoading.value = true;
  try {
    const res = await listUserCart(token);
    products.value = res.data.products;
    cartTotal.value = res.data.cartTotal;
    address.value = res.data.user.address || "";
    name.value = res.data.user.name || "";
    savedAddress.value = !!res.data.user.address && res.data.user.name;
  } catch (error) {
    console.log(error);
    toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    isLoading.value = false;
  }
};

const handleProceedToPayment = () => {
  if (!savedAddress.value || isProcessing.value) return;
  isProcessing.value = true;
  toast.clear();
  toast.info("กำลังไปยังหน้าชำระเงิน...");
  setTimeout(() => {
    router.push("/user/payment");
  }, 3000);
};

onMounted(() => handleUserCart());
</script>
<template>
  <div v-if="isLoading" class="text-center py-10">
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
    กำลังโหลดข้อมูล...
  </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
    <!-- left -->
    <div
      class="h-65 bg-gray-200 rounded-xl p-4 border border-gray-400 text-center"
    >
      <div class="space-y-1">
        <h1 class="text-2xl font-bold">ที่อยู่ในการจัดส่ง</h1>
        <div class="flex w-full">
          <input
            v-model="name"
            type="text"
            name="name"
            placeholder="กรอกชื่อ"
            class="px-2 border rounded border-gray-400 font-semibold"
          />
        </div>
        <textarea
          v-model="address"
          placeholder="กรอกที่อยู่ในการจัดส่ง"
          class="w-full px-2 h-30 border rounded border-gray-400 font-semibold"
        ></textarea>
        <button
          @click="handleSaveAddress"
          class="bg-red-500 rounded-lg px-4 py-2 text-white cursor-pointer hover:bg-red-600"
        >
          บันทึกที่อยู่
        </button>
      </div>
    </div>
    <!-- right -->
    <div class="bg-gray-200 rounded-xl p-4 border border-gray-400 text-center">
      <div>
        <h1 class="text-2xl font-bold">คำสั่งซื้อของคุณ</h1>
        <div
          v-for="product in products"
          :key="product.id"
          class="flex justify-between my-4 text-left"
        >
          <div>
            <p>{{ product.product.title }}</p>
            <p>จำนวน: {{ product.count }} x {{ product.price }}</p>
          </div>
          <div class="text-red-600 font-medium">
            ฿{{ formatCurrencyTHB(product.count * product.price) }}
          </div>
        </div>
        <hr class="text-gray-400" />
        <div class="text-left my-3">
          <div class="flex justify-between">
            <div>ส่วนลด:</div>
            <div class="text-red-600 mr-1.5 font-medium">0</div>
          </div>
        </div>
        <hr class="text-gray-400" />
        <div class="text-2xl font-bold text-left my-4 flex justify-between">
          <div>ยอดรวมสุธิ:</div>
          <div class="text-red-600 font-medium">
            ฿{{ formatCurrencyTHB(cartTotal) }}
          </div>
        </div>
        <button
          :disabled="!savedAddress || isProcessing"
          @click="handleProceedToPayment"
          class="rounded-lg px-6 py-3 text-white w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            v-if="isProcessing"
            class="animate-spin h-5 w-5 text-white"
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
          <span>
            {{ isProcessing ? "กำลังดำเนินการสั่งซื้อ" : "ยืนยันคำสั่งซื้อ" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
