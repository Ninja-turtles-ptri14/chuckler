const express = require("express");
const userController = require("../controllers/userController");
const jokeController = require("../controllers/jokeController");
const tokenController = require("../controllers/tokenController");
const chatController = require("../controllers/chatController");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/signup",
  userController.createUser,
  tokenController.setJWTCookie,
  userController.setIsOnlineTrue,
  (req, res) => {
    return res.status(200).json("User signed up successfully!");
  }
);

router.post(
  "/login",
  userController.verifyUser,
  tokenController.setJWTCookie,
  userController.setIsOnlineTrue,
  (req, res) => {
    return res.status(200).json("User logged in successfully!");
  }
);

router.post(
  "/logout",
  tokenController.verifyToken,
  userController.setIsOnlineFalse,
  tokenController.removeJWTCookie,
  (req, res) => {
    return res.status(200).json("User logged out successfully!");
  }
);

// Get requesting user's jokes
router.post(
  "/jokes",
  tokenController.verifyToken,
  userController.getUserJokes,
  (req, res) => {
    return res.status(200).json(res.locals.jokes);
  }
);

// Get requesting user's matches
router.post(
  "/matches",
  tokenController.verifyToken,
  userController.getUserMatches,
  (req, res) => {
    return res.status(200).json(res.locals.matches);
  }
);

// Get requesting user's profile data
router.post(
  "/profile",
  tokenController.verifyToken,
  userController.getUserProfile,
  (req, res) => {
    return res.status(200).json(res.locals.userInfo);
  }
);

router.get("/picture", userController.getPictureURL, (req, res) => {
  return res.status(200).json(res.locals.user_picture);
});

router.post(
  "/picture",
  tokenController.verifyToken,
  upload.single("image"),
  userController.setUserPicture,
  (req, res) => {
    return res.status(200).send("User picture updated successfully");
  }
);
// verifies if user has a jwt cookie
router.get("/verify", tokenController.verifyToken, (req, res) => {
  return res.status(200).json("Requesting user is authorized");
});
router.get("/chat", chatController.getPreviousMessages);
router.post("/send", chatController.sendMessage);
module.exports = router;
