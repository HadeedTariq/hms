import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Trash2,
  Plus,
  Hotel,
  BedDouble,
  DollarSign,
  Users,
  Check,
  X,
  ImageIcon,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { toast } from "@/hooks/use-toast";
import { useGetOwnerHotel } from "@/pages/app/hooks/useHotelsManagement";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { managerApi } from "@/lib/axios";

// Define the room types based on the schema
const roomTypes = ["single", "double", "suite", "deluxe"] as const;

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

// Zod schema for room creation
const roomSchema = z.object({
  hotel_id: z.coerce.number().positive("Room ID is required"),
  room_number: z.string().min(1, "Room number is required"),
  type: z.enum(roomTypes, {
    errorMap: () => ({ message: "Please select a valid room type" }),
  }),
  price: z.coerce.number().positive("Price must be greater than 0"),
  capacity: z.coerce.number().int().positive("Capacity must be at least 1"),
  is_available: z.boolean().default(true),
  room_images: z.array(z.string().url("Please enter a valid URL")).default([]),
  amenities: z.array(z.string()).default([]),
});

type RoomFormValues = z.infer<typeof roomSchema>;

const uploadImage = async (file: File) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "n5y4fqsf");
    formData.append("cloud_name", "lmsproject");
    try {
      const { data: cloudinaryData } = await axios.post(
        "https://api.cloudinary.com/v1_1/lmsproject/image/upload",
        formData
      );
      return cloudinaryData.secure_url;
    } catch (err) {
      console.log(err);
      toast({
        title: "Error uploading",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
      return "";
    }
  }
};

export default function RoomCreationForm() {
  const [uploadingRoomImage, setUploadingRoomImage] = useState(false);

  const { data, isError } = useGetOwnerHotel();

  // Form for single room creation
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      hotel_id: data?.id || undefined,
      room_number: "",
      type: "single",
      price: undefined,
      capacity: 1,
      is_available: true,
      room_images: [],
      amenities: [],
    },
  });

  const handleRoomImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingRoomImage(true);
    try {
      const file = e.target.files[0];
      const imageUrl = await uploadImage(file);

      const currentImages = form.getValues("room_images") || [];
      form.setValue("room_images", [...currentImages, imageUrl]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingRoomImage(false);
    }
  };
  const removeRoomImage = (indexToRemove: number) => {
    const currentImages = form.getValues("room_images") || [];
    form.setValue(
      "room_images",
      currentImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // State for managing image URLs and amenities

  const [newAmenity, setNewAmenity] = useState("");

  // Function to add a custom amenity
  const addCustomAmenity = () => {
    if (!newAmenity) return;

    const currentAmenities = form.getValues("amenities") || [];
    if (!currentAmenities.includes(newAmenity)) {
      form.setValue("amenities", [...currentAmenities, newAmenity]);
    }

    setNewAmenity("");
  };

  // Function to toggle a common amenity
  const toggleAmenity = (amenity: string) => {
    const currentAmenities = form.getValues("amenities") || [];
    if (currentAmenities.includes(amenity)) {
      form.setValue(
        "amenities",
        currentAmenities.filter((a) => a !== amenity)
      );
    } else {
      form.setValue("amenities", [...currentAmenities, amenity]);
    }
  };

  // Function to remove a custom amenity
  const removeAmenity = (amenity: string) => {
    const currentAmenities = form.getValues("amenities") || [];
    form.setValue(
      "amenities",
      currentAmenities.filter((a) => a !== amenity)
    );
  };

  const { mutate: createRoom, isPending: isRoomCreationPending } = useMutation({
    mutationKey: ["createRoom"],
    mutationFn: async (roomData: RoomFormValues) => {
      const { data } = await managerApi.post("/create-room", roomData);
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: data.message || "Room created successfully",
        description: "Your hotel has been created successfully.",
      });
      form.reset();
    },
    onError: (err: ErrResponse) => {
      toast({
        title: err.response.data.message || "Error Creating Room",
        variant: "destructive",
      });
    },
  });

  // Function to handle single room creation

  function onSubmit(data: RoomFormValues) {
    createRoom(data);
  }

  if (isError) return <Navigate to={"/manager-dashboard"} />;

  return (
    <div className="container  py-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage hotel rooms
          </p>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="bg-primary/5 rounded-t-lg">
          <CardTitle>Create New Room</CardTitle>
          <CardDescription>
            Add a new room to your hotel inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hotel_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            readOnly
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
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
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="room_images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {field.value &&
                              field.value.map((image, index) => (
                                <div key={index} className="relative group">
                                  <div className="aspect-square rounded-md border overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                      src={
                                        image ||
                                        "/placeholder.svg?height=200&width=200&text=Image"
                                      }
                                      alt={`Room image ${index + 1}`}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeRoomImage(index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            <div className="aspect-square rounded-md border border-dashed flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                {uploadingRoomImage ? (
                                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                ) : (
                                  <>
                                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                      Add Image
                                    </span>
                                  </>
                                )}
                                <input
                                  readOnly={data ? true : false}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleRoomImageUpload}
                                  disabled={uploadingRoomImage}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload images of your rooms (bedroom,washroom, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    onClick={() => addCustomAmenity()}
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
                      const isSelected = form
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
                {form.watch("amenities")?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Selected Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {form.watch("amenities")?.map((amenity) => (
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

              <Button
                type="submit"
                className="w-full"
                disabled={isRoomCreationPending}
              >
                {isRoomCreationPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
