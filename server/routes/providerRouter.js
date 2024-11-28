const express = require("express");
const Provider = require("../model/Provider");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const provider = new Provider(req.body);
    const newProvider = await provider.create();
    res.status(201).send({
      message: "Provider created successfully",
      provider: newProvider,
    });
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).send({ error: "Failed to create provider" });
  }
});

router.get("/", async (req, res) => {
  try {
    const providers = await Provider.getAll();
    res.status(200).send(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).send({ error: "Failed to fetch providers" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const provider = await Provider.getById(req.params.id);
    res.status(200).send(provider);
  } catch (error) {
    console.error("Error fetching provider:", error);
    res.status(500).send({ error: "Failed to fetch provider" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const provider = new Provider({ ...req.body, id: req.params.id });
    const updatedProvider = await provider.update();
    res.status(200).send(updatedProvider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).send({ error: "Failed to update provider" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Provider.deleteById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting provider:", error);
    res.status(500).send({ error: "Failed to delete provider" });
  }
});

/**
 * @swagger
 * tags:
 *   name: Providers
 *   description: 거래처 CRUD API
 */

/**
 * @swagger
 * paths:
 *   /providers:
 *     post:
 *       summary: 거래처 생성
 *       description: 새로운 거래처를 생성합니다.
 *       tags: [Providers]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - provider_name
 *                 - provider_address
 *                 - provider_sido
 *                 - provider_sigungu
 *                 - provider_contact
 *                 - provider_brn
 *                 - business_file
 *                 - provider_ceo_name
 *                 - provider_ceo_phone
 *                 - provider_manager_name
 *                 - provider_manager_phone
 *               properties:
 *                 provider_name:
 *                   type: string
 *                   description: 거래처 이름
 *                   example: ABC Company
 *                 provider_address:
 *                   type: string
 *                   description: 거래처 주소
 *                   example: 서울특별시 강남구 테헤란로 123
 *                 provider_sido:
 *                   type: number
 *                   description: 거래처 주소 시/도 코드
 *                   example: 11
 *                 provider_sigungu:
 *                   type: number
 *                   description: 거래처 주소 시/군/구 코드
 *                   example: 110
 *                 provider_contact:
 *                   type: string
 *                   description: 거래처 전화번호
 *                   example: 02-1234-5678
 *                 provider_brn:
 *                   type: string
 *                   description: 사업자 등록 번호
 *                   example: 123-45-67890
 *                 bankbook_file:
 *                   type: string
 *                   description: 통장 사본 파일 URL
 *                   example: https://example.com/bankbook.jpg
 *                 bank_account_number:
 *                   type: string
 *                   description: 계좌 번호
 *                   example: 1234567890
 *                 business_file:
 *                   type: string
 *                   description: 사업자 등록증 사본 URL
 *                   example: https://example.com/business.jpg
 *                 provider_ceo_name:
 *                   type: string
 *                   description: 대표자 이름
 *                   example: 홍길동
 *                 provider_ceo_phone:
 *                   type: string
 *                   description: 대표자 전화번호
 *                   example: 010-1234-5678
 *                 provider_manager_name:
 *                   type: string
 *                   description: 담당자 이름
 *                   example: 김철수
 *                 provider_manager_phone:
 *                   type: string
 *                   description: 담당자 전화번호
 *                   example: 010-5678-1234
 *                 payment_type:
 *                   type: string
 *                   description: 결제 유형
 *                   example: 계좌이체
 *       responses:
 *         201:
 *           description: 거래처 생성 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   provider_name:
 *                     type: string
 *                   provider_address:
 *                     type: string
 *                   provider_sido:
 *                     type: number
 *                   provider_sigungu:
 *                     type: number
 *                   provider_contact:
 *                     type: string
 *                   provider_brn:
 *                     type: string
 *                   business_file:
 *                     type: string
 *                   provider_ceo_name:
 *                     type: string
 *                   provider_ceo_phone:
 *                     type: string
 *                   provider_manager_name:
 *                     type: string
 *                   provider_manager_phone:
 *                     type: string
 *                   payment_type:
 *                     type: string
 *         500:
 *           description: 서버 오류
 *     get:
 *       summary: 모든 거래처 조회
 *       description: 저장된 모든 거래처 데이터를 조회합니다.
 *       tags: [Providers]
 *       responses:
 *         200:
 *           description: 거래처 목록 조회 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     provider_name:
 *                       type: string
 *                     provider_address:
 *                       type: string
 *                     provider_sido:
 *                       type: number
 *                     provider_sigungu:
 *                       type: number
 *                     provider_contact:
 *                       type: string
 *                     provider_brn:
 *                       type: string
 *                     business_file:
 *                       type: string
 *                     provider_ceo_name:
 *                       type: string
 *                     provider_ceo_phone:
 *                       type: string
 *                     provider_manager_name:
 *                       type: string
 *                     provider_manager_phone:
 *                       type: string
 *                     payment_type:
 *                       type: string
 *         500:
 *           description: 서버 오류
 *   /providers/{id}:
 *     get:
 *       summary: 특정 거래처 조회
 *       description: ID를 사용하여 특정 거래처 데이터를 조회합니다.
 *       tags: [Providers]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 거래처 ID
 *       responses:
 *         200:
 *           description: 거래처 데이터 조회 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   provider_name:
 *                     type: string
 *                   provider_address:
 *                     type: string
 *                   provider_sido:
 *                     type: number
 *                   provider_sigungu:
 *                     type: number
 *                   provider_contact:
 *                     type: string
 *                   provider_brn:
 *                     type: string
 *                   business_file:
 *                     type: string
 *                   provider_ceo_name:
 *                     type: string
 *                   provider_ceo_phone:
 *                     type: string
 *                   provider_manager_name:
 *                     type: string
 *                   provider_manager_phone:
 *                     type: string
 *                   payment_type:
 *                     type: string
 *         404:
 *           description: 거래처를 찾을 수 없음
 *         500:
 *           description: 서버 오류
 *     put:
 *       summary: 거래처 수정
 *       description: ID를 사용하여 거래처 데이터를 수정합니다.
 *       tags: [Providers]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 거래처 ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - provider_name
 *                 - provider_address
 *                 - provider_sido
 *                 - provider_sigungu
 *                 - provider_contact
 *                 - provider_brn
 *                 - business_file
 *                 - provider_ceo_name
 *                 - provider_ceo_phone
 *                 - provider_manager_name
 *                 - provider_manager_phone
 *               properties:
 *                 provider_name:
 *                   type: string
 *                   description: 거래처 이름
 *                   example: ABC Company
 *                 provider_address:
 *                   type: string
 *                   description: 거래처 주소
 *                   example: 서울특별시 강남구 테헤란로 123
 *                 provider_sido:
 *                   type: number
 *                   description: 거래처 주소 시/도 코드
 *                   example: 11
 *                 provider_sigungu:
 *                   type: number
 *                   description: 거래처 주소 시/군/구 코드
 *                   example: 110
 *                 provider_contact:
 *                   type: string
 *                   description: 거래처 전화번호
 *                   example: 02-1234-5678
 *                 provider_brn:
 *                   type: string
 *                   description: 사업자 등록 번호
 *                   example: 123-45-67890
 *                 bankbook_file:
 *                   type: string
 *                   description: 통장 사본 파일 URL
 *                   example: https://example.com/bankbook.jpg
 *                 bank_account_number:
 *                   type: string
 *                   description: 계좌 번호
 *                   example: 1234567890
 *                 business_file:
 *                   type: string
 *                   description: 사업자 등록증 사본 URL
 *                   example: https://example.com/business.jpg
 *                 provider_ceo_name:
 *                   type: string
 *                   description: 대표자 이름
 *                   example: 홍길동
 *                 provider_ceo_phone:
 *                   type: string
 *                   description: 대표자 전화번호
 *                   example: 010-1234-5678
 *                 provider_manager_name:
 *                   type: string
 *                   description: 담당자 이름
 *                   example: 김철수
 *                 provider_manager_phone:
 *                   type: string
 *                   description: 담당자 전화번호
 *                   example: 010-5678-1234
 *                 payment_type:
 *                   type: string
 *                   description: 결제 유형
 *                   example: 계좌이체
 *       responses:
 *         200:
 *           description: 거래처 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   provider_name:
 *                     type: string
 *                   provider_address:
 *                     type: string
 *                   provider_sido:
 *                     type: number
 *                   provider_sigungu:
 *                     type: number
 *                   provider_contact:
 *                     type: string
 *                   provider_brn:
 *                     type: string
 *                   business_file:
 *                     type: string
 *                   provider_ceo_name:
 *                     type: string
 *                   provider_ceo_phone:
 *                     type: string
 *                   provider_manager_name:
 *                     type: string
 *                   provider_manager_phone:
 *                     type: string
 *                   payment_type:
 *                     type: string
 *         500:
 *           description: 서버 오류
 *     delete:
 *       summary: 거래처 삭제
 *       description: ID를 사용하여 거래처 데이터를 삭제합니다.
 *       tags: [Providers]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 거래처 ID
 *       responses:
 *         200:
 *           description: 거래처 삭제 성공
 *         404:
 *           description: 거래처를 찾을 수 없음
 *         500:
 *           description: 서버 오류
 */

module.exports = router;
