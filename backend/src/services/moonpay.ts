import axios from "axios";

export const getCurrencies = () =>
  axios.get("https://api.moonpay.com/v3/currencies").then((resp) => resp.data);
