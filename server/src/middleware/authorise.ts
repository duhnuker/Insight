import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

interface JwtPayload {
    user: {
        id: string;
    };
}

export default (req: Request & { user?: { id: string } }, res: Response, next: NextFunction) => {

    const token = req.header("jwt_token");

    if (!token) {
        return res.status(403).json("Not Authorised");
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = verify.user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ msg: "Invalid token" });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ msg: "Token expired" });
        } else {
            console.error((error as Error).message);
            return res.status(500).json({ msg: "Server error during authentication" });
        }
    }
};