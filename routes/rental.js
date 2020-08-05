const express = require("express");
const auth = require("../middleware/auth");

const {
  bookRental,
  getMyRental,
  deleteRental,
} = require("../controller/rental");

const router = express.Router();

router
  .route("/")
  .post(auth, bookRental)
  .get(auth, getMyRental)
  .delete(auth, deleteRental);

module.exports = router;
