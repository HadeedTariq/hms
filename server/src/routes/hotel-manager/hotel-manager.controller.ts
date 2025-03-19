import { pool, queryDb, runIndependentTransaction } from "@/db/connect";
import { NextFunction, Request, Response } from "express";
import { env } from "@/common/utils/envConfig";
import { z } from "zod";
import { hotelSchema, roomSchema } from "./vaildators/validators";

class HotelManagerController {
  constructor() {
    this.createHotel = this.createHotel.bind(this);
    this.getHotel = this.getHotel.bind(this);
    this.getHotelById = this.getHotelById.bind(this);
    this.updateHotel = this.updateHotel.bind(this);
    this.deleteHotel = this.deleteHotel.bind(this);

    this.createRoom = this.createRoom.bind(this);
    this.getRoomsByHotel = this.getRoomsByHotel.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }

  // Create a new hotel
  async createHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const data = hotelSchema.parse(req.body);

      const query = `
        INSERT INTO hotels 
          (name, description, location, rating, contact_email, contact_phone, owner_id, hotel_images, amenities, policies, check_in_time, check_out_time) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *;
      `;

      const values = [
        data.name,
        data.description || null,
        data.location,
        data.rating || null,
        data.contact_email,
        data.contact_phone,
        req.body.user?.id || null,
        data.hotel_images
          ? JSON.stringify(data.hotel_images)
          : JSON.stringify([]),
        data.amenities ? JSON.stringify(data.amenities) : JSON.stringify([]),
        data.policies || null,
        data.check_in_time,
        data.check_out_time,
      ];

      const result = await queryDb(query, values);

      return res.status(201).json({
        message: "Hotel created successfully",
        hotel: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }

  async getHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const query = `SELECT * FROM hotels WHERE owner_id = $1`;
      const result = await queryDb(query, [req.body.user?.id]);
      if (result.rows.length < 1) {
        return res
          .status(404)
          .json({ message: "No hotels found for this manager" });
      }
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  // Get hotel by ID
  async getHotelById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const query = `SELECT * FROM hotels WHERE id = $1 AND owner_id = $2`;
      const result = await queryDb(query, [id, req.body.user?.id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  // Update hotel
  async updateHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = hotelSchema.partial().parse(req.body);

      const query = `
        UPDATE hotels 
        SET name = COALESCE($1, name), 
            description = COALESCE($2, description), 
            location = COALESCE($3, location),
            rating = COALESCE($4, rating),
            contact_email = COALESCE($5, contact_email),
            contact_phone = COALESCE($6, contact_phone)
        WHERE id = $7 AND owner_id = $8
        RETURNING *;
      `;

      const values = [
        data.name,
        data.description,
        data.location,
        data.rating,
        data.contact_email,
        data.contact_phone,
        id,
        req.body.user?.id,
      ];

      const result = await queryDb(query, values);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Hotel not found or unauthorized" });
      }

      return res
        .status(200)
        .json({ message: "Hotel updated", hotel: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Delete hotel
  async deleteHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const query = `DELETE FROM hotels WHERE id = $1 AND owner_id = $2 RETURNING *`;
      const result = await queryDb(query, [id, req.body.user?.id]);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Hotel not found or unauthorized" });
      }

      return res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Create a room
  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const data = roomSchema.parse(req.body);

      const query = `
        INSERT INTO rooms (hotel_id, room_number, type, price, capacity, is_available)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
      const values = [
        data.hotel_id,
        data.room_number,
        data.type,
        data.price,
        data.capacity,
        data.is_available ?? true,
      ];

      const result = await queryDb(query, values);
      return res
        .status(201)
        .json({ message: "Room created", room: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Get all rooms in a hotel
  async getRoomsByHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotel_id } = req.params;
      const query = `SELECT * FROM rooms WHERE hotel_id = $1`;
      const result = await queryDb(query, [hotel_id]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  }

  // Update a room
  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = roomSchema.partial().parse(req.body);

      const query = `
        UPDATE rooms 
        SET room_number = COALESCE($1, room_number),
            type = COALESCE($2, type),
            price = COALESCE($3, price),
            capacity = COALESCE($4, capacity),
            is_available = COALESCE($5, is_available)
        WHERE id = $6 RETURNING *;
      `;

      const values = [
        data.room_number,
        data.type,
        data.price,
        data.capacity,
        data.is_available,
        id,
      ];
      const result = await queryDb(query, values);

      return res
        .status(200)
        .json({ message: "Room updated", room: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Delete a room
  async deleteRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const query = `DELETE FROM rooms WHERE id = $1 RETURNING *`;
      const result = await queryDb(query, [id]);

      return res.status(200).json({ message: "Room deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export const hotelManagerController = new HotelManagerController();
