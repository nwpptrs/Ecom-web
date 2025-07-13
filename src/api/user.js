import axios from "axios";

export const createUserCart = async (token, cart) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/user/cart`, cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listUserCart = async (token) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/user/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveUserAddress = async (token, payload) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/user/address`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const listUserOrder = async (token) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/user/order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveUserOrder = async (token, payload) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/user/order`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createUserReview = async (token, payload) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/user/order/review`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const listReviews = async () => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/user/reviews`);
};

export const uploadProfile = async (token, data) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/user/profile`,
    {
      image: data,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
