

import { Model } from "mongoose";
import { USER_ROLE } from "./user.contant";


export interface IUser {
    [x: string]: any  | undefined;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    phone?: string;
    address?: string;
    city?: string;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    status: 'in-progress' | 'blocked';
    isBlocked: boolean;           
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

