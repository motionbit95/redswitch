const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");
const Bdsm = require("../model/BDSM");

const cors = require("cors");
router.use(cors());

// Realtime Database 참조
const db = admin.database();

/** @swagger
 * tags:
 *   name: BDSM
 *   description: BDSM
 */

/**
 * @swagger
 * /bdsm/questions:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: 새로운 BDSM 질문을 추가하고 관련된 답변을 생성합니다.
 *     description: 서버에 새로운 BDSM 질문을 추가합니다. 질문은 인덱스가 자동으로 할당되며, 7개의 기본 답변이 생성되어 연결됩니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: 추가할 질문 텍스트입니다. (필수)
 *     responses:
 *       200:
 *         description: BDSM 질문과 관련된 답변들이 정상적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "BDSM 질문이 정상적으로 등록되었습니다."
 *       400:
 *         description: 잘못된 요청입니다. 질문 텍스트가 필요합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "질문 텍스트는 필수입니다."
 *       500:
 *         description: 서버 오류가 발생했습니다. 질문과 답변을 등록하는 동안 문제가 발생했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "BDSM 질문을 등록하는동안 오류가 발생했습니다."
 */
router.post("/questions", async (req, res) => {
  const { question = "" } = req.body; // 클라이언트에서 보낸 요청 데이터

  try {
    // Firebase에서 가장 큰 index 값 가져오기
    const ref = db.ref("bdsm_questions");
    const snapshot = await ref
      .orderByChild("index")
      .limitToLast(1)
      .once("value");

    let newIndex = 1; // 기본값 (첫 번째 데이터는 1로 시작)
    if (snapshot.exists()) {
      const lastBdsm = snapshot.val();
      const lastIndex = Object.values(lastBdsm)[0].index;
      newIndex = lastIndex + 1; // 마지막 index에 1을 더해 새로운 index 값 설정
    }

    // Bdsm 객체 생성
    const newBdsmQuestion = new Bdsm.Question(newIndex, question, newIndex);

    // Firebase에 추가
    await newBdsmQuestion.add();

    const answerRef = db.ref("bdsm_answers");
    const answerSnapshot = await answerRef
      .orderByChild("index")
      .limitToLast(1)
      .once("value");

    let answerIndex = 1; // 기본값 (첫 번째 데이터는 1로 시작)

    if (answerSnapshot.exists()) {
      const lastBdsm = answerSnapshot.val();
      const lastIndex = Object.values(lastBdsm)[0].index;
      answerIndex = lastIndex + 1; // 마지막 index에 1을 더해 새로운 index 값 설정
    }

    // 답변 생성 및 추가
    for (let i = 0; i < 7; i++) {
      const newBdsmAnswer = new Bdsm.Answer(
        answerIndex,
        (question_pk = newIndex),
        (step = i + 1),
        (master_mistress_ = 0),
        (slave_ = 0),
        (hunter_ = 0),
        (prey_ = 0),
        (brat_tamer_ = 0),
        (brat_ = 0),
        (owner_ = 0),
        (pet_ = 0),
        (daddy_mommy_ = 0),
        (little_ = 0),
        (sadist_ = 0),
        (masochist_ = 0),
        (spanker_ = 0),
        (spankee_ = 0),
        (degrader_ = 0),
        (degradee_ = 0),
        (rigger_ = 0),
        (rope_bunny_ = 0),
        (dominant_ = 0),
        (submissive_ = 0),
        (switch_ = 0),
        (vanilla_ = 0)
      );

      await newBdsmAnswer.add();
      answerIndex++;
    }

    res.status(200).json({ message: "BDSM 질문이 정상적으로 등록되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "BDSM 질문을 등록하는동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/questions:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 모든 BDSM 질문 목록을 가져옵니다.
 *     description: 서버에서 모든 BDSM 질문을 가져와 목록을 반환합니다.
 *     responses:
 *       200:
 *         description: BDSM 질문 목록을 성공적으로 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   index:
 *                     type: integer
 *                     description: 질문 order
 *                   question:
 *                     type: string
 *                     description: BDSM 질문 텍스트
 *                   question_pk:
 *                     type: integer
 *                     description: 질문의 고유 인덱스
 *       404:
 *         description: 질문이 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "질문이 없습니다."
 *       500:
 *         description: 서버 오류가 발생했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */
router.get("/questions", async (req, res) => {
  try {
    // Reference to the "bdsm_questions" node
    const ref = db.ref("bdsm_questions");

    // Fetch all questions
    const snapshot = await ref.once("value");

    // Check if the snapshot contains any data
    if (!snapshot.exists()) {
      return res.status(404).json({ message: "질문이 없습니다." });
    }

    // Convert the data into an array (using Object.values to extract the values)
    const bdsmQuestions = Object.values(snapshot.val());

    // Return the list of questions
    res.status(200).json(bdsmQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/questions:
 *   put:
 *     tags:
 *       - BDSM
 *     summary: BDSM 질문 수정
 *     description: 서버에서 BDSM 질문을 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_pk:
 *                 type: integer
 *                 description: 수정할 질문의 고유 인덱스
 *               question:
 *                 type: string
 *                 description: 수정된 질문 텍스트
 *     responses:
 *       200:
 *         description: BDSM 질문이 성공적으로 수정되었습니다.
 *       404:
 *         description: 해당 BDSM 질문을 찾을 수 없습니다.
 *       500:
 *         description: 내부 서버 오류가 발생했습니다.
 */
router.put("/questions", async (req, res) => {
  const { question_pk = 0, question = "" } = req.body; // 클라이언트에서 보낸 요청 데이터

  try {
    // Firebase에서 question_pk에 해당하는 질문을 가져오기
    const ref = db.ref("bdsm_questions");
    const snapshot = await ref
      .orderByChild("index")
      .equalTo(question_pk) // 주어진 question_pk와 일치하는 항목을 찾습니다
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "해당 질문을 찾을 수 없습니다." });
    }

    // 기존 질문을 수정
    const existingBdsmQuestion = snapshot.val();
    const questionKey = Object.keys(existingBdsmQuestion)[0]; // 첫 번째 항목만 수정

    // 질문을 업데이트
    const updatedBdsmQuestion = {
      question_pk,
      question,
    };

    // Firebase에서 해당 질문을 업데이트
    await ref.child(questionKey).update(updatedBdsmQuestion);

    // 관련된 답변을 업데이트 (만약 수정이 필요하다면)
    const answerRef = db.ref("bdsm_answers");
    const answerSnapshot = await answerRef
      .orderByChild("question_pk")
      .equalTo(question_pk)
      .once("value");

    if (answerSnapshot.exists()) {
      const existingAnswers = answerSnapshot.val();
      const answerKeys = Object.keys(existingAnswers);

      // 각 답변을 업데이트 (원하는 필드만 수정)
      for (const answerKey of answerKeys) {
        const updatedAnswer = {
          ...existingAnswers[answerKey],
          question_pk,
          // 필요한 값들 수정
        };
        await answerRef.child(answerKey).update(updatedAnswer);
      }
    }

    res.status(200).json({ message: "BDSM 질문이 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("BDSM 질문 수정 오류 : ", error);
    res.status(500).json({ message: "BDSM 질문 수정 중 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/questions/{id}:
 *   delete:
 *     tags:
 *       - BDSM
 *     summary: 특정 BDSM 질문과 관련된 답변들을 삭제합니다.
 *     description: 주어진 `id`에 해당하는 BDSM 질문과 그에 연관된 모든 답변을 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 질문의 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: BDSM 질문과 관련된 모든 답변이 정상적으로 삭제되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "BDSM 질문과 관련된 모든 답변이 정상적으로 삭제되었습니다."
 *       404:
 *         description: 질문을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "해당 질문을 찾을 수 없습니다."
 *       500:
 *         description: 질문과 답변을 삭제하는 동안 오류가 발생했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "BDSM 질문을 삭제하는 동안 오류가 발생했습니다."
 */
router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Firebase에서 index 값으로 질문 정보 가져오기
    const questionRef = db.ref("bdsm_questions");
    const questionSnapshot = await questionRef
      .orderByChild("index") // 'index' 필드를 기준으로 정렬
      .equalTo(Number(id)) // 'id' 값과 일치하는 항목을 찾음
      .once("value");

    if (!questionSnapshot.exists()) {
      return res.status(404).json({ message: "해당 질문을 찾을 수 없습니다." });
    }

    // 질문 삭제
    const questionKey = Object.keys(questionSnapshot.val())[0]; // 첫 번째 항목의 key 가져오기
    await questionRef.child(questionKey).remove();

    // 해당 질문에 대한 모든 답변 삭제
    const answerRef = db.ref("bdsm_answers");
    const answersSnapshot = await answerRef
      .orderByChild("question_pk") // 'question_pk' 기준으로 정렬
      .equalTo(Number(id)) // question_pk가 id와 일치하는 답변들을 찾음
      .once("value");

    if (answersSnapshot.exists()) {
      const answerData = answersSnapshot.val();
      for (const key in answerData) {
        await db.ref("bdsm_answers").child(key).remove(); // 각 답변 삭제
      }
    }

    res.status(200).json({
      message: "BDSM 질문과 관련된 모든 답변이 정상적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "BDSM 질문을 삭제하는 동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/answers/{question_pk}:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 특정 BDSM 질문에 대한 답변 목록을 가져옵니다
 *     description: 특정 BDSM 질문에 대한 답변 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: question_pk
 *         required: true
 *         description: BDSM 질문의 기본 키
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: 해당 질문에 대한 답변 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   index:
 *                     type: integer
 *                   question_pk:
 *                     type: integer
 *                   step:
 *                     type: integer
 *                   master_mistress_:
 *                     type: integer
 *                   slave_:
 *                     type: integer
 *                   # 필요에 따라 데이터 구조에 맞게 추가 속성들을 넣으세요.
 *       404:
 *         description: 주어진 질문에 대한 답변이 없습니다.
 *       500:
 *         description: 서버 내부 오류
 */
router.get("/answers/:question_pk", async (req, res) => {
  // 현재 사용하지는 않음 - krystal
  const { question_pk } = req.params; // Get question_pk from the URL parameter

  try {
    // Reference to the "bdsm_answers" node
    const ref = db.ref("bdsm_answers");

    // Query Firebase to filter answers by `question_pk`
    const snapshot = await ref
      .orderByChild("question_pk")
      .equalTo(Number(question_pk))
      .once("value");

    // Check if the snapshot contains any data
    if (!snapshot.exists()) {
      return res.status(404).json({
        message: "해당 질문에 대한 점수 데이터가 존재하지 않습니다.",
      });
    }

    // Convert the data into an array (using Object.values to extract the values)
    const bdsmAnswers = Object.values(snapshot.val());

    // Return the list of answers
    res.status(200).json(bdsmAnswers);
  } catch (error) {
    console.error(
      "BDSM 점수 데이터를 가져오는동안 오류가 발생했습니다 : ",
      error
    );
    res.status(500).json({
      message: "BDSM 점수 데이터를 가져오는동안 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /bdsm/answers:
 *   put:
 *     tags:
 *       - BDSM
 *     summary: 답변을 수정합니다
 *     description: 데이터베이스에서 답변을 수정합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: integer
 *               question_pk:
 *                 type: integer
 *               step:
 *                 type: integer
 *               master_mistress_:
 *                 type: integer
 *               slave_:
 *                 type: integer
 *               # 데이터 구조에 맞게 필요한 추가 속성들을 넣으세요
 *     responses:
 *       200:
 *         description: 답변이 성공적으로 업데이트되었습니다
 *       500:
 *         description: 서버 내부 오류
 */
router.put("/answers", async (req, res) => {
  const {
    index,
    question_pk,
    step,
    master_mistress_,
    slave_,
    hunter_,
    prey_,
    brat_tamer_,
    brat_,
    owner_,
    pet_,
    daddy_mommy_,
    little_,
    sadist_,
    masochist_,
    spanker_,
    spankee_,
    degrader_,
    degradee_,
    rigger_,
    rope_bunny_,
    dominant_,
    submissive_,
    switch_,
    vanilla_,
  } = req.body;

  try {
    const answer = new Bdsm.Answer(
      index,
      question_pk,
      step,
      master_mistress_,
      slave_,
      hunter_,
      prey_,
      brat_tamer_,
      brat_,
      owner_,
      pet_,
      daddy_mommy_,
      little_,
      sadist_,
      masochist_,
      spanker_,
      spankee_,
      degrader_,
      degradee_,
      rigger_,
      rope_bunny_,
      dominant_,
      submissive_,
      switch_,
      vanilla_
    );

    console.log(answer);

    await answer.update();

    res
      .status(200)
      .json({ message: "BDSM 데이터가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("BDSM 데이터 수정 오류: ", error);
    res
      .status(500)
      .json({ message: "BDSM 데이터를 수정하는 동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/results:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: 새로운 결과 추가
 *     description: 데이터베이스에 새로운 BDSM 결과를 추가합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tendency:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: 결과가 성공적으로 추가되었습니다.
 *       500:
 *         description: 서버 내부 오류
 */
router.post("/results", async (req, res) => {
  const { tendency, description, type } = req.body;

  try {
    // "bdsm_results" 노드에서 가장 큰 index 값을 찾기
    const ref = db.ref("bdsm_results");
    const snapshot = await ref.once("value");

    let lastIndex = 0; // 기본값 설정
    if (snapshot.exists()) {
      const results = snapshot.val();
      const resultKeys = Object.keys(results);

      // 가장 큰 index 값을 찾기
      resultKeys.forEach((key) => {
        const result = results[key];
        if (result.key > lastIndex) {
          lastIndex = result.key;
        }
      });
    }

    // 새로운 index는 마지막 index + 1
    const newIndex = lastIndex + 1;

    console.log(newIndex);

    const newResult = new Bdsm.Result(newIndex, tendency, description, type);

    await newResult.add();

    res.status(201).json({
      message: "BDSM 결과가 성공적으로 추가되었습니다.",
      result: newResult,
    });
  } catch (error) {
    console.error("BDSM 결과 추가 오류: ", error);
    res.status(500).json({
      message: "BDSM 결과를 추가하는 동안 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /bdsm/results:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 모든 BDSM 결과 목록 조회
 *     description: 모든 BDSM 결과의 목록을 조회합니다.
 *     responses:
 *       200:
 *         description: BDSM 결과 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: number
 *                     example: 1
 *                   result:
 *                     type: string
 *                     example: "Some result data"
 *                   description:
 *                     type: string
 *                     example: "description"
 *                   type:
 *                     type: string
 *                     example: "type_"
 *       404:
 *         description: BDSM 결과가 존재하지 않습니다.
 *       500:
 *         description: 서버 내부 오류
 * */
router.get("/results", async (req, res) => {
  try {
    // "bdsm_results" 노드에 대한 참조
    const ref = db.ref("bdsm_results");

    // 모든 BDSM 결과 가져오기
    const snapshot = await ref.once("value");

    // 데이터가 존재하는지 확인
    if (!snapshot.exists()) {
      return res
        .status(404)
        .json({ message: "BDSM 결과가 존재하지 않습니다." });
    }

    // 데이터를 배열로 변환 (Object.values를 사용하여 값만 추출)
    const bdsmResults = Object.values(snapshot.val());

    // BDSM 결과 목록 반환
    res.status(200).json(bdsmResults);
  } catch (error) {
    console.error("BDSM 결과 조회 오류: ", error);
    res
      .status(500)
      .json({ message: "BDSM 결과를 조회하는 동안 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/results/{key}:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 특정 결과 조회
 *     description: 특정 BDSM 결과를 키를 기준으로 조회합니다.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 결과의 고유 키
 *     responses:
 *       200:
 *         description: BDSM 결과 객체
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 key:
 *                   type: string
 *                   example: "1"
 *                 result:
 *                   type: string
 *                   example: "Some result data"
 *       404:
 *         description: 결과를 찾을 수 없습니다.
 *       500:
 *         description: 서버 내부 오류
 */
router.get("/results/:key", async (req, res) => {
  const { key } = req.params;

  try {
    // Firebase에서 index 값으로 질문 정보 가져오기
    const ref = db.ref("bdsm_results");
    const snapshot = await ref
      .orderByChild("key") // 'index' 필드를 기준으로 정렬
      .equalTo(Number(key)) // 'id' 값과 일치하는 항목을 찾음
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "결과를 찾을 수 없습니다." });
    }

    const result = snapshot.val();

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("BDSM 결과 조회 오류: ", error);
    res.status(500).json({
      message: "BDSM 결과를 조회하는 동안 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /bdsm/results/{key}:
 *   put:
 *     tags:
 *       - BDSM
 *     summary: BDSM 결과 업데이트
 *     description: 데이터베이스에서 BDSM 결과를 업데이트합니다.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: 업데이트할 결과의 고유 키
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               result:
 *                 type: string
 *                 example: "Updated result"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               tendency:
 *                 type: string
 *                 example: "Updated tendency"
 *     responses:
 *       200:
 *         description: BDSM 결과가 성공적으로 업데이트되었습니다.
 *       500:
 *         description: 서버 내부 오류
 * */
router.put("/results/:key", async (req, res) => {
  const { key } = req.params; // URL에서 key 값을 가져옴
  const { description, tendency, type } = req.body; // 요청 본문에서 업데이트할 데이터

  try {
    // Result 객체를 생성합니다. key는 URL 파라미터에서 전달된 값입니다.
    const resultObj = new Bdsm.Result(key, tendency, description, type);

    // Result 객체의 update 메소드 호출하여 해당 key에 대해 업데이트를 진행
    await resultObj.update();

    // 업데이트 완료 후 성공 메시지 반환
    res
      .status(200)
      .json({ message: "BDSM 데이터가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("BDSM 데이터 업데이트 오류: ", error);
    res.status(500).json({
      message: "BDSM 데이터를 업데이트하는 동안 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /bdsm/results/{key}:
 *   delete:
 *     tags:
 *       - BDSM
 *     summary: 결과 삭제
 *     description: 데이터베이스에서 특정 BDSM 결과를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 결과의 고유 키
 *     responses:
 *       200:
 *         description: 결과가 성공적으로 삭제되었습니다.
 *       500:
 *         description: 서버 내부 오류
 */
router.delete("/results/:key", async (req, res) => {
  const { key } = req.params;

  try {
    const ref = db.ref("bdsm_results");
    const snapshot = await ref
      .orderByChild("key")
      .equalTo(Number(key))
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "결과를 찾을 수 없습니다." });
    }

    // Assuming snapshot.val() returns an object of results with unique keys
    const resultKey = Object.keys(snapshot.val())[0]; // Get the key of the first result matching

    if (resultKey) {
      // Use the resultKey to remove the corresponding entry
      await ref.child(resultKey).remove();

      return res
        .status(200)
        .json({ message: "BDSM 결과가 성공적으로 삭제되었습니다." });
    } else {
      return res.status(404).json({ message: "결과를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("BDSM 데이터 삭제 오류: ", error);
    res.status(500).json({
      message: "BDSM 데이터를 삭제하는 동안 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /bdsm/calculate-scores:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: Calculate BDSM scores
 *     description: Calculate BDSM scores based on the provided answers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: object
 *                 properties:
 *                   question_pk:
 *                     type: number
 *                     example: 1
 *                   step:
 *                     type: number
 *                     example: 1
 *     responses:
 *       200:
 *         description: BDSM scores calculated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: BDSM answers not found
 *       500:
 *         description: Internal server error
 * */
router.post("/calculate-scores", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res
        .status(400)
        .json({ error: "유효한 answers 객체를 제공해주세요." });
    }

    // Firebase에서 데이터를 가져옴
    const ref = admin.database().ref("bdsm_answers");
    const snapshot = await ref.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "BDSM 답변 데이터가 없습니다." });
    }

    const allAnswers = snapshot.val(); // Firebase에서 가져온 모든 답변 데이터
    const scores = {
      master_mistress_total: 0,
      slave_total: 0,
      hunter_total: 0,
      prey_total: 0,
      brat_tamer_total: 0,
      brat_total: 0,
      owner_total: 0,
      pet_total: 0,
      daddy_mommy_total: 0,
      little_total: 0,
      sadist_total: 0,
      masochist_total: 0,
      spanker_total: 0,
      spankee_total: 0,
      degrader_total: 0,
      degradee_total: 0,
      rigger_total: 0,
      rope_bunny_total: 0,
      dominant_total: 0,
      submissive_total: 0,
      switch_total: 0,
      vanilla_total: 0,
    };

    // 요청된 answers 데이터 기반으로 점수 합산
    for (const [question_pk, step] of Object.entries(answers)) {
      // 해당 question_pk에 해당하는 Answer 데이터를 찾음
      const answerData = Object.values(allAnswers).find(
        (answer) => answer.question_pk === parseInt(question_pk)
      );

      if (answerData) {
        // 각 항목별 점수를 누적
        scores.master_mistress_total += answerData.master_mistress_ || 0;
        scores.slave_total += answerData.slave_ || 0;
        scores.hunter_total += answerData.hunter_ || 0;
        scores.prey_total += answerData.prey_ || 0;
        scores.brat_tamer_total += answerData.brat_tamer_ || 0;
        scores.brat_total += answerData.brat_ || 0;
        scores.owner_total += answerData.owner_ || 0;
        scores.pet_total += answerData.pet_ || 0;
        scores.daddy_mommy_total += answerData.daddy_mommy_ || 0;
        scores.little_total += answerData.little_ || 0;
        scores.sadist_total += answerData.sadist_ || 0;
        scores.masochist_total += answerData.masochist_ || 0;
        scores.spanker_total += answerData.spanker_ || 0;
        scores.spankee_total += answerData.spankee_ || 0;
        scores.degrader_total += answerData.degrader_ || 0;
        scores.degradee_total += answerData.degradee_ || 0;
        scores.rigger_total += answerData.rigger_ || 0;
        scores.rope_bunny_total += answerData.rope_bunny_ || 0;
        scores.dominant_total += answerData.dominant_ || 0;
        scores.submissive_total += answerData.submissive_ || 0;
        scores.switch_total += answerData.switch_ || 0;
        scores.vanilla_total += answerData.vanilla_ || 0;
      }
    }

    // 결과 반환
    res.json({
      success: true,
      totalScores: scores,
    });
  } catch (error) {
    console.error("점수 계산 오류:", error);
    res.status(500).json({ error: "점수 계산 중 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/save-score-result:
 *   post:
 *     tags:
 *       - BDSM
 *     summary: Save a BDSM score result
 *     description: Save a BDSM score result in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: number
 *                 description: The age of the user.
 *               gender:
 *                 type: string
 *                 description: The gender of the user.
 *               isAgree:
 *                 type: boolean
 *                 description: Whether the user agrees to the terms and conditions.
 *               master_mistress_total:
 *                 type: number
 *                 description: The total score for master_mistress.
 *               slave_total:
 *                 type: number
 *                 description: The total score for slave.
 *     responses:
 *       200:
 *         description: BDSM score result saved successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 * */
router.post("/save-score-result", async (req, res) => {
  try {
    const body = req.body;

    // 요청 데이터 유효성 검사
    if (!body.age || !body.gender || body.isAgree === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "필수 데이터가 누락되었습니다." });
    }

    // Firebase 참조 생성age:
    const ref = db.ref("bdsm_scores");
    const newResultRef = ref.push(); // 고유 키 생성

    // 고유 id 추가
    const id = newResultRef.key;

    // Score 객체 생성
    const score = new Bdsm.Score({
      id,
      ...body, // 요청 데이터 병합
    });

    // 데이터 저장
    await newResultRef.set(score);

    console.log("데이터 저장 완료:", score);
    res.status(200).json({
      success: true,
      message: "점수 데이터가 성공적으로 저장되었습니다.",
      id,
    });
  } catch (error) {
    console.error("데이터 저장 실패:", error.message);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

/**
 * @swagger
 * /bdsm/statistics:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: Get BDSM statistics
 *     description: Get BDSM statistics from the database.
 *     responses:
 *       200:
 *         description: BDSM statistics retrieved successfully
 *       500:
 *         description: Internal server error
 * */
router.get("/statistics", async (req, res) => {
  try {
    // Firebase에서 데이터 읽어오기
    const snapshot = await db.ref("bdsm_scores").once("value");

    // 데이터가 없으면 빈 배열 반환
    if (!snapshot.exists()) {
      return res.json({ message: "No data found" });
    }

    const data = [];
    snapshot.forEach((childSnapshot) => {
      const score = childSnapshot.val(); // 자식 데이터 가져오기
      data.push(new Bdsm.Score(score)); // Score 객체로 변환하여 배열에 추가
    });

    // 통계 계산
    const statistics = Bdsm.Score.calculateStatistics(data);

    // 결과 반환
    res.json(statistics);
  } catch (error) {
    console.error("Error fetching data from Firebase: ", error);
    res.status(500).json({ error: "Failed to fetch data from Firebase" });
  }
});

/**
 * @swagger
 * /bdsm/age-group/average:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 나이대별 점수 평균 계산
 *     description: 주어진 나이대에 대해 각 항목별 평균을 계산합니다.
 *     parameters:
 *       - in: query
 *         name: ageGroup
 *         description: 나이대
 *         required: true
 *         schema:
 *           type: string
 *           example: "23~26"  # 예시를 추가해줘서 이해를 돕기
 *     responses:
 *       200:
 *         description: 평균 계산 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 master_mistress_total:
 *                   type: number
 *                   description: "Master/Mistress 평균 점수"
 *                 slave_total:
 *                   type: number
 *                   description: "Slave 평균 점수"
 *                 hunter_total:
 *                   type: number
 *                   description: "Hunter 평균 점수"
 *                 prey_total:
 *                   type: number
 *                   description: "Prey 평균 점수"
 *                 brat_tamer_total:
 *                   type: number
 *                   description: "Brat Tamer 평균 점수"
 *                 brat_total:
 *                   type: number
 *                   description: "Brat 평균 점수"
 *                 owner_total:
 *                   type: number
 *                   description: "Owner 평균 점수"
 *                 pet_total:
 *                   type: number
 *                   description: "Pet 평균 점수"
 *                 daddy_mommy_total:
 *                   type: number
 *                   description: "Daddy/Mommy 평균 점수"
 *                 little_total:
 *                   type: number
 *                   description: "Little 평균 점수"
 *                 sadist_total:
 *                   type: number
 *                   description: "Sadist 평균 점수"
 *                 masochist_total:
 *                   type: number
 *                   description: "Masochist 평균 점수"
 *                 spanker_total:
 *                   type: number
 *                   description: "Spanker 평균 점수"
 *                 spankee_total:
 *                   type: number
 *                   description: "Spankee 평균 점수"
 *                 degrader_total:
 *                   type: number
 *                   description: "Degrader 평균 점수"
 *                 degradee_total:
 *                   type: number
 *                   description: "Degradee 평균 점수"
 *                 rigger_total:
 *                   type: number
 *                   description: "Rigger 평균 점수"
 *                 rope_bunny_total:
 *                   type: number
 *                   description: "Rope Bunny 평균 점수"
 *                 dominant_total:
 *                   type: number
 *                   description: "Dominant 평균 점수"
 *                 submissive_total:
 *                   type: number
 *                   description: "Submissive 평균 점수"
 *                 switch_total:
 *                   type: number
 *                   description: "Switch 평균 점수"
 *                 vanilla_total:
 *                   type: number
 *                   description: "Vanilla 평균 점수"
 */
router.get("/age-group/average", async (req, res) => {
  const { ageRange } = req.query;

  if (!ageRange) {
    return res.status(400).json({ error: "나이대가 필요합니다." });
  }

  try {
    // Firebase Realtime Database에서 bdsm_scores 데이터 읽기
    const snapshot = await db.ref("bdsm_scores").once("value");
    const scores = snapshot.val();

    if (!scores) {
      return res.status(404).json({ error: "데이터가 없습니다." });
    }

    // 객체 형태의 데이터를 배열로 변환
    const scoresArray = Object.values(scores);

    // 나이대별 평균 계산
    const averages = Bdsm.Score.calculateAgeGroupAverage(scoresArray, ageRange);

    if (averages) {
      return res.json(averages);
    } else {
      return res
        .status(404)
        .json({ error: "해당 나이대의 데이터를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return res
      .status(500)
      .json({ error: "서버 에러. 데이터를 가져올 수 없습니다." });
  }
});

/**
 * @swagger
 * /bdsm/gender-group/average:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 성별별 BDSM 항목 평균 점수 계산
 *     description: 주어진 성별에 대해 각 항목별 평균 점수를 계산합니다.
 *     parameters:
 *       - in: query
 *         name: genderGroup
 *         description: 성별
 *         required: true
 *         schema:
 *           type: string
 *           example: "남자"  # 예시를 추가해줘서 이해를 돕기
 *     responses:
 *       200:
 *         description: 평균 계산 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 master_mistress_total:
 *                   type: number
 *                   description: "Master/Mistress 평균 점수"
 *                 slave_total:
 *                   type: number
 *                   description: "Slave 평균 점수"
 *                 hunter_total:
 *                   type: number
 *                   description: "Hunter 평균 점수"
 *                 prey_total:
 *                   type: number
 *                   description: "Prey 평균 점수"
 *                 brat_tamer_total:
 *                   type: number
 *                   description: "Brat Tamer 평균 점수"
 *                 brat_total:
 *                   type: number
 *                   description: "Brat 평균 점수"
 *                 owner_total:
 *                   type: number
 *                   description: "Owner 평균 점수"
 *                 pet_total:
 *                   type: number
 *                   description: "Pet 평균 점수"
 *                 daddy_mommy_total:
 *                   type: number
 *                   description: "Daddy/Mommy 평균 점수"
 *                 little_total:
 *                   type: number
 *                   description: "Little 평균 점수"
 *                 sadist_total:
 *                   type: number
 *                   description: "Sadist 평균 점수"
 *                 masochist_total:
 *                   type: number
 *                   description: "Masochist 평균 점수"
 *                 spanker_total:
 *                   type: number
 *                   description: "Spanker 평균 점수"
 *                 spankee_total:
 *                   type: number
 *                   description: "Spankee 평균 점수"
 *                 degrader_total:
 *                   type: number
 *                   description: "Degrader 평균 점수"
 *                 degradee_total:
 *                   type: number
 *                   description: "Degradee 평균 점수"
 *                 rigger_total:
 *                   type: number
 *                   description: "Rigger 평균 점수"
 *                 rope_bunny_total:
 *                   type: number
 *                   description: "Rope Bunny 평균 점수"
 *                 dominant_total:
 *                   type: number
 *                   description: "Dominant 평균 점수"
 *                 submissive_total:
 *                   type: number
 *                   description: "Submissive 평균 점수"
 *                 switch_total:
 *                   type: number
 *                   description: "Switch 평균 점수"
 *                 vanilla_total:
 *                   type: number
 *                   description: "Vanilla 평균 점수"
 *       400:
 *         description: "성별이 지정되지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "성별이 필요합니다."
 *       404:
 *         description: "해당 성별의 데이터가 없음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "데이터가 없습니다."
 *       500:
 *         description: "서버 에러"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "서버 에러. 데이터를 가져올 수 없습니다."
 */
router.get("/gender-group/average", async (req, res) => {
  const { genderGroup } = req.query;

  if (!genderGroup) {
    return res.status(400).json({ error: "성별이 필요합니다." });
  }

  try {
    // Firebase Realtime Database에서 bdsm_scores 데이터 읽기
    const snapshot = await db.ref("bdsm_scores").once("value");
    const scores = snapshot.val();

    if (!scores) {
      return res.status(404).json({ error: "데이터가 없습니다." });
    }

    // 객체 형태의 데이터를 배열로 변환
    const scoresArray = Object.values(scores);

    // 성별별 평균 계산
    const averages = Bdsm.Score.calculateGenderGroupAverage(
      scoresArray,
      genderGroup
    );

    if (averages) {
      return res.json(averages);
    } else {
      return res
        .status(404)
        .json({ error: "해당 성별의 데이터를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return res
      .status(500)
      .json({ error: "서버 에러. 데이터를 가져올 수 없습니다." });
  }
});

/**
 * @swagger
 * /bdsm/preference-group/average:
 *   get:
 *     tags:
 *       - BDSM
 *     summary: 성적 취향별 BDSM 항목 평균 점수 계산
 *     description: 주어진 성적 취향에 대해 각 항목별 평균 점수를 계산합니다.
 *     parameters:
 *       - in: query
 *         name: preferenceGroup
 *         description: 성적 취향
 *         required: true
 *         schema:
 *           type: string
 *           example: "이성애자"  # 예시를 추가해줘서 이해를 돕기
 *     responses:
 *       200:
 *         description: 평균 계산 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 master_mistress_total:
 *                   type: number
 *                   description: "Master/Mistress 평균 점수"
 *                 slave_total:
 *                   type: number
 *                   description: "Slave 평균 점수"
 *                 hunter_total:
 *                   type: number
 *                   description: "Hunter 평균 점수"
 *                 prey_total:
 *                   type: number
 *                   description: "Prey 평균 점수"
 *                 brat_tamer_total:
 *                   type: number
 *                   description: "Brat Tamer 평균 점수"
 *                 brat_total:
 *                   type: number
 *                   description: "Brat 평균 점수"
 *                 owner_total:
 *                   type: number
 *                   description: "Owner 평균 점수"
 *                 pet_total:
 *                   type: number
 *                   description: "Pet 평균 점수"
 *                 daddy_mommy_total:
 *                   type: number
 *                   description: "Daddy/Mommy 평균 점수"
 *                 little_total:
 *                   type: number
 *                   description: "Little 평균 점수"
 *                 sadist_total:
 *                   type: number
 *                   description: "Sadist 평균 점수"
 *                 masochist_total:
 *                   type: number
 *                   description: "Masochist 평균 점수"
 *                 spanker_total:
 *                   type: number
 *                   description: "Spanker 평균 점수"
 *                 spankee_total:
 *                   type: number
 *                   description: "Spankee 평균 점수"
 *                 degrader_total:
 *                   type: number
 *                   description: "Degrader 평균 점수"
 *                 degradee_total:
 *                   type: number
 *                   description: "Degradee 평균 점수"
 *                 rigger_total:
 *                   type: number
 *                   description: "Rigger 평균 점수"
 *                 rope_bunny_total:
 *                   type: number
 *                   description: "Rope Bunny 평균 점수"
 *                 dominant_total:
 *                   type: number
 *                   description: "Dominant 평균 점수"
 *                 submissive_total:
 *                   type: number
 *                   description: "Submissive 평균 점수"
 *                 switch_total:
 *                   type: number
 *                   description: "Switch 평균 점수"
 *                 vanilla_total:
 *                   type: number
 *                   description: "Vanilla 평균 점수"
 *       400:
 *         description: "성적 취향이 지정되지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "성적 취향이 필요합니다."
 *       404:
 *         description: "해당 성적 취향의 데이터가 없음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "데이터가 없습니다."
 *       500:
 *         description: "서버 에러"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "서버 에러. 데이터를 가져올 수 없습니다."
 */
router.get("/preference-group/average", async (req, res) => {
  const { preferenceGroup } = req.query;

  if (!preferenceGroup) {
    return res.status(400).json({ error: "성적 취향이 필요합니다." });
  }

  try {
    // Firebase Realtime Database에서 bdsm_scores 데이터 읽기
    const snapshot = await db.ref("bdsm_scores").once("value");
    const scores = snapshot.val();

    if (!scores) {
      return res.status(404).json({ error: "데이터가 없습니다." });
    }

    // 객체 형태의 데이터를 배열로 변환
    const scoresArray = Object.values(scores);

    // 성적 취향별 평균 계산
    const averages = Bdsm.Score.calculatePreferenceGroupAverage(
      scoresArray,
      preferenceGroup
    );

    if (averages) {
      return res.json(averages);
    } else {
      return res
        .status(404)
        .json({ error: "해당 성적 취향의 데이터를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return res
      .status(500)
      .json({ error: "서버 에러. 데이터를 가져올 수 없습니다." });
  }
});

module.exports = router;
