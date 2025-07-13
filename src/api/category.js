import axios from "axios";

export const createCategory = async (token, form) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/api/category`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const listCategory = async () => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
};

export const removeCategory = async (token, id) => {
  return axios.delete(`${import.meta.env.VITE_API_URL}/api/category/` + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
