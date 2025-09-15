# Clone project

Clone the repository to your local machine:


git clone https://github.com/Lavanya-BV/retailer
cd retailer

### `npm install`
Install the required dependencies using npm

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


#### How It Works

- **Customer Data:** The app uses mock customer data stored in `public/data/customers.json`. Each customer has a unique `customerId` and a list of transactions, each with `transactionId`, `amount`, and `date`.
- **Reward Points Calculation:**
  - For purchases over $100: 2 points for every dollar spent over $100.
  - For purchases between $50 and $100: 1 point for every dollar spent in this range.
  - Transactions below $50: No points.
  - Example: A $120 purchase earns 90 points (2x$20 + 1x$50).
- **Month/Year Filter:**
  - By default, the app displays customers with transactions in the last 3 months.
  - Users can select any month (Jan-Dec) and year (2021-2025) to filter the customer list dynamically.
  - Only customers with transactions in the selected months/years are shown.
- **Customer Details:**
  - Click a customer to view their reward points per month and all transactions for the selected period.
- **Pagination:**
  - The customer list is paginated (5 per page). Use "Next" and "Previous" to navigate.
- **API Simulation:**
  - Data is loaded asynchronously from the local JSON file, simulating a real API call with loading and error states.
- **Logging:**
  - Application events and reward calculations are logged using `pino`.
- **Styling:**
  - All UI is styled using `styled-components` for modular, maintainable CSS.
- **Testing:**
  - Unit tests cover positive and negative cases, including fractional values, for reward calculation logic.


#### Folder Structure

```
/public
  /data
    customers.json  # mock data for customers and transactions
/src
  /components
    CustomerList.js       # Displays the list of customers (with filtering & pagination)
    CustomerDetails.js    # Shows details for a selected customer (per-month summary)
  /logger
    logger.js             # Handles application logging
  /utils
    rewardCalculation.js  # Contains the logic for calculating reward points
    rewardCalculation.test.js # Unit tests for reward logic
  App.js                  # Main application component
  index.js                # Renders the app
  constants.js            # Contains constants like months and years
  App.css                 # Global styling
```


#### Components

**CustomerList.js**
- Displays the list of customers.
- Handles month/year filtering and pagination.
- Only shows customers with transactions in the selected months/years.

**CustomerDetails.js**
- Shows details for the selected customer.
- Displays reward points per month and all transactions for the selected period.

**rewardCalculation.js**
- Contains the logic for calculating reward points based on transaction amounts.
- Unit tests cover positive, negative, and fractional cases.

**logger.js**
- Handles application logging using `pino`.

#### How to Run
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to launch the app
4. Run `npm test` to execute unit tests
