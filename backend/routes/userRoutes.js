import express from "express";
import { registerUser, loginUser, userCredits, razorpayPayment, verifyPayment, sendOtp, verifyOtp, resetPassword } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Create a new router instance
const userRouter = express.Router();

userRouter.post("/register", registerUser); // Route for user registration
userRouter.post("/login", loginUser); // Route for user login
userRouter.post('/reset-password', resetPassword);  // Route for user to reset password by sending an email with a reset link
userRouter.get("/credits", authMiddleware, userCredits); // Route for user credits balance
userRouter.post("/pay", authMiddleware, razorpayPayment); // Route for user to pay for credits
userRouter.post("/verify-payment", verifyPayment); // Route for verify the payment of the user for the credits
userRouter.post('/send-otp', sendOtp); // Routes for sending otp to the user for logging in or registering
userRouter.post('/verify-otp', verifyOtp); // Routes for verifying the otp the user entered for successfully logging in or registering

export default userRouter;

// This endpoint will be used in the frontend to interact with the user authentication system.
// The routes are as follows:
// http://localhost:4000/api/user/register - for user registration
// http://localhost:4000/api/user/login - for user login
// http://localhost:4000/api/user/buy-credits - for user credits balance (requires authentication)
// http://localhost:4000/api/user/pay - for user payment for credits (requires authentication)