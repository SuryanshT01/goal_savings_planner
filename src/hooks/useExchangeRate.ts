import { useState, useEffect } from 'react';

interface ExchangeRateData {
  rate: number; // INR per 1 USD
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
}

const API_URL = `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGE_API_KEY}/latest/INR`;

export const useExchangeRate = () => {
  const [exchangeData, setExchangeData] = useState<ExchangeRateData>({
    rate: 85.52, // Fallback rate (INR per USD)
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
  });

  const fetchExchangeRate = async () => {
    setExchangeData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch exchange rate');

      const data = await response.json();
      if (data.result !== 'success') throw new Error('API returned error');

      const usdPerInr = data.conversion_rates?.USD;

      if (!usdPerInr || usdPerInr === 0) {
        throw new Error('Invalid USD rate from response');
      }

      // Invert to get INR per USD
      const inrPerUsd = 1 / usdPerInr;
      const now = new Date();

      setExchangeData({
        rate: inrPerUsd,
        lastUpdated: now,
        isLoading: false,
        error: null,
      });

      localStorage.setItem('exchangeRate', JSON.stringify({
        rate: inrPerUsd,
        lastUpdated: now.toISOString(),
      }));
    } catch (error) {
      console.error('Exchange rate fetch error:', error);
      setExchangeData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch exchange rate. Using cached rate.',
      }));
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem('exchangeRate');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setExchangeData(prev => ({
          ...prev,
          rate: parsed.rate,
          lastUpdated: new Date(parsed.lastUpdated),
        }));
      } catch (err) {
        console.warn('Failed to parse cached exchange rate:', err);
      }
    }

    fetchExchangeRate();
  }, []);

  return {
    ...exchangeData,
    refreshRate: fetchExchangeRate,
  };
};
