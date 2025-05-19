
export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Unit = 'pcs' | 'kg' | 'g' | 'l' | 'ml' | 'pack' | 'bottle' | 'box' | 'can';

export type ShoppingItem = {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  unit: Unit;
  price: number;
  checked: boolean;
  comments?: string;
  storeLocation?: string;
};

export type ShoppingList = {
  id: string;
  name: string;
  budget: number;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
};
