const express = require("express");
const joi = require("joi");
const router = express.Router();
const validation = require("express-joi-validation").createValidator({});
const userController = require("../Controller/userController");
const auth = require("../Middleware/auth");
const messageController = require("../Controller/messageController");

const SignUpSchema = joi.object({
  fullName: joi.string().min(5).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().required().max(20),
  confirmPassword: joi.string().required(),
});
const LoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().max(20),
});

router.post(
  "/api/signUp",
  validation.body(SignUpSchema),
  userController.signUp
);
router.post("/api/Login", validation.body(LoginSchema), userController.Login);
router.get("/api/allUsers", messageController.allUsers);

module.exports = router;
