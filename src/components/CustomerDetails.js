import { calculateRewardPoints } from "../utils/rewardCalculation";
import PropTypes from "prop-types";
import logger from "../logger/logger";
import { Table, Th, Td, Tr } from "./StyledApp";
import {
  CUSTOMER_DETAILS_TITLE,
  TOTAL_POINTS_LABEL,
  POINTS_PER_MONTH_LABEL,
  TRANSACTIONS_LABEL,
  NO_TRANSACTIONS_MSG,
  TRANSACTION_ID_LABEL,
  AMOUNT_LABEL,
  DATE_LABEL,
  POINTS_EARNED_LABEL,
} from "../constants";

const CustomerDetails = ({ selectedCustomer, monthYearFilter }) => {
  let filteredTransactions = [];
  let monthlyPoints = [];
  // Calculate per-month reward points
  monthlyPoints = monthYearFilter.map(({ month, year }) => {
    const transactions = selectedCustomer.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === parseInt(month) &&
        transactionDate.getFullYear() === parseInt(year)
      );
    });
    const points = transactions.reduce((total, transaction) => {
      return total + calculateRewardPoints(transaction.amount);
    }, 0);
    return {
      month,
      year,
      points,
      transactions,
    };
  });
  // Flatten all transactions for last 3 months
  filteredTransactions = monthlyPoints.flatMap((mp) => mp.transactions);
  logger.info("Customer selected and details displayed.", {
    customerId: selectedCustomer.customerId,
    monthYearFilter,
    transactionCount: filteredTransactions.length,
  });

  const totalPoints = filteredTransactions.reduce((total, transaction) => {
    return total + calculateRewardPoints(transaction.amount);
  }, 0);

  return (
    <>
      <h2>
        {CUSTOMER_DETAILS_TITLE} {selectedCustomer?.customerId}
      </h2>
      <h4>
        {TOTAL_POINTS_LABEL} {totalPoints}
      </h4>
      <h4>{POINTS_PER_MONTH_LABEL}</h4>
      <Table>
        <thead>
          <Tr>
            <Th>Month</Th>
            <Th>Year</Th>
            <Th>Points</Th>
          </Tr>
        </thead>
        <tbody>
          {monthlyPoints.map((mp) => (
            <Tr key={mp.month + mp.year}>
              <Td>{mp.month}</Td>
              <Td>{mp.year}</Td>
              <Td>{mp.points}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <h4>{TRANSACTIONS_LABEL}</h4>
      {filteredTransactions.length === 0 ? (
        <p>{NO_TRANSACTIONS_MSG}</p>
      ) : (
        <>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.transactionId}>
              <p>
                {TRANSACTION_ID_LABEL} {transaction.transactionId}
              </p>
              <p>
                {AMOUNT_LABEL} ${transaction.amount}
              </p>
              <p>
                {DATE_LABEL} {transaction.date}
              </p>
              <p>
                {POINTS_EARNED_LABEL}{" "}
                {calculateRewardPoints(transaction.amount)}
              </p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default CustomerDetails;
CustomerDetails.propTypes = {
  selectedCustomer: PropTypes.shape({
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
  }),
  monthYearFilter: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    })
  ).isRequired,
};
