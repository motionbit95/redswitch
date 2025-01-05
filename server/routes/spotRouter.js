const express = require("express");
const router = express.Router();
const Spot = require("../model/Spot"); // Spot 클래스 가져오기

/**
 * @swagger
 * tags:
 *   name: Spots
 *   description: 설치 지점 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Spot:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 설치 지점의 고유 ID
 *         spot_name:
 *           type: string
 *           description: 설치 지점명
 *         spot_logo:
 *           type: string
 *           description: 설치 지점 로고 (URL)
 *         spot_image:
 *           type: string
 *           description: 설치 지점 이미지 (URL)
 *         install_flag:
 *           type: integer
 *           description: 설치 여부
 *         branch_adress:
 *           type: string
 *           description: 설치 지점 주소
 * /spots:
 *   post:
 *     summary: 새로운 설치 지점 생성
 *     tags: [Spots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Spot'
 *     responses:
 *       201:
 *         description: 설치 지점 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "설치 지점이 생성되었습니다."
 *                 data:
 *                   $ref: '#/components/schemas/Spot'
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
  try {
    const spotData = req.body;
    const spot = new Spot(spotData);
    const createdSpot = await spot.create();
    res.status(201).json(createdSpot);
  } catch (error) {
    console.error("설치 지점 생성 오류:", error);
    res.status(500).json({ error: "설치 지점 생성 중 문제가 발생했습니다." });
  }
});

/**
 * @swagger
 * /spots/{id}:
 *   get:
 *     summary: ID로 설치 지점 조회
 *     tags: [Spots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 설치 지점 ID
 *     responses:
 *       200:
 *         description: 설치 지점 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Spot'
 *       404:
 *         description: 설치 지점을 찾을 수 없음
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const spot = await Spot.getByID(id);
    res.status(200).json(spot);
  } catch (error) {
    console.error("설치 지점 조회 오류:", error);
    res.status(404).json({ error: "설치 지점을 찾을 수 없습니다." });
  }
});

/**
 * @swagger
 * /spots:
 *   get:
 *     summary: 모든 설치 지점 조회
 *     tags: [Spots]
 *     responses:
 *       200:
 *         description: 설치 지점 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Spot'
 *       500:
 *         description: 서버 오류
 */
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.getAll();
    res.status(200).json(spots);
  } catch (error) {
    console.error("설치 지점 목록 조회 오류:", error);
    res
      .status(500)
      .json({ error: "설치 지점 목록 조회 중 문제가 발생했습니다." });
  }
});

/**
 * @swagger
 * /spots/{id}:
 *   put:
 *     summary: 설치 지점 업데이트
 *     tags: [Spots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 설치 지점 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Spot'
 *     responses:
 *       200:
 *         description: 설치 지점 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "설치 지점이 업데이트되었습니다."
 *                 data:
 *                   $ref: '#/components/schemas/Spot'
 *       400:
 *         description: 잘못된 요청
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const spot = await Spot.getByID(id);
    const updatedSpot = new Spot({ ...spot, ...updateData });
    await updatedSpot.update();

    res.status(200).json(updatedSpot);
  } catch (error) {
    console.error("설치 지점 업데이트 오류:", error);
    res
      .status(400)
      .json({ error: "설치 지점 업데이트 중 문제가 발생했습니다." });
  }
});

/**
 * @swagger
 * /spots/{id}:
 *   delete:
 *     summary: 설치 지점 삭제
 *     tags: [Spots]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 설치 지점 ID
 *     responses:
 *       200:
 *         description: 설치 지점 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "설치 지점이 성공적으로 삭제되었습니다."
 *       404:
 *         description: 설치 지점을 찾을 수 없음
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Spot.deleteByID(id);
    res.status(200).json({ message: "설치 지점이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("설치 지점 삭제 오류:", error);
    res.status(404).json({ error: "설치 지점 삭제 중 문제가 발생했습니다." });
  }
});

module.exports = router;
