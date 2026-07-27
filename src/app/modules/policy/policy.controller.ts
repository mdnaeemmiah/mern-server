import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { policyService } from "./policy.service";

const getId = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) || "";

const createPolicy = catchAsync(async (req: Request, res: Response) => {
  const result = await policyService.createPolicy(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Policy created successfully",
    data: result,
  });
});

const getAllPolicies = catchAsync(async (_req: Request, res: Response) => {
  const result = await policyService.getAllPolicies();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Policies retrieved successfully",
    data: result,
  });
});

const getSinglePolicy = catchAsync(async (req: Request, res: Response) => {
  const result = await policyService.getSinglePolicy(getId(req.params.id));
  if (!result) throw new AppError(StatusCodes.NOT_FOUND, "Policy not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Policy retrieved successfully",
    data: result,
  });
});

const updatePolicy = catchAsync(async (req: Request, res: Response) => {
  const result = await policyService.updatePolicy(
    getId(req.params.id),
    req.body,
  );
  if (!result) throw new AppError(StatusCodes.NOT_FOUND, "Policy not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Policy updated successfully",
    data: result,
  });
});

const deletePolicy = catchAsync(async (req: Request, res: Response) => {
  const result = await policyService.deletePolicy(getId(req.params.id));
  if (!result) throw new AppError(StatusCodes.NOT_FOUND, "Policy not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Policy deleted successfully",
    data: result,
  });
});

export const policyController = {
  createPolicy,
  getAllPolicies,
  getSinglePolicy,
  updatePolicy,
  deletePolicy,
};
