import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { initialShoppingLists } from "@/data/mockData";
import { ShoppingList, ShoppingItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

type ShoppingListContextType = {
  shoppingLists: ShoppingList[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  getActiveList: () => ShoppingList | undefined;
  addShoppingList: (name: string, budget: number) => string;
  updateShoppingList: (id: string, data: Partial<ShoppingList>) => void;
  deleteShoppingList: (id: string) => void;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  updateItem: (listId: string, itemId: string, data: Partial<ShoppingItem>) => void;
  toggleItemCheck: (listId: string, itemId: string) => void;
  deleteItem: (listId: string, itemId: string) => void;
  getTotalSpent: (listId: string) => number;
  searchItems: (query: string) => ShoppingItem[];
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(initialShoppingLists);
  const [activeListId, setActiveListId] = useState<string | null>(initialShoppingLists[0]?.id || null);

  const getActiveList = useCallback(() => {
    return shoppingLists.find(list => list.id === activeListId);
  }, [shoppingLists, activeListId]);

  const updateShoppingList = useCallback((id: string, data: Partial<ShoppingList>) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === id ? { ...list, ...data, updatedAt: new Date().toISOString() } : list
      )
    );
    toast({ description: "List updated successfully" });
  }, []);

  const addShoppingList = useCallback((name: string, budget: number): string => {
    const newList: ShoppingList = {
      id: uuidv4(),
      name,
      budget,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setShoppingLists(prevLists => [...prevLists, newList]);
    toast({ description: "New list created successfully" });
    return newList.id;
  }, []);

  const deleteShoppingList = useCallback((id: string) => {
    setShoppingLists(prevLists => prevLists.filter(list => list.id !== id));
    
    // If the deleted list was active, set the first available list as active
    if (activeListId === id) {
      setActiveListId(prevState => {
        const remainingLists = shoppingLists.filter(list => list.id !== id);
        return remainingLists.length > 0 ? remainingLists[0].id : null;
      });
    }
    
    toast({ description: "List deleted successfully" });
  }, [activeListId, shoppingLists]);

  const addItem = useCallback((listId: string, item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: uuidv4(),
      checked: false
    };
    
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: [...list.items, newItem],
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
    
    toast({ description: "Item added successfully" });
  }, []);

  const updateItem = useCallback((listId: string, itemId: string, data: Partial<ShoppingItem>) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items.map(item => 
                item.id === itemId ? { ...item, ...data } : item
              ),
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
  }, []);

  const toggleItemCheck = useCallback((listId: string, itemId: string) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items.map(item => 
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ) 
            } 
          : list
      )
    );
  }, []);

  const deleteItem = useCallback((listId: string, itemId: string) => {
    setShoppingLists(prevLists => 
      prevLists.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items.filter(item => item.id !== itemId),
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
    
    toast({ description: "Item removed from list" });
  }, []);

  const getTotalSpent = useCallback((listId: string) => {
    const list = shoppingLists.find(list => list.id === listId);
    if (!list) return 0;
    
    return list.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [shoppingLists]);

  const searchItems = useCallback((query: string) => {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return shoppingLists.flatMap(list => 
      list.items.filter(item => 
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.comments?.toLowerCase().includes(normalizedQuery) ||
        item.storeLocation?.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [shoppingLists]);

  const value = {
    shoppingLists,
    activeListId,
    setActiveListId,
    getActiveList,
    addShoppingList,
    updateShoppingList,
    deleteShoppingList,
    addItem,
    updateItem,
    toggleItemCheck,
    deleteItem,
    getTotalSpent,
    searchItems
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
}
