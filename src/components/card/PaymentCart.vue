<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { payment } from "../../api/stripe";
import { saveUserOrder } from "../../api/user";
import { useAuthStore } from "../../store/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const stripePromise = loadStripe(
  "pk_test_51Rev7ZP1n33Sc3pvO2HVImKH9eR09VWRH1nctVonk9bzrixBueo0DXVPXzGClTaCayNkEWhrPIZrh30v2rm8wvlm00SRbeF76f"
);

const store = useAuthStore();
const token = store.token;
const toast = useToast();
const router = useRouter();
const clearCart = store.clearCart;

let stripe, elements, cardNumber, cardExpiry, cardCvc;

const errorMessage = ref("");
const loading = ref(false);
const country = ref("TH");

onMounted(async () => {
  stripe = await stripePromise;
  elements = stripe.elements();

  cardNumber = elements.create("cardNumber");
  cardExpiry = elements.create("cardExpiry");
  cardCvc = elements.create("cardCvc");

  cardNumber.mount("#card-number");
  cardExpiry.mount("#card-expiry");
  cardCvc.mount("#card-cvc");

  const onChange = (event) => {
    errorMessage.value = event.error?.message || "";
  };

  cardNumber.on("change", onChange);
  cardExpiry.on("change", onChange);
  cardCvc.on("change", onChange);
});

onBeforeUnmount(() => {
  cardNumber?.destroy();
  cardExpiry?.destroy();
  cardCvc?.destroy();
});

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  errorMessage.value = "";

  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card: cardNumber,
    billing_details: {
      address: {
        country: country.value,
      },
    },
  });

  if (error) {
    errorMessage.value = error.message;
    loading.value = false;
    return;
  }

  try {
    const response = await payment(token);
    const clientSecret = response.data.clientSecret;

    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    if (confirmError) {
      errorMessage.value = confirmError.message;
    } else if (paymentIntent.status === "succeeded") {
      await saveUserOrder(token, paymentIntent);
      clearCart();
      toast.success("ชำระเงินสำเร็จ");
      setTimeout(() => router.push("/user/history"), 1500);
    } else {
      errorMessage.value = "เกิดข้อผิดพลาดในการชำระเงิน";
    }
  } catch (err) {
    errorMessage.value = "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
  >
    <div class="w-full max-w-md text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">ข้อมูลการชำระเงิน</h1>
      <p class="text-gray-500 mt-2">กรุณากรอกข้อมูลบัตรเครดิต/เดบิตของคุณ</p>
    </div>

    <div class="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4">
      <div>
        <label class="block mb-1 font-medium text-gray-700">หมายเลขบัตร</label>
        <div id="card-number" class="border rounded-md p-3"></div>
      </div>

      <div class="flex gap-4">
        <div class="w-1/2">
          <label class="block mb-1 font-medium text-gray-700">วันหมดอายุ</label>
          <div id="card-expiry" class="border rounded-md p-3"></div>
        </div>
        <div class="w-1/2">
          <label class="block mb-1 font-medium text-gray-700">CVC</label>
          <div id="card-cvc" class="border rounded-md p-3"></div>
        </div>
      </div>

      <div>
        <label class="block mb-1 font-medium text-gray-700">ประเทศ</label>
        <select
          v-model="country"
          class="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="TH">Thailand</option>
          <option value="US">United States</option>
          <option value="JP">Japan</option>
        </select>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 justify-center transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
      >
        <svg
          v-if="loading"
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
        <span>{{ loading ? "กำลังชำระเงิน..." : "ชำระเงิน" }}</span>
      </button>

      <p
        v-if="errorMessage"
        class="text-red-600 text-sm text-center transition-opacity duration-300"
      >
        {{ errorMessage }}
      </p>
    </div>
  </form>
</template>
