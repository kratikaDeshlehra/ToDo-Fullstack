import express from "express";
import { register ,login,home,logout} from "../controllers/user.controller.js";
import validateUser from "../middlewares/validateUser.js";
import authenticate from "../middlewares/authenticate.js";


const router = express.Router();

router.post("/signup",validateUser, register);
router.get("/Home",authenticate,home);
router.post("/login",login);
router.post("/logout",authenticate,logout);
export default router;