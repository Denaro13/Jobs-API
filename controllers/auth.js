const { UnauthenticatedError, BadRequestError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email: user.email }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email }, token });
};

module.exports = {
  register,
  login,
};
