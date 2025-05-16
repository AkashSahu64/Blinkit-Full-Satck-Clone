import jwt from 'jsonwebtoken';
import UserModel from '../models/user.models.js';

// Generate Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: process.env.JWT_ACCESS_COOKIE_EXPIRY,
  });
};

// Generate Refresh Token and Store in Database
export const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: process.env.JWT_REFRESH_COOKIE_EXPIRY,
  });

  await UserModel.findByIdAndUpdate(userId, { refresh_token: refreshToken });
  return refreshToken;
};

// Set Secure Cookies
export const setSecureCookie = (res, name, value, expiry) => {
  const options = {
    httpOnly: true,
    secure: true, // Set only over HTTPS in production
    sameSite: 'none', // For cross-site requests
    //maxAge: expiry * 1000, // Convert seconds to milliseconds
  };
  res.cookie(name, value, options);
};
