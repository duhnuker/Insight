import jwt from "jsonwebtoken";
import 'dotenv/config'


interface UserPayload {
    user: {
        id: string;
    };
}

function jwtGenerator(id: string) {
    const payload: UserPayload = {
        user: {
            id: id
        }
    };

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
      }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export default jwtGenerator;