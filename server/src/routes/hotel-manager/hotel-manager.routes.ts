import { Router } from "express";
import { checkIsManager } from "./hotel-manager.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { hotelManagerController } from "./hotel-manager.controller";

const router = Router();

router.use(checkIsManager);
router.post("/", asyncHandler(hotelManagerController.createHotel));
router.post("/create-room", asyncHandler(hotelManagerController.createRoom));
router.get("/", asyncHandler(hotelManagerController.getHotel));
router.get("/hotel-rooms", asyncHandler(hotelManagerController.getHotelRooms));
router.get("/:id", asyncHandler(hotelManagerController.getHotelById));
router.put("/:id", asyncHandler(hotelManagerController.updateHotel));
router.delete("/:id", asyncHandler(hotelManagerController.deleteHotel));

router.post("/:hotelId/rooms", asyncHandler(hotelManagerController.createRoom));

router.put(
  "/:hotelId/rooms/:roomId",
  asyncHandler(hotelManagerController.updateRoom)
);
router.delete(
  "/:hotelId/rooms/:roomId",
  asyncHandler(hotelManagerController.deleteRoom)
);

export { router as hotelManagerRouter };
