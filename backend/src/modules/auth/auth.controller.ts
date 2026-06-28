import { Response } from "express";
import { Request } from "express";
import { registerUser, loginUser } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";

//register function
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//login function
export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const { email, password } = req.body;

    const result = await loginUser(
      email,
      password
    );

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const me = async (
  req: AuthRequest,
  res: Response
) => {

  return res.json({
    success: true,
    user: req.user,
  });

};