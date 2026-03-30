import { Request, Response } from "express";
import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.helper";

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new Error("User ID not found in request");

  const user = await userService.getUserById(userId);
  res.json(createResponse(user));
};
