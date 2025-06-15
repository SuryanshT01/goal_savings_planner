
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Goal } from '../types/goal';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface HeaderProps {
  goals: Goal[];
  exchangeRate: number;
  lastUpdated: Date;
  isLoading: boolean;
  onRefreshRate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  goals,
  exchangeRate,
  lastUpdated,
  isLoading,
  onRefreshRate,
}) => {
  const totalTargetINR = goals.reduce((sum, goal) => {
    const amountInINR = convertCurrency(goal.targetAmount, goal.currency, 'INR', exchangeRate);
    return sum + amountInINR;
  }, 0);

  const totalSavedINR = goals.reduce((sum, goal) => {
    const amountInINR = convertCurrency(goal.savedAmount, goal.currency, 'INR', exchangeRate);
    return sum + amountInINR;
  }, 0);

  const overallProgress = totalTargetINR > 0 ? (totalSavedINR / totalTargetINR) * 100 : 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">Goal-Based Savings Planner</h1>
        <button
          onClick={onRefreshRate}
          disabled={isLoading}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Rates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-100 mb-1">Total Target</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalTargetINR, 'INR')}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-100 mb-1">Total Saved</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalSavedINR, 'INR')}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-100 mb-1">Overall Progress</h3>
          <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-100 mb-1">Exchange Rate</h3>
          <p className="text-lg font-bold">1 USD = ₹{exchangeRate.toFixed(2)}</p>
          <p className="text-xs text-blue-200">
            Last updated: {formatTime(lastUpdated)}
          </p>
        </div>
      </div>
    </div>
  );
};
