import jwt from "jsonwebtoken";

export function identifyUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "unauthorize",
      success: false,
      err: "no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "unauthorized", success: false, err: "invalid token" });
  }
}
