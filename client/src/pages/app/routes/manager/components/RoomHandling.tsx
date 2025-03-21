import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Bed,
  DollarSign,
  Hash,
  ImageIcon,
  Loader2,
  Trash2,
  Users,
  Wifi,
  Wind,
  Refrigerator,
  Tv,
  Check,
  Save,
  Coffee,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Common amenities for rooms
const roomAmenities = [
  { id: "tv", label: "TV", icon: <Tv className="h-4 w-4 mr-2" /> },
  { id: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4 mr-2" /> },
  {
    id: "ac",
    label: "Air Conditioning",
    icon: <Wind className="h-4 w-4 mr-2" />,
  },
  {
    id: "minibar",
    label: "Minibar",
    icon: <Refrigerator className="h-4 w-4 mr-2" />,
  },
  {
    id: "coffee",
    label: "Coffee Maker",
    icon: <Coffee className="h-4 w-4 mr-2" />,
  },
  {
    id: "breakfast",
    label: "Room Service",
    icon: <Utensils className="h-4 w-4 mr-2" />,
  },
];

// Define the validation schema using Zod
const roomSchema = z.object({
  hotel_id: z.number().int().positive("Hotel ID is required"),
  room_number: z.string().min(1, "Room number is required"),
  type: z.enum(["single", "double", "suite", "deluxe"], {
    required_error: "Room type is required",
  }),
  price: z.coerce.number().positive("Price must be positive"),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacity must be a positive integer"),
  is_available: z.boolean().default(true),
  room_images: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
});

type RoomFormValues = z.infer<typeof roomSchema>;

// Mock API function
const createRoom = async (data: RoomFormValues) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Submitted room data:", data);
  return data;
};

// Mock image upload function
const uploadImage = async (file: File): Promise<string> => {
  // In a real app, this would upload to a storage service and return the URL
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock URL for the uploaded image
      resolve(`https://example.com/images/${file.name}`);
    }, 800);
  });
};

export default function RoomHandling() {
  const [roomCount, setRoomCount] = useState<number>(1);
  const [createdRooms, setCreatedRooms] = useState<number[]>([]);

  // Handle room count change
  const handleRoomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number.parseInt(e.target.value);
    if (!isNaN(count) && count > 0 && count <= 20) {
      setRoomCount(count);
    }
  };

  return (
    <div className="container max-w-5xl py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Room Management</CardTitle>
          <CardDescription>
            Create and manage rooms for your hotel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="w-full max-w-xs">
              <FormLabel htmlFor="room-count">
                Number of Rooms to Create
              </FormLabel>
              <Input
                id="room-count"
                type="number"
                min="1"
                max="20"
                value={roomCount}
                onChange={handleRoomCountChange}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum 20 rooms at once
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <div className="grid gap-6">
        {Array.from({ length: roomCount }).map((_, index) => (
          <SingleRoomForm
            key={index}
            roomIndex={index}
            isCreated={createdRooms.includes(index)}
            onRoomCreated={() => setCreatedRooms((prev) => [...prev, index])}
          />
        ))}
      </div> */}
    </div>
  );
}

// interface SingleRoomFormProps {
//   roomIndex: number;
//   isCreated: boolean;
//   onRoomCreated: () => void;
// }

// function SingleRoomForm({
//   roomIndex,
//   isCreated,
//   onRoomCreated,
// }: SingleRoomFormProps) {
//   const [uploadingImage, setUploadingImage] = useState(false);

//   // Initialize form
//   const form = useForm<RoomFormValues>({
//     resolver: zodResolver(roomSchema),
//     defaultValues: {
//       hotel_id: 1, // This would typically come from a prop or context
//       room_number: "",
//       type: "single",
//       price: 0,
//       capacity: 1,
//       is_available: true,
//       room_images: [],
//       amenities: [],
//     },
//   });

//   // Setup mutation
//   const mutation = useMutation({
//     mutationFn: createRoom,
//     onSuccess: () => {
//       toast({
//         title: "Room created successfully",
//         description: `Room ${form.getValues(
//           "room_number"
//         )} has been added to the hotel.`,
//       });
//       onRoomCreated();
//     },
//   });

//   // Form submission handler
//   function onSubmit(data: RoomFormValues) {
//     mutation.mutate(data);
//   }

//   // Handle room image upload
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;

//     setUploadingImage(true);
//     try {
//       const file = e.target.files[0];
//       const imageUrl = await uploadImage(file);

//       const currentImages = form.getValues("room_images") || [];
//       form.setValue("room_images", [...currentImages, imageUrl]);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast({
//         title: "Error uploading image",
//         description:
//           "There was a problem uploading your image. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   // Remove room image
//   const removeImage = (indexToRemove: number) => {
//     const currentImages = form.getValues("room_images") || [];
//     form.setValue(
//       "room_images",
//       currentImages.filter((_, index) => index !== indexToRemove)
//     );
//   };

//   return (
//     <Card
//       className={
//         isCreated
//           ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900"
//           : ""
//       }
//     >
//       <CardHeader className="bg-gray-50 dark:bg-gray-900">
//         <div className="flex items-center justify-between">
//           <CardTitle>Room {roomIndex + 1}</CardTitle>
//           {isCreated && (
//             <Badge variant="default" className="flex items-center gap-1">
//               <Check className="h-3.5 w-3.5" />
//               Created
//             </Badge>
//           )}
//         </div>
//         <CardDescription>
//           {isCreated
//             ? "This room has been created successfully"
//             : "Fill in the details to create this room"}
//         </CardDescription>
//       </CardHeader>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <CardContent className="space-y-6 pt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="room_number"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Room Number</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           placeholder="101"
//                           {...field}
//                           className="pl-10"
//                           disabled={isCreated}
//                         />
//                         <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       </div>
//                     </FormControl>
//                     <FormDescription>
//                       Unique identifier for this room
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Room Type</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={isCreated}
//                     >
//                       <FormControl>
//                         <SelectTrigger className="pl-10">
//                           <SelectValue placeholder="Select room type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="single">Single</SelectItem>
//                         <SelectItem value="double">Double</SelectItem>
//                         <SelectItem value="suite">Suite</SelectItem>
//                         <SelectItem value="deluxe">Deluxe</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Bed className="absolute left-3 top-[2.7rem] h-4 w-4 text-gray-400" />
//                     <FormDescription>
//                       Type determines the room's features and pricing
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price per Night</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           placeholder="199.99"
//                           {...field}
//                           className="pl-10"
//                           disabled={isCreated}
//                         />
//                         <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       </div>
//                     </FormControl>
//                     <FormDescription>
//                       Standard nightly rate for this room
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="capacity"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Capacity</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           type="number"
//                           min="1"
//                           placeholder="2"
//                           {...field}
//                           className="pl-10"
//                           disabled={isCreated}
//                         />
//                         <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       </div>
//                     </FormControl>
//                     <FormDescription>
//                       Maximum number of guests allowed
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <Separator />

//             <FormField
//               control={form.control}
//               name="amenities"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>Room Amenities</FormLabel>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
//                     {roomAmenities.map((amenity) => (
//                       <FormField
//                         key={amenity.id}
//                         control={form.control}
//                         name="amenities"
//                         render={({ field }) => {
//                           return (
//                             <FormItem
//                               key={amenity.id}
//                               className="flex flex-row items-start space-x-3 space-y-0"
//                             >
//                               <FormControl>
//                                 <Checkbox
//                                   checked={field.value?.includes(amenity.id)}
//                                   onCheckedChange={(checked) => {
//                                     return checked
//                                       ? field.onChange([
//                                           ...field.value,
//                                           amenity.id,
//                                         ])
//                                       : field.onChange(
//                                           field.value?.filter(
//                                             (value) => value !== amenity.id
//                                           )
//                                         );
//                                   }}
//                                   disabled={isCreated}
//                                 />
//                               </FormControl>
//                               <FormLabel className="font-normal flex items-center">
//                                 {amenity.icon}
//                                 {amenity.label}
//                               </FormLabel>
//                             </FormItem>
//                           );
//                         }}
//                       />
//                     ))}
//                   </div>
//                   <FormDescription>
//                     Select the amenities available in this room
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="room_images"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Room Images</FormLabel>
//                   <FormControl>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {field.value &&
//                           field.value.map((image, index) => (
//                             <div key={index} className="relative group">
//                               <div className="aspect-square rounded-md border overflow-hidden bg-gray-100 dark:bg-gray-800">
//                                 <img
//                                   src={
//                                     image ||
//                                     "/placeholder.svg?height=200&width=200&text=Image"
//                                   }
//                                   alt={`Room image ${index + 1}`}
//                                   className="object-cover w-full h-full"
//                                 />
//                               </div>
//                               {!isCreated && (
//                                 <Button
//                                   type="button"
//                                   variant="destructive"
//                                   size="icon"
//                                   className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//                                   onClick={() => removeImage(index)}
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               )}
//                             </div>
//                           ))}
//                         {!isCreated && (
//                           <div className="aspect-square rounded-md border border-dashed flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//                             <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
//                               {uploadingImage ? (
//                                 <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
//                               ) : (
//                                 <>
//                                   <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
//                                   <span className="text-sm text-gray-500">
//                                     Add Image
//                                   </span>
//                                 </>
//                               )}
//                               <input
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={handleImageUpload}
//                                 disabled={uploadingImage || isCreated}
//                               />
//                             </label>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </FormControl>
//                   <FormDescription>
//                     Upload images of this room to showcase its features
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="is_available"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <FormLabel className="text-base">
//                       Available for Booking
//                     </FormLabel>
//                     <FormDescription>
//                       Mark this room as available for guests to book
//                     </FormDescription>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                       disabled={isCreated}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </CardContent>

//           <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 flex justify-end">
//             {isCreated ? (
//               <Button variant="outline" disabled>
//                 <Check className="mr-2 h-4 w-4" />
//                 Room Created
//               </Button>
//             ) : (
//               <Button
//                 type="submit"
//                 disabled={mutation.isPending}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 {mutation.isPending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="mr-2 h-4 w-4" /> Create Room
//                   </>
//                 )}
//               </Button>
//             )}
//           </CardFooter>
//         </form>
//       </Form>
//     </Card>
//   );
// }
