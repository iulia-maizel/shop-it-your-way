
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ShoppingListCard } from "@/components/lists/ShoppingListCard";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { 
  Plus, 
  PieChart, 
  ShoppingCart, 
  Calendar,
  ArrowRight 
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const { shoppingLists, getTotalSpent } = useShoppingList();
  const navigate = useNavigate();
  
  const createNewList = () => {
    navigate("/create-list");
  };

  const viewAllLists = () => {
    navigate("/lists");
  };

  // Calculate statistics
  const totalBudget = shoppingLists.reduce((sum, list) => sum + list.budget, 0);
  const totalSpent = shoppingLists.reduce((sum, list) => sum + getTotalSpent(list.id), 0);
  const totalItems = shoppingLists.reduce((sum, list) => sum + list.items.length, 0);
  const completedItems = shoppingLists.reduce(
    (sum, list) => sum + list.items.filter(item => item.checked).length, 
    0
  );

  // Get recent lists (last 5)
  const recentLists = [...shoppingLists]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Shopping Dashboard</h1>
          <p className="text-lg opacity-90 mb-4">
            Manage your shopping lists and stay on budget
          </p>
          <div className="flex gap-3">
            <Button onClick={createNewList} variant="secondary" className="bg-white text-purple-700 hover:bg-gray-100">
              <Plus size={16} className="mr-1" />
              New List
            </Button>
            <Button onClick={viewAllLists} variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              View All Lists
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Budget" 
            value={formatCurrency(totalBudget)} 
            icon={<PieChart className="text-green-500" />} 
          />
          <StatCard 
            title="Total Spent" 
            value={formatCurrency(totalSpent)} 
            icon={<ShoppingCart className="text-blue-500" />}
          />
          <StatCard 
            title="Items Completed" 
            value={`${completedItems}/${totalItems}`} 
            icon={<Calendar className="text-amber-500" />}
          />
          <StatCard 
            title="Progress" 
            value={totalItems > 0 ? `${Math.round((completedItems / totalItems) * 100)}%` : "0%"} 
            icon={<PieChart className="text-purple-500" />}
          />
        </div>
        
        {/* Recent Lists Section */}
        {recentLists.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Lists</h2>
              <Button variant="ghost" onClick={viewAllLists} className="text-sm">
                View All <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
            
            <Carousel className="mb-8">
              <CarouselContent>
                {recentLists.map((list) => (
                  <CarouselItem key={list.id} className="md:basis-1/2 lg:basis-1/3">
                    <ShoppingListCard list={list} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex">
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </div>
            </Carousel>
          </>
        )}
        
        {/* Empty State */}
        {shoppingLists.length === 0 && (
          <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">No Lists Yet</h2>
            <p className="text-muted-foreground mb-4">
              Create your first shopping list to get started tracking your purchases and staying on budget.
            </p>
            <Button onClick={createNewList}>
              <Plus size={16} className="mr-1" />
              Create List
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default HomePage;
