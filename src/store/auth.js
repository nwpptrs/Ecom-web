import { defineStore } from "pinia";
import axios from "axios";
import { currentUser, currentAdmin } from "../api/auth";
import { listCategory } from "../api/category";
import { listProduct, searchFilters } from "../api/product";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    categories: [],
    products: [],
    carts: [],
    searchQuery: "",
    selectedCategories: [],
    priceSelected: [0, 30000],
  }),
  getters: {
    cartSubtotal: (state) =>
      state.carts.reduce((sum, item) => sum + item.price * item.count, 0),
  },
  actions: {
    async login(payload) {
      const res = await axios.post(
        "https://ecom-api-ecru.vercel.app/api/login",
        payload
      );
      this.token = res.data.token;
      if (res.data.payload.role === "admin") {
        const adminRes = await currentAdmin(this.token);
        this.user = adminRes.data.user;
      } else {
        const userRes = await currentUser(this.token);
        this.user = userRes.data.user;
      }

      return res;
    },
    async fetchUser() {
      try {
        const res = await currentUser(this.token);
        this.user = res.data.user;
      } catch (error) {
        console.error("Fetch user failed", error);
      }
    },
    async getCategory() {
      try {
        const res = await listCategory();
        this.categories = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getProduct(count) {
      try {
        const res = await listProduct(count);
        this.products = res.data.products;
      } catch (error) {
        console.log(error);
      }
    },
    async actionSearchFilter(arg) {
      try {
        const res = await searchFilters(arg);
        this.products = res.data.products;
      } catch (error) {
        console.log("Search Error:", error);
      }
    },
    async actionAddtoCart(product) {
      try {
        const existingProduct = this.carts.find(
          (item) => item.id === product.id
        );

        if (existingProduct) {
          existingProduct.count += 1;
        } else {
          this.carts.push({ ...product, count: 1 });
        }
      } catch (error) {
        console.log("Cart Error", error);
      }
    },
    increment(productId) {
      const item = this.carts.find((item) => item.id === productId);

      if (item) {
        item.count += 1;
      } else {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          this.carts.push({ ...product, count: 1 });
        }
      }
    },
    decrement(productId) {
      const item = this.carts.find((item) => item.id === productId);
      if (item && item.count > 1) {
        item.count -= 1;
      } else if (item && item.count === 1) {
        this.carts = this.carts.filter((item) => item.id !== productId);
      }
    },
    removeFromCart(productId) {
      this.carts = this.carts.filter((item) => item.id !== productId);
    },
    clearCart() {
      this.carts = [];
    },
    logout() {
      this.token = null;
      this.user = null;
      this.categories = [];
      this.products = [];
      this.carts = [];
    },
  },
  persist: true,
});
