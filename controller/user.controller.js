const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const Users = require("../model/user.model");

exports.registerUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send({
      success: false,
      error: "Phone number or Password is required",
    });
  }

  const foundUser = await User.findOne({ phoneNumber });

  if (foundUser) {
    return res.status(400).send({
      success: false,
      error: "This user has already registered",
    });
  }

  const HashedPassword = await bcrypt.hash(password, 10);

  //? Creating new admin
  const user = new User({
    phoneNumber,
    password: HashedPassword,
  });

  try {
    await user.save();

    res.status(201).send({
      success: true,
      message: "User created successfully",
      role: "user",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to create user",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send({
      success: false,
      message: "Phone number or Password is required",
    });
  }

  try {
    const findUser = await User.findOne({ phoneNumber });

    if (!findUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        phoneNumber,
        role: "user",
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).send({
      success: true,
      message: "User successfully authenticated",
      token,
      role: "user",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();

    res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
