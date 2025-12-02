import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { config } from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/users/user.routes";
import { todoRouter } from "./modules/todo/todo.routes";


const app = express();
const port =config.port;
// middleware
app.use(express.json());



initDB();



app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// users apis
app.use("/users",userRouter);



// todos apis
app.use("/todos",todoRouter);


app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
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
});


app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET title=$1 WHERE id=$2 RETURNING *`,
      [title, id]
    );
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
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM todos WHERE id = $1 RETURNING *`,
      [id]
    );
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
});

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
