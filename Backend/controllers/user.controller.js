import User from "../models/user.model.js";
import bcrypt from "bcrypt";


export const register = async (req, res) => {
  try {
    
    const { email, username, password } = req.body;
 
    const user = await User.findOne({
  $or: [
    { email: email },
    { username: username }
  ]
});

    if (user) {
      return res.status(400).json({ errors: "User already registered" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashPassword });
    await newUser.save();

     const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }

    if (newUser) {
      const accessToken=newUser.generateAccessToken();
      const refreshToken=newUser.generateRefreshToken();
      newUser.refreshToken=refreshToken;
      await newUser.save({ validateBeforeSave: false })
       const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
      res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({
        message: "User registered successfully",
        user:userResponse
      });

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    
     const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
    const accessToken=user.generateAccessToken();
      const refreshToken=user.generateRefreshToken();
      user.refreshToken=refreshToken;
      await user.save({ validateBeforeSave: false })
       const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
      res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({
        message: "User logged in successfully",
        user:userResponse
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging user" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging out user" });
  }
};