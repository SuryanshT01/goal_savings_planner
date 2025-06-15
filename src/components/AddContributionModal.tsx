
import React, { useState } from 'react';
import { Goal } from '../types/goal';
import { formatCurrency } from '../utils/currency';

interface AddContributionModalProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onAddContribution: (goalId: string, amount: number, date: Date) => void;
}

export const AddContributionModal: React.FC<AddContributionModalProps> = ({
  isOpen,
  goal,
  onClose,
  onAddContribution,
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal) return;
    
    const newErrors: { [key: string]: string } = {};
    
    const contributionAmount = parseFloat(amount);
    if (!amount || isNaN(contributionAmount) || contributionAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onAddContribution(goal.id, contributionAmount, new Date(date));
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    onClose();
  };

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Contribution</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">{goal.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="font-medium">{formatCurrency(goal.targetAmount, goal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Saved:</span>
                <span className="font-medium text-green-600">{formatCurrency(goal.savedAmount, goal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-medium text-orange-600">{formatCurrency(remaining, goal.currency)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contributionAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Contribution Amount ({goal.currency})
              </label>
              <input
                id="contributionAmount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount in ${goal.currency}`}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="contributionDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="contributionDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Contribution
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
