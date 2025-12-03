import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.createTodo(req.body);
    res.status(201).send({
      success: true,
      message: "user todos created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getTodos();
    res.status(200).send({
      success: true,
      message: "get todos successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getSingleTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await todoService.getSingleTodo(id!);
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "user get successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const result = await todoService.updateUser(title, id!);
    if (result.rows.length === 0) {
      res.status(404).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(201).send({
        success: true,
        message: "todos updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await todoService.deleteUser(id!);
    if (result.rowCount === 0) {
      res.status(404).send({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "user deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

export const todoController = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateUser,
  deleteUser,
};
