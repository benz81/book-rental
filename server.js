const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
// 로그 찍어주는 로거다. 미들웨어 다. app.use에 추가시키는 것.
//
// 우리가 파일로 만든것은 항상, npm 패키지의 아래쪽에 위치
const users = require("./routes/users");

const rental = require("./routes/rental");

const app = express();
// Body parser 설정. 클라이언트에서 body로 데이터 보내는것 처리.
app.use(express.json());

// 먼저 로그 찍어주도록 미들웨어 설정.

// API 경로연결
app.use("/api/v1/users", users);
app.use("/api/v1/rental", rental);

const PORT = process.env.PORT || 5589;

app.listen(PORT, console.log(`API SERVER ${PORT} , ${process.env.MYSQL_USER}`));
