
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { ShoppingItemCard } from "@/components/items/ShoppingItemCard";
import { AddItemForm } from "@/components/items/AddItemForm";
import { BudgetProgress } from "@/components/lists/BudgetProgress";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { shoppingLists, getTotalSpent, updateShoppingList } = useShoppingList();
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [listName, setListName] = useState("");
  const [budget, setBudget] = useState(0);
  
  const list = shoppingLists.find((list) => list.id === id);
  
  useEffect(() => {
    if (list) {
      setListName(list.name);
      setBudget(list.budget);
    } else {
      navigate("/");
    }
  }, [list, navigate]);
  
  const handleSaveListDetails = () => {
    if (id) {
      updateShoppingList(id, { name: listName, budget });
      setIsEditingList(false);
    }
  };
  
  if (!list || !id) {
    return null;
  }
  
  const totalSpent = getTotalSpent(list.id);
  
  // Group items by category
  const itemsByCategory = list.items.reduce((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = [];
    }
    acc[item.categoryId].push(item);
    return acc;
  }, {} as Record<string, typeof list.items>);
  
  const groupedItems = Object.entries(itemsByCategory).map(([categoryId, items]) => ({
    categoryId,
    items: items.sort((a, b) => {
      // Sort by checked status first
      if (a.checked !== b.checked) {
        return a.checked ? 1 : -1;
      }
      // Then sort alphabetically
      return a.name.localeCompare(b.name);
    }),
  }));
  
  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4 pb-20">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 mr-2" 
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold flex-1 truncate">{list.name}</h1>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsEditingList(true)}
          >
            Edit
          </Button>
        </div>
        
        <BudgetProgress spent={totalSpent} budget={list.budget} className="mb-6" />
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Items</h2>
          <Button 
            size="sm" 
            onClick={() => setIsAddingItem(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Item
          </Button>
        </div>
        
        {list.items.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <p className="text-muted-foreground mb-4">
              No items in this list yet. Add your first item to get started.
            </p>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus size={16} className="mr-1" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div>
            {groupedItems.map(({ categoryId, items }) => (
              <div key={categoryId} className="mb-6">
                {items.map((item) => (
                  <ShoppingItemCard key={item.id} listId={list.id} item={item} />
                ))}
              </div>
            ))}
          </div>
        )}
        
        {/* Add Item Dialog */}
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <AddItemForm 
              listId={list.id} 
              onComplete={() => setIsAddingItem(false)} 
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit List Dialog */}
        <Dialog open={isEditingList} onOpenChange={setIsEditingList}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit List Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="listName" className="text-sm font-medium">
                  List Name
                </label>
                <Input
                  id="listName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="listBudget" className="text-sm font-medium">
                  Budget
                </label>
                <Input
                  id="listBudget"
                  type="number"
                  min="0"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditingList(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveListDetails}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ListPage;
