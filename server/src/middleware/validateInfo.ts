import { Request, Response, NextFunction } from 'express';

interface UserInfo {
  email: string;
  name: string;
  password: string;
}

function middleware(req: Request, res: Response, next: NextFunction): void {
  const { email, name, password } = req.body as UserInfo;

  function validEmail(userEmail: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
      res.status(401).json("Missing Credentials");
      return;
    } else if (!validEmail(email)) {
      res.status(401).json("Invalid Email");
      return;
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      res.status(401).json("Missing Credentials");
      return;
    } else if (!validEmail(email)) {
      res.status(401).json("Invalid Email");
      return;
    }
  }
  next();
}

export default middleware;