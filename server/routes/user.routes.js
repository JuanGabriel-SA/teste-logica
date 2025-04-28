import { Router } from "express";
import {deleteUser, editUser, exportUsers, getUserById, getUserBySearch, getUsers, writeFile } from "../controllers/user.controller.js";

const router = Router();

router.post("/save", writeFile);
router.get("/users", getUsers);
router.get("/user", getUserById);
router.put("/user/edit", editUser);
router.get("/users/search", getUserBySearch);
router.delete("/user/delete", deleteUser);
router.get("/users/export", exportUsers);

export default router;