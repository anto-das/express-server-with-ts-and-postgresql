import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export const config = {
  db_connection_url : process.env.DB_CONNECTION_URL,
  port : process.env.PORT,
  jwt_secret:process.env.JWT_SECRET
};
