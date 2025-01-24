const express = require("express");
const router = express.Router();
const { Franchise, Post, Inquiry, Calendar } = require("../model/Post");

const cors = require("cors");
router.use(cors());

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: 문의 게시판 API
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 게시글 관리 API
 */

//가맹점 신청
/**
 * @swagger
 * tags:
 *   name: Franchise
 *   description: 가맹점 신청 관리 API
 */

/**
 * @swagger
 * /posts/franchises:
 *   post:
 *     tags: [Franchise]
 *     summary: 가맹점 신청 생성
 *     description: 새로운 가맹점 신청을 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: true
 *             properties:
 *               franchise_name:
 *                 type: string
 *                 description: 거래처명
 *               franchise_room_cnt:
 *                 type: number
 *                 description: 객실수
 *               franchise_address:
 *                 type: string
 *                 description: 거래처 주소
 *               franchise_manager:
 *                 type: string
 *                 description: 담당자
 *               franchise_manager_phone:
 *                 type: string
 *                 description: 전화번호
 *               franchise_manager_email:
 *                 type: string
 *                 description: 이메일
 *               flag:
 *                 type: string
 *                 description: 상태 - 상담요청, 상담완료, 계약완료, 설치완료
 *               sales_manager:
 *                 type: string
 *                 description: 영업 담당자
 *               memo:
 *                 type: string
 *                 description: 비고
 *               created_at:
 *                 type: string
 *                 description: 생성일
 *                 format: date-time
 *               updated_at:
 *                 type: string
 *                 description: 수정일
 *                 format: date-time
 *     responses:
 *       201:
 *         description: 가맹점 신청 생성 성공
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * tags:
 *   name: Calendars
 *   description: 대시보드 일정 관리 API
 */
router.post("/franchises", async (req, res) => {
  try {
    const newFranchise = new Franchise(req.body);
    const createdFranchise = await newFranchise.create();
    res.status(201).json(createdFranchise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/franchises:
 *   get:
 *     tags: [Franchise]
 *     summary: 모든 가맹점 신청 조회
 *     description: 모든 가맹점 신청 정보를 반환합니다.
 *     responses:
 *       200:
 *         description: 가맹점 신청 리스트 조회 성공
 */
router.get("/franchises", async (req, res) => {
  try {
    const franchises = await Franchise.getAll();
    console.log(franchises);
    res.status(200).json(franchises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/franchises/{id}:
 *   get:
 *     tags: [Franchise]
 *     summary: 특정 가맹점 신청 조회
 *     description: 가맹점 신청 ID를 기반으로 특정 가맹점 신청 정보를 조회합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 가맹점 신청 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 가맹점 신청 조회 성공
 *       404:
 *         description: 가맹점 신청을 찾을 수 없음
 */
router.get("/franchises/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const franchise = await Franchise.getById(id);
    res.status(200).json(franchise);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/franchises/{id}:
 *   put:
 *     tags: [Franchise]
 *     summary: 가맹점 신청 수정
 *     description: 가맹점 신청 정보를 수정합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 가맹점 신청 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flag:
 *                 type: string
 *                 description: 상태 - 상담요청, 상담완료, 계약완료, 설치완료
 *               sales_manager:
 *                 type: string
 *                 description: 영업 담당자
 *               memo:
 *                 type: string
 *                 description: 비고
 *     responses:
 *       200:
 *         description: 가맹점 신청 수정 성공
 *         content:
 */
router.put("/franchises/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body; // 변경된 데이터만 포함

  try {
    const franchiseToUpdate = new Franchise({ id }); // ID로 기존 인스턴스 생성
    const updatedFranchise = await franchiseToUpdate.update(updatedFields); // 변경된 데이터만 업데이트
    console.log("update!", updatedFranchise);
    res.status(200).json(updatedFranchise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/franchises/{id}:
 *   delete:
 *     tags: [Franchise]
 *     summary: 가맹점 신청 삭제
 *     description: 가맹점 신청을 삭제합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 가맹점 신청 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 가맹점 신청 삭제 성공
 */
router.delete("/franchises/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Franchise.delete(id);
    res.status(200).json({ message: "Franchise deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries:
 *   post:
 *     summary: 새 게시글을 작성합니다.
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               author:
 *                 type: string
 *                 description: 게시글 작성자
 *               allowedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 열람 권한 사용자 ID 목록
 *               groups:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 그룹 목록
 *               sticky:
 *                 type: boolean
 *                 description: 게시글 상단 고정 여부
 *             required:
 *               - title
 *               - content
 *               - author
 *               - allowedUsers
 *               - groups
 *               - sticky
 *     responses:
 *       201:
 *         description: 게시글이 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post("/inquiries", async (req, res) => {
  try {
    const newPost = new Inquiry(req.body);
    const createdPost = await newPost.create();
    console.log(createdPost);
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries:
 *   get:
 *     summary: 모든 게시글을 조회합니다.
 *     tags: [Inquiries]
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pk:
 *                     type: string
 *                     description: 게시글 ID
 *                   title:
 *                     type: string
 *                     description: 게시글 제목
 *                   content:
 *                     type: string
 *                     description: 게시글 내용
 *                   author:
 *                     type: string
 *                     description: 작성자
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: 작성일
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: 수정일
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: 댓글 ID
 *                         user:
 *                           type: string
 *                           description: 댓글 작성자
 *                         content:
 *                           type: string
 *                           description: 댓글 내용
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: 댓글 작성일
 *       500:
 *         description: 서버 오류
 */
router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await Inquiry.getAll(); // 전체 게시글 조회
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}:
 *   get:
 *     summary: 게시글을 조회합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/inquiries/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.getById(req.params.id);
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}:
 *   put:
 *     summary: 게시글을 수정합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정된 게시글 제목
 *               content:
 *                 type: string
 *                 description: 수정된 게시글 내용
 *               allowedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 열람 권한 사용자 ID 목록
 *               groups:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 그룹 목록
 *               sticky:
 *                 type: boolean
 *                 description: 게시글 상단 고정 여부
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.put("/inquiries/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const inquiry = await Inquiry.getById(req.params.id); // Inquiry 객체로 반환됨

    // 댓글이 존재하면 댓글을 추가하고, 존재하지 않으면 빈 배열로 초기화
    if (!inquiry.comments) {
      inquiry.comments = [];
    }

    // 요청 본문으로 받은 데이터를 기존 객체에 병합
    Object.assign(inquiry, req.body);

    await inquiry.update(); // update 메서드 호출
    res.status(200).json(inquiry); // 업데이트된 inquiry 반환
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}:
 *   delete:
 *     summary: 게시글을 삭제합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 삭제되었습니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.delete("/inquiries/:id", async (req, res) => {
  try {
    await Inquiry.deleteById(req.params.id);
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}/comments:
 *   inquiry:
 *     summary: 게시글에 댓글을 작성합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: 댓글 작성자 ID
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *             required:
 *               - user
 *               - content
 *     responses:
 *       201:
 *         description: 댓글이 성공적으로 작성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.post("/inquiries/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const { user, content } = req.body;

    // 게시글을 찾음
    const inquiry = await Inquiry.getById(postId);

    if (!inquiry) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글이 존재하면 댓글을 추가하고, 존재하지 않으면 빈 배열로 초기화
    if (!inquiry.comments) {
      inquiry.comments = [];
    }

    // 댓글 데이터 생성
    const newComment = {
      id: `comment_${inquiry.comments.length + 1}`,
      user: user,
      content: content,
      createdAt: new Date().toISOString(),
    };

    // 게시글에 댓글 추가
    inquiry.comments.push(newComment);

    // 게시글 업데이트
    await inquiry.update(); // 이제 update 메서드가 정상 작동함

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}/comments:
 *   get:
 *     summary: 게시글의 댓글 목록을 조회합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 목록을 성공적으로 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/inquiries/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;

    // 게시글을 찾음
    const inquiry = await Inquiry.getById(postId);

    if (!inquiry) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글 목록 반환
    res.status(200).json(inquiry.comments || []);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}/comments/{commentId}:
 *   put:
 *     summary: 게시글의 특정 댓글을 수정합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: 수정할 댓글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정된 댓글 내용
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: 댓글이 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글 또는 댓글을 찾을 수 없습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.put("/inquiries/:id/comments/:commentId", async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { content } = req.body;

    // 게시글을 찾음
    const inquiry = await Inquiry.getById(postId);

    if (!inquiry) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글을 찾음
    const comment = inquiry.comments.find((c) => c.id === commentId);

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 수정
    comment.content = content;
    comment.updatedAt = new Date().toISOString();

    // 게시글 업데이트
    await inquiry.update();

    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/inquiries/{id}/comments/{commentId}:
 *   delete:
 *     summary: 게시글의 특정 댓글을 삭제합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: 삭제할 댓글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글이 성공적으로 삭제되었습니다.
 *       404:
 *         description: 게시글 또는 댓글을 찾을 수 없습니다.
 */
router.delete("/inquiries/:id/comments/:commentId", async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    // 게시글을 찾음
    const inquiry = await Inquiry.getById(postId);

    if (!inquiry) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글을 찾음
    const commentIndex = inquiry.comments.findIndex((c) => c.id === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 삭제
    inquiry.comments.splice(commentIndex, 1);

    // 게시글 업데이트
    await inquiry.update();

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/calendars", async (req, res) => {
  try {
    const newPost = new Calendar(req.body);
    const createdCalendar = await newPost.create();
    res.status(200).json(createdCalendar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/calendars", async (req, res) => {
  console.log("calendars");
  try {
    const calendars = await Calendar.getAll();
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/calendars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const calendars = await Calendar.getById(id);
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/calendars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, content } = req.body;
    const calendars = await Calendar.updateById(id, date, title, content);
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/calendars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const calendars = await Calendar.delete(id);
    res.status(200).json(calendars);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: 새 게시글을 작성합니다.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               author:
 *                 type: string
 *                 description: 게시글 작성자
 *               allowedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 열람 권한 사용자 ID 목록
 *               groups:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 그룹 목록
 *               sticky:
 *                 type: boolean
 *                 description: 게시글 상단 고정 여부
 *             required:
 *               - title
 *               - content
 *               - author
 *               - allowedUsers
 *               - groups
 *               - sticky
 *     responses:
 *       201:
 *         description: 게시글이 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const createdPost = await newPost.create();
    console.log(createdPost);
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: 모든 게시글을 조회합니다.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pk:
 *                     type: string
 *                     description: 게시글 ID
 *                   title:
 *                     type: string
 *                     description: 게시글 제목
 *                   content:
 *                     type: string
 *                     description: 게시글 내용
 *                   author:
 *                     type: string
 *                     description: 작성자
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: 작성일
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: 수정일
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: 댓글 ID
 *                         user:
 *                           type: string
 *                           description: 댓글 작성자
 *                         content:
 *                           type: string
 *                           description: 댓글 내용
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: 댓글 작성일
 *       500:
 *         description: 서버 오류
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.getAll(); // 전체 게시글 조회
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: 게시글을 조회합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.getById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: 게시글을 수정합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정된 게시글 제목
 *               content:
 *                 type: string
 *                 description: 수정된 게시글 내용
 *               allowedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 열람 권한 사용자 ID 목록
 *               groups:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 게시글 그룹 목록
 *               sticky:
 *                 type: boolean
 *                 description: 게시글 상단 고정 여부
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.put("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.getById(req.params.id); // Post 객체로 반환됨

    // 댓글이 존재하면 댓글을 추가하고, 존재하지 않으면 빈 배열로 초기화
    if (!post.comments) {
      post.comments = [];
    }

    // 요청 본문으로 받은 데이터를 기존 객체에 병합
    Object.assign(post, req.body);

    await post.update(); // update 메서드 호출
    res.status(200).json(post); // 업데이트된 post 반환
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: 게시글을 삭제합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 게시글이 성공적으로 삭제되었습니다.
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.delete("/:id", async (req, res) => {
  try {
    await Post.deleteById(req.params.id);
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}/comments:
 *   post:
 *     summary: 게시글에 댓글을 작성합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: 댓글 작성자 ID
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *             required:
 *               - user
 *               - content
 *     responses:
 *       201:
 *         description: 댓글이 성공적으로 작성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.post("/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const { user, content } = req.body;

    // 게시글을 찾음
    const post = await Post.getById(postId);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글이 존재하면 댓글을 추가하고, 존재하지 않으면 빈 배열로 초기화
    if (!post.comments) {
      post.comments = [];
    }

    // 댓글 데이터 생성
    const newComment = {
      id: `comment_${post.comments.length + 1}`,
      user: user,
      content: content,
      createdAt: new Date().toISOString(),
    };

    // 게시글에 댓글 추가
    post.comments.push(newComment);

    // 게시글 업데이트
    await post.update(); // 이제 update 메서드가 정상 작동함

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}/comments:
 *   get:
 *     summary: 게시글의 댓글 목록을 조회합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글 목록을 성공적으로 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: 게시글을 찾을 수 없습니다.
 */
router.get("/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;

    // 게시글을 찾음
    const post = await Post.getById(postId);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글 목록 반환
    res.status(200).json(post.comments || []);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}/comments/{commentId}:
 *   put:
 *     summary: 게시글의 특정 댓글을 수정합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: 수정할 댓글 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정된 댓글 내용
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: 댓글이 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 게시글 또는 댓글을 찾을 수 없습니다.
 *       400:
 *         description: 잘못된 요청입니다.
 */
router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { content } = req.body;

    // 게시글을 찾음
    const post = await Post.getById(postId);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글을 찾음
    const comment = post.comments.find((c) => c.id === commentId);

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 수정
    comment.content = content;
    comment.updatedAt = new Date().toISOString();

    // 게시글 업데이트
    await post.update();

    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /posts/{id}/comments/{commentId}:
 *   delete:
 *     summary: 게시글의 특정 댓글을 삭제합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 게시글 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: 삭제할 댓글 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 댓글이 성공적으로 삭제되었습니다.
 *       404:
 *         description: 게시글 또는 댓글을 찾을 수 없습니다.
 */
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    // 게시글을 찾음
    const post = await Post.getById(postId);

    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 댓글을 찾음
    const commentIndex = post.comments.findIndex((c) => c.id === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 삭제
    post.comments.splice(commentIndex, 1);

    // 게시글 업데이트
    await post.update();

    res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
