
export const formatCurrency = (amount: number, currency: 'INR' | 'USD'): string => {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
};

export const convertCurrency = (amount: number, fromCurrency: 'INR' | 'USD', toCurrency: 'INR' | 'USD', exchangeRate: number): number => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  } else if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  
  return amount;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
