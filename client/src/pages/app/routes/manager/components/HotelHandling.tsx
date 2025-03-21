import type React from "react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Star,
  Trash2,
  ArrowRight,
  Loader2,
  Clock,
  ImageIcon,
  Wifi,
  Utensils,
  Dumbbell,
  PocketIcon as Pool,
  Car,
  Coffee,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { managerApi } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useGetOwnerHotel } from "@/pages/app/hooks/useHotelsManagement";
import LoadingBar from "@/components/LoadingBar";
import { useNavigate } from "react-router-dom";

// Common amenities for hotels
const hotelAmenities = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4 mr-2" /> },
  {
    id: "pool",
    label: "Swimming Pool",
    icon: <Pool className="h-4 w-4 mr-2" />,
  },
  {
    id: "gym",
    label: "Fitness Center",
    icon: <Dumbbell className="h-4 w-4 mr-2" />,
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: <Utensils className="h-4 w-4 mr-2" />,
  },
  {
    id: "parking",
    label: "Free Parking",
    icon: <Car className="h-4 w-4 mr-2" />,
  },
  {
    id: "breakfast",
    label: "Complimentary Breakfast",
    icon: <Coffee className="h-4 w-4 mr-2" />,
  },
];

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const hotelFormSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),
  description: z.string().optional(),
  location: z.string().min(5, "Location is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(10, "Phone number is required"),
  hotel_images: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  policies: z.string().optional(),
  check_in_time: z
    .string()
    .regex(timeRegex, "Invalid time format. Use HH:MM")
    .default("14:00"),
  check_out_time: z
    .string()
    .regex(timeRegex, "Invalid time format. Use HH:MM")
    .default("12:00"),
});

type HotelFormValues = z.infer<typeof hotelFormSchema>;

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

export default function HotelHandling() {
  const { data, isLoading } = useGetOwnerHotel();
  const [uploadingHotelImage, setUploadingHotelImage] = useState(false);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      rating: 0,
      contact_email: "",
      contact_phone: "",
      hotel_images: [],
      amenities: [],
      policies: "",
      check_in_time: "14:00",
      check_out_time: "12:00",
    },
  });

  // Setup mutation
  const { mutate: createHotel, isPending: isHotelCreationPending } =
    useMutation({
      mutationFn: async (hotelData: HotelFormValues) => {
        const { data } = await managerApi.post("/", hotelData);
        return data;
      },
      onSuccess: (data: any) => {
        toast({
          title: data.message || "Hotel created successfully",
          description: "Your hotel has been created successfully.",
        });
        navigate("/manager-dashboard/");
      },
      onError: (err: ErrResponse) => {
        toast({
          title: err.response.data.message || "Error Creating Hotel",
          variant: "destructive",
        });
      },
    });

  function onSubmit(data: HotelFormValues) {
    createHotel(data);
  }

  // Handle hotel image upload
  const handleHotelImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploadingHotelImage(true);
    try {
      const file = e.target.files[0];
      const imageUrl = await uploadImage(file);

      const currentImages = form.getValues("hotel_images") || [];
      form.setValue("hotel_images", [...currentImages, imageUrl]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingHotelImage(false);
    }
  };

  // Remove hotel image
  const removeHotelImage = (indexToRemove: number) => {
    const currentImages = form.getValues("hotel_images") || [];
    form.setValue(
      "hotel_images",
      currentImages.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    if (data) {
      navigate("/manager-dashboard/");
    }
  }, [isLoading]);

  if (isLoading) return <LoadingBar />;
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly={data ? true : false}
                        placeholder="Grand Hotel"
                        {...field}
                        className="pl-10"
                      />
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly={data ? true : false}
                        placeholder="New York, NY"
                        {...field}
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly={data ? true : false}
                        placeholder="contact@hotel.com"
                        {...field}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly={data ? true : false}
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_in_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly={data?.check_in_time ? true : false}
                        type="time"
                        {...field}
                        className="pl-10"
                      />
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormDescription>Default: 14:00 (2:00 PM)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_out_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        readOnly={data?.check_out_time ? true : false}
                        type="time"
                        {...field}
                        className="pl-10"
                      />
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormDescription>Default: 12:00 (12:00 PM)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={data ? true : false}
                    placeholder="A luxurious hotel with stunning views..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Policies</FormLabel>
                <FormControl>
                  <Textarea
                    readOnly={data ? true : false}
                    placeholder="Cancellation policy, pet policy, etc..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your hotel's policies regarding cancellations,
                  check-in/check-out, pets, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      readOnly={data ? true : false}
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="4.5"
                      {...field}
                      className="pl-10"
                    />
                    <Star className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormDescription>
                  Hotel rating from 0 to 5 stars
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!data && (
            <>
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <FormLabel>Hotel Amenities</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {hotelAmenities.map((amenity) => (
                        <FormField
                          key={amenity.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            amenity.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== amenity.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center">
                                  {amenity.icon}
                                  {amenity.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select the amenities available at your hotel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hotel_images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Images</FormLabel>
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
                                    alt={`Hotel image ${index + 1}`}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeHotelImage(index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          <div className="aspect-square rounded-md border border-dashed flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                              {uploadingHotelImage ? (
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
                                onChange={handleHotelImageUpload}
                                disabled={uploadingHotelImage}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload images of your hotel (exterior, lobby, common
                      areas, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isHotelCreationPending}
                >
                  Create Hotel <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </>
  );
}
