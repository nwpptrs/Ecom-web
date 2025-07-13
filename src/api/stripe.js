import axios from "axios";

export const payment = async (token) => {
  return await axios.post(
    "https://ecom-api-ecru.vercel.app/api/payment-intent",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
