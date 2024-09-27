import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
export interface RequestAuth extends Request {
    user?: JwtPayload; 
}
const JWT_SECRET = process.env.JWT_SECRET

export default function authMiddleware(req: RequestAuth, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Invalid authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token not found" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'string') {
            return res.status(401).json({ success: false, message: "Invalid token", error: "Token payload is not a valid object" });
        }
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
    }
}
