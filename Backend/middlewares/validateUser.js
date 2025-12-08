
const validateUser = (req, res, next) => {
  const { email, username, password } = req.body;
  const errors = [];

  if (!email || !email.includes("@")) {
    errors.push("Invalid or missing email");
  }

  if (!username || username.length < 3) {
    errors.push("Username must be 3+ characters");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be 6+ characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
export default validateUser;
