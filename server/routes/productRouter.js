const express = require("express");
const admin = require("firebase-admin");
const {
  Category,
  Material,
  Product,
  OrderingHistory,
  OrderingProduct,
  Inventory,
} = require("../model/Product");

const router = express.Router();

const cors = require("cors");
router.use(cors());

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: 상품 카테고리 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: 물자 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 판매상품 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: OrderingHistory
 *   description: 발주 이력 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: OrderingProduct
 *   description: 발주 상품 CRUD API
 */

/**
 * @swagger
 * tags:
 *   name: Inventories
 *   description: 재고 CRUD API
 */

// Create a new category
/**
 * @swagger
 * /products/categories:
 *   post:
 *     summary: 새로운 카테고리를 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 카테고리를 생성합니다.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_category
 *               - product_category_code
 *             properties:
 *               product_category:
 *                 type: string
 *                 description: 상품 카테고리 이름
 *               product_category_code:
 *                 type: string
 *                 description: 상품 카테고리 코드
 *     responses:
 *       201:
 *         description: 카테고리 생성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 카테고리 고유 ID
 *                 product_category:
 *                   type: string
 *                   description: 상품 카테고리 이름
 *                 product_category_code:
 *                   type: string
 *                   description: 상품 카테고리 코드
 *                 created_at:
 *                   type: string
 *                   description: 카테고리 생성 일시
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/categories", async (req, res) => {
  try {
    const { product_category, product_category_code } = req.body;

    if (!product_category || !product_category_code) {
      return res
        .status(400)
        .json({ message: "상품 카테고리와 코드가 필요합니다." });
    }

    const category = new Category({
      product_category,
      product_category_code,
    });

    const createdCategory = await category.create();
    res.status(201).json(createdCategory);
    console.log(createdCategory);
  } catch (error) {
    console.error("카테고리 생성 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 생성 실패", error: error.message });
  }
});

// Get all categories
/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: 모든 카테고리 정보를 조회합니다.
 *     description: 저장된 모든 카테고리 정보를 조회합니다.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 카테고리 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pk:
 *                     type: string
 *                     description: 카테고리 고유 ID
 *                   product_category:
 *                     type: string
 *                     description: 상품 카테고리 이름
 *                   product_category_code:
 *                     type: string
 *                     description: 상품 카테고리 코드
 *                   created_at:
 *                     type: string
 *                     description: 카테고리 생성 일시
 *       500:
 *         description: 서버 오류
 */
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("카테고리 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 목록 조회 실패", error: error.message });
  }
});

// Get a category by PK
/**
 * @swagger
 * /products/categories/{pk}:
 *   get:
 *     summary: 카테고리 정보를 조회합니다.
 *     description: 주어진 PK로 카테고리 정보를 조회합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 카테고리 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 카테고리 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 카테고리 고유 ID
 *                 product_category:
 *                   type: string
 *                   description: 상품 카테고리 이름
 *                 product_category_code:
 *                   type: string
 *                   description: 상품 카테고리 코드
 *                 created_at:
 *                   type: string
 *                   description: 카테고리 생성 일시
 *       404:
 *         description: 카테고리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/categories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const category = await Category.getByPk(pk);
    res.status(200).json(category);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 조회 실패", error: error.message });
  }
});

// Update a category by PK
/**
 * @swagger
 * /products/categories/{pk}:
 *   put:
 *     summary: 카테고리 정보를 수정합니다.
 *     description: 주어진 PK로 카테고리 정보를 수정합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 카테고리 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_category:
 *                 type: string
 *                 description: 상품 카테고리 이름
 *               product_category_code:
 *                 type: string
 *                 description: 상품 카테고리 코드
 *     responses:
 *       200:
 *         description: 카테고리 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 카테고리 고유 ID
 *                 product_category:
 *                   type: string
 *                   description: 상품 카테고리 이름
 *                 product_category_code:
 *                   type: string
 *                   description: 상품 카테고리 코드
 *                 created_at:
 *                   type: string
 *                   description: 카테고리 생성 일시
 *                 updated_at:
 *                   type: string
 *                   description: 카테고리 수정 일시
 *       400:
 *         description: 필수 필드 누락
 *       404:
 *         description: 카테고리 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/categories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const { product_category, product_category_code } = req.body;

    if (!product_category && !product_category_code) {
      return res.status(400).json({ message: "수정할 필드를 제공해 주세요." });
    }

    const category = new Category({
      pk,
      product_category,
      product_category_code,
    });

    await category.update();
    res.status(200).json(category);
  } catch (error) {
    console.error("카테고리 수정 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 수정 실패", error: error.message });
  }
});

// Delete a category by PK
/**
 * @swagger
 * /products/categories/{pk}:
 *   delete:
 *     summary: 카테고리를 삭제합니다.
 *     description: 주어진 PK로 카테고리를 삭제합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 카테고리 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 카테고리 삭제 성공
 *       404:
 *         description: 카테고리를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/categories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    await Category.deleteByPk(pk);
    res.status(200).json({ message: "카테고리 삭제 성공" });
  } catch (error) {
    console.error("카테고리 삭제 오류:", error);
    res
      .status(500)
      .json({ message: "카테고리 삭제 실패", error: error.message });
  }
});

// Create a new material
/**
 * @swagger
 * /products/materials:
 *   post:
 *     summary: 새로운 물자를 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 물자를 생성합니다.
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - product_sale
 *               - provider_name
 *               - provider_code
 *               - product_category_code
 *             properties:
 *               product_name:
 *                 type: string
 *                 description: 제품명
 *               product_sale:
 *                 type: string
 *                 description: 원가
 *               provider_name:
 *                 type: string
 *                 description: 거래처명
 *               original_image:
 *                 type: string
 *                 description: 제품 이미지
 *               product_category_code:
 *                 type: string
 *                 description: 카테고리 PK
 *               provider_id:
 *                 type: string
 *                 description: 거래처 고유 ID
 *               provider_code:
 *                 type: string
 *                 description: 거래처 코드
 *     responses:
 *       201:
 *         description: 물자 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/materials", async (req, res) => {
  try {
    const {
      product_name,
      product_sale,
      provider_name,
      product_category_code,
      provider_id,
      provider_code,
    } = req.body;

    if (
      !product_name ||
      !product_sale ||
      !provider_name ||
      !product_category_code ||
      !provider_code ||
      !provider_id
    ) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const material = new Material(req.body);

    const createdMaterial = await material.create();
    res.status(201).json(createdMaterial);
  } catch (error) {
    console.error("물자 생성 오류:", error);
    res.status(500).json({ message: "물자 생성 실패", error: error.message });
  }
});

// Get a material by PK
/**
 * @swagger
 * /products/materials/{pk}:
 *   get:
 *     summary: 물자 정보를 조회합니다.
 *     description: 주어진 PK로 물자 정보를 조회합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 물자 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 물자 조회 성공
 *       404:
 *         description: 물자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/materials/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const material = await Material.getByPk(pk);
    res.status(200).json(material);
  } catch (error) {
    console.error("물자 조회 오류:", error);
    res.status(500).json({ message: "물자 조회 실패", error: error.message });
  }
});

// Get all materials - search
/**
 * @swagger
 * /products/materials:
 *   get:
 *     summary: 모든 물자 정보를 조회합니다.
 *     description: 모든 물자 정보를 조회하여 반환합니다.
 *     tags: [Materials]
 *     responses:
 *       200:
 *         description: 물자 리스트 조회 성공
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 물자 고유 ID
 *                 product_code:
 *                   type: string
 *                   description: 상품 코드
 *                 product_name:
 *                   type: string
 *                   description: 제품명
 *                 product_sale:
 *                   type: string
 *                   description: 원가
 *                 provider_name:
 *                   type: string
 *                   description: 거래처명
 *                 original_image:
 *                   type: string
 *                   description: 제품 이미지
 *                 provider_code:
 *                   type: string
 *                   description: 거래처 PK
 *                 product_category_code:
 *                   type: string
 *                   description: 카테고리 PK
 *                 created_at:
 *                   type: string
 *                   description: 물자 생성 일시
 *       500:
 *         description: 서버 오류
 */
router.get("/materials", async (req, res) => {
  try {
    const materials = await Material.getAll();
    res.status(200).json(materials);
  } catch (error) {
    console.error("물자 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "물자 목록 조회 실패", error: error.message });
  }
});

// Search materials
/**
 * @swagger
 * /products/materials/search/{provider_id}:
 *   get:
 *     summary: 거래처별 물자 목록을 조회합니다.
 *     description: 거래처별 물자 목록을 조회하여 반환합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: provider_id
 *         required: true
 *         description: 거래처 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 거래처별 물자 목록 조회 성공
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 pk:
 *                   type: string
 *                   description: 물자 고유 ID
 *                 product_code:
 *                   type: string
 *                   description: 상품 코드
 *                 product_name:
 *                   type: string
 *                   description: 제품명
 *                 product_sale:
 *                   type: string
 *                   description: 원가
 *                 provider_name:
 *                   type: string
 *                   description: 거래처명
 *                 original_image:
 *                   type: string
 *                   description: 제품 이미지
 *                 provider_code:
 *                   type: string
 *                   description: 거래처 PK
 *                 product_category_code:
 *                   type: string
 *                   description: 카테고리 PK
 *                 created_at:
 *                   type: string
 *                   description: 물자 생성 일시
 *       500:
 *         description: 서버 오류
 */
router.get("/materials/search/:provider_id", async (req, res) => {
  // 거래처 기준 함수로 수정
  const { provider_id } = req.params;
  try {
    const materials = await Material.search(provider_id);
    res.status(200).json(materials);
  } catch (error) {
    console.error("물자 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "물자 목록 조회 실패", error: error.message });
  }
});

// Update a material by PK
/**
 * @swagger
 * /products/materials/{pk}:
 *   put:
 *     summary: 물자 정보를 수정합니다.
 *     description: 주어진 PK로 물자 정보를 수정합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 물자 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: 상품 코드
 *               product_name:
 *                 type: string
 *                 description: 제품명
 *               product_sale:
 *                 type: string
 *                 description: 원가
 *               provider_name:
 *                 type: string
 *                 description: 거래처명
 *               original_image:
 *                 type: string
 *                 description: 제품 이미지
 *               provider_code:
 *                 type: string
 *                 description: 거래처 PK
 *               product_category_code:
 *                 type: string
 *                 description: 카테고리 PK
 *     responses:
 *       200:
 *         description: 물자 수정 성공
 *       404:
 *         description: 물자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/materials/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const material = new Material(req.body);

    material.pk = pk;
    console.log("material: ", material.pk, pk);

    await material.update();
    res.status(200).json(material);
  } catch (error) {
    console.error("물자 수정 오류:", error);
    res.status(500).json({ message: "물자 수정 실패", error: error.message });
  }
});

// Delete a material by PK
/**
 * @swagger
 * /products/materials/{pk}:
 *   delete:
 *     summary: 물자를 삭제합니다.
 *     description: 주어진 PK로 물자를 삭제합니다.
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 물자 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 물자 삭제 성공
 *       404:
 *         description: 물자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/materials/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    await Material.deleteByPk(pk);
    res.status(200).json({ message: "물자 삭제 성공" });
  } catch (error) {
    console.error("물자 삭제 오류:", error);
    res.status(500).json({ message: "물자 삭제 실패", error: error.message });
  }
});

// Create a new ordering history
/**
 * @swagger
 * /products/ordering_history:
 *   post:
 *     summary: 새로운 발주 이력을 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 발주 이력을 생성합니다.
 *     tags: [OrderingHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider_id
 *             properties:
 *               provider_id:
 *                 type: string
 *                 description: 거래처 ID
 *     responses:
 *       201:
 *         description: 발주 이력 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/ordering_history", async (req, res) => {
  try {
    const { branch_id, arrive, products } = req.body;

    if (!branch_id) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const history = new OrderingHistory(req.body);
    const createdHistory = await history.create();

    for (const product of products) {
      const productHistory = new OrderingProduct({
        history_pk: createdHistory.pk,
        ordered_cnt: product.ordered_cnt,
        material_pk: product.material_id,
      });
      await productHistory.create();
      console.log("productHistory: ", productHistory);
    }

    res.status(201).json(createdHistory);
  } catch (error) {
    console.error("발주 이력 생성 오류:", error);
    res
      .status(500)
      .json({ message: "발주 이력 생성 실패", error: error.message });
  }
});

// Get an ordering history by PK
/**
 * @swagger
 * /products/ordering_history/{pk}:
 *   get:
 *     summary: 발주 이력 정보를 조회합니다.
 *     description: 주어진 PK로 발주 이력 정보를 조회합니다.
 *     tags: [OrderingHistory]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 발주 이력 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 발주 이력 조회 성공
 *       404:
 *         description: 발주 이력을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/ordering_history/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const history = await OrderingHistory.getByPK(pk);
    res.status(200).json(history);
  } catch (error) {
    console.error("발주 이력 조회 오류:", error);
    res
      .status(500)
      .json({ message: "발주 이력 조회 실패", error: error.message });
  }
});

// Get all ordering histories
/**
 * @swagger
 * /products/ordering_history:
 *   get:
 *     summary: 모든 발주 이력을 조회합니다.
 *     description: 모든 발주 이력을 조회하여 반환합니다.
 *     tags: [OrderingHistory]
 *     responses:
 *       200:
 *         description: 발주 이력 리스트 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/ordering_history", async (req, res) => {
  console.log("발주 이력 목록 조회");
  try {
    const histories = await OrderingHistory.getAll();
    res.status(200).json(histories);
  } catch (error) {
    console.error("발주 이력 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "발주 이력 목록 조회 실패", error: error.message });
  }
});

// Update an ordering history by PK
/**
 * @swagger
 * /products/ordering_history/{pk}:
 *   put:
 *     summary: 발주 이력 정보를 수정합니다.
 *     description: 주어진 PK로 발주 이력 정보를 수정합니다.
 *     tags: [OrderingHistory]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 발주 이력 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provider_id:
 *                 type: string
 *                 description: 거래처 ID
 *               arrive:
 *                 type: number
 *                 description: 발주 도착 여부
 *                 example: 1
 *     responses:
 *       200:
 *         description: 발주 이력 수정 성공
 *       404:
 *         description: 발주 이력을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/ordering_history/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const { provider_id, arrive } = req.body;

    const history = new OrderingHistory({ pk, provider_id, arrive });
    const updatedHistory = await history.update();
    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error("발주 이력 수정 오류:", error);
    res
      .status(500)
      .json({ message: "발주 이력 수정 실패", error: error.message });
  }
});

// Delete an ordering history by PK
/**
 * @swagger
 * /products/ordering_history/{pk}:
 *   delete:
 *     summary: 발주 이력을 삭제합니다.
 *     description: 주어진 PK로 발주 이력을 삭제합니다.
 *     tags: [OrderingHistory]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 발주 이력 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 발주 이력 삭제 성공
 *       404:
 *         description: 발주 이력을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/ordering_history/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const result = await OrderingHistory.deleteByPK(pk);
    res.status(200).json(result);
  } catch (error) {
    console.error("발주 이력 삭제 오류:", error);
    res
      .status(500)
      .json({ message: "발주 이력 삭제 실패", error: error.message });
  }
});

// Create a new ordering product
/**
 * @swagger
 * /products/ordering_product:
 *   post:
 *     summary: 새로운 주문 상품을 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 주문 상품을 생성합니다.
 *     tags: [OrderingProduct]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - history_pk
 *               - provider_id
 *               - ordered_cnt
 *               - material_pk
 *               - product_code
 *               - provider_code
 *             properties:
 *               history_pk:
 *                 type: string
 *                 description: 관련 주문 이력 PK
 *               provider_id:
 *                 type: string
 *                 description: 제공자 ID
 *               ordered_cnt:
 *                 type: string
 *                 description: 주문 개수
 *               material_pk:
 *                 type: string
 *                 description: 관련 자재 PK
 *               product_code:
 *                 type: string
 *                 description: 상품 코드
 *               provider_code:
 *                 type: string
 *                 description: 제공자 코드
 *     responses:
 *       201:
 *         description: 주문 상품 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/ordering_product", async (req, res) => {
  try {
    const {
      history_pk,
      provider_id,
      ordered_cnt,
      material_pk,
      product_code,
      provider_code,
    } = req.body;

    if (
      !history_pk ||
      !provider_id ||
      !ordered_cnt ||
      !material_pk ||
      !product_code ||
      !provider_code
    ) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const product = new OrderingProduct(req.body);
    const createdProduct = await product.create();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("주문 상품 생성 오류:", error);
    res
      .status(500)
      .json({ message: "주문 상품 생성 실패", error: error.message });
  }
});

// Get an ordering product by PK
/**
 * @swagger
 * /products/ordering_product/{pk}:
 *   get:
 *     summary: 주문 상품 정보를 조회합니다.
 *     description: 주어진 PK로 주문 상품 정보를 조회합니다.
 *     tags: [OrderingProduct]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 주문 상품 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 주문 상품 조회 성공
 *       404:
 *         description: 주문 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/ordering_product/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    console.log("pk: ", pk);
    const product = await OrderingProduct.getByPK(pk);
    res.status(200).json(product);
  } catch (error) {
    console.error("주문 상품 조회 오류:", error);
    res
      .status(500)
      .json({ message: "주문 상품 조회 실패", error: error.message });
  }
});

// Get all ordering products
/**
 * @swagger
 * /products/ordering_product:
 *   get:
 *     summary: 모든 주문 상품을 조회합니다.
 *     description: 모든 주문 상품을 조회하여 반환합니다.
 *     tags: [OrderingProduct]
 *     responses:
 *       200:
 *         description: 주문 상품 리스트 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/ordering_product", async (req, res) => {
  try {
    const products = await OrderingProduct.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("주문 상품 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "주문 상품 목록 조회 실패", error: error.message });
  }
});

/**
 * @swagger
 * /products/ordering-products/history/{history_pk}:
 *   get:
 *     summary: 특정 history_pk로 주문 제품 목록을 조회합니다.
 *     description: 지정된 history_pk를 기준으로 모든 주문 제품을 조회하여 반환합니다.
 *     tags: [OrderingProduct]
 *     parameters:
 *       - in: path
 *         name: history_pk
 *         required: true
 *         description: 주문 내역 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 주문 제품 리스트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: 주문 제품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/ordering-products/history/:history_pk", async (req, res) => {
  try {
    const { history_pk } = req.params;

    console.log("history_pk: ", history_pk);

    // 모든 데이터 조회 후 history_pk로 필터링
    const allProducts = await OrderingProduct.getByHistoryPK(history_pk);
    const filteredProducts = allProducts.filter(
      (product) => product.history_pk === history_pk
    );

    if (filteredProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 history_pk의 데이터가 없습니다." });
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error("주문 제품 조회 오류:", error);
    res
      .status(500)
      .json({ message: "주문 제품 조회 실패", error: error.message });
  }
});

// Update an ordering product by PK
/**
 * @swagger
 * /products/ordering_product/{pk}:
 *   put:
 *     summary: 주문 상품 정보를 수정합니다.
 *     description: 주어진 PK로 주문 상품 정보를 수정합니다.
 *     tags: [OrderingProduct]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 주문 상품 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               history_pk:
 *                 type: string
 *               provider_id:
 *                 type: string
 *               ordered_cnt:
 *                 type: string
 *               material_pk:
 *                 type: string
 *               product_code:
 *                 type: string
 *               provider_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: 주문 상품 수정 성공
 *       404:
 *         description: 주문 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/ordering_product/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const {
      history_pk,
      provider_id,
      ordered_cnt,
      material_pk,
      product_code,
      provider_code,
    } = req.body;

    const product = new OrderingProduct({
      pk,
      history_pk,
      provider_id,
      ordered_cnt,
      material_pk,
      product_code,
      provider_code,
    });
    const updatedProduct = await product.update();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("주문 상품 수정 오류:", error);
    res
      .status(500)
      .json({ message: "주문 상품 수정 실패", error: error.message });
  }
});

// Delete an ordering product by PK
/**
 * @swagger
 * /products/ordering_product/{pk}:
 *   delete:
 *     summary: 주문 상품을 삭제합니다.
 *     description: 주어진 PK로 주문 상품을 삭제합니다.
 *     tags: [OrderingProduct]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 주문 상품 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 주문 상품 삭제 성공
 *       404:
 *         description: 주문 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/ordering_product/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const result = await OrderingProduct.deleteByPK(pk);
    res.status(200).json(result);
  } catch (error) {
    console.error("주문 상품 삭제 오류:", error);
    res
      .status(500)
      .json({ message: "주문 상품 삭제 실패", error: error.message });
  }
});

// Create Inventory
/**
 * @swagger
 * /products/inventories:
 *   post:
 *     summary: 새로운 재고를 생성합니다.
 *     description: 새로운 재고를 생성합니다. 필수 필드가 누락되면 실패합니다.
 *     tags: [Inventories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_pk
 *               - branch_id
 *               - provider_id
 *             properties:
 *               inventory_cnt:
 *                 type: string
 *                 description: 현재 재고 수량
 *               inventory_min_cnt:
 *                 type: string
 *                 description: 최소 재고 수량
 *               product_pk:
 *                 type: string
 *                 description: 상품의 고유 PK
 *               product_code:
 *                 type: string
 *                 default: A01010001
 *                 description: 상품 코드
 *               branch_id:
 *                 type: string
 *                 description: 지점 ID
 *               provider_id:
 *                 type: string
 *                 description: 거래처 ID
 *               managed:
 *                 type: boolean
 *                 default: false
 *                 description: 재고 관리 여부 플래그
 *     responses:
 *       201:
 *         description: 재고 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/inventories", async (req, res) => {
  try {
    const {
      inventory_cnt,
      inventory_min_cnt,
      product_pk,
      product_code,
      branch_id,
      provider_id,
      managed,
    } = req.body;

    console.log("req.body: ", req.body);

    if (!product_pk || !branch_id) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const inventory = new Inventory(req.body);
    const createdInventory = await inventory.create();
    res.status(201).json(createdInventory);
  } catch (error) {
    console.error("Inventory 생성 오류:", error);
    res
      .status(500)
      .json({ message: "Inventory 생성 실패", error: error.message });
  }
});

// Get Inventory by PK
/**
 * @swagger
 * /products/inventories/{pk}:
 *   get:
 *     summary: 특정 재고 정보를 조회합니다.
 *     description: 주어진 PK를 통해 특정 재고 정보를 반환합니다.
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 재고의 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 재고 조회 성공
 *       404:
 *         description: 재고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/inventories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const inventory = await Inventory.getByPK(pk);
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Inventory 조회 오류:", error);
    res
      .status(500)
      .json({ message: "Inventory 조회 실패", error: error.message });
  }
});

// Get All Inventories
/**
 * @swagger
 * /products/inventories:
 *   get:
 *     summary: 모든 재고를 조회합니다.
 *     description: 모든 재고 정보를 반환합니다.
 *     tags: [Inventories]
 *     responses:
 *       200:
 *         description: 재고 목록 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/inventories", async (req, res) => {
  try {
    const inventories = await Inventory.getAll();
    res.status(200).json(inventories);
  } catch (error) {
    console.error("모든 Inventory 조회 오류:", error);
    res
      .status(500)
      .json({ message: "모든 Inventory 조회 실패", error: error.message });
  }
});

// Update Inventory by PK
/**
 * @swagger
 * /products/inventories/{pk}:
 *   put:
 *     summary: 특정 재고를 수정합니다.
 *     description: 주어진 PK를 통해 특정 재고 정보를 수정합니다.
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 재고의 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inventory_cnt:
 *                 type: string
 *               inventory_min_cnt:
 *                 type: string
 *               product_pk:
 *                 type: string
 *               product_code:
 *                 type: string
 *               branch_id:
 *                 type: string
 *               provider_id:
 *                 type: string
 *               managed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 재고 수정 성공
 *       404:
 *         description: 재고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/inventories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const {
      inventory_cnt,
      inventory_min_cnt,
      product_pk,
      product_code,
      branch_id,
      provider_id,
      managed,
    } = req.body;

    const inventory = new Inventory({
      pk,
      inventory_cnt,
      inventory_min_cnt,
      product_pk,
      product_code,
      branch_id,
      provider_id,
      managed,
    });

    const updatedInventory = await inventory.update();
    res.status(200).json(updatedInventory);
  } catch (error) {
    console.error("Inventory 수정 오류:", error);
    res
      .status(500)
      .json({ message: "Inventory 수정 실패", error: error.message });
  }
});

// Delete Inventory by PK
/**
 * @swagger
 * /products/inventories/{pk}:
 *   delete:
 *     summary: 특정 재고를 삭제합니다.
 *     description: 주어진 PK를 통해 특정 재고 정보를 삭제합니다.
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         description: 재고의 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 재고 삭제 성공
 *       404:
 *         description: 재고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/inventories/:pk", async (req, res) => {
  try {
    const { pk } = req.params;
    const result = await Inventory.deleteByPK(pk);
    res.status(200).json(result);
  } catch (error) {
    console.error("Inventory 삭제 오류:", error);
    res
      .status(500)
      .json({ message: "Inventory 삭제 실패", error: error.message });
  }
});

// Create a new product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: 새로운 상품을 생성합니다.
 *     description: 제공된 정보를 바탕으로 새로운 상품을 생성합니다.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_code
 *               - branch_id
 *               - product_name
 *               - product_price
 *               - product_image
 *             properties:
 *               product_code:
 *                 type: string
 *                 description: 상품 코드
 *               branch_id:
 *                 type: string
 *                 description: 지점 ID
 *               product_name:
 *                 type: string
 *                 description: 상품명
 *               product_price:
 *                 type: integer
 *                 description: 판매가
 *               product_image:
 *                 type: string
 *                 description: 상품 이미지 URL
 *               blurred_image:
 *                 type: string
 *                 description: 미리보기 방지 이미지 URL
 *     responses:
 *       201:
 *         description: 상품 생성 성공
 *       400:
 *         description: 필수 필드 누락
 *       500:
 *         description: 서버 오류
 */
router.post("/", async (req, res) => {
  try {
    const {
      product_code,
      branch_id,
      product_name,
      product_price,
      material_id,
    } = req.body;

    if (
      !material_id ||
      !product_code ||
      !branch_id ||
      !product_name ||
      !product_price
    ) {
      return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
    }

    const product = new Product(req.body);
    const createdProduct = await product.create();
    console.log("createdProduct: ", createdProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("상품 생성 오류:", error);
    res.status(500).json({ message: "상품 생성 실패", error: error.message });
  }
});

// Get all products
/**
 * @swagger
 * /products/search/{branch_id}:
 *   get:
 *     summary: 모든 상품 정보를 조회합니다.
 *     description: 주어진 branch_id로 모든 상품 정보를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: branch_id
 *         required: true
 *         description: 지점 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 리스트 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/search/:branch_id", async (req, res) => {
  try {
    const { branch_id } = req.params;
    const products = await Product.searchByBranchId(branch_id);
    console.log("products: ", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("상품 조회 오류:", error);
    res.status(500).json({ message: "상품 조회 실패", error: error.message });
  }
});

// Get a product by PK
/**
 * @swagger
 * /products/{PK}:
 *   get:
 *     summary: 상품 정보를 조회합니다.
 *     description: 주어진 PK로 상품 정보를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: PK
 *         required: true
 *         description: 상품 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:PK", async (req, res) => {
  try {
    const { PK } = req.params;
    const product = await Product.getByPK(PK);
    console.log("product: ", product);
    res.status(200).json(product);
  } catch (error) {
    console.error("상품 조회 오류:", error);
    res.status(500).json({ message: "상품 조회 실패", error: error.message });
  }
});

// Get all products
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 모든 상품 정보를 조회합니다.
 *     description: 모든 상품 정보를 조회하여 반환합니다.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 상품 리스트 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    res
      .status(500)
      .json({ message: "상품 목록 조회 실패", error: error.message });
  }
});

// Update a product by PK
/**
 * @swagger
 * /products/{PK}:
 *   put:
 *     summary: 상품 정보를 수정합니다.
 *     description: 주어진 PK로 상품 정보를 수정합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: PK
 *         required: true
 *         description: 상품 고유 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_code:
 *                 type: string
 *               branch_id:
 *                 type: string
 *               product_name:
 *                 type: string
 *               product_price:
 *                 type: integer
 *               product_image:
 *                 type: string
 *               blurred_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put("/:PK", async (req, res) => {
  try {
    const { PK } = req.params;

    const product = new Product({
      ...req.body,
      PK,
    });

    console.log("product: ", product);
    const updatedProduct = await product.update();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("상품 수정 오류:", error);
    res.status(500).json({ message: "상품 수정 실패", error: error.message });
  }
});

// Delete a product by PK
/**
 * @swagger
 * /products/{PK}:
 *   delete:
 *     summary: 상품을 삭제합니다.
 *     description: 주어진 PK로 상품을 삭제합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: PK
 *         required: true
 *         description: 상품 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
 *       404:
 *         description: 상품을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/:PK", async (req, res) => {
  try {
    const { PK } = req.params;
    const result = await Product.deleteByPK(PK);
    res.status(200).json(result);
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    res.status(500).json({ message: "상품 삭제 실패", error: error.message });
  }
});

module.exports = router;
