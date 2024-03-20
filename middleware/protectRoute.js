import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_cookie;

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized token" });
    }

    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.send(error);
  }
};

export default protectRoute;
