import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HotelSidebar } from "./ManagerDashboardSidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useFullApp } from "@/store/hooks/useFullApp";

import LoadingBar from "@/components/LoadingBar";
import ManagerWelcome from "./ManagerWelcome";
import { useGetOwnerHotel } from "@/pages/app/hooks/useHotelsManagement";

export function ManagerDashboardLayout() {
  const { user } = useFullApp();
  const { isLoading, isError } = useGetOwnerHotel();

  if (!user || user.role !== "owner") return <Navigate to="/" />;
  if (isLoading) return <LoadingBar />;
  return (
    <>
      {isError ? (
        <ManagerWelcome />
      ) : (
        <div className={`min-h-screen w-full`}>
          <div className="flex h-screen overflow-hidden">
            <div className="hidden md:block">
              <HotelSidebar />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden absolute top-4 left-4 z-50"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <HotelSidebar />
              </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden ">
              {/* Header */}
              <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 w-full">
                <div className="md:hidden w-8"></div>
                <h1 className="text-xl font-semibold">StayFlow</h1>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
