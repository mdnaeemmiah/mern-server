"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const user_contant_1 = require("./user.contant");
const upload_1 = require("../../../middlewares/upload");
const userRouter = (0, express_1.Router)();
const maybeUploadProfileImage = upload_1.upload.single('profileImage');
userRouter.get('/:userId', user_controller_1.userController.getSingleUser);
userRouter.patch('/:id', (req, res, next) => {
    var _a;
    const contentType = (_a = req.headers['content-type']) !== null && _a !== void 0 ? _a : '';
    if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
        return maybeUploadProfileImage(req, res, next);
    }
    next();
}, user_controller_1.userController.updateUser);
userRouter.delete('/:id', user_controller_1.userController.deleteUser);
userRouter.get('/', (0, auth_1.default)(user_contant_1.USER_ROLE.admin, user_contant_1.USER_ROLE.user), user_controller_1.userController.getUser);
userRouter.patch('/change-status/:id', 
// auth( USER_ROLE.admin),
(0, validateRequest_1.default)(user_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.userController.changeStatus);
exports.default = userRouter;
