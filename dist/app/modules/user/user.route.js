"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const userRouter = (0, express_1.Router)();
userRouter.get('/:userId', user_controller_1.userController.getSingleUser);
userRouter.patch('/:id', user_controller_1.userController.updateUser);
userRouter.delete('/:id', user_controller_1.userController.deleteUser);
userRouter.get('/', user_controller_1.userController.getUser);
userRouter.patch('/change-status/:id', 
// auth( USER_ROLE.admin),
(0, validateRequest_1.default)(user_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.userController.changeStatus);
exports.default = userRouter;
