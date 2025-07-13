import axios from "axios";

export const createProduct = async (token, form) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/product`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listProduct = async (count = 20) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/products/` + count);
};

export const productBy = async (payload) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/productby`, payload);
};

export const searchFilters = async (arg) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/search/filters`, arg);
};

export const readProduct = async (token, id) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/product/` + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProduct = async (token, id, form) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/api/product/` + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeProduct = async (token, id) => {
  return axios.delete(`${import.meta.env.VITE_API_URL}/api/product/` + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFiles = async (token, data) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/images`,
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

export const removeFile = async (token, public_id) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/removeimage`,
    {
      public_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
