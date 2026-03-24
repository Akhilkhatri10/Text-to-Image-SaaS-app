import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    creditsBalance: {
        type: Number,
        default: 5,
    },
})

const userModel = mongoose.models.user || model("user", userSchema);

export default userModel;