import React, { useState, useCallback } from "react";
import { useTable } from "react-table";
import { months, years, CUSTOMERS_PER_PAGE } from "../constants";
import logger from "../logger/logger";
import { calculateRewardPoints } from "../utils/rewardCalculation";
import PropTypes from "prop-types";
import { Table, Th, Td, Tr, Select, Button } from "./StyledApp";
import {
  CUSTOMER_ID_HEADER,
  REWARD_POINTS_HEADER,
  TRANSACTIONS_HEADER,
  FILTER_LABEL,
  LAST_3_MONTHS_LABEL,
  SELECT_MONTHS_LABEL,
  INVALID_DATA_MSG,
  NO_CUSTOMERS_MSG,
  PREVIOUS_BTN,
  NEXT_BTN,
} from "../constants";

const CustomerList = ({
  customers,
  setSelectedCustomer,
  monthYearFilter = [],
  setMonthYearFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const validCustomers = Array.isArray(customers)
    ? customers.filter((customer) => {
        if (
          !customer ||
          !customer.customerId ||
          !Array.isArray(customer.transactions) ||
          customer.transactions.length === 0
        ) {
          return false;
        }
        // Only include customers with at least one transaction in selected months/years
        const hasValidTransaction = customer.transactions.some(
          (transaction) => {
            if (!transaction.date) return false;
            const transactionDate = new Date(transaction.date);
            return monthYearFilter.some(
              ({ month, year }) =>
                transactionDate.getMonth() + 1 === parseInt(month) &&
                transactionDate.getFullYear() === parseInt(year)
            );
          }
        );
        return hasValidTransaction;
      })
    : [];

  const columns = React.useMemo(
    () => [
      {
        Header: CUSTOMER_ID_HEADER,
        accessor: "customerId",
      },
      {
        Header: REWARD_POINTS_HEADER,
        accessor: "totalPoints",
      },
      {
        Header: TRANSACTIONS_HEADER,
        accessor: "transactions",
        Cell: ({ value }) => value.length,
      },
    ],
    []
  );

  const customerTableData = Array.isArray(validCustomers)
    ? validCustomers.map((customer) => {
        const totalPoints = customer.transactions.reduce(
          (total, transaction) => {
            return total + calculateRewardPoints(transaction.amount);
          },
          0
        );
        return {
          ...customer,
          totalPoints,
        };
      })
    : [];

  // Slice customerTableData for pagination before passing to useTable
  const paginatedData = Array.isArray(customerTableData)
    ? customerTableData.slice(
        (currentPage - 1) * CUSTOMERS_PER_PAGE,
        currentPage * CUSTOMERS_PER_PAGE
      )
    : [];

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({ columns, data: paginatedData });

  const handleCustomerSelect = useCallback(
    (customer) => {
      if (customer && customer.customerId) {
        setSelectedCustomer(customer);
        logger.info(`Customer selected: ${customer.customerId}`);
      } else {
        logger.error("Invalid customer selected.");
      }
    },
    [setSelectedCustomer]
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        Math.ceil(validCustomers.length / CUSTOMERS_PER_PAGE),
        prevPage + 1
      )
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  return (
    <>
      <>
        <label>{FILTER_LABEL}</label>
        <span>{LAST_3_MONTHS_LABEL}</span>
        <br />
        <label>{SELECT_MONTHS_LABEL}</label>
        <Select
          multiple
          value={monthYearFilter.map((m) => m.month + "-" + m.year)}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions).map(
              (opt) => opt.value
            );
            const newFilter = selectedOptions.map((val) => {
              const [month, year] = val.split("-");
              return { month, year };
            });
            setMonthYearFilter(newFilter);
          }}
        >
          {years.map((year) =>
            months.map((month) => (
              <option
                key={month.value + "-" + year}
                value={month.value + "-" + year}
              >
                {month.label} {year}
              </option>
            ))
          )}
        </Select>
      </>

      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows && rows.length > 0 ? (
            rows.map((row) => {
              prepareRow(row);
              if (row && row.original && row.original.customerId) {
                return (
                  <Tr
                    {...row.getRowProps()}
                    onClick={() => handleCustomerSelect(row.original)}
                  >
                    {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    ))}
                  </Tr>
                );
              } else {
                return (
                  <Tr>
                    <Td colSpan="3">{INVALID_DATA_MSG}</Td>
                  </Tr>
                );
              }
            })
          ) : (
            <Tr>
              <Td colSpan="3">{NO_CUSTOMERS_MSG}</Td>
            </Tr>
          )}
        </tbody>
      </Table>
      <>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          {PREVIOUS_BTN}
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={
            currentPage ===
            Math.ceil(validCustomers.length / CUSTOMERS_PER_PAGE)
          }
        >
          {NEXT_BTN}
        </Button>
      </>
    </>
  );
};

export default CustomerList;
CustomerList.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          transactionId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  setSelectedCustomer: PropTypes.func.isRequired,
  monthYearFilter: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    })
  ),
  setMonthYearFilter: PropTypes.func,
};
