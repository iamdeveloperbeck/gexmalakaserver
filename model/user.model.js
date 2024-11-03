const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate phone format
        return /^(\+998)\d{2}\d{3}\d{2}\d{2}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid Phone Number!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  isInfoCreate: {
    type: Boolean,
    default: false,
  },
});

const Users = mongoose.model("User", UserSchema);
module.exports = Users;
