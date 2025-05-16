import UserModel from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../config/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken, setSecureCookie } from '../utils/accessAndRefreshToken.js';
import uploadImageCloudinary from '../utils/uplaodImage.utils.js';
import generateOtp from '../utils/generateOtp.utils.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.utils.js';

dotenv.config();

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required',
        error: true,
        success: false,
      });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this email',
        error: true,
        success: false,
      });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Generate email verification URL
    const verifyEmailUrl = `${process.env.CLIENT_URL}/verify-email?token=${savedUser._id}`;

    // Send verification email
    await sendEmail({
      sendTo: email,
      subject: 'Verify Your Email - Blinkit',
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    });

    // Respond with success
    return res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      error: false,
      success: true,
      data: savedUser
      // data: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
  } catch (error) {
    console.error('Error in registerUserController:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: true,
      success: false,
    });
  }
}


//verifyEmailController function to verify the email of the user by decoding the token and updating the user's verify_email status to true. 
export async function verifyEmailController(req, res) {
  try {
    const { token } = req.body;

    // Validate token presence
    if (!token) {
      return res.status(400).json({
        message: 'Verification token is required',
        error: true,
        success: false,
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    } catch (err) {
      return res.status(400).json({
        message: 'Invalid or expired token',
        error: true,
        success: false,
      });
    }

    // Find user by ID from decoded token
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    // Check if the user is already verified
    if (user.verify_email) {
      return res.status(409).json({
        message: 'User is already verified',
        error: true,
        success: false,
      });
    }

    // Update user verification status
    user.verify_email = true;
    await user.save();

    // Respond with success
    return res.status(200).json({
      message: 'User email verified successfully',
      error: false,
      success: true,
    });
  } catch (error) {
    console.error('Error in verifyEmailController:', error.message || error);
    return res.status(500).json({
      message: 'Internal server error',
      error: true,
      success: false,
    });
  }
}

//loginUserController function to authenticate the user by checking the email and password, and generate a JWT token for the user.
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        error: true,
        success: false,
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: true,
        success: false,
      });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(403).json({
        message: 'Account is inactive. Please contact support.',
        error: true,
        success: false,
      });
    }

    // Check email verification
    // if (!user.verify_email) {
    //   return res.status(403).json({
    //     message: 'Please verify your email before logging in',
    //     error: true,
    //     success: false,
    //   });
    // }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: true,
        success: false,
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    // Set cookies for tokens
    setSecureCookie(res, 'accessToken', accessToken, process.env.JWT_ACCESS_COOKIE_EXPIRY);
    setSecureCookie(res, 'refreshToken', refreshToken, process.env.JWT_REFRESH_COOKIE_EXPIRY);

    return res.status(200).json({
      message: 'User logged in successfully',
      error: false,
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error('Error in loginUserController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}


//logoutUserController function to clear the cookies containing the JWT tokens.
export async function logoutUserController(req, res) {
  try {
    const userid = req.userId //middleware

    const cookiesOptions = {
      httpOnly: true,
      sameSite: 'None',
      expires: new Date(0),
    };
    // Clear cookies
    res.clearCookie('accessToken', cookiesOptions);
    res.clearCookie('refreshToken', cookiesOptions);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: ""
    })

    return res.status(200).json({
      message: 'User logged out successfully',
      error: false,
      success: true,
    });
  } catch (error) {
    console.error('Error in logoutUserController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}

//uplaodImageController function to upload the image to the cloudinary server and update the user's profile image.
export async function uploadImageController(req, res) {
  try {
    const userId = req.userId; // Extracted from auth middleware
    const image = req.file; // Extracted by multer middleware

    if (!image) {
      return res.status(400).json({
        message: 'No image file provided',
        error: true,
        success: false,
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadImageCloudinary(image);

    if (!uploadResult?.url) {
      return res.status(500).json({
        message: 'Image upload failed',
        error: true,
        success: false,
      });
    }

    // Update user profile with the new avatar URL
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: uploadResult.url },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Image uploaded successfully',
      error: false,
      success: true,
      data: {
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error('Error in uploadImageController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}

//updateProfileController function to update the user's profile details.
export async function updateProfileController(req, res) {
  try {
    const userId = req.userId; // Extracted from auth middleware
    const { name, email, mobile, password } = req.body;

    // Validate required fields


    let hashedPassword = '';

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user profile
    const updatedUser = await UserModel.updateOne({ _id: userId }, {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(password && { password: hashedPassword }),
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      error: false,
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    console.error('Error in updateProfileController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}

//forgotPasswordController function to send an email to the user with a password reset link.
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        error: true,
        success: false,
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date() + 60 * 60 * 1000; // 1 hour from now

    // Update user with OTP and expiry
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: 'An error occurred while processing your request',
        error: true,
        success: false,
      });
    }
    // Send email with password reset link
    await sendEmail({
      sendTo: email,
      subject: 'Reset Your Password - Blinkit',
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp
      })
    });
    return res.status(200).json({
      message: 'Password reset link sent to your email',
      error: false,
      success: true,
    });

  } catch (error) {
    console.error('Error in forgotPasswordController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}

//verifyOtpController function to verify the OTP sent to the user's email for password reset.
export async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
        error: true,
        success: false,
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    // Check if OTP is expired
    const currentTime = new Date().toISOString()

    if (user.forgot_password_expiry < currentTime) {
      return response.status(401).json({
        message: "Otp has expired",
        error: true,
        success: false
      })
    }

    // Check if OTP matches
    if (user.forgot_password_otp !== otp) {
      return res.status(401).json({
        message: 'Invalid OTP',
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: ""
    })

    return res.status(200).json({
      message: 'OTP verified successfully',
      error: false,
      success: true,
    });
  } catch (error) {
    console.error('Error in verifyOtpController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}

//resetPasswordController function to reset the user's password after verifying the OTP.
export const resetPasswordController = async (req, res) => {
  try {
    const { email, newpassword, confirmPassword } = req.body;

    if (!email || !newpassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Email, new password, and confirm password are required',
        error: true,
        success: false,
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: true,
        success: false,
      });
    }

    // Check if new password and confirm password match
    if (newpassword !== confirmPassword) {
      return res.status(400).json({
        message: 'New Password and confirm password do not match',
        error: true,
        success: false,
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update user password
    const updatedUser = await UserModel.findOneAndUpdate(user._id, {
      password: hashedPassword,
      forgot_password_otp: null,
      forgot_password_expiry: null,
    });

    if (!updatedUser) {
      return res.status(500).json({
        message: 'An error occurred while processing your request',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Password updated successfully',
      error: false,
      success: true,
    });
  }
  catch (error) {
    console.error('Error in resetPasswordController:', error.message || error);
    return res.status(500).json({
      message: 'An error occurred while processing your request',
      error: true,
      success: false,
    });
  }
}

//refresh token controller
export async function refreshTokenController(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid Token",
        error: true,
        success: false,
      });
    }

    // Verify the Refresh Token
    let verifyToken;
    try {
      verifyToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);
    } catch (error) {
      return res.status(401).json({
        message: "Token has expired or is invalid",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken._id || verifyToken.id; // Ensure the correct user ID is extracted

    // Generate a new Access Token
    const newAccessToken = await generateAccessToken(userId);

    // Set accessToken in cookies
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // Fixing capitalization issue
    };

    res.cookie("accessToken", newAccessToken, cookiesOptions);

    return res.status(200).json({
      message: "New refreshed token successfully generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Error in refreshTokenController:", error.message || error);
    return res.status(500).json({
      message: "An error occurred while processing your request",
      error: true,
      success: false,
    });
  }
}

//get login user details
export async function userDetails(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select("-password -refresh_token");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    
    return res.status(200).json({
      message: "User details fetched successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in userDetails:", error.message || error);
    return res.status(500).json({
      message: "An error occurred while processing your request",
      error: true,
      success: false,
    });
  }
}