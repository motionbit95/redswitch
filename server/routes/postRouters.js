const express = require("express");
const router = express.Router();
const Post = require("../model/Post");

const cors = require("cors");
router.use(cors());

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 게시글 관리 API
 */

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
