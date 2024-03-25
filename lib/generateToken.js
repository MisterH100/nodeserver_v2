import jwt from "jsonwebtoken";

const generateJWTToken = async (user_id) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  return token;
};

export default generateJWTToken;
