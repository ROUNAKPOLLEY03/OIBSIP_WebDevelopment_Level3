import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/email.js";

const cookieOption = {
  httpOnly: true, // Prevents JS access (mitigates XSS)
  secure: process.env.NODE_ENV === "production", // Only HTTPS in prod
  sameSite: "strict", // Prevents CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Send Token Response
const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// SIGNUP Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validation
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      emailVerificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      emailVerificationToken
    );

    if (!emailSent) {
      console.log(
        "Email sending failed, but user created. Token:",
        emailVerificationToken
      );
    }

    // Send response (don't log user in until email is verified)
    res.status(201).json({
      status: "success",
      message:
        "Account created successfully! Please check your email to verify your account.",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          isEmailVerified: newUser.isEmailVerified,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: "error",
      message: "Error creating account. Please try again.",
    });
  }
};

// LOGIN Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        status: "error",
        message:
          "Please verify your email before logging in. Check your inbox for verification link.",
      });
    }

    // Send JWT token
    createSendToken(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Error logging in. Please try again.",
    });
  }
};

// LOGOUT Controller (simple)
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// EMAIL VERIFICATION Controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this verification token and check if not expired
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }, // Check token hasn't expired
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification token",
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    //To bypass passwordConfirm check..that's why we are updating here not saving
    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });

    createSendToken(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong during email verification",
    });
  }
};

// FORGOT PASSWORD Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Please provide your email address",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found with that email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save reset token to user (expires in 10 minutes)
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (emailSent) {
      res.status(200).json({
        status: "success",
        message: "Password reset link sent to your email!",
      });
    } else {
      // If email fails, clear the reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        status: "error",
        message: "Error sending email. Please try again later.",
      });
    }

    // For development - log the token
    if (process.env.NODE_ENV === "development") {
      console.log("Password reset token:", resetToken);
      console.log(
        "Reset URL:",
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      status: "error",
      message: "Error processing request. Please try again.",
    });
  }
};

// RESET PASSWORD Controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    // Validation
    if (!password || !passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "Please provide password and password confirmation",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Log user in with new password
    return res.status(201).json({
      status: "success",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      status: "error",
      message: "Error resetting password. Please try again.",
    });
  }
};

// PROTECT ROUTE CONTROLLER

export const protectRoute = async (req, res, next) => {
  //1) Get the token and check it
  try {
    let token;

    if (
      req.headers?.authorization &&
      req.headers?.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ").at(1);
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in. Please log in to access.",
      });
    }

    //2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //3) Check if the user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists.",
      });
    }

    //4) Check if the user changes password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "error",
        message: "Password is changed recently! Please re-login!",
      });
    }

    //5) Grant access to the protected route
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
