
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ShoppingListCard } from "@/components/lists/ShoppingListCard";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Plus } from "lucide-react";

const HomePage = () => {
  const { shoppingLists } = useShoppingList();
  const navigate = useNavigate();
  
  const createNewList = () => {
    navigate("/create-list");
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shopping Lists</h1>
          <Button onClick={createNewList} size="sm">
            <Plus size={16} className="mr-1" />
            New List
          </Button>
        </div>
        
        {shoppingLists.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">No Lists Yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first shopping list to get started.
            </p>
            <Button onClick={createNewList}>
              <Plus size={16} className="mr-1" />
              Create List
            </Button>
          </div>
        ) : (
          <div>
            {shoppingLists.map((list) => (
              <ShoppingListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
