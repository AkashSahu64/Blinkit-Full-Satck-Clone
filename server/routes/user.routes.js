import { Router } from "express";
import {
  forgotPasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
  updateProfileController,
  uploadImageController,
  userDetails,
  verifyEmailController,
  verifyOtpController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutUserController);
userRouter.put("/upload-avatar", auth, upload.single('avatar'), uploadImageController);
userRouter.put('/update-user', auth, updateProfileController);
userRouter.put('/forgot-password', forgotPasswordController);
userRouter.put('/verify-otp', verifyOtpController);
userRouter.put('/reset-password', resetPasswordController);
userRouter.post('/refresh-token', refreshTokenController)
userRouter.get('/user-details', auth, userDetails)

export default userRouter;
