import axios from "axios";

export const createProduct = async (token, form) => {
  return axios.post("https://ecom-api-ecru.vercel.app/api/product", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listProduct = async (count = 20) => {
  return axios.get("https://ecom-api-ecru.vercel.app/api/products/" + count);
};

export const productBy = async (payload) => {
  return axios.post("https://ecom-api-ecru.vercel.app/api/productby", payload);
};

export const searchFilters = async (arg) => {
  return axios.post("https://ecom-api-ecru.vercel.app/api/search/filters", arg);
};

export const readProduct = async (token, id) => {
  return axios.get("https://ecom-api-ecru.vercel.app/api/product/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProduct = async (token, id, form) => {
  return axios.put("https://ecom-api-ecru.vercel.app/api/product/" + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeProduct = async (token, id) => {
  return axios.delete("https://ecom-api-ecru.vercel.app/api/product/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFiles = async (token, data) => {
  return axios.post(
    "https://ecom-api-ecru.vercel.app/api/images",
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
    "https://ecom-api-ecru.vercel.app/api/removeimage",
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
