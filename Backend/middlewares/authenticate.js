
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(401).json({ message: "Not found access token or refresh token" });
  }

  try {
    // verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // fetch user from DB
    const user = await User.findById(decoded._id);

    if (!user) return res.status(401).json({ message: "User not found" });

    // // compare refresh tokens
    // if (user.refreshToken !== refreshToken) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    req.user = user;
    next();

  } catch (err) {
    return res.status(403).json({ message: "Access token expired" });
  }
};



export default authenticate;