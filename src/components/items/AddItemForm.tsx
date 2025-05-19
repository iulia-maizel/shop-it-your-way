
import { useState } from "react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Unit } from "@/types";
import { categories } from "@/data/mockData";

interface AddItemFormProps {
  listId: string;
  onComplete: () => void;
}

const units: Unit[] = ['pcs', 'kg', 'g', 'l', 'ml', 'pack', 'bottle', 'box', 'can'];

export function AddItemForm({ listId, onComplete }: AddItemFormProps) {
  const { addItem } = useShoppingList();
  
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "cat8", // Default to "Other" category
    quantity: 1,
    unit: "pcs" as Unit,
    price: 0,
    comments: "",
    storeLocation: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };
  
  const handleUnitChange = (value: Unit) => {
    setFormData(prev => ({ ...prev, unit: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(listId, formData);
    setFormData({
      name: "",
      categoryId: "cat8",
      quantity: 1,
      unit: "pcs" as Unit,
      price: 0,
      comments: "",
      storeLocation: "",
    });
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Enter item name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select 
          defaultValue={formData.categoryId}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            name="quantity" 
            type="number" 
            min="0" 
            step="0.01"
            value={formData.quantity} 
            onChange={handleNumberChange} 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select 
            defaultValue={formData.unit}
            onValueChange={(value) => handleUnitChange(value as Unit)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input 
          id="price" 
          name="price" 
          type="number" 
          min="0" 
          step="0.01"
          value={formData.price} 
          onChange={handleNumberChange} 
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="storeLocation">Store Location</Label>
        <Input 
          id="storeLocation" 
          name="storeLocation" 
          value={formData.storeLocation} 
          onChange={handleChange} 
          placeholder="e.g., Aisle 5, Produce section"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea 
          id="comments" 
          name="comments" 
          value={formData.comments} 
          onChange={handleChange} 
          placeholder="Any additional notes..."
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          Add Item
        </Button>
      </div>
    </form>
  );
}
