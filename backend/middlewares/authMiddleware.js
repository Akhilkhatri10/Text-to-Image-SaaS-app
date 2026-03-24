import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    console.log(req.headers.authorization);
    const token = req.headers.token;
    if(!token) {
        return res.json({
            success: false,
            message: "Not authorized. Please login again."
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.id) {
            // req.body.userId = decodedToken.id; // Since we are not using body parsing in this middleware, we can set userId directly on req
            req.userId = decodedToken.id;
        } else {
            return res.json({
                success: false,
                message: "Not authorized. Please login again."
            });
        }

        // Proceed to the next middleware or route handler if everything is fine
        next();
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message || "Something went wrong while verifying the token. Please try again."
        })
    }
}

export default authMiddleware;