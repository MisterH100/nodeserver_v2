import bcrypt from "bcrypt";
import vine, { errors } from "@vinejs/vine";
import User from "../models/user.model.js";
import generateJWTToken from "../lib/generateToken.js";

export const RegisterUser = async (req, res) => {
  const { first_name, last_name, email, password, phone, gender, address } =
    req.body;

  const schema = vine.object({
    first_name: vine.string().minLength(3),
    last_name: vine.string().minLength(3),
    email: vine.string().email(),
    gender: vine.enum(["male", "female"]),
    password: vine.string(),
  });

  const data = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    gender: gender,
    password: password,
  };

  try {
    const validator = vine.compile(schema);
    await validator.validate(data);

    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({ message: "this email is taken" });
    } else {
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

      const token = await generateJWTToken(newUser._id);
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
        token: token,
      });
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      res.status(400).json({
        message: error.messages[0].message,
      });
    } else {
      res
        .status(500)
        .json({ message: "failed to register, internal server error" });
    }
  }
};

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  const schema = vine.object({
    email: vine.string().email(),
    password: vine.string(),
  });

  const data = {
    email: email,
    password: password,
  };

  try {
    const validator = vine.compile(schema);
    await validator.validate(data);

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ message: "user does not exist" });
    } else {
      const validatePassword = bcrypt.compareSync(password, user.password);

      if (!validatePassword) {
        res.status(400).json({ message: "wrong credentials" });
      }
      if (validatePassword) {
        const token = await generateJWTToken(user._id);
        await User.findByIdAndUpdate(user._id, {
          $set: { logged_in: true },
        });
        const { password, ...details } = user._doc;
        res
          .status(200)
          .json({ message: "login successful", user: details, token: token });
      }
    }
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      res.status(400).json({
        message: error.messages[0].message,
      });
    } else {
      res
        .status(500)
        .json({ message: "failed to login, internal server error" });
    }
  }
};

export const updateUser = async (req, res) => {
  const userID = req.user._id;
  const { address, phone } = req.body;
  const schema = vine.object({
    address: vine.string(),
    phone: vine.string(),
  });

  const data = {
    address: address,
    phone: phone,
  };
  try {
    const validator = vine.compile(schema);
    await validator.validate(data);

    await User.findByIdAndUpdate(userID, {
      $set: { address: address, phone: phone },
    });
    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      res.status(400).json({
        message: error.messages[0].message,
      });
    } else {
      res
        .status(500)
        .json({ message: "failed to update, internal server error" });
    }
  }
};

export const authUser = async (req, res) => {
  const userID = req.user._id;
  try {
    const user = await User.findById(userID);

    if (!user) {
      res.status(400).json({ message: "user does not exist" });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $set: { logged_in: true },
      });
      const { password, ...details } = user._doc;
      res
        .status(200)
        .json({ message: "authenticated successfully", user: details });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to authenticate, internal server error" });
  }
};

export const LogoutUser = async (req, res) => {
  const userID = req.user._id;
  try {
    await User.findByIdAndUpdate(userID, {
      $set: { logged_in: false },
    });

    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to logout, internal server error" });
  }
};
