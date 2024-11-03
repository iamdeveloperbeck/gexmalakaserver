const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fullname: {
    type: String,
    required: true,
  },
  specialization_course: {
    type: String,
    required: true,
  },
  studied_time: {
    type: Date,
  },
  completed_time: {
    type: Date,
  },
  diplom_number: {
    type: String,
    required: true,
    unique: true,
  },
  certificate_number: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
});

const Infos = mongoose.model("Info", InfoSchema);
module.exports = Infos;
