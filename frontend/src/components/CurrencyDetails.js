import React from "react";
const CurrencyDetails = ({ name, symbol }) => (
  <div
    className="CurrencyDetails"
    onClick={() =>
      window.open(
        `https://www.moonpay.com/buy/${symbol}`,
        "_blank",
        "noopener,noreferrer"
      )
    }
  >
    <p>{name}</p>
    <p>({symbol})</p>
  </div>
);

export default CurrencyDetails;
