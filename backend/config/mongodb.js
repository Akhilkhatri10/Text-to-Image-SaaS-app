import mongoose from "mongoose";

const connectDB = async () => {
    // event to connect to the database
    mongoose.connection.on("connected",  () => {
        console.log("Database Connected!");
    })
    // connect to the database using the URI from environment variables
    await mongoose.connect(`${process.env.MONGO_URI}/imaginai`);
}

export default connectDB;