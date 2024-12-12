const express = require("express");
const router = express.Router();
const OrderAlarm = require("../model/OrderAlarm"); // OrderAlarm 클래스 가져오기

/**
 * @swagger
 * tags:
 *   name: Alarms
 *   description: 주문 알림 관리 API
 */

/**
 * @swagger
 * /alarms:
 *   post:
 *     summary: 새로운 알림 생성
 *     tags: [Alarms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alarm_title:
 *                 type: string
 *                 description: 알림 제목
 *                 example: "새 주문 알림"
 *               alarm_content:
 *                 type: string
 *                 description: 알림 내용
 *                 example: "주문이 접수되었습니다."
 *               branch_pk:
 *                 type: string
 *                 description: 지점 ID
 *                 example: "branch123"
 *               order_pk:
 *                 type: string
 *                 description: 주문 ID
 *                 example: "order456"
 *     responses:
 *       201:
 *         description: 알림 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "알림이 생성되었습니다."
 *                 data:
 *                   $ref: '#/components/schemas/OrderAlarm'
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
  try {
    const alarmData = req.body; // 클라이언트에서 전달된 알림 데이터
    const alarm = new OrderAlarm(alarmData);
    const createdAlarm = await alarm.create();
    res
      .status(201)
      .json({ message: "알림이 생성되었습니다.", data: createdAlarm });
  } catch (error) {
    console.error("알림 생성 오류:", error);
    res.status(500).json({ error: "알림 생성 중 문제가 발생했습니다." });
  }
});

/**
 * @swagger
 * /alarms/{id}:
 *   get:
 *     summary: ID로 알림 조회
 *     tags: [Alarms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/OrderAlarm'
 *       404:
 *         description: 알림을 찾을 수 없음
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const alarm = await OrderAlarm.getById(id);
    res.status(200).json({ data: alarm });
  } catch (error) {
    console.error("알림 조회 오류:", error);
    res.status(404).json({ error: "알림을 찾을 수 없습니다." });
  }
});

/**
 * @swagger
 * /alarms:
 *   get:
 *     summary: 모든 알림 조회
 *     tags: [Alarms]
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderAlarm'
 *       500:
 *         description: 서버 오류
 */
router.get("/", async (req, res) => {
  try {
    const alarms = await OrderAlarm.getAll();
    res.status(200).json({ data: alarms });
  } catch (error) {
    console.error("알림 목록 조회 오류:", error);
    res.status(500).json({ error: "알림 목록 조회 중 문제가 발생했습니다." });
  }
});

/**
 * @swagger
 * /alarms/{id}:
 *   put:
 *     summary: 알림 업데이트
 *     tags: [Alarms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 알림 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alarm_title:
 *                 type: string
 *                 description: 알림 제목
 *                 example: "업데이트된 알림 제목"
 *               alarm_content:
 *                 type: string
 *                 description: 알림 내용
 *                 example: "업데이트된 알림 내용"
 *               alarm_status:
 *                 type: integer
 *                 description: 알림 상태
 *                 example: 1
 *     responses:
 *       200:
 *         description: 알림 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "알림이 업데이트되었습니다."
 *                 data:
 *                   $ref: '#/components/schemas/OrderAlarm'
 *       400:
 *         description: 잘못된 요청
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // 업데이트할 데이터

    // 기존 알림 데이터를 가져온 후 업데이트
    const alarm = await OrderAlarm.getById(id);
    const updatedAlarm = new OrderAlarm({ ...alarm, ...updateData });
    await updatedAlarm.update();

    res
      .status(200)
      .json({ message: "알림이 업데이트되었습니다.", data: updatedAlarm });
  } catch (error) {
    console.error("알림 업데이트 오류:", error);
    res.status(400).json({ error: "알림 업데이트 중 문제가 발생했습니다." });
  }
});

/**
 * @swagger
 * /alarms/{id}:
 *   delete:
 *     summary: 알림 삭제
 *     tags: [Alarms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "알림이 성공적으로 삭제되었습니다."
 *       404:
 *         description: 알림을 찾을 수 없음
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await OrderAlarm.deleteById(id);
    res.status(200).json({ message: "알림이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("알림 삭제 오류:", error);
    res.status(404).json({ error: "알림 삭제 중 문제가 발생했습니다." });
  }
});

module.exports = router;
