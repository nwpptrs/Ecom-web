import axios from "axios";

export const getOrdersAdmin = async (token) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeOrdersStatus = async (token, orderId, orderStatus) => {
  return axios.put(
    `${import.meta.env.VITE_API_URL}/api/admin/order-status`,
    { orderId, orderStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getListUserAdmin = async (token) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserStatus = async (token, payload) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/api/change-status`,
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
    `${import.meta.env.VITE_API_URL}/api/change-role`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
