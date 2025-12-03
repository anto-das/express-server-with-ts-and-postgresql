import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { config } from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/users/user.routes";
import { todoRouter } from "./modules/todo/todo.routes";
import { authRouter } from "./modules/auth/auth.routes";

const app = express();
const port = config.port;
// middleware
app.use(express.json());
// app.use(express.urlencoded()) if form data;

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// users apis
app.use("/users", userRouter);

// todos apis
app.use("/todos", todoRouter);

// auth apis

app.use("/auth", authRouter);
app.use((req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    message: "route not found",
    method: req.method,
    route: req.path,
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
