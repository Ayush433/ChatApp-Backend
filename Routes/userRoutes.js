const express = require("express");
const joi = require("joi");
const router = express.Router();
const validation = require("express-joi-validation").createValidator({});
const userController = require("../Controller/userController");
const auth = require("../Middleware/auth");

const SignUpSchema = joi.object({
  fullName: joi.string().min(5).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().required().max(20),
});

router.post(
  "/api/signUp",
  validation.body(SignUpSchema),
  userController.signUp
);

module.exports = router;
