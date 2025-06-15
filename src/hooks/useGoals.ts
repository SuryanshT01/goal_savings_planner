
import { useState, useEffect } from 'react';
import { Goal, Contribution } from '../types/goal';
import { generateId } from '../utils/currency';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('savings-goals');
    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        const goalsWithDates = parsed.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          contributions: goal.contributions.map((contrib: any) => ({
            ...contrib,
            date: new Date(contrib.date),
          })),
        }));
        setGoals(goalsWithDates);
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('savings-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (name: string, targetAmount: number, currency: 'INR' | 'USD') => {
    const newGoal: Goal = {
      id: generateId(),
      name,
      targetAmount,
      savedAmount: 0,
      currency,
      createdAt: new Date(),
      contributions: [],
    };
    
    setGoals(prev => [...prev, newGoal]);
    return newGoal.id;
  };

  const addContribution = (goalId: string, amount: number, date: Date = new Date()) => {
    const contribution: Contribution = {
      id: generateId(),
      amount,
      date,
      goalId,
    };

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          savedAmount: goal.savedAmount + amount,
          contributions: [...goal.contributions, contribution],
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return {
    goals,
    addGoal,
    addContribution,
    deleteGoal,
  };
};
