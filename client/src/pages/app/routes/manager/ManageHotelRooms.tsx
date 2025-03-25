import { useEffect, useState } from "react";
import {
  BedDouble,
  Check,
  DollarSign,
  Edit,
  Hotel,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useGetOwnerHotelRooms } from "../../hooks/useHotelsManagement";
import { Navigate } from "react-router-dom";
import LoadingBar from "@/components/LoadingBar";
import { roomSchema } from "./components/RoomHandling";

// Define the room types based on the schema
const roomTypes = ["single", "double", "suite", "deluxe"] as const;

// Zod schema for batch price update
const priceUpdateSchema = z.object({
  type: z.enum(roomTypes, {
    errorMap: () => ({ message: "Please select a valid room type" }),
  }),
  price: z.coerce.number().positive("Price must be greater than 0"),
  percentage: z.boolean().default(false),
});

type RoomFormValues = z.infer<typeof roomSchema> & { id: number };
type PriceUpdateFormValues = z.infer<typeof priceUpdateSchema>;

export default function ManageRooms() {
  // State for managing rooms data
  const { data, isPending, isError } = useGetOwnerHotelRooms();
  const [rooms, setRooms] = useState(data);
  const [filteredRooms, setFilteredRooms] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterAvailability, setFilterAvailability] = useState<string | null>(
    null
  );

  // State for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomFormValues | null>(null);

  // State for image and amenity management
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newAmenity, setNewAmenity] = useState("");

  // Form for editing a room
  const editForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      id: 0,
      hotel_id: 0,
      room_number: "",
      type: "single",
      price: 0,
      capacity: 1,
      is_available: true,
      room_images: [],
      amenities: [],
    },
  });

  // Form for batch price update
  const priceUpdateForm = useForm<PriceUpdateFormValues>({
    resolver: zodResolver(priceUpdateSchema),
    defaultValues: {
      type: "single",
      price: 0,
      percentage: false,
    },
  });

  // Function to apply filters
  const applyFilters = (availabilityFilter: string, typeFilter?: string) => {
    let result = [...(rooms ? rooms : [])];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result?.filter(
        (room) =>
          room.room_number.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query) ||
          room.amenities.some((amenity: string) =>
            amenity.toLowerCase().includes(query)
          )
      );
    }

    // Apply room type filter
    if (typeFilter === "all") {
      result = result.filter((room) => room.type);
    } else if (typeFilter !== "all") {
      result = result.filter((room) => room.type === typeFilter);
    } else if (typeFilter.length < 1 && filterType !== "all") {
      result = result.filter((room) => room.type === filterType);
    }

    // Apply availability filter
    if (availabilityFilter !== null) {
      if (
        availabilityFilter === "all" ||
        (filterAvailability === "all" && availabilityFilter === "")
      ) {
        result = result.filter(
          (room) => room.is_available || !room.is_available
        );
      } else if (
        availabilityFilter === "true" ||
        (filterAvailability === "true" && availabilityFilter === "")
      ) {
        result = result.filter((room) => room.is_available === true);
      } else if (
        availabilityFilter === "false" ||
        (filterAvailability === "false" && availabilityFilter === "")
      ) {
        result = result.filter((room) => room.is_available === false);
      }
    }

    setFilteredRooms(result);
  };

  // Function to reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterType(null);
    setFilterAvailability(null);
    setFilteredRooms(rooms);
  };

  // Function to open edit dialog
  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    editForm.reset({
      id: room.id,
      hotel_id: room.hotel_id,
      room_number: room.room_number,
      type: room.type,
      price: room.price,
      capacity: room.capacity,
      is_available: room.is_available,
      room_images: room.room_images,
      amenities: room.amenities,
    });
    setEditDialogOpen(true);
  };

  // Function to add a new image URL
  const addImageUrl = () => {
    if (!newImageUrl) return;

    const currentImages = editForm.getValues("room_images") || [];
    editForm.setValue("room_images", [...currentImages, newImageUrl]);
    setNewImageUrl("");
  };

  // Function to remove an image URL
  const removeImageUrl = (index: number) => {
    const currentImages = editForm.getValues("room_images") || [];
    editForm.setValue(
      "room_images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  // Function to add a custom amenity
  const addCustomAmenity = () => {
    if (!newAmenity) return;

    const currentAmenities = editForm.getValues("amenities") || [];
    if (!currentAmenities.includes(newAmenity)) {
      editForm.setValue("amenities", [...currentAmenities, newAmenity]);
    }

    setNewAmenity("");
  };

  // Function to toggle an amenity
  const toggleAmenity = (amenity: string) => {
    const currentAmenities = editForm.getValues("amenities") || [];
    if (currentAmenities.includes(amenity)) {
      editForm.setValue(
        "amenities",
        currentAmenities.filter((a) => a !== amenity)
      );
    } else {
      editForm.setValue("amenities", [...currentAmenities, amenity]);
    }
  };

  // Function to remove an amenity
  const removeAmenity = (amenity: string) => {
    const currentAmenities = editForm.getValues("amenities") || [];
    editForm.setValue(
      "amenities",
      currentAmenities.filter((a) => a !== amenity)
    );
  };

  // Function to handle room update
  const onUpdateRoom = async (data: RoomFormValues) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your API
      console.log("Updating room:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Room updated successfully",
        description: `Room ${data.room_number} has been updated.`,
      });

      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        title: "Error updating room",
        description: "There was an error updating the room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle batch price update
  const onUpdatePrices = async (data: PriceUpdateFormValues) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your API
      console.log("Updating prices:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the prices in the local state
      const updatedRooms = rooms?.map((room) => {
        if (room.type === data.type) {
          if (data.percentage) {
            // Calculate new price based on percentage increase/decrease
            const newPrice = room.price * (1 + data.price / 100);
            return { ...room, price: Number.parseFloat(newPrice.toFixed(2)) };
          } else {
            // Set absolute price
            return { ...room, price: data.price };
          }
        }
        return room;
      });

      setRooms(updatedRooms);
      setFilteredRooms(updatedRooms);

      toast({
        title: "Prices updated successfully",
        description: `Prices for ${data.type} rooms have been updated.`,
      });

      setPriceDialogOpen(false);
    } catch (error) {
      console.error("Error updating prices:", error);
      toast({
        title: "Error updating prices",
        description:
          "There was an error updating the prices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Common amenities for quick selection
  const commonAmenities = [
    "TV",
    "AC",
    "Minibar",
    "Wi-Fi",
    "Safe",
    "Balcony",
    "Ocean View",
    "Room Service",
    "Coffee Maker",
    "Hair Dryer",
    "Iron",
    "Bathtub",
    "Shower",
    "King Bed",
    "Queen Bed",
  ];

  useEffect(() => {
    setRooms(data);
    setFilteredRooms(data);
  }, [data]);

  if (isPending) return <LoadingBar />;
  if (isError) return <Navigate to={"/"} />;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your hotel rooms
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                Update Prices
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Room Prices</DialogTitle>
                <DialogDescription>
                  Update prices for all rooms of a specific type.
                </DialogDescription>
              </DialogHeader>
              <Form {...priceUpdateForm}>
                <form
                  onSubmit={priceUpdateForm.handleSubmit(onUpdatePrices)}
                  className="space-y-4 py-4"
                >
                  <FormField
                    control={priceUpdateForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="capitalize"
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={priceUpdateForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {priceUpdateForm.watch("percentage")
                            ? "Percentage Change"
                            : "New Price"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step={
                                priceUpdateForm.watch("percentage")
                                  ? "1"
                                  : "0.01"
                              }
                              placeholder={
                                priceUpdateForm.watch("percentage")
                                  ? "10"
                                  : "99.99"
                              }
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {priceUpdateForm.watch("percentage")
                            ? "Enter a percentage (e.g., 10 for 10% increase, -5 for 5% decrease)"
                            : "Enter the new price for all selected rooms"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={priceUpdateForm.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Percentage Mode
                          </FormLabel>
                          <FormDescription>
                            Update by percentage instead of absolute value
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Prices"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-primary/5 rounded-t-lg pb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  applyFilters("");
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={filterType || ""}
                onValueChange={(value) => {
                  console.log(value);

                  setFilterType(value || null);
                  applyFilters("", value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {roomTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={
                  filterAvailability === null
                    ? ""
                    : filterAvailability.toString()
                }
                onValueChange={(value) => {
                  setFilterAvailability(value);
                  applyFilters(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All rooms</SelectItem>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Room #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No rooms found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms?.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">
                        {room.room_number}
                      </TableCell>
                      <TableCell className="capitalize">{room.type}</TableCell>
                      <TableCell>${room.price}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            room.is_available ? "default" : "destructive"
                          }
                          className="bg-opacity-15"
                        >
                          {room.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {room.amenities.slice(0, 2).map((amenity, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(room)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Room Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the details for room {selectedRoom?.room_number}.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onUpdateRoom)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="hotel_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Enter hotel ID"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="room_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="e.g., 101, A201"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roomTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Availability
                        </FormLabel>
                        <FormDescription>
                          Is this room available for booking?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Room Images Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Room Images</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addImageUrl}
                      variant="secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {editForm.watch("room_images")?.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-md bg-muted"
                      >
                        <div className="w-12 h-12 rounded overflow-hidden bg-background flex-shrink-0">
                          <img
                            src={url || "/placeholder.svg"}
                            alt="Room"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.svg?height=48&width=48";
                            }}
                          />
                        </div>
                        <div className="flex-1 truncate text-sm">{url}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImageUrl(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Amenities Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Amenities</h3>

                {/* Custom amenity input */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Add custom amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={addCustomAmenity}
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Common amenities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Common Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {commonAmenities.map((amenity) => {
                      const isSelected = editForm
                        .watch("amenities")
                        ?.includes(amenity);
                      return (
                        <Badge
                          key={amenity}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleAmenity(amenity)}
                        >
                          {isSelected && <Check className="h-3 w-3 mr-1" />}
                          {amenity}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Selected amenities */}
                {editForm.watch("amenities")?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Selected Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {editForm.watch("amenities")?.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {amenity}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeAmenity(amenity)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Room"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
