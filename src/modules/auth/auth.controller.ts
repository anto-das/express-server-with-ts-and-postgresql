import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);
    res.status(200).send({
      success: true,
      message: "user login successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  loginUser,
};
