import express from "express";
import { register ,login} from "../controllers/user.controller.js";
import validateUser from "../middlewares/validateUser.js";

const router = express.Router();

router.post("/signup",validateUser, register);
router.post("/login", login);
export default router;