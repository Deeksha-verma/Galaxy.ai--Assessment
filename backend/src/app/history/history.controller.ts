import { Request, Response } from "express";
import * as historyService from "./history.service";
import { historyQuerySchema } from "./history.validation";
import { createResponse } from "../common/helper/response.helper";

export const listHistory = async (req: Request, res: Response) => {
  const { workflowId } = historyQuerySchema.parse(req.query);
  const runs = await historyService.listHistory(req.userId!, workflowId);
  res.json(createResponse(runs));
};

export const getRunDetail = async (req: Request, res: Response) => {
  const run = await historyService.getRunDetail(req.userId!, req.params.runId);
  res.json(createResponse(run));
};
