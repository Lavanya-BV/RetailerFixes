export const fetchCustomers = async () => {
  try {
    const response = await fetch('/data/customers.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const customersData = await response.json();
    return customersData;
  } catch (error) {
    import('../logger/logger').then(({ default: logger }) => {
      logger.error('Error fetching customers:', error);
    });
    throw error;
  }
};
