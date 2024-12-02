const express = require("express");
const router = express.Router();
const Cart = require("../model/Cart"); // Cart 클래스 경로를 맞춰주세요

const cors = require("cors");
router.use(cors());

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: 장바구니 항목 관리 API
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: 장바구니 항목 생성
 *     description: 새로운 장바구니 항목을 생성합니다.
 *     tags:
 *       - Cart
 *     requestBody:
 *       description: 생성할 장바구니 데이터
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 주문자 토큰
 *                 example: user12345
 *               product_pk:
 *                 type: string
 *                 description: 상품의 고유 식별자
 *                 example: prod001
 *               count:
 *                 type: number
 *                 description: 상품 수량
 *                 example: 2
 *               branch_pk:
 *                 type: string
 *                 description: 지점 고유 ID
 *                 example: branch001
 *               amount:
 *                 type: number
 *                 description: 총 금액
 *                 example: 50000
 *     responses:
 *       201:
 *         description: 생성된 장바구니 항목
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
  try {
    const cartData = req.body; // 요청 본문에서 데이터 가져오기
    const newCartItem = new Cart(cartData);
    const createdCartItem = await newCartItem.create();
    res.status(201).json(createdCartItem); // 생성된 항목 반환
  } catch (error) {
    console.error("Error creating cart item:", error);
    res.status(500).json({ error: "Failed to create cart item" });
  }
});

/**
 * @swagger
 * /carts/{pk}:
 *   get:
 *     summary: 특정 장바구니 항목 조회
 *     description: PK를 사용하여 특정 장바구니 항목을 조회합니다.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: 장바구니 항목의 PK
 *     responses:
 *       200:
 *         description: 조회된 장바구니 항목
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: 항목을 찾을 수 없음
 */
router.get("/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const cartItem = await Cart.getByPk(pk);
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res.status(404).json({ error: "Cart item not found" });
  }
});

/**
 * @swagger
 * /carts/token/{token}:
 *   get:
 *     summary: 특정 사용자 토큰의 장바구니 항목 조회
 *     description: 사용자 토큰으로 모든 장바구니 항목을 가져옵니다.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 토큰
 *     responses:
 *       200:
 *         description: 조회된 장바구니 항목들
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: 서버 오류
 */
router.get("/token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const cartItems = await Cart.getAllByToken(token);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

/**
 * @swagger
 * /carts/{pk}:
 *   put:
 *     summary: 특정 장바구니 항목 수정
 *     description: PK를 사용하여 장바구니 항목을 수정합니다.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: 장바구니 항목의 PK
 *     requestBody:
 *       description: 수정할 데이터
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 수정된 장바구니 항목
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: 서버 오류
 */
router.put("/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const cartData = req.body;
    const existingCartItem = await Cart.getByPk(pk);

    Object.assign(existingCartItem, cartData); // 기존 데이터를 요청 본문의 데이터로 병합
    const updatedCartItem = await existingCartItem.update();

    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

/**
 * @swagger
 * /carts/{pk}:
 *   delete:
 *     summary: 특정 장바구니 항목 삭제
 *     description: PK를 사용하여 장바구니 항목을 삭제합니다.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: 장바구니 항목의 PK
 *     responses:
 *       200:
 *         description: 성공적으로 삭제됨
 *       500:
 *         description: 서버 오류
 */
router.delete("/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    await Cart.deleteByPk(pk);
    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

module.exports = router;
