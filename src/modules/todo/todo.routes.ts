import { Router } from "express";
import { todoController } from "./todo.controller";

const router = Router();

router.post("/", todoController.createTodo);
router.get("/", todoController.getTodos);
router.get("/:id", todoController.getSingleTodo);
router.put("/:id", todoController.updateUser);
router.delete("/:id", todoController.deleteUser);
export const todoRouter = router;
