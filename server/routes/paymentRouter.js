const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");
const { default: axios } = require("axios");
var router = express.Router();
const qs = require("qs");

const Payment = require("../model/Payment");

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
  console.log(req.query.goodsNm);

  // 주문 정보를 가지고 오기

  const ediDate = getyyyyMMddHHmmss();
  const goodsAmt = req.query.amount; // 결제상품금액
  const encData = encryptSHA256(merchantID + ediDate + goodsAmt + merchantKey);

  console.log("encData : " + encData);

  res.render("pg", {
    merchantID,
    goodsNm: req.query.goodsNm,
    goodsAmt,
    ordNm: "레드스위치", // 주문자 성함
    ordTel: "01000000000", // 주문자 번호
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
      // 위에 응답결과를 저장
      axios
        .post("http://localhost:8080/payments", response.data)
        .then(() => {
          console.log("승인 결과 DB에 저장완료");
        })
        .catch((error) => {
          console.log(error);
        });
      // Assuming `response.data` is your response object
      res.redirect(
        "http://localhost:3000/payment/result?data=" +
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
      axios
        .post("http://localhost:8080/payments", response.data)
        .then(() => {
          console.log("환불 결과 DB에 저장완료");
        })
        .catch((error) => {
          console.log(error);
        });
      // 환불 결과를 저장합니다.
      // res.send(response.data);
      res.redirect(
        "http://localhost:3000/payment/cancel?data=" +
          encodeURIComponent("{" + qs.stringify(response.data) + "}")
      );
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/sendResponse", async (req, res) => {
  console.log(req.body);

  res.send(req.body);
});

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: 결제 관련 API
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: 새로운 결제 정보 생성
 *     description: 새로운 결제 정보를 생성하고 데이터베이스에 저장합니다.
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tid:
 *                 type: string
 *                 description: 거래 ID
 *               ediDate:
 *                 type: string
 *                 description: 결제 날짜
 *               ordNo:
 *                 type: string
 *                 description: 주문 번호
 *               goodsAmt:
 *                 type: string
 *                 description: 결제 금액
 *               cancelYN:
 *                 type: string
 *                 description: 결제 취소 여부
 *               payMethod:
 *                 type: string
 *                 description: 결제 방법
 *               appNo:
 *                 type: string
 *                 description: 승인 번호
 *     responses:
 *       201:
 *         description: 결제 정보가 성공적으로 생성되었습니다.
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
  try {
    const paymentData = req.body;
    const payment = new Payment(paymentData);
    const newPayment = await payment.create();
    res.status(201).json(newPayment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "결제 생성 중 오류 발생", error: error.message });
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: 특정 결제 정보 조회
 *     description: ID를 사용하여 특정 결제 정보를 조회합니다.
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 결제 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 결제 정보 조회 성공
 *       404:
 *         description: 결제 정보가 존재하지 않음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.getById(id);
    res.status(200).json(payment);
  } catch (error) {
    res
      .status(error.message === "Payment not found" ? 404 : 500)
      .json({ message: error.message });
  }
});

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: 모든 결제 정보 조회
 *     description: 데이터베이스에 저장된 모든 결제 정보를 조회합니다.
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: 결제 정보 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.getAll();
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "결제 정보 조회 중 오류 발생", error: error.message });
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: 결제 정보 수정
 *     description: ID를 사용하여 기존 결제 정보를 수정합니다.
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 결제 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tid:
 *                 type: string
 *                 description: 거래 ID
 *               ediDate:
 *                 type: string
 *                 description: 결제 날짜
 *               ordNo:
 *                 type: string
 *                 description: 주문 번호
 *               goodsAmt:
 *                 type: string
 *                 description: 결제 금액
 *               cancelYN:
 *                 type: string
 *                 description: 결제 취소 여부
 *               payMethod:
 *                 type: string
 *                 description: 결제 방법
 *               appNo:
 *                 type: string
 *                 description: 승인 번호
 *     responses:
 *       200:
 *         description: 결제 정보 수정 성공
 *       404:
 *         description: 결제 정보가 존재하지 않음
 *       500:
 *         description: 서버 오류
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const paymentData = req.body;
    const payment = new Payment({ ...paymentData, pk: id });
    const updatedPayment = await payment.update();
    res.status(200).json(updatedPayment);
  } catch (error) {
    res
      .status(error.message === "Payment not found" ? 404 : 500)
      .json({ message: error.message });
  }
});

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: 결제 정보 삭제
 *     description: ID를 사용하여 특정 결제 정보를 삭제합니다.
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 결제 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 결제 정보 삭제 성공
 *       404:
 *         description: 결제 정보가 존재하지 않음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Payment.deleteById(id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(error.message === "Payment not found" ? 404 : 500)
      .json({ message: error.message });
  }
});

module.exports = router;
