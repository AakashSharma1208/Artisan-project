export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const validateIndianPhone = (phone) => {
  const regex = /^(\+91)?[6-9]\d{9}$/;
  return regex.test(phone);
};
