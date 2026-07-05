import jwt from "jsonwebtoken";

export const userVerification = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};