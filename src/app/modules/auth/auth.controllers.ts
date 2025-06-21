



import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import config from "../../config";
import { User } from "../user/user.model";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const register = catchAsync(async(req: Request, res: Response)=>{
    const result = await AuthService.register(req.body);
    const { name, email, role,password } = req.body;

    // Default role is 'user', can be 'admin' if specified
    const newUserRole = role === 'admin' ? 'admin' : 'user'; 

    const newUser = new User({
      name,
      email,
      password,
      role: newUserRole, // Set the role during registration
    });

    await newUser.save();
    sendResponse(res,{
      statusCode: StatusCodes.ACCEPTED,
      success: true,
      message: "User Registered in successfully",
      data: result
  })
})

const login = catchAsync(async(req: Request, res: Response)=>{
    const result = await AuthService.login(req.body);

    const { refreshToken, accessToken, needsPasswordChange } = result;

    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res,{
        statusCode: StatusCodes.ACCEPTED,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            needsPasswordChange,
        }
    })
})

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;
  
    const result = await AuthService.changePassword(req.user, passwordData);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password is updated successfully!',
      data: result,
    });
  });

  const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'refreshToken token is retrieved successfully!',
      data: {
        result
      },
    });
  });


export const AuthControllers = {
    register,
    login,
    changePassword,
    refreshToken,
}