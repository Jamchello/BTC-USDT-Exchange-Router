import "./App.css";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/Spinner";
import CurrencyGrid from "./components/CurrencyGrid";
import Header from "./components/Header";

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [filters, setFilters] = useState({
    isSupportedInUS: [],
    supportsTestMode: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("https://api.moonpay.com/v3/currencies").then(
        (resp) => resp.json()
      );
      setCurrencies(data);
    };
    currencies.length === 0 && fetchData();
  }, [currencies.length]);

  return (
    <div className="App">
      <Header setCurrencies={setCurrencies} setFilters={setFilters} />
      <CurrencyGrid currencies={currencies} filters={filters} />
      {!currencies.length && <LoadingSpinner />}
    </div>
  );
};

export default App;
