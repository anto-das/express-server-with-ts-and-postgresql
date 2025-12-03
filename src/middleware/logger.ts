import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  // console.log(
  //   `This ${req.method} method is applicable on this ${req.path} path.`
  // );
  next();
};

export default logger