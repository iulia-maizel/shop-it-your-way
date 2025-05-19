
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShoppingList } from "@/contexts/ShoppingListContext";

const CreateListPage = () => {
  const navigate = useNavigate();
  const { addShoppingList, setActiveListId } = useShoppingList();
  
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(100);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newListId = addShoppingList(name, budget);
    setActiveListId(newListId);
    navigate(`/list/${newListId}`);
  };
  
  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New List</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="name">List Name</Label>
            <Input 
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Groceries"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input 
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              min="0"
              step="1"
              required
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create List
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateListPage;
