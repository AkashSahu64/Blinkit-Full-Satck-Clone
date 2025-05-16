import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized: Token not found',
                error: true,
                success: false,
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
        
        if(!decoded) {
            return res.status(401).json({
                message: 'Unauthorized access',
                error: true,
                success: false,
            });
        }

        req.userId = decoded.id;
        next()
        
    } catch (error) {
        console.error('JWT Verification Error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token has expired. Please refresh your token.',
                error: true,
                success: false,
            });
        }

        return res.status(401).json({
            message: 'Unauthorized',
            error: true,
            success: false,
        });
    }
};

export default auth;
