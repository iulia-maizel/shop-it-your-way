
import { useNavigate } from "react-router-dom";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingList } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface ShoppingListCardProps {
  list: ShoppingList;
}

export function ShoppingListCard({ list }: ShoppingListCardProps) {
  const navigate = useNavigate();
  const { getTotalSpent, deleteShoppingList } = useShoppingList();
  
  const totalSpent = getTotalSpent(list.id);
  const totalItems = list.items.length;
  const completedItems = list.items.filter(item => item.checked).length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  const handleViewList = () => {
    navigate(`/list/${list.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this list?")) {
      deleteShoppingList(list.id);
    }
  };
  
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between">
          <span>{list.name}</span>
          <span className={totalSpent > list.budget ? 'text-destructive' : 'text-green-600'}>
            {formatCurrency(totalSpent)} / {formatCurrency(list.budget)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{completedItems} of {totalItems} items</span>
          <span>{progress}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${totalSpent > list.budget ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${Math.min(progress, 100)}%` }} 
          />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button size="sm" variant="outline" onClick={handleDelete}>
          Delete
        </Button>
        <Button size="sm" onClick={handleViewList}>
          View List
        </Button>
      </CardFooter>
    </Card>
  );
}
