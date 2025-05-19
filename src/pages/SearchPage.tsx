
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { categories } from "@/data/mockData";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchItems, shoppingLists } = useShoppingList();
  
  const searchResults = searchQuery.trim() ? searchItems(searchQuery) : [];
  
  // Find which list each search result belongs to
  const resultsWithList = searchResults.map(item => {
    const listId = shoppingLists.find(list => 
      list.items.some(listItem => listItem.id === item.id)
    )?.id;
    
    return { ...item, listId };
  });
  
  return (
    <Layout>
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Search Items</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items by name, location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          {searchQuery.trim() && resultsWithList.length === 0 && (
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
              <p className="text-muted-foreground">
                No items found matching "{searchQuery}"
              </p>
            </div>
          )}
          
          {resultsWithList.map((item) => {
            const category = categories.find(cat => cat.id === item.categoryId);
            const list = shoppingLists.find(list => list.id === item.listId);
            
            return (
              <Link to={`/list/${item.listId}`} key={item.id}>
                <Card className="mb-3 hover:shadow-sm transition-shadow duration-200">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                          <span className="flex items-center">
                            <span 
                              className="inline-block w-3 h-3 rounded-full mr-1" 
                              style={{ backgroundColor: category?.color || "#9ca3af" }}
                            />
                            {category?.name || "Other"}
                          </span>
                          <span>{item.quantity} {item.unit}</span>
                        </div>
                        {item.storeLocation && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Location: {item.storeLocation}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        {list && (
                          <div className="text-xs text-muted-foreground mt-1">
                            In: {list.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
