import { Model } from "mongoose";
import { USER_ROLE } from "./user.contant";


export interface IUser {
    [x: string]: any  | undefined;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
  dateOfBirth?: string;
    phone?: string;
    profileImage?: string;
    address?: string;
    city?: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    status: 'in-progress' | 'blocked';
    isBlocked: boolean;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
  }
  

  
export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(email: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}


  export type IUserRole = keyof typeof USER_ROLE;

