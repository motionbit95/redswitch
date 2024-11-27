const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");
const { default: axios } = require("axios");
var router = express.Router();
const qs = require("qs");

const merchantKey =
  "0KHf4qt04B6LEBwZ8M8z5bN/p/I0VQaaMy/SiQfjmVyYFpv6R+OB9toybcTYoOak09rVE4ytGLuvEs5wUEt3pA=="; // 상점키
const merchantID = "DMGS00001m"; // 상점아이디

// Function to get current date and time in yyyyMMddHHmmss format
function getyyyyMMddHHmmss() {
  const now = new Date();
  const yyyyMMddHHmmss =
    now.getFullYear() +
    "" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "" +
    now.getDate().toString().padStart(2, "0") +
    "" +
    now.getHours().toString().padStart(2, "0") +
    "" +
    now.getMinutes().toString().padStart(2, "0") +
    "" +
    now.getSeconds().toString().padStart(2, "0");
  return yyyyMMddHHmmss;
}

// Function to encrypt data using SHA-256
function encryptSHA256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

router.get("/", (req, res) => {
  console.log("PG Sample page");

  console.log(req.query.order_id);
  console.log(req.query.amount);

  // 주문 정보를 가지고 오기

  const ediDate = getyyyyMMddHHmmss();
  const goodsAmt = req.query.amount; // 결제상품금액
  const encData = encryptSHA256(merchantID + ediDate + goodsAmt + merchantKey);

  console.log("encData : " + encData);

  res.render("pg", {
    merchantID,
    goodsNm: "레드스위치",
    goodsAmt,
    ordNm: "레드스위치",
    ordTel: "01000000000",
    ordNo: req.query.order_id,
    returnUrl: "http://localhost:8080/payments/payResult",
    ediDate,
    encData,
  });
});

router.post("/payResult", (req, res) => {
  console.log(req.body);

  const encData = encryptSHA256(
    merchantID + req.body.ediDate + req.body.goodsAmt + merchantKey
  );

  // 승인을 요청합니다. - content-type 변경
  axios
    .post(
      "https://api.payster.co.kr/payment.do",
      { ...req.body, encData: encData },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Charset: "UTF-8",
        },
      }
    )
    .then(async (response) => {
      console.log("응답결과:", response.data, req.body.ordNo);
      // Assuming `response.data` is your response object
      res.redirect(
        "http://localhost:3000/payment?data=" +
          encodeURIComponent("{" + qs.stringify(response.data) + "}")
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/payCancel", (req, res) => {
  const encData = encryptSHA256(
    merchantID + req.query.ediDate + req.query.canAmt + merchantKey
  );

  console.log(encData);

  let data = {
    tid: req.query.tid,
    ordNo: req.query.ordNo,
    canAmt: req.query.canAmt,
    ediDate: req.query.ediDate,
  };

  axios
    .post(
      "https://api.payster.co.kr/payment.cancel",
      {
        tid: data.tid,
        ordNo: data.ordNo,
        canAmt: data.canAmt,
        canMsg: "지점사정", // 취소사유
        partCanFlg: "0",
        encData: encData,
        ediDate: data.ediDate,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Charset: "UTF-8",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      // 환불 결과를 저장합니다.
      // res.send(response.data);
      res.redirect("http://localhost:3000/payment");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/sendResponse", async (req, res) => {
  console.log(req.body);

  res.send(req.body);
});

module.exports = router;
