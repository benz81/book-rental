const express = require("express");
const auth = require("../middleware/auth");

const {
  bookRental,
  getMyRental,
  deleteRental,
  getBook,
} = require("../controller/rental");

const router = express.Router();

router
  .route("/")
  .post(auth, bookRental)
  .get(auth, getMyRental)
  .delete(auth, deleteRental);
router.route("/all").get(getBook);

module.exports = router;
