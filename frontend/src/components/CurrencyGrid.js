import React from "react";
import CurrencyDetails from "./CurrencyDetails";
const CurrencyGrid = ({ currencies, filters }) => {
  const filterCurrencies = (data) =>
    data.filter((currency) =>
      Object.keys(filters).every((filterKey) => {
        if (!filters[filterKey].length) {
          return true;
        }
        return filters[filterKey].includes(currency[filterKey]);
      })
    );

  return (
    <div className="flex">
      {filterCurrencies(currencies).map((currency) => (
        <CurrencyDetails name={currency.name} symbol={currency.code} />
      ))}
    </div>
  );
};

export default CurrencyGrid;
