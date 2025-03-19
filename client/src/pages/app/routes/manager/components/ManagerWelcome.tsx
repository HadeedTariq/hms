"use client";
import {
  BedDouble,
  Building2,
  Calendar,
  Hotel,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple feature list
const features = [
  {
    icon: <Calendar className="h-6 w-6 text-blue-500" />,
    title: "Booking Management",
    description: "Manage reservations and check-ins with ease.",
  },
  {
    icon: <BedDouble className="h-6 w-6 text-blue-500" />,
    title: "Room Management",
    description: "Track room status and availability in real-time.",
  },
  {
    icon: <Users className="h-6 w-6 text-blue-500" />,
    title: "Guest Management",
    description: "Store guest information and preferences.",
  },
  {
    icon: <Settings className="h-6 w-6 text-blue-500" />,
    title: "Hotel Settings",
    description: "Configure your hotel details and policies.",
  },
];

export default function WelcomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Simple Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <Hotel className="mr-1.5 h-4 w-4" />
          Hotel Management System
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Welcome to StayFlow</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Get started by creating your first hotel and begin managing your
          property efficiently.
        </p>
      </div>

      {/* Create Hotel Card */}
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Hotels Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Create your first hotel to start managing bookings, rooms, and
            guests all in one place.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Hotel
          </Button>
        </CardContent>
      </Card>

      {/* Simple Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl font-semibold">Getting Started is Easy</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Create your hotel, add rooms, and start accepting bookings in
              minutes. Our intuitive interface makes hotel management simple and
              efficient.
            </p>
            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Hotel
              </Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </div>
          <div className="md:w-1/3">
            <img
              src="/placeholder.svg?height=200&width=300&text=StayFlow"
              alt="StayFlow Dashboard Preview"
              className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
