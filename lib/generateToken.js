import jwt from "jsonwebtoken";

const setJWTCookie = async (user_id, res) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt_cookie", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.ENVIRONMENT != "development",
    sameSite: "strict",
  });
};

export default setJWTCookie;