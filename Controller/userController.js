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

module.exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExistUser = await User.findOne({ email: email });
    if (isExistUser) {
      const isValidatePassword = await bcrypt.compareSync(
        password,
        isExistUser.password
      );
      if (!isValidatePassword) {
        return res.status(400).json({
          status: 400,
          message: "Please Check Your Password",
        });
      } else {
        const token = jwt.sign({ id: isExistUser._id }, "tokenGenerated");
        return res.status(200).json({
          status: 200,
          data: {
            id: isExistUser._id,
            fullName: isExistUser.fullName,
            token,
            email: isExistUser.email,
          },
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        message: "User Not Found Please SignUp",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 400,
      message: { error },
    });
  }
};
