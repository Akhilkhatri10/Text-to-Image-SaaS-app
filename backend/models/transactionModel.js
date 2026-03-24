import mongoose, { Schema, model } from "mongoose";

const transactionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment: {
        type: Boolean,
        default: false
    },
    date: {
        type: Number,
        required: true
    }
})

const transactionModel = mongoose.models.transaction || model('transaction', transactionSchema);

export default transactionModel;