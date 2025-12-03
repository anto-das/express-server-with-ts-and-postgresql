import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    res.status(201).send({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    res.status(200).send({
      success: true,
      message: "get users successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await userServices.getSingleUser(id!);

    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "users found successfully",
        data: result.rows[0],
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "user not found",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const result = await userServices.userUpdate(name, email, id!);
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "user updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: true,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await userServices.deleteUser(id!);
    if (result.rowCount === 0) {
      res.status(404).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "user deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
}

export const userControllers = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
