const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../model/Account");
const router = express.Router();
const cors = require("cors");

router.use(cors());

const db = admin.database(); // Realtime Database 사용
const app = express();
app.use(bodyParser.json());

// JWT 비밀키 (보안을 위해 환경 변수로 관리하는 것이 좋습니다)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // 실제 환경에서는 더 안전한 키를 사용해야 합니다.

// Realtime Database에서 "accounts" 경로 사용
const accountsRef = db.ref("accounts"); // "accounts" 경로에 저장된 데이터를 가져옵니다.

router.post("/", async (req, res) => {
  try {
    // 해싱 필요 없음
    // const { user_password } = req.body;
    // const hashedPassword = await bcrypt.hash(user_password, 10);
    const newAccount = new Account({
      ...req.body,
      // user_password: hashedPassword,
    });
    await newAccount.create();
    res.status(201).send({ message: "계정 생성 성공", account: newAccount });
  } catch (error) {
    console.error("계정 생성 오류:", error);
    res.status(500).send({ error: "계정 생성 실패" });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await accountsRef.once("value"); // Realtime Database에서 모든 데이터 읽기

    // 데이터가 없으면 빈 배열 반환
    if (!snapshot.exists()) {
      return res.status(404).send({ error: "저장된 계정이 없습니다." });
    }

    const accounts = [];
    snapshot.forEach((childSnapshot) => {
      accounts.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    res.status(200).send(accounts);
  } catch (error) {
    console.error("계정 조회 오류:", error);
    res.status(500).send({ error: "계정 조회 실패" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await accountsRef.child(id).once("value");
    if (!snapshot.exists()) {
      return res.status(404).send({ error: "계정을 찾을 수 없음" });
    }
    res.status(200).send({ id: snapshot.key, ...snapshot.val() });
  } catch (error) {
    console.error("계정 조회 오류:", error);
    res.status(500).send({ error: "계정 조회 실패" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    console.log(updatedData);

    // 비밀번호는 해싱 필요
    // if (updatedData.user_password) {
    //   updatedData.user_password = await bcrypt.hash(
    //     updatedData.user_password,
    //     10
    //   );
    // }

    updatedData.updated_at = new Date().toISOString();
    await accountsRef.child(id).update(updatedData);
    res.status(200).send({ message: "계정 수정 성공" });
  } catch (error) {
    console.error("계정 수정 오류:", error);
    res.status(500).send({ error: "계정 수정 실패" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await accountsRef.child(id).remove();
    res.status(200).send({ message: "계정 삭제 성공" });
  } catch (error) {
    console.error("계정 삭제 오류:", error);
    res.status(500).send({ error: "계정 삭제 실패" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user_id, user_password } = req.body;

    const snapshot = await accountsRef
      .orderByChild("user_id")
      .equalTo(user_id)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(403).send({ error: "사용자를 찾을 수 없음" });
    }

    const user = snapshot.val();
    const userKey = Object.keys(user)[0]; // 첫 번째 계정 키
    // const storedHash = user[userKey].user_password;

    // const isMatch = await bcrypt.compare(user_password, storedHash);
    const isMatch = user_password === user[userKey].user_password;
    if (!isMatch) {
      return res.status(401).send({ error: "잘못된 인증 정보" });
    }

    const token = jwt.sign(
      { user_id: user[userKey].user_id, user_name: user[userKey].user_name },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).send({ token, id: user[userKey].id });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).send({ error: "로그인 실패" });
  }
});

// 익명 로그인 엔드포인트
/**
 * @swagger
 * /accounts/anonymous-login:
 *   post:
 *     tags:
 *       - Account
 *     summary: 익명 로그인
 *     description: 익명 로그인을 위한 토큰 생성
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: 로그인 토큰
 *       500:
 *         description: 서버 오류
 */
router.post("/anonymous-login", (req, res) => {
  try {
    // 사용자 고유 식별자 생성 (UUID 또는 임의 값)
    const userId = `anon_${Date.now()}`; // 예: anon_123456789

    // JWT 토큰 생성
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "2h",
    });

    // 토큰 반환
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during anonymous login:", error);
    res.status(500).json({ error: "Failed to create anonymous token" });
  }
});

/**
 * @swagger
 * /accounts/verify-token:
 *   post:
 *     summary: Token 유효성 검증
 *     description: 클라이언트가 보낸 JWT 토큰을 검증하여 유효한지 확인합니다.
 *     tags:
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: "검증할 JWT 토큰"
 *                 example: "your_jwt_token_here"
 *     responses:
 *       200:
 *         description: Token이 유효함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token verification successful"
 *                 decodedToken:
 *                   type: object
 *                   description: "디코딩된 토큰 정보"
 *       401:
 *         description: Token이 유효하지 않거나 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       400:
 *         description: Token이 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized, token missing"
 */
router.post("/verify-token", async (req, res) => {
  try {
    // req.body에서 token 추출
    const token = req.body.token;

    console.log(token); // 디버깅용 로그

    if (!token) {
      return res.status(401).json({ error: "Unauthorized, token missing" });
    }

    // JWT 토큰을 검증하고 디코딩
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // 토큰 검증이 성공하면
    res
      .status(200)
      .json({ message: "Token verification successful", decodedToken });
  } catch (error) {
    console.error("Error during token verification:", error);
    // JWT 검증 실패 시
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// swagger

/** @swagger
 * tags:
 *   name: Account
 *   description: 계정 CRUD API
 */

// POST /accounts: 계정 생성
/**
 * @swagger
 * /accounts:
 *   post:
 *     tags:
 *       - Account
 *     summary: 계정 생성
 *     description: 새로운 계정을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               user_password:
 *                 type: string
 *               user_email:
 *                 type: string
 *               user_name:
 *                 type: string
 *               user_phone:
 *                 type: string
 *               permission:
 *                 type: string
 *               office_position:
 *                 type: string
 *           example:
 *             user_id: "user123"
 *             user_password: "password123"
 *             user_email: "user123@example.com"
 *             user_name: "John Doe"
 *             user_phone: "010-1234-5678"
 *             permission: "admin"
 *             office_position: "manager"
 *     responses:
 *       201:
 *         description: 계정 생성 성공
 *       400:
 *         description: 잘못된 요청 데이터
 *       500:
 *         description: 서버 오류
 */

// GET /accounts: 모든 계정 조회
/**
 * @swagger
 * /accounts:
 *   get:
 *     tags:
 *       - Account
 *     summary: 모든 계정 조회
 *     description: 저장된 모든 계정을 조회합니다.
 *     responses:
 *       200:
 *         description: 모든 계정 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 계정 ID
 *                   user_id:
 *                     type: string
 *                     description: 사용자 ID
 *                   user_name:
 *                     type: string
 *                     description: 사용자 이름
 *                   user_email:
 *                     type: string
 *                     description: 사용자 이메일
 *                   user_phone:
 *                     type: string
 *                     description: 사용자 전화번호
 *                   permission:
 *                     type: string
 *                     description: 사용자 권한
 *                   office_position:
 *                     type: string
 *                     description: 직위
 *             example: [
 *               {
 *                 "id": "1",
 *                 "user_id": "user123",
 *                 "user_name": "John Doe",
 *                 "user_email": "user123@example.com",
 *                 "user_phone": "010-1234-5678",
 *                 "permission": "admin",
 *                 "office_position": "manager"
 *               },
 *               {
 *                 "id": "2",
 *                 "user_id": "user456",
 *                 "user_name": "Jane Smith",
 *                 "user_email": "user456@example.com",
 *                 "user_phone": "010-5678-1234",
 *                 "permission": "user",
 *                 "office_position": "employee"
 *               }
 *             ]
 *       500:
 *         description: 서버 오류
 */

// GET /accounts/:id: 특정 계정 조회
/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     tags:
 *       - Account
 *     summary: 특정 계정 조회
 *     description: 특정 계정을 조회합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 계정 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 계정 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 계정 ID
 *                 user_id:
 *                   type: string
 *                   description: 사용자 ID
 *                 user_name:
 *                   type: string
 *                   description: 사용자 이름
 *                 user_email:
 *                   type: string
 *                   description: 사용자 이메일
 *                 user_phone:
 *                   type: string
 *                   description: 사용자 전화번호
 *                 permission:
 *                   type: string
 *                   description: 사용자 권한
 *                 office_position:
 *                   type: string
 *                   description: 직위
 *             example:
 *               id: "1"
 *               user_id: "user123"
 *               user_name: "John Doe"
 *               user_email: "user123@example.com"
 *               user_phone: "010-1234-5678"
 *               permission: "admin"
 *               office_position: "manager"
 *       404:
 *         description: 계정을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

// PUT /accounts/:id: 특정 계정 수정
/**
 * @swagger
 * /accounts/{id}:
 *   put:
 *     tags:
 *       - Account
 *     summary: 특정 계정 수정
 *     description: 특정 계정을 수정합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 계정 ID
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *           example:
 *             user_name: "John Updated"
 *     responses:
 *       200:
 *         description: 계정 수정 성공
 *       500:
 *         description: 서버 오류
 */

// DELETE /accounts/:id: 특정 계정 삭제
/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     tags:
 *       - Account
 *     summary: 특정 계정 삭제
 *     description: 특정 계정을 삭제합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: 계정 ID
 *         required: true
 *     responses:
 *       200:
 *         description: 계정 삭제 성공
 *       500:
 *         description: 서버 오류
 */

// POST /accounts/login: 로그인
/**
 * @swagger
 * /accounts/login:
 *   post:
 *     tags:
 *       - Account
 *     summary: 로그인
 *     description: 사용자가 로그인하여 인증을 받고 JWT 토큰을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               user_password:
 *                 type: string
 *             required:
 *               - user_id
 *               - user_password
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 로그인 성공 메시지
 *                 token:
 *                   type: string
 *                   description: JWT 인증 토큰
 *             example:
 *               message: "로그인 성공"
 *               token: "your_jwt_token"
 *       401:
 *         description: 잘못된 인증 정보
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

module.exports = router;
