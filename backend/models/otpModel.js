import mongoose, { Schema, model } from "mongoose";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otpCode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 600 // auto - delete after 10 mins
        }
    }
})

const otpModel = mongoose.models.otp || mongoose.model('otp', otpSchema);

export default otpModel;