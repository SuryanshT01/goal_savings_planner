
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { GoalCard } from '../components/GoalCard';
import { AddGoalModal } from '../components/AddGoalModal';
import { AddContributionModal } from '../components/AddContributionModal';
import { useGoals } from '../hooks/useGoals';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { Goal } from '../types/goal';

const Index = () => {
  const { goals, addGoal, addContribution, deleteGoal } = useGoals();
  const { rate: exchangeRate, lastUpdated, isLoading, refreshRate } = useExchangeRate();
  
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isAddContributionModalOpen, setIsAddContributionModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleAddContribution = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsAddContributionModalOpen(true);
    }
  };

  const handleContributionSubmit = (goalId: string, amount: number, date: Date) => {
    addContribution(goalId, amount, date);
    setIsAddContributionModalOpen(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      deleteGoal(goalId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header
          goals={goals}
          exchangeRate={exchangeRate}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefreshRate={refreshRate}
        />

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Your Goals</h2>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Add New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Goals Yet</h3>
              <p className="text-gray-600 mb-6">Start your savings journey by creating your first goal!</p>
              <button
                onClick={() => setIsAddGoalModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                exchangeRate={exchangeRate}
                onAddContribution={handleAddContribution}
                onDeleteGoal={handleDeleteGoal}
              />
            ))}
          </div>
        )}

        <AddGoalModal
          isOpen={isAddGoalModalOpen}
          onClose={() => setIsAddGoalModalOpen(false)}
          onAddGoal={addGoal}
        />

        <AddContributionModal
          isOpen={isAddContributionModalOpen}
          goal={selectedGoal}
          onClose={() => {
            setIsAddContributionModalOpen(false);
            setSelectedGoal(null);
          }}
          onAddContribution={handleContributionSubmit}
        />
      </div>
    </div>
  );
};

export default Index;
