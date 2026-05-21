

import { StatusCodes } from 'http-status-codes';
import { userService } from './user.service';
import { Request, Response } from 'express';
import { User } from './user.model';
import { IUser } from './user.interface';
import mongoose from 'mongoose';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import AppError from '../../../errors/AppError';

const getParam = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) || '';


const getUser = catchAsync(async (req, res) => {
  const result = await userService.getUser();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await userService.getMe(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  console.log(req.params);
  const userId = getParam(req.params.userId);

  const result = await userService.getSingleUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User getting successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const id = getParam(req.params.id);
  const body = req.body as Partial<IUser>;

  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (file?.filename) {
    body.profileImage = `/uploads/profile-images/${file.filename}`;
  }
  const result = await userService.updateUser(id, body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid user ID');
  }

  const deletedUser = await User.findByIdAndDelete(id); // Physically delete the user

  if (!deletedUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted successfully',
    data: deletedUser,
  });
});


export const changeStatus = catchAsync(async (req: Request, res: Response) => {
  const id = getParam(req.params.id);
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid user ID');
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status }, // Update the status
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Status updated successfully',
    data: updatedUser,
  });
});

export const userController = {
  getUser,
  getMe,
  getSingleUser,
  updateUser,
  deleteUser,
  changeStatus
};
