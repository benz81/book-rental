const jwt = require("jsonwebtoken");
const connection = require("../db/mysql_connection");

const auth = async (req, res, next) => {
  let token;
  try {
    token = req.header("Authorization");
    token = token.replace("Bearer ", "");
  } catch (e) {
    res.status(401).json({ error: e, message: "auth 에러" });
    return;
  }

  let user_id;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    user_id = decoded.user_id;
  } catch (e) {
    res.status(401).json({ error: e });
    return;
  }

  let query = `select u.id,u.email,u.age,t.token 
  from book_user as u join book_user_token as t on u.id = t.user_id 
  where u.id = ${user_id}`;

  try {
    [rows] = await connection.query(query);
    if (rows.length == 0) {
      res.status(401).json({ message: "auth" });
      return;
    } else {
      req.user = rows[0];
      next();
    }
  } catch (e) {
    res.status(500).json();
    return;
  }
};

module.exports = auth;
