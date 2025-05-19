
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  spent: number;
  budget: number;
  className?: string;
}

export function BudgetProgress({ spent, budget, className }: BudgetProgressProps) {
  const percentage = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const isOverBudget = spent > budget;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span>Budget</span>
        <span className={cn(
          "font-medium",
          isOverBudget ? "text-destructive" : "text-green-600"
        )}>
          {formatCurrency(spent)} / {formatCurrency(budget)}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isOverBudget ? "bg-red-200" : "bg-gray-200"
        )}
        indicatorClassName={isOverBudget ? "bg-destructive" : "bg-primary"}
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {percentage}% {isOverBudget ? "over budget" : "of budget used"}
        </span>
      </div>
    </div>
  );
}
