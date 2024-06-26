require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
require("dotenv").config();
const tokenController = {};

/**
 * Current Auth controller
 * Verifies JWT token and stores userInfo in locals
 */
tokenController.verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(403).json("Not authorized");

  // Store userInfo for next controller middleware
  res.locals.userInfo = await jwt.verify(token, secretKey);
  console.log(req.file);
  // Important console log for debugging
  console.log("User successfully authorized\n userInfo: ", res.locals.userInfo);

  return next();
};

//assigns a jwt cookie on sign up
tokenController.setJWTCookie = (req, res, next) => {
  const userInfo = res.locals.userInfo;
  if (!userInfo) throw new Error("No user data to create token");

  // Create token and store in cookie
  const token = jwt.sign(res.locals.userInfo, secretKey);
  let secureBool = true;
  if(process.env.NODE_ENV==='test') secureBool = false;
  console.log(secureBool,'secure Bool');
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: secureBool,
    sameSite: "strict",
  });
  
  return next();
};

// clears jwt cookie on logout
tokenController.removeJWTCookie = (req, res, next) => {
  res.clearCookie("jwt");
  return next();
};

module.exports = tokenController;
