const express = require("express");
const { createUser } = require("../controller/users");

const router = express.Router();

router.route("/").post(createUser);

module.exports = router;
