const express = require("express");
const Branch = require("../model/Branch"); // Branch 모델 참조
const router = express.Router();

// 지점 생성
router.post("/", async (req, res) => {
  try {
    const branch = new Branch(req.body);
    const newBranch = await branch.create();
    res.status(201).send(newBranch);
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).send({ error: "Failed to create branch" });
  }
});

// 모든 지점 조회
router.get("/", async (req, res) => {
  try {
    const branches = await Branch.getAll();
    res.status(200).send(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).send({ error: "Failed to fetch branches" });
  }
});

// 특정 지점 조회
router.get("/:id", async (req, res) => {
  try {
    const branch = await Branch.getById(req.params.id);
    res.status(200).send(branch);
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).send({ error: "Failed to fetch branch" });
  }
});

// 지점 수정
router.put("/:id", async (req, res) => {
  try {
    const branch = new Branch({ ...req.body, id: req.params.id });
    const updatedBranch = await branch.update();
    res.status(200).send(updatedBranch);
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).send({ error: "Failed to update branch" });
  }
});

// 지점 삭제
router.delete("/:id", async (req, res) => {
  try {
    const result = await Branch.deleteById(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).send({ error: "Failed to delete branch" });
  }
});

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: 지점 CRUD API
 */

/*

    this.id = data.id || null; // 데이터베이스에서 자동 생성됨
    this.branch_name = data.branch_name;
    this.branch_address = data.branch_address;
    this.branch_contact = data.branch_contact;
    this.branch_room_cnt = data.branch_room_cnt;
    this.updated_at = data.updated_at || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.install_flag = data.install_flag || 1; // 기본값
    this.branch_image = data.branch_image || null;
    this.install_image = data.install_image || null;
    this.contract_image = data.contract_image || null;
    this.branch_ceo_name = data.branch_ceo_name || null;
    this.branch_ceo_phone = data.branch_ceo_phone || null;
    this.branch_manager_name = data.branch_manager_name || null;
    this.branch_manager_phone = data.branch_manager_phone || null;

*/

/**
 * @swagger
 * paths:
 *   /branches:
 *     post:
 *       summary: 지점 생성
 *       description: 새로운 지점을 생성합니다.
 *       tags: [Branches]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - branch_name
 *                 - branch_address
 *                 - branch_contact
 *                 - branch_manager_name
 *                 - branch_manager_phone
 *               properties:
 *                 branch_name:
 *                   type: string
 *                   description: 지점 이름
 *                   example: 강남지점
 *                 branch_address:
 *                   type: string
 *                   description: 지점 주소
 *                   example: 서울특별시 강남구 테헤란로 123
 *                 branch_contact:
 *                   type: string
 *                   description: 지점 전화번호
 *                   example: 02-9876-5432
 *                 branch_room_cnt:
 *                   type: number
 *                   description: 지점 ROOM 개수
 *                   example: 1
 *                 install_flag:
 *                   type: number
 *                   description: 지점 설치 여부
 *                   example: 1
 *                 branch_image:
 *                   type: string
 *                   description: 지점 이미지
 *                   example: https://example.com/branch_image.jpg
 *                 install_image:
 *                   type: string
 *                   description: 지점 설치 이미지
 *                   example: https://example.com/install_image.jpg
 *                 contract_image:
 *                   type: string
 *                   description: 지점 계약서 이미지
 *                   example: https://example.com/contract_image.jpg
 *                 branch_ceo_name:
 *                   type: string
 *                   description: 지점 대표자 이름
 *                   example: 홍길동
 *                 branch_ceo_phone:
 *                   type: string
 *                   description: 지점 대표자 전화번호
 *                   example: 010-1234-5678
 *                 branch_manager_name:
 *                   type: string
 *                   description: 지점 담당자 이름
 *                   example: 홍길동
 *                 branch_manager_phone:
 *                   type: string
 *                   description: 지점 담당자 전화번호
 *                   example: 010-1234-5678
 *       responses:
 *         201:
 *           description: 지점 생성 성공
 *         500:
 *           description: 서버 오류
 *
 *     get:
 *       summary: 모든 지점 조회
 *       description: 저장된 모든 지점 데이터를 조회합니다.
 *       tags: [Branches]
 *       responses:
 *         200:
 *           description: 지점 목록 조회 성공
 *         500:
 *           description: 서버 오류
 *
 *   /branches/{id}:
 *     get:
 *       summary: 특정 지점 조회
 *       description: ID로 특정 지점을 조회합니다.
 *       tags: [Branches]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 지점 ID
 *       responses:
 *         200:
 *           description: 지점 데이터 조회 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   branch_name:
 *                     type: string
 *                   branch_address:
 *                     type: string
 *                   branch_contact:
 *                     type: string
 *                   branch_manager_name:
 *                     type: string
 *                   branch_manager_phone:
 *                     type: string
 *         404:
 *           description: 지점을 찾을 수 없음
 *         500:
 *           description: 서버 오류
 *
 *     put:
 *       summary: 지점 수정
 *       description: 특정 지점의 데이터를 수정합니다.
 *       tags: [Branches]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 지점 ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - branch_name
 *                 - branch_address
 *                 - branch_contact
 *                 - branch_manager_name
 *                 - branch_manager_phone
 *               properties:
 *                 branch_name:
 *                   type: string
 *                   description: 지점 이름
 *                   example: 강남지점
 *                 branch_address:
 *                   type: string
 *                   description: 지점 주소
 *                   example: 서울특별시 강남구 테헤란로 123
 *                 branch_contact:
 *                   type: string
 *                   description: 지점 전화번호
 *                   example: 02-9876-5432
 *                 branch_manager_name:
 *                   type: string
 *                   description: 지점 담당자 이름
 *                   example: 홍길동
 *                 branch_manager_phone:
 *                   type: string
 *                   description: 지점 담당자 전화번호
 *                   example: 010-1234-5678
 *       responses:
 *         200:
 *           description: 지점 수정 성공
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   branch_name:
 *                     type: string
 *                   branch_address:
 *                     type: string
 *                   branch_contact:
 *                     type: string
 *                   branch_manager_name:
 *                     type: string
 *                   branch_manager_phone:
 *                     type: string
 *         500:
 *           description: 서버 오류
 *
 *     delete:
 *       summary: 지점 삭제
 *       description: 특정 지점을 삭제합니다.
 *       tags: [Branches]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: 지점 ID
 *       responses:
 *         200:
 *           description: 지점 삭제 성공
 *         404:
 *           description: 지점을 찾을 수 없음
 *         500:
 *           description: 서버 오류
 */

module.exports = router;
