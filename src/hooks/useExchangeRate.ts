
import { useState, useEffect } from 'react';

interface ExchangeRateData {
  rate: number;
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
}

export const useExchangeRate = () => {
  const [exchangeData, setExchangeData] = useState<ExchangeRateData>({
    rate: 85.52, // Default fallback rate
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
  });

  const fetchExchangeRate = async () => {
    setExchangeData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Using a free exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      const inrRate = data.rates.INR;
      
      setExchangeData({
        rate: inrRate,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
      
      // Cache the rate in localStorage
      localStorage.setItem('exchangeRate', JSON.stringify({
        rate: inrRate,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      setExchangeData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch exchange rate. Using cached rate.',
      }));
    }
  };

  useEffect(() => {
    // Try to load cached rate first
    const cachedRate = localStorage.getItem('exchangeRate');
    if (cachedRate) {
      try {
        const parsed = JSON.parse(cachedRate);
        setExchangeData(prev => ({
          ...prev,
          rate: parsed.rate,
          lastUpdated: new Date(parsed.lastUpdated),
        }));
      } catch (error) {
        console.error('Error parsing cached exchange rate:', error);
      }
    }
    
    // Fetch fresh rate
    fetchExchangeRate();
  }, []);

  return {
    ...exchangeData,
    refreshRate: fetchExchangeRate,
  };
};
