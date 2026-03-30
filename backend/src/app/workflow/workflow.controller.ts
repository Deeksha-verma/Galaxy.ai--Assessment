import { Request, Response } from "express";
import * as workflowService from "./workflow.service";
import { workflowCreateSchema, workflowUpdateSchema } from "./workflow.validation";
import { createResponse } from "../common/helper/response.helper";

export const createWorkflow = async (req: Request, res: Response) => {
  const data = workflowCreateSchema.parse(req.body);
  const workflow = await workflowService.createWorkflow(req.userId!, data);
  res.json(createResponse(workflow));
};

export const listWorkflows = async (req: Request, res: Response) => {
  const workflows = await workflowService.listWorkflows(req.userId!);
  res.json(createResponse(workflows));
};

export const getWorkflow = async (req: Request, res: Response) => {
  const workflow = await workflowService.getWorkflow(req.userId!, req.params.id);
  res.json(createResponse(workflow));
};

export const updateWorkflow = async (req: Request, res: Response) => {
  const data = workflowUpdateSchema.parse(req.body);
  const workflow = await workflowService.updateWorkflow(req.userId!, req.params.id, data);
  res.json(createResponse(workflow));
};

export const deleteWorkflow = async (req: Request, res: Response) => {
  await workflowService.deleteWorkflow(req.userId!, req.params.id);
  res.json(createResponse({ success: true }));
};

export const exportWorkflow = async (req: Request, res: Response) => {
  const data = await workflowService.exportWorkflow(req.userId!, req.params.id);
  res.json(createResponse(data));
};

export const importWorkflow = async (req: Request, res: Response) => {
  const data = workflowCreateSchema.parse(req.body);
  const workflow = await workflowService.importWorkflow(req.userId!, data);
  res.json(createResponse(workflow));
};

export const seedWorkflow = async (req: Request, res: Response) => {
  const workflow = await workflowService.seedSampleWorkflow(req.userId!);
  res.json(createResponse(workflow));
};
