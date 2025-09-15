import React, { useState, useEffect } from "react";
import { APP_TITLE, SELECT_CUSTOMER_PROMPT, LOADING } from "./constants";
import CustomerList from "./components/CustomerList";
import CustomerDetails from "./components/CustomerDetails";
import logger from "./logger/logger";
import "./App.css";
import { AppContainer } from "./components/StyledApp";
import { fetchCustomers } from "./api/customerApi";

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate last 3 months for default filter
  const today = new Date();
  const last3Months = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    last3Months.push({
      month: (d.getMonth() + 1).toString().padStart(2, "0"),
      year: d.getFullYear().toString(),
    });
  }
  const [monthYearFilter, setMonthYearFilter] = useState(last3Months);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await fetchCustomers();
        setCustomers(customersData);
        setLoading(false);
        logger.info("Customer data loaded successfully.", {
          count: customersData.length,
        });
      } catch (error) {
        logger.error("Error fetching customer data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <>{LOADING}</>;
  }

  return (
    <AppContainer>
      <h1>{APP_TITLE}</h1>
      <CustomerList
        customers={customers}
        setSelectedCustomer={setSelectedCustomer}
        monthYearFilter={monthYearFilter}
        setMonthYearFilter={setMonthYearFilter}
      />
      {selectedCustomer ? (
        <CustomerDetails
          selectedCustomer={selectedCustomer}
          monthYearFilter={monthYearFilter}
        />
      ) : (
        <p>{SELECT_CUSTOMER_PROMPT}</p>
      )}
    </AppContainer>
  );
}

export default App;
App.propTypes = {};
