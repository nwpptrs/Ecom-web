import axios from "axios";

export const getOrdersAdmin = async (token) => {
  return axios.get("https://ecom-api-ecru.vercel.app/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeOrdersStatus = async (token, orderId, orderStatus) => {
  return axios.put(
    "https://ecom-api-ecru.vercel.app/api/admin/order-status",
    { orderId, orderStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getListUserAdmin = async (token) => {
  return axios.get("https://ecom-api-ecru.vercel.app/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserStatus = async (token, payload) => {
  return axios.post(
    "https://ecom-api-ecru.vercel.app/api/change-status",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changeUserRole = async (token, payload) => {
  return axios.post(
    "https://ecom-api-ecru.vercel.app/api/change-role",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
