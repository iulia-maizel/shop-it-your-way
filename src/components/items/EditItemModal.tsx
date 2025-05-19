
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingItem, Unit } from "@/types";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { categories } from "@/data/mockData";

interface EditItemModalProps {
  listId: string;
  item: ShoppingItem;
  isOpen: boolean;
  onClose: () => void;
}

const units: Unit[] = ['pcs', 'kg', 'g', 'l', 'ml', 'pack', 'bottle', 'box', 'can'];

const EditItemModal = ({ listId, item, isOpen, onClose }: EditItemModalProps) => {
  const { updateItem } = useShoppingList();
  
  const [formData, setFormData] = useState({
    name: item.name,
    categoryId: item.categoryId,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    comments: item.comments || "",
    storeLocation: item.storeLocation || ""
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
    updateItem(listId, item.id, formData);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
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
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;
