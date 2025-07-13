import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

export const formatCurrencyTHB = (number) => {
  return number.toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const formatDate = (date) => {
  return dayjs(date).format("D MMM YYYY (HH:mm)");
};
