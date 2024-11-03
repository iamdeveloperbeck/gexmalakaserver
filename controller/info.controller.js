const Infos = require("../model/info.model");
const Users = require("../model/user.model");

exports.create = async (req, res) => {
  const { id } = req.params;
  const {
    fullname,
    studied_time,
    completed_time,
    diplom_number,
    certificate_number,
    specialization_course,
  } = req.body;

  if (!fullname || !diplom_number) {
    return res.status(400).send({
      success: false,
      message: "Fullname or diplom number are required",
    });
  }

  if (!req.file) {
    return res.status(400).send({
      success: false,
      message: "Please upload a profile picture",
    });
  }

  try {
    //? Check if user already exists
    const foundUser = await Users.findById(id);

    if (!foundUser) {
      return res.status(400).send({
        success: false,
        message: "This user not found",
      });
    }

    //? Create a new user
    const newUser = new Infos({
      user_id: foundUser._id,
      fullname,
      studied_time,
      completed_time,
      diplom_number,
      certificate_number,
      specialization_course,
      avatar: `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`,
    });

    await newUser.save();

    await Users.findByIdAndUpdate(id, {
      $set: {
        isInfoCreate: true,
      },
    });

    res.status(201).send({
      success: true,
      message: "User created successfully",
      user: newUser,
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
    const users = await Infos.find().populate("user_id");

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

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(404).send({
      success: false,
      message: "id not found",
    });
  }

  try {
    if (id === "me") {
      const user = await Infos.findOne({
        user_id: req.userId,
      }).populate("user_id");

      res.status(200).send({
        success: true,
        message: "User retrieved successfully",
        user,
      });
    } else {
      const user = await Infos.findOne({
        user_id: id,
      }).populate("user_id");

      res.status(200).send({
        success: true,
        message: "User retrieved successfully",
        user,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await Infos.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body,
      },
    });

    if (!user) {
      return res.status(200).send({
        success: true,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await Infos.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(200).send({
        success: true,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.searchByDiplomNumber = async (req, res) => {
  const { diplom_number } = req.params;

  if (!diplom_number) {
    res.status(404).send({
      success: false,
      message: "diplom number not found",
    });
  }

  const user = await Infos.findOne({
    diplom_number,
  }).populate("user_id");

  if (!user) {
    res.status(404).send({
      success: false,
      message: "User Not Found",
    });
  }

  res.status(200).send({
    success: true,
    message: "User Found",
    user,
  });

  try {
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occured",
      error: error.message,
    });
  }
};
