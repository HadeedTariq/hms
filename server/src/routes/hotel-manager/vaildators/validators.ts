import { z } from "zod";
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const hotelSchema = z.object({
  name: z
    .string()
    .min(3, "Hotel name must be at least 3 characters long")
    .max(255, "Hotel name must not exceed 255 characters"),

  description: z.string().max(1000, "Description is too long").optional(),

  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(255, "Location must not exceed 255 characters"),

  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5")
    .optional(),

  contact_email: z.string().email("Invalid email format"),

  contact_phone: z
    .string()
    .regex(/^\+?\d{10,20}$/, "Invalid phone number format"),

  hotel_images: z
    .array(z.string().url("Invalid image URL"))
    .max(10, "Cannot upload more than 10 images")
    .optional(),

  amenities: z
    .array(z.string())
    .max(50, "Too many amenities listed")
    .optional(),

  policies: z.string().max(2000, "Policies description is too long").optional(),

  check_in_time: z
    .string()
    .regex(timeRegex, "Invalid time format. Use HH:MM")
    .default("14:00"),
  check_out_time: z
    .string()
    .regex(timeRegex, "Invalid time format. Use HH:MM")
    .default("12:00"),
});

export const roomSchema = z.object({
  hotel_id: z.number(),
  room_number: z.string().min(1, "Room number is required"),
  type: z.enum(["single", "double", "suite", "deluxe"]),
  price: z.number().positive("Price must be positive"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  is_available: z.boolean().optional(),
});
