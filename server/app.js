//app.js
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

// JSON 형식의 요청 본문을 파싱
app.use(express.json());
// URL-encoded 형식의 요청 본문을 파싱
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
// 모든요청에 cors 적용
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

require("dotenv").config();
// Firebase Admin SDK
var admin = require("firebase-admin");

// var serviceAccount = require("./serviceAccountKey.json");
// Construct the credentials object using environment variables
const serviceAccount = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://redswitch-64c62-default-rtdb.firebaseio.com",
  storageBucket: "redswitch-64c62.firebasestorage.app",
});

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0", // 버전 설정
  info: {
    title: "Redswitch API", // API 문서 제목
    version: "1.0.0", // API 버전
    description: "API documentation using Swagger",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // API 문서화할 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger UI 초기화 시 requestInterceptor 설정 추가
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      docExpansion: "none", // 기본적으로 모든 API를 축소
      filter: true,
    },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.use(express.json());

app.use("/", require("./routes/commonRouter"));
app.use("/accounts", require("./routes/accountRouter"));
app.use("/providers", require("./routes/providerRouter"));
app.use("/branches", require("./routes/branchRouter"));
app.use("/products", require("./routes/productRouter"));
app.use("/carts", require("./routes/cartRouter"));
app.use("/orders", require("./routes/ordersRouter"));
app.use("/payments", require("./routes/paymentRouter"));
app.use("/posts", require("./routes/postRouters"));
app.use("/bdsm", require("./routes/bdsmRouter"));
app.use("/advertisements", require("./routes/advertisementRouter"));
app.use("/alarms", require("./routes/alarmRouter"));

/*1. 간편인증 서비스 API 설정*/
/* 키파일은 반드시 서버의 안전한 로컬경로에 별도 저장. 웹URL 경로에 파일이 있을경우 키파일이 외부에 노출될 수 있음 주의 */
const eziok = require("./eziok_Key_Manager_v1.0.3"); // eziok_Key_Manager.js가 있는 폴더 위치
const eziok_path = "./lib/eziok_keyInfo_redswitch.kr_241219.dat";
const password = "dream";
eziok.keyInit(eziok_path, password);

const requestUri = "/eziok/eziok_std_request"; // 인증요청 전 이용기관 처리 URI
const resultUri = "/eziok/eziok_std_result"; // 결과요청 응답값 이용기관 처리 URI

const resultUrl =
  "https://redswitch-customer.netlify.app/eziok/eziok_std_result"; // 결과 수신 후 전달 URL 설정, "https://" 포함한 URL 입력

// 간편인증-표준창 인증결과 keyToken API 요청 URL
// const hubTokenTargetUrl = 'https://cert.ez-iok.com/agent/auth-verify';  // 운영
const hubTokenTargetUrl = "https://scert.ez-iok.com/agent/auth-verify"; // 개발

// 이용기관 거래ID생성시 이용기관별 유일성 보장을 위해 설정, 이용기관식별자는 이용기관코드 영문자로 반드시 수정
const clientPrefix = "SWITCH"; //  8자이내 영대소문자,숫자 (예) EZIOK, TESTCOKR

// eziok_std_request mapping
app.post(requestUri, (req, res) => {
  const serviceId = eziok.getServiceId();

  /* 2. 간편인증-표준창 거래정보 생성 */
  // - 요청 생성 시간 + "|" + 거래ID(유일한 거래정보)
  // 2.1. 간편인증-표준창 요청시간(한국시간 기준) 생성
  // - 간편인증-표준창 요청정보 생성날짜 5분이 초과한 경우 거래정보 유효시간 오류 발생
  // - DataFormat("yyyyMMddHHmmss") 형식으로 변경해주는 함수
  const dateTime = getCurrentDate();
  // 2.2 이용기관 거래ID 생성, 20자 이상 40자 이내 이용기관 고유 트랜잭션ID
  // - 간편인증-표준창 거래ID 는 유일한 값이어야 하며 기 사용한 거래ID가 있는 경우 오류 발생
  // - 이용기관이 고유식별 ID로 유일성을 보장할 경우 고객이 이용하는 ID사용 가능 (예시) 이용기관식별자+UUID, ...
  // - 영문 대소문자, 숫자, '-', '_' 만 허용
  let clientTxId = clientPrefix + uuid();
  /* 2.3 인증 결과 검증을 위한 이용기관 거래ID 세션 저장 (필수) */
  // 동일한 세션내 요청과 결과가 동일한지 확인 및 인증결과 재사용 방지처리
  // req.session.clientTxId = clientTxId; // <- 여기서 버그 생김
  // 2.4. 간편인증-표준창 거래정보 생성
  // - 간편인증-표준창 인증요청 정보 생성날짜 5분이 초과한 경우 거래정보 유효시간 오류 발생
  // clientTxId = dateTime + "|" + clientTxId;

  const newClientTxId = dateTime + "|" + clientTxId;
  console.log("clientTxId", clientTxId, "newClientTxId", newClientTxId);

  console.log(newClientTxId);

  /* 3. 간편인증-표준창 거래정보 암호화 */
  const encClientTxId = eziok.RSAEncrypt(newClientTxId);

  // 4. 간편 인증 인증요청 정보 생성
  const sendData = {
    serviceId: serviceId, // 간편인증-표준창 이용기관 서비스 ID
    // , 'plainData' : '전자서명 원문 데이터 입력 TEST123!@#$' // 전자서명시 원문 입력, { serviceType : "sign" } 일 경우 필수 입력
    // , 'plainData' : 'PDF hash 전자서명 PDF hash 데이터 입력 vfnmgp83peY6FHi0Fo/GBVOzcx2bMhubx4USf9qETIA=' // PDF hash 전자서명시 PDF hash 입력, { serviceType : "pdf_hash_sign" } 일 경우 필수 입력
    encClientTxId: encClientTxId, // 암호화된 거래정보
    serviceType: "auth", // 간편인증-표준창 : auth, 전자서명 : sign, PDF hash 전자서명 : pdf_hash_sign
    retTransferType: "keytoken", // 간편인증-표준창 결과 타입, "keytoken" : 개인정보 응답결과를 이용기관 서버에서 간편인증서버에 요청하여 수신 후 처리
    resultUrl: resultUrl, // 결과 수신 후 전달 URL 설정, "https://" 포함한 URL 입력
    retType: "callback", // 콜백함수 사용 : "callback" , 모바일 redirect 사용(모바일 WebView 또는 iOS 이용시) : "redirect"
  };

  // 5. 간편인증-표준창 인증요청 JSON
  res.send(JSON.stringify(sendData));
});

// eziok_std_result mapping
app.post(resultUri, async (req, res) => {
  // 결과 Token 수신
  const resultToken = req.body; //retType이 callback 방식일 경우
  // const resultToken = req.body.hubToken; //retType이 redirect 방식일 경우
  if (resultToken == "" || resultToken == null) {
    return res.send("-9|간편인증 resultToken 인증결과 응답이 없습니다.");
  }

  resultData = await keytoken(resultToken); //retTransferType(간편인증-표준창 결과 타입)이 keytoken일 경우

  /* 3. 간편인증-표준창 결과 설정 */
  resultData = JSON.parse(resultData);
  const clientTxId = resultData.clientTxId;
  const serviceType = resultData.serviceType;
  const encUserName = resultData.encUsername;
  const encUserPhone = resultData.encUserphone;
  const encUserbirthday = resultData.encUserbirthday;
  const providerId = resultData.providerId;
  const txId = resultData.txId;
  const issueDate = resultData.issueDate;
  const issuer = resultData.issuer;
  const plainData = null;
  if (resultData.hasOwnProperty("encCi")) {
    encCi = resultData.encCi;
  } else {
    encCi = null;
  }

  if (resultData.hasOwnProperty("signedData")) {
    signedData = resultData.signedData;
  } else {
    signedData = null;
  }

  /* 4. 이용기관 응답데이터 셔션 및 검증유효시간 처리  */
  // 세션 내 요청 clientTxId 와 수신한 clientTxId 가 동일한지 비교(필수)
  if (req.session.clientTxId != clientTxId) {
    return res.send("-4|세션값에 저장된 거래ID 비교 실패");
  }

  // 검증정보 유효시간 검증 (검증결과 생성 후 10분 이내 검증 권고)
  let oldDate = new Date(issueDate);
  oldDate = getOldTime(oldDate);

  const currentDate = getCurrentDate();

  if (oldDate < currentDate) {
    return res.send("-5|토큰 생성 10분 결과");
  }

  /* 5. 인증사업자별 개인정보 결과 복호화 */
  const userName = eziok.aesDecode(providerId, encUserName);
  const userphone = eziok.aesDecode(providerId, encUserPhone);
  const userbirthday = eziok.aesDecode(providerId, encUserbirthday);
  if (encCi != null) {
    ci = eziok.aesDecode(providerId, encCi);
  }

  /* 6.1 간편서명 요청시 전자서명 확인 */
  // (이용기관 별 전자서명 복호화 알고리즘을 구현해야 합니다.)
  // - 간편서명 요청시 처리 (serviceType : "sign")
  // - 수신한 전자서명의 원문 복호화, 전자서명 검증, 인증서 획득
  // - 간편인증-표준창 전자서명인증사업자는 인증서 검증 완료 후 결과 전달
  // if (serviceType == "sign") {
  //     plainData = verifySignedData(signedData);
  // }

  /* 6.2 PDF hash 전자서명 요청시 전자서명 확인 */
  // (이용기관 별 전자서명 복호화 알고리즘을 구현해야 합니다.)
  // - PDF hash 전자서명 요청시 처리 (serviceType : "pdf_hash_sign")
  // - 수신한 전자서명의 검증, 인증서 획득
  // - 간편인증-표준창 전자서명인증사업자는 인증서 검증 완료 후 결과 전달
  // if (serviceType == "pdf_hash_sign") {
  //     verifySignedData(signedData, pdfOrigin);
  // }

  /* 7. 이용기관 서비스 기능 처리 */
  // - 이용기관에서 수신한 개인정보 검증 확인 처리
  // - 이용기관에서 수신한 CI 확인 처리

  /* 8.응답결과 전달 */
  // - 간편인증-표준창 요청시 "retType": "callback" 일 경우 > 8.1 callback function 전달
  // - 간편인증-표준창 요청시 "retType": "redirect" 는 8.2 결과 페이지로 이동(모바일 WebView 또는 iOS 등 팝업이 안되는 App일경우)

  /* 8.1 callback 함수 사용시 응답결과 전달 */
  let data = { errorCode: "2000", data: userName };
  res.send("0|" + JSON.stringify(data)); //retType이 callback 방식일 경우

  /* 8.2 redirect 함수 사용시 응답결과 전달 */
  // const redirectUrl = './eziok/eziok_std_redirect.ejs'; //retType이 redirect 방식일 경우
  // res.render(redirectUrl, {data : JSON.stringify(data)}); //retType이 redirect 방식일 경우
});

async function keytoken(token) {
  // auth-verify에 keyToken을 이용하여 hubToken 요청
  // axios의 동작방식이 비동기식으로 진행되는데, 변수에 수신하기 전 데이터가 들어가져 await키워드 사용

  const hubToken = await sendPost(hubTokenTargetUrl, token);
  if (hubToken == null || hubToken == "") {
    return res.send("-1|간편인증 hubtoken 인증결과 응답이 없습니다.");
  }

  /* 2. 간편인증-표준창 HUBToken 처리 결과 복호화 */
  let resultData;
  try {
    resultData = eziok.getResult(hubToken);
  } catch (error) {
    return res.send("-2|간편인증 결과 복호화 오류");
  }
  return resultData;
}

function uuid() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

function getCurrentDate() {
  const newDate = new Date();

  // UTC 시간에 9시간을 더하여 한국 시간으로 변환
  const localTime = new Date(newDate.getTime() + 9 * 60 * 60 * 1000); // 9시간을 밀리초 단위로 더함

  const year = localTime.getFullYear();
  const mon = String(localTime.getMonth() + 1).padStart(2, "0");
  const date = String(localTime.getDate()).padStart(2, "0");

  const hour = String(localTime.getHours()).padStart(2, "0");
  const min = String(localTime.getMinutes()).padStart(2, "0");
  const sec = String(localTime.getSeconds()).padStart(2, "0");

  return `${year}${mon}${date}${hour}${min}${sec}`;
}

async function sendPost(targetUrl, keyToken) {
  let hubToken = await axios({
    method: "post",
    url: targetUrl,
    data: {
      keyToken: keyToken,
    },
  });

  return hubToken.data.hubToken;
}

function getOldTime(oldTime) {
  let year = oldTime.getFullYear();
  let mon = oldTime.getMonth() + 1;
  let date = oldTime.getDate();

  let hour = oldTime.getHours();
  let min = oldTime.getMinutes() + 10;
  let sec = oldTime.getSeconds();

  if (min >= 60) {
    min = min - 60;

    hour = hour + 1;
  }
  if (hour >= 24) {
    hour = hour - 24;

    date = date + 1;
  }
  if (date > new Date(year, mon, 0).getDate()) {
    date = date - new Date(year, mon, 0).getDate();

    mon = mon + 1;
  }
  if (mon >= 13) {
    mon = mon - 12;

    year = year + 1;
  }

  mon = mon < 10 ? `0${mon}` : `${mon}`;
  date = date < 10 ? `0${date}` : `${date}`;
  hour = hour < 10 ? `0${hour}` : `${hour}`;
  min = min < 10 ? `0${min}` : `${min}`;
  sec = sec < 10 ? `0${sec}` : `${sec}`;

  const reqDate = year + mon + date + hour + min + sec;

  return reqDate;
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the server.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
});

// Realtime Database 참조
const db = admin.database();

// 데이터 삽입 함수
async function insertData() {
  const ref = db.ref("users"); // "users" 테이블(참조) 생성
  const newUserRef = ref.push(); // 고유 키로 새 데이터 생성
  await newUserRef.set({
    name: "John Doe",
    email: "johndoe@example.com",
    age: 30,
  });

  console.log("Data inserted successfully!");
}

// 실행
// insertData().catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
