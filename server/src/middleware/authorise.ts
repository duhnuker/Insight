import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

interface JwtPayload {
    user: {
        id: string;
    };
}

export default (req: Request & { user?: { id: string } }, res: Response, next: NextFunction): void => {
    const token = req.header("jwt_token");

    if (!token) {
        res.status(403).json("Not Authorised");
        return;
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = verify.user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ msg: "Invalid token" });
            return;
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(403).json({ msg: "Token expired" });
            return;
        } else {
            console.error((error as Error).message);
            res.status(500).json({ msg: "Server error during authentication" });
            return;
        }
    }
};
