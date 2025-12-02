import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo =async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await todoService.createTodo(user_id,title);
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
}

const getTodos =  async (req: Request, res: Response) => {
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
}

export const todoController ={
    createTodo,
    getTodos
}