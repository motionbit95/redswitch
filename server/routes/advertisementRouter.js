const express = require("express");
const router = express.Router();
const Advertisement = require("../model/Advertisement"); // Advertisement 클래스 가져오기

/**
 * @swagger
 * tags:
 *   name: Advertisements
 *   description: 광고 관리 API
 */

/**
 * @swagger
 * /advertisements:
 *   post:
 *     summary: 새로운 광고 생성
 *     tags: [Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banner_advertiser:
 *                 type: string
 *                 description: 광고주 이름
 *               banner_image:
 *                 type: string
 *                 format: binary
 *                 description: 배너 이미지 파일 경로
 *               banner_site:
 *                 type: string
 *                 description: 배너 사이트 URL
 *               banner_position:
 *                 type: integer
 *                 description: 배너 위치
 *               manager_phone:
 *                 type: string
 *                 description: 매니저 연락처
 *               manager_name:
 *                 type: string
 *                 description: 매니저 이름
 *               brn:
 *                 type: string
 *                 description: 사업자 등록 번호
 *               business_file:
 *                 type: string
 *                 description: 사업자 파일 경로
 *               amount:
 *                 type: number
 *                 description: 광고비 금액
 *               active_datetime:
 *                 type: string
 *                 format: date-time
 *                 description: 광고 시작 시간
 *               expire_datetime:
 *                 type: string
 *                 format: date-time
 *                 description: 광고 종료 시간
 *     responses:
 *       201:
 *         description: 광고가 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
 */
router.post("/", async (req, res) => {
  try {
    const advertisement = new Advertisement(req.body);
    const createdAd = await advertisement.create();
    res.status(201).json({ success: true, data: createdAd });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /advertisements/{pk}:
 *   get:
 *     summary: 특정 광고 조회
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: pk
 *         schema:
 *           type: string
 *         required: true
 *         description: 광고의 PK (Primary Key)
 *     responses:
 *       200:
 *         description: 광고 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
 *       404:
 *         description: 광고를 찾을 수 없음
 */
router.get("/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const advertisement = await Advertisement.getByPK(pk);
    res.status(200).json({ success: true, data: advertisement });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    res.status(404).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /advertisements:
 *   get:
 *     summary: 모든 광고 조회
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: 모든 광고를 성공적으로 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Advertisement'
 */
router.get("/", async (req, res) => {
  try {
    const advertisements = await Advertisement.getAll();
    res.status(200).json({ success: true, data: advertisements });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /advertisements/{pk}:
 *   put:
 *     summary: 특정 광고 수정
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: pk
 *         schema:
 *           type: string
 *         required: true
 *         description: 광고의 PK (Primary Key)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banner_advertiser:
 *                 type: string
 *                 description: 광고주 이름
 *               banner_image:
 *                 type: string
 *                 description: 광고 이미지 경로
 *               banner_position:
 *                 type: integer
 *                 description: 광고 위치
 *               manager_phone:
 *                 type: string
 *                 description: 매니저 연락처
 *               manager_name:
 *                 type: string
 *                 description: 매니저 이름
 *               brn:
 *                 type: string
 *                 description: 사업자 등록 번호
 *               business_file:
 *                 type: string
 *                 description: 사업자 파일 경로
 *               amount:
 *                 type: number
 *                 description: 광고비 금액
 *               active_datetime:
 *                 type: string
 *                 format: date-time
 *                 description: 광고 시작 시간
 *               expire_datetime:
 *                 type: string
 *                 format: date-time
 *                 description: 광고 종료 시간
 *     responses:
 *       200:
 *         description: 광고 수정 성공
 */
router.put("/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const advertisement = new Advertisement({ ...req.body, pk });
    const updatedAd = await advertisement.update();
    res.status(200).json({ success: true, data: updatedAd });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /advertisements/{pk}:
 *   delete:
 *     summary: 특정 광고 삭제
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: pk
 *         schema:
 *           type: string
 *         required: true
 *         description: 광고의 PK (Primary Key)
 *     responses:
 *       200:
 *         description: 광고 삭제 성공
 */
router.delete("/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    await Advertisement.deleteByPK(pk);
    res
      .status(200)
      .json({ success: true, message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
