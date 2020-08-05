const connection = require("../db/mysql_connection");
const moment = require("moment");

// @desc     책한권을 대여하는 api
// @route   POST /api/v1/rental
// @request id(auth), age(auth), book_id
// @response    success
exports.bookRental = async (req, res, next) => {
  let user_id = req.user.id;
  let age = req.user.age;
  let book_id = req.body.book_id;
  console.log(age);

  let query = `select * from book where id =${book_id} and limit_age < ${age}`;
  console.log(query);
  try {
    [rows] = await connection.query(query);
    console.log(rows);
    if (rows.length == 0) {
      res.status(400).json();
      return;
    }
  } catch (e) {
    res.status(500).json();
    return;
  }

  let currentTime = Date.now();
  let limit_date = currentTime + 1000 * 60 * 60 * 24 * 7;
  limit_date = moment(limit_date).format("YYYY-MM-DD HH:mm:ss");
  console.log(limit_date);

  query = `insert into book_rental(user_id,book_id,limit_date) values(${user_id},${book_id},"${limit_date}")`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, result });
  } catch (e) {
    res.status(500).json(e);
    return;
  }
};

// @desc     내가 대여한 책 목록 불러오기
// @route   GET /api/v1/rental?offset=0&limit=25
// @request     id(auth)
// @response    success, rows[]
exports.getMyRental = async (req, res, next) => {
  let user_id = req.user.id;
  let offset = req.query.offset;
  let limit = req.query.limit;

  if (limit > 100) {
    res.status(400).json();
    return;
  }

  let query = `select * from book_rental as r join book as b on r.book_id = b.id where user_id = ${user_id} limit ${offset},${limit}`;
  console.log(query);
  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, rows: rows });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};

// @desc     책한권을 반납하는 api
// @route   DELETE /api/v1/rental
// @request id(auth),book_id
// @response    success
exports.deleteRental = async (req, res, next) => {
  let user_id = req.user.id;
  let book_id = req.body.book_id;

  let query = `delete from book_rental where user_id = ${user_id} and book_id = ${book_id}`;
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
};
