import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from 'razorpay';
// import nodemailer from 'nodemailer';
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import otpModel from "../models/otpModel.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);



// Register a new user
// take input(name, email, password) -> check if all fields are filed -> encrypt password using bcrypt -> save the user data in the database using userModel -> generate token using JWT(jsonwebtoken) -> return success response with token and user data
// If any error occurs, return error response with message
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields. Some fields are missing." });
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        const newUserDAta = {
            name,
            email,
            password: encryptedPassword,
        }
        const newUser = new userModel(newUserDAta);
        const user = await newUser.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        )

        res.json({
            success: true,
            token,
            user: {
                name: user.name
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message || "Something went wrong while registering the user. Please try again."
        });
    }
}

// Login a user
// take input(email, password) -> check whether all the fields are filled -> check whether the email of the user exists in the data bse or not -> compare the password with the encrypted password in the database -> check whether user exists or not -> if does not exists, then send the error message through response -> if user exists, then generate token using JWT(jsonwebtoken) -> return success response with token and user data
// If any error occurs, return error response with message
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Please fill all the fields. Some fields are missing."
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exists. Please register first."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({
                success: false,
                message: "Invalid credentials. Please try again."
            });
        } else {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET
            )
            res.json({
                success: true,
                token,
                user: {
                    name: user.name
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message || "Something went wrong while logging in the user. Please try again."
        })
    }
}

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found!"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword
        });

        res.json({
            success: true,
            message: "Password reset successful!"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Check credits balance
const userCredits = async (req, res) => {
    try {
        // const { userId } = req.body; // This is not needed as body is not sent in the request
        // Instead, we can get userId from the request object which is set by the auth middleware
        const { userId } = req;
        const user = await userModel.findById(userId);

        res.json({
            success: true,
            credits: user.creditsBalance,
            user: {
                name: user.name
            }
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message || "Something went wrong while fetching credits. Please wait for a while."
        })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const razorpayPayment = async (req, res) => {
    try {
        const { userId } = req;
        const { planId } = req.body;

        const userData = await (userModel.findById(userId));

        if (!userId) {
            return res.json({
                success: false,
                message: 'User not found! Please login again.'
            })
        } else if (!planId) {
            return res.json({
                success: false,
                message: 'Please select a valid plan to proceed.'
            })
        }

        let credits, plan, amount;

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 50;
                amount = 52;
                break;

            case 'Advanced':
                plan = 'Advanced';
                credits = 250;
                amount = 155;
                break;

            case 'Business':
                plan = 'Business';
                credits = 1000;
                amount = 412;
                break;

            default:
                return res.json({
                    success: false,
                    message: "Plan doesn't exists. Please choose another plan."
                });
        }

        let date = Date.now();

        const transactionData = {
            userId,
            plan,
            credits,
            amount,
            date
        }

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id.toString()
        }

        console.log("Creating Razorpay order:", options);

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log("Razorpay order error:", error);
                return res.json({
                    success: false,
                    message: error.message
                })
            }

            res.json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID,
                receipt: order.receipt
            })
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body.response;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.json({
                    success: false,
                    message: 'Payment Failed!'
                })
            }
            const userData = await userModel.findById(transactionData.userId);
            const creditsBalance = userData.creditsBalance + transactionData.credits;

            await userModel.findByIdAndUpdate(userData._id, { creditsBalance });

            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({
                success: true,
                message: 'Credits Added to the account!'
            })
        } else {
            res.json({
                success: false,
                message: 'Payment failed!'
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

const sendOtp = async (req, res) => {
    try {
        const { email, name, state } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (state === 'register' && existingUser) {
            return res.json({
                success: false,
                message: 'Email is already registered! Please log in.'
            })
        }

        // FORGOT PASSWORD case
        if (state === 'forgot' && !existingUser) {
            return res.json({
                success: false,
                message: 'Email is not registered!'
            })
        }

        // Check if an OTP was sent in the last 1 minute to prevent spamming the OTP service (Rate Limiting)
        const recentOtp = await otpModel.findOne({
            email,
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) } // last 1 min
        });

        if (recentOtp) {
            return res.json({
                success: false,
                message: "Please wait 60 seconds before requesting another OTP"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        await otpModel.create({ email, otpCode: hashedOtp });

        // Send Email using Gmail SMTP
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.GMAIL_USER,
        //         pass: process.env.GMAIL_PASS
        //     }
        // })

        const displayName = name || 'User';

        let purpose = state === 'register'
            ? 'registering'
            : 'resetting your password';

        const content = `
            <p>Hi, ${displayName}</p>
            <p>Welcome to <strong>imaginAI</strong> - your creative companion for transforming text prompts into stunning AI-generated images.</p>
            <p>Your One-Time-Password (OTP) for ${purpose} is:</p>
            <br />
            <h1><strong>${otp}</strong></h1>
            <br />
            <p>This code is valid for <strong>10 minutes</strong>.</p>
            <p>Please <strong>do not share</strong> this OTP with anyone else.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>imaginAI will never contact you about this email or ask for any login codes or links. Beware of phishing scams.</p>
            <p>Need help? Contact us at: <strong>${process.env.GMAIL_USER}</strong></p>
            <p>Thanks,</p>
            <p><strong>Team imaginAI</strong></p>
        `;

        const mailOptions = {
            from: `"imaginAI" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: '🔐 Your imaginAI OTP Verification Code',
            html: content
        }

        // await transporter.sendMail(mailOptions);
        // transporter.sendMail(mailOptions)
        //     .then(() => console.log("Email sent"))
        //     .catch(err => console.log("Email error:", err));
        await resend.emails.send({
            from: "imaginAI <onboarding@resend.dev>", // default test sender
            to: email,
            subject: '🔐 Your imaginAI OTP Verification Code',
            html: content
        });

        console.log("OTP sent:", otp);
        console.log("Sending OTP to:", email);
        res.json({
            success: true,
            message: 'OTP sent successfully!'
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const otpRecord = await otpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
        return res.json({
            success: false,
            message: 'OTP Expired or Not Found!'
        })
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otpCode);

    if (!isMatch) {
        return res.json({
            success: false,
            message: 'Incorrect OTP!'
        })
    }

    await otpModel.deleteMany({ email }); // Delete all the OTPs from this email
    res.json({
        success: true,
        message: 'OTP Verified!'
    })
}

export { registerUser, loginUser, userCredits, razorpayPayment, verifyPayment, sendOtp, verifyOtp, resetPassword };