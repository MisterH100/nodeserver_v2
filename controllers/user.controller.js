import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import setJWTCookie from "../lib/generateToken.js";

export const RegisterUser = async (req, res) => {
  const { first_name, last_name, email, password, phone, gender, address } =
    req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(404).json({ message: "this email is taken" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${first_name}`;
    const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${first_name}`;

    const newUser = new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      phone: phone,
      gender: gender,
      address: address,
      profileImage: gender === "male" ? maleProfilePic : femaleProfilePic,
    });

    if (newUser) {
      setJWTCookie(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        message: "user registered successfully",
        user: {
          _id: newUser._id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone: newUser.phone,
          gender: newUser.gender,
          address: newUser.address,
          profileImage: newUser.profileImage,
        },
      });
    }
  } catch (err) {
    res.send(err);
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "user does not exist" });
    }

    const validatePassword = bcrypt.compareSync(password, user.password);

    if (!validatePassword) {
      res.status(404).json({ message: "wrong credentials" });
    }
    if (validatePassword) {
      setJWTCookie(user._id, res);
      const { password, ...details } = user._doc;
      res.status(200).json({ message: "login successful", user: details });
    }
  } catch (error) {
    res.send(error);
  }
};

export const updateUser = async (req, res) => {
  const userID = req.user_id;
  const { address, phone } = req.body;
  try {
    await User.findByIdAndUpdate(userID, {
      address: address,
      phone: phone,
    });
    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    res.send(error);
  }
};

export const LogoutUser = (req, res) => {
  try {
    res.cookie("jwt_cookie", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    res.send(error);
  }
};
