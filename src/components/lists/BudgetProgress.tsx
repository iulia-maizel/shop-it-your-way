
import React from "react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";

interface BudgetProgressProps {
  spent: number;
  budget: number;
  className?: string;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  spent,
  budget,
  className = "",
}) => {
  const percentage = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const isOverBudget = spent > budget;
  
  let progressColor = "bg-primary";
  if (percentage > 85) {
    progressColor = "bg-amber-500";
  }
  if (isOverBudget) {
    progressColor = "bg-destructive";
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>
          Spent: <span className="font-medium">{formatCurrency(spent)}</span>
        </span>
        <span>
          Budget: <span className="font-medium">{formatCurrency(budget)}</span>
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className={`h-2 ${isOverBudget ? 'bg-red-100' : 'bg-gray-100'}`}
      />
      
      <div className="text-xs text-right text-muted-foreground">
        {percentage}% of budget used
      </div>
    </div>
  );
};
