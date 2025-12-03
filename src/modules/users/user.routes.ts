import express from "express";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userControllers.createUser);



router.get("/", logger,auth("admin"),userControllers.getUsers);

router.get("/:id",auth("admin","user"),userControllers.getSingleUser);

router.put("/:id",userControllers.updateUser);

router.delete("/:id",userControllers.deleteUser)

export const userRouter = router;
