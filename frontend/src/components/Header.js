import React from "react";
import Select from "react-select";

const filterOptions = [
  { value: [false], label: "false" },
  { value: [true], label: "true" },
  { value: [], label: "-" },
];

const Header = ({ setFilters, setCurrencies }) => {
  const sortByProperty = (property) => (e) => {
    setCurrencies((current) =>
      [...current].sort((a, b) => a[property].localeCompare(b[property]))
    );
  };

  const shuffleSort = (e) =>
    setCurrencies((current) =>
      current
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );

  const updateFilter =
    (property) =>
    ({ value }) => {
      const updated = {};
      updated[property] = value;
      setFilters((currentFilters) => ({
        ...currentFilters,
        ...updated,
      }));
    };

  return (
    <>
      <div className="row">
        <h1> MoonPay FullStack Challenge</h1>
      </div>
      <div className="row">
        <div className="column">
          <p className="label">Supports US:</p>
          <Select
            options={filterOptions}
            onChange={updateFilter("isSupportedInUS")}
          />
          <p className="label">Supports Test Mode:</p>
          <Select
            options={filterOptions}
            onChange={updateFilter("supportsTestMode")}
          />
        </div>

        <div className="column">
          <p className="label">Sort by:</p>
          <div className="column">
            <button onClick={sortByProperty("name")}>Name</button>
            <button onClick={sortByProperty("code")}>Symbol</button>
            <button onClick={shuffleSort}>Shuffle</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
