import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Hotel,
  Menu,
  Search,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Authenticate from "./NonAuthorizer";
import { authApi } from "@/lib/axios";
import { useFullApp } from "@/store/hooks/useFullApp";
const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useFullApp();

  const logout = async () => {
    await authApi.post("/logout");
    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-col w-full z-50">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col gap-4 mt-6">
                    <Link
                      to="#"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="#"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-2"
                    >
                      Bookings
                    </Link>
                    <Link
                      to="#"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-2"
                    >
                      Rooms
                    </Link>
                    <Link
                      to="#"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-2"
                    >
                      Guests
                    </Link>
                    <Link
                      to="#"
                      className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 py-2"
                    >
                      Reports
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link to="#" className="flex items-center gap-2">
                <Hotel className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">
                  StayFlow
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 ml-6">
                <Link
                  to="#"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  to="#"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Bookings
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 px-1 text-sm font-medium"
                    >
                      Management <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Rooms</DropdownMenuItem>
                    <DropdownMenuItem>Guests</DropdownMenuItem>
                    <DropdownMenuItem>Staff</DropdownMenuItem>
                    <DropdownMenuItem>Services</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  to="#"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Reports
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex relative w-40 lg:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-8 bg-background"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Help</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                {user ? (
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={async () => await logout()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                ) : (
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate("/auth/login")}
                      className="cursor-pointer"
                    >
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/auth/register")}
                      className="cursor-pointer"
                    >
                      Register
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          </div>
        </header>
        {user ? (
          <div className="ml-16 max-[770px]:ml-0 max-[770px]:mb-16">
            <Outlet />
          </div>
        ) : (
          <Authenticate />
        )}
      </div>
    </>
  );
};

export default NavBar;
