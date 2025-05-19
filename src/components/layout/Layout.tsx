
import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function Layout({ children, showBottomNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16">
      <main className="flex-1">{children}</main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
