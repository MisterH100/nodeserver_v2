import Jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookie.jwt_cookie;
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized token" });
    }

    req.user_id = decoded.user_id;

    next();
  } catch (error) {
    res.send(error);
  }
};

export default protectRoute;
