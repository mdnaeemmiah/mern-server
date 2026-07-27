import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../errors/AppError";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { termsService } from "./terms.service";

const getId = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) || "";

const createTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await termsService.createTerms(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Terms created successfully",
    data: result,
  });
});

const getAllTerms = catchAsync(async (_req: Request, res: Response) => {
  const result = await termsService.getAllTerms();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Terms retrieved successfully",
    data: result,
  });
});

const getSingleTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await termsService.getSingleTerms(getId(req.params.id));
  if (!result) throw new AppError(StatusCodes.NOT_FOUND, "Terms not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Terms retrieved successfully",
    data: result,
  });
});

const updateTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await termsService.updateTerms(getId(req.params.id), req.body);
  if (!result) throw new AppError(StatusCodes.NOT_FOUND, "Terms not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Terms updated successfully",
    data: result,
  });
});

const deleteTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await termsService.deleteTerms(getId(req.params.id));
  if (!result) throw new AppError(StatusCodes.NOT_FOUND, "Terms not found");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Terms deleted successfully",
    data: result,
  });
});

export const termsController = {
  createTerms,
  getAllTerms,
  getSingleTerms,
  updateTerms,
  deleteTerms,
};
