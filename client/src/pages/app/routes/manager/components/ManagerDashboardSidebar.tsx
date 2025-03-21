import {
  BarChart3,
  BedDouble,
  Calendar,
  ChevronDown,
  CreditCard,
  Gift,
  Hotel,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Percent,
  Settings,
  Star,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function HotelSidebar() {
  const { pathname } = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r border-border">
        <SidebarHeader className="border-b border-border">
          <div className="flex items-center gap-2 px-4 py-3">
            <Hotel className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">StayFlow</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard"}
                    tooltip="Dashboard"
                  >
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/bookings"}
                    tooltip="Bookings"
                  >
                    <Link to="/bookings">
                      <Calendar className="h-5 w-5" />
                      <span>Bookings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Collapsible className="w-full">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname?.startsWith("/rooms")}
                        tooltip="Rooms"
                      >
                        <BedDouble className="h-5 w-5" />
                        <span>Rooms</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/rooms/all"}
                          >
                            <Link to="handleRooms">Handle Rooms</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/rooms/available"}
                          >
                            <Link to="/rooms/available">Available</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/rooms/occupied"}
                          >
                            <Link to="/rooms/occupied">Occupied</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/rooms/maintenance"}
                          >
                            <Link to="/rooms/maintenance">Maintenance</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/rooms/types"}
                          >
                            <Link to="/rooms/types">Room Types</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Collapsible className="w-full">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname?.startsWith("/guests")}
                        tooltip="Guests"
                      >
                        <Users className="h-5 w-5" />
                        <span>Guests</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/guests/all"}
                          >
                            <Link to="/guests/all">All Guests</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/guests/current"}
                          >
                            <Link to="/guests/current">Current Guests</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/guests/vip"}
                          >
                            <Link to="/guests/vip">VIP Guests</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Hotel Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/staff"}
                    tooltip="Staff"
                  >
                    <Link to="/staff">
                      <Users className="h-5 w-5" />
                      <span>Staff</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Collapsible className="w-full">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname?.startsWith("/services")}
                        tooltip="Services"
                      >
                        <Gift className="h-5 w-5" />
                        <span>Services</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/services/restaurant"}
                          >
                            <Link to="/services/restaurant">Restaurant</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/services/spa"}
                          >
                            <Link to="/services/spa">Spa & Wellness</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/services/housekeeping"}
                          >
                            <Link to="/services/housekeeping">
                              Housekeeping
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/services/amenities"}
                          >
                            <Link to="/services/amenities">Amenities</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/billing"}
                    tooltip="Billing"
                  >
                    <Link to="/billing">
                      <CreditCard className="h-5 w-5" />
                      <span>Billing</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/promotions"}
                    tooltip="Promotions"
                  >
                    <Link to="/promotions">
                      <Percent className="h-5 w-5" />
                      <span>Promotions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Reports & Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Collapsible className="w-full">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname?.startsWith("/reports")}
                        tooltip="Reports"
                      >
                        <BarChart3 className="h-5 w-5" />
                        <span>Reports</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/reports/financial"}
                          >
                            <Link to="/reports/financial">Financial</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/reports/occupancy"}
                          >
                            <Link to="/reports/occupancy">Occupancy</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/reports/staff"}
                          >
                            <Link to="/reports/staff">Staff</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === "/reports/custom"}
                          >
                            <Link to="/reports/custom">Custom Reports</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/reviews"}
                    tooltip="Reviews"
                  >
                    <Link to="/reviews">
                      <Star className="h-5 w-5" />
                      <span>Reviews</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/messages"}
                    tooltip="Messages"
                  >
                    <Link to="/messages">
                      <MessageSquare className="h-5 w-5" />
                      <span>Messages</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/settings"}
                    tooltip="Settings"
                  >
                    <Link to="/settings">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">
                Hotel Manager
              </span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
