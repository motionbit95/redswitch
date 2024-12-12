const express = require("express");
const Orders = require("../model/Orders"); // Orders 클래스
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: 주문 관련 API
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: 주문 생성
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_pk:
 *                 type: string
 *                 description: 결제 정보 고유 ID
 *               branch_pk:
 *                 type: string
 *                 description: 지점 ID
 *               order_code:
 *                 type: string
 *                 description: 주문 번호
 *               customer_id:
 *                 type: string
 *                 description: 고객 ID
 *               customer_phone:
 *                 type: string
 *                 description: 고객 전화번호
 *               customer_address:
 *                 type: string
 *                 description: 고객 주소
 *               select_products:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: 선택된 상품 목록
 *               order_status:
 *                 type: string
 *                 description: 주문 상태
 *               order_amount:
 *                 type: number
 *                 description: 주문 금액
 *               goods_name:
 *                 type: string
 *                 description: 상품 이름
 *               delivery_message:
 *                 type: string
 *                 description: 배송 메시지
 *     responses:
 *       201:
 *         description: 주문 생성 성공
 */
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;
    const order = new Orders(orderData);
    const createdOrder = await order.create();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("주문 생성 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 생성 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: 주문 상세 조회
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 주문 ID
 *     responses:
 *       200:
 *         description: 주문 상세 정보
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.getById(id);
    res.status(200).json(order);
  } catch (error) {
    console.error("주문 조회 오류:", error);
    res.status(404).json({
      success: false,
      message: "주문을 찾을 수 없습니다.",
    });
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: 모든 주문 조회
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: 모든 주문 정보
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Orders.getAll();
    res.status(200).json(orders);
  } catch (error) {
    console.error("주문 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 목록 조회 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: 주문 업데이트
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 주문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_status:
 *                 type: string
 *                 description: 새로운 주문 상태
 *     responses:
 *       200:
 *         description: 주문 업데이트 성공
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Orders.getById(id);
    Object.assign(order, updateData);
    const updatedOrder = await new Orders(order).update();

    res.status(200).json({
      success: true,
      message: "주문이 성공적으로 업데이트되었습니다.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("주문 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 업데이트 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: 주문 삭제
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 주문 ID
 *     responses:
 *       200:
 *         description: 주문 삭제 성공
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Orders.deleteById(id);
    res.status(200).json({
      success: true,
      message: "주문이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("주문 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 삭제 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /orders/code/{order_code}:
 *   get:
 *     summary: 주문 코드로 주문 조회
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: order_code
 *         required: true
 *         schema:
 *           type: string
 *         description: 주문 코드
 *     responses:
 *       200:
 *         description: 주문 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 성공 여부
 *                 data:
 *                   type: object
 *                   description: 주문 데이터
 *       404:
 *         description: 주문을 찾을 수 없음
 */
router.get("/code/:order_code", async (req, res) => {
  try {
    const { order_code } = req.params;
    const order = await Orders.getByOrderCode(order_code);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "주문을 찾을 수 없습니다.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("주문 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "주문 조회 중 오류가 발생했습니다.",
    });
  }
});

// router.get("/orders", async (req, res) => {
//   const { customerId } = req.query;

//   if (!customerId) {
//     return res.status(400).json({ error: "customerId는 필수입니다." });
//   }

//   try {
//     const orders = await Orders.findOrderByCustomerId(customerId);
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("주문 조회 엔드포인트 오류:", error);
//     res.status(500).json({ error: "주문 조회 실패" });
//   }
// });

module.exports = router;
