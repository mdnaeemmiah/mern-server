

import { Router } from 'express'
import { userController } from './user.controller'
import { UserValidation } from './user.validation'
import validateRequest from '../../../middlewares/validateRequest'
import auth from '../../../middlewares/auth'
import { USER_ROLE } from './user.contant'
import { upload } from '../../../middlewares/upload'




const userRouter = Router()

const maybeUploadProfileImage = upload.single('profileImage')

userRouter.get('/me', auth(USER_ROLE.admin, USER_ROLE.user), userController.getMe)
userRouter.get('/:userId', userController.getSingleUser)
userRouter.patch(
  '/:id',
  (req, res, next) => {
    const contentType = req.headers['content-type'] ?? '';
    if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
      return maybeUploadProfileImage(req, res, next);
    }
    next();
  },
  userController.updateUser,
)
userRouter.delete('/:id', userController.deleteUser)
userRouter.get('/', auth(USER_ROLE.admin, USER_ROLE.user), userController.getUser)
userRouter.patch(
    '/change-status/:id',
    // auth( USER_ROLE.admin),
    validateRequest(UserValidation.changeStatusValidationSchema),
    userController.changeStatus,
  );

export default userRouter