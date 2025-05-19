
import { Link, useLocation } from "react-router-dom";
import { Search, Home, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { 
      name: "Home", 
      icon: Home, 
      path: "/" 
    },
    { 
      name: "Lists", 
      icon: List, 
      path: "/lists" 
    },
    { 
      name: "New", 
      icon: Plus, 
      path: "/create-list" 
    },
    { 
      name: "Search", 
      icon: Search, 
      path: "/search" 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 z-50">
      <nav className="h-full">
        <ul className="flex items-center justify-around h-full">
          {navItems.map((item) => (
            <li key={item.name} className="flex-1">
              <Link
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center h-full",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-500"
                )}
              >
                <item.icon size={20} />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
