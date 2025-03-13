import { pool, queryDb, runIndependentTransaction } from "@/db/connect";
import { NextFunction, Request, Response } from "express";

import { env } from "@/common/utils/envConfig";

class HotelManagerController {
  constructor() {}
}

export const userController = new HotelManagerController();
