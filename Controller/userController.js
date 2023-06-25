const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../Middleware/auth");

module.exports.signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const isExistUser = await User.findOne({ email: email });
    if (isExistUser) {
      return res.status(400).json({
        status: 400,
        message: "User Already Exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({
      status: 200,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: 401,
      message: "error",
    });
  }
};
