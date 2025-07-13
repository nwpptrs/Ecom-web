import axios from "axios";

export const payment = async (token) => {
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/api/payment-intent`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
