import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    } else {
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
    }
  } catch (error) {
    res.send(error);
  }
};

export default protectRoute;
