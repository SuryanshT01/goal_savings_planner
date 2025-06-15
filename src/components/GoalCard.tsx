
import React from 'react';
import { Goal } from '../types/goal';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface GoalCardProps {
  goal: Goal;
  exchangeRate: number;
  onAddContribution: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  exchangeRate,
  onAddContribution,
  onDeleteGoal,
}) => {
  const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  
  const otherCurrency = goal.currency === 'INR' ? 'USD' : 'INR';
  const convertedTarget = convertCurrency(goal.targetAmount, goal.currency, otherCurrency, exchangeRate);
  const convertedSaved = convertCurrency(goal.savedAmount, goal.currency, otherCurrency, exchangeRate);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{goal.name}</h3>
        <button
          onClick={() => onDeleteGoal(goal.id)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Target:</span>
          <div className="text-right">
            <div className="font-semibold text-gray-800">
              {formatCurrency(goal.targetAmount, goal.currency)}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(convertedTarget, otherCurrency)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Saved:</span>
          <div className="text-right">
            <div className="font-semibold text-green-600">
              {formatCurrency(goal.savedAmount, goal.currency)}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(convertedSaved, otherCurrency)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Remaining:</span>
          <div className="font-semibold text-orange-600">
            {formatCurrency(remaining, goal.currency)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-800">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-3 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onAddContribution(goal.id)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Add Contribution
      </button>

      {goal.contributions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Contributions</h4>
          <div className="space-y-1">
            {goal.contributions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((contribution) => (
                <div key={contribution.id} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">
                    {new Date(contribution.date).toLocaleDateString('en-IN')}
                  </span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(contribution.amount, goal.currency)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
