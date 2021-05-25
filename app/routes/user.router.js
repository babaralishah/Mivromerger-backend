const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get("/", userController.getAll);
router.post("/add", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.delete("/delete/:_id", userController.deleteUser);
router.put("/update/:_id", userController.updateUser);

module.exports = router;