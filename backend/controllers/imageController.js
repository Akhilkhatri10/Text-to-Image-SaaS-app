import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
    try {
        const { userId } = req;
        const { prompt } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "Missing user. Please login again."
            });
        }

        if(!prompt) {
            return res.json({
                success: false,
                message: "Missing prompt. Please provide valid inputs."
            });
        }

        if(user.creditsBalance <= 0) {  
            return res.json({
                success: false,
                message: "You do not have enough credits to generate an image. Please recharge your credits.",
                creditsBalance: user.creditsBalance
            });
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                },
                responseType: 'arraybuffer'
            }
        )

        const base64Image = Buffer.from(data, 'binary').toString('base64'); // Convert the response data to base64
        const generatedImage = `data:image/png;base64,${base64Image}`; // Create a data URL for the image

        // Deduct credits from user's balance
        await userModel.findByIdAndUpdate(user._id, { creditsBalance: user.creditsBalance - 1 });

        res.json({
            success: true,
            message: "Image generated successfully.",
            generatedImage,
            creditsBalance: user.creditsBalance - 1 // Return the updated credits balance
        });

    } catch (error) {
        console.log("HuggingFace API Error:", error?.response?.data || error);
        res.json({
            success: false,
            message: error?.response?.data?.error || error.message || "Something went wrong while generating the image. Please try again."
        });
    }
}