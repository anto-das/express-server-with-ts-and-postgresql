import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;
// middleware
app.use(express.json());

//Database
const pool = new Pool({
  connectionString: `${process.env.DB_CONNECTION_URL}`,
});

//init DB

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
};

initDB();

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `This ${req.method} method is applicable on this ${req.path} path.`
  );
  next();
};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// users apis
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
      [name, email]
    );
    res.status(201).send({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).send({ success: false, message: err.message });
  }
});

app.get("/users", logger, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
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
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
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
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

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
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,
      [name, email, id]
    );
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
});

// todos apis
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
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
});

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

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`,
      [user_id, title]
    );
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
