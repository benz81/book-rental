const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../db/mysql_connection");

// @desc    회원가입
// @route   POST    /api/v1/users
// @parameters  email, passwd
exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;

  // npm bcryptjs
  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = "insert into book-rental (email, passwd) values ( ? , ? ) ";
  let data = [email, hashedPasswd];
  let user_id;

  try {
    [result] = await connection.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    res.status(500).json();
    return;
  }

  // 토큰 처리  npm jsonwebtoken
  // 토큰 생성 sign
  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into book-rental (user_id, token) values (? , ? )";
  data = [user_id, token];

  try {
    [result] = await connection.query(query, data);
  } catch (e) {
    res.status(500).json();
    return;
  }

  res.status(200).json({ success: true, token: token });
};
