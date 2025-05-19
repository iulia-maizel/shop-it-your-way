
import { useState } from "react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { ShoppingItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/data/mockData";
import { Check, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import EditItemModal from "./EditItemModal";

interface ShoppingItemCardProps {
  listId: string;
  item: ShoppingItem;
}

export function ShoppingItemCard({ listId, item }: ShoppingItemCardProps) {
  const { toggleItemCheck, deleteItem } = useShoppingList();
  const [isEditing, setIsEditing] = useState(false);
  
  const category = categories.find(cat => cat.id === item.categoryId);
  
  const handleToggle = () => {
    toggleItemCheck(listId, item.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this item?")) {
      deleteItem(listId, item.id);
    }
  };
  
  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  const closeEditModal = () => {
    setIsEditing(false);
  };
  
  return (
    <>
      <Card 
        className={cn(
          "mb-3 hover:shadow-sm transition-shadow duration-200",
          item.checked ? "bg-gray-100" : "bg-white"
        )}
      >
        <CardContent className="p-3 flex items-center">
          <Checkbox 
            checked={item.checked}
            onCheckedChange={handleToggle}
            className="mr-3"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className={cn(
                "font-medium truncate",
                item.checked && "line-through text-muted-foreground"
              )}>
                {item.name}
              </h3>
              <span className="whitespace-nowrap">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: category?.color || "#9ca3af" }}
                />
                {category?.name || "Other"}
              </span>
              
              <span>
                {item.quantity} {item.unit}
              </span>
              
              {item.storeLocation && (
                <span className="inline-flex items-center gap-1">
                  <span>•</span>
                  {item.storeLocation}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center ml-2 gap-1">
            <button 
              onClick={openEditModal}
              className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-destructive rounded-full hover:bg-gray-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </CardContent>
      </Card>
      
      {isEditing && (
        <EditItemModal 
          listId={listId}
          item={item} 
          isOpen={isEditing}
          onClose={closeEditModal}
        />
      )}
    </>
  );
}
