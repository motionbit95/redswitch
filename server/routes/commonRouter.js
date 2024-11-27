const express = require("express");
const firebaseAdmin = require("firebase-admin");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const bucket = firebaseAdmin.storage().bucket();

const router = express.Router();
router.use(cors());

// multer 설정: 메모리에 파일을 저장
const storage = multer.memoryStorage(); // 메모리에 파일 저장
const upload = multer({ storage: storage });

// 파일 업로드 처리
router.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file); // 여기서 파일 정보 확인
  const fileName = decodeURIComponent(req.file.originalname); // URL 디코딩
  console.log("파일 이름:", fileName);

  if (!req.file) {
    return res
      .status(400)
      .send({ success: false, message: "파일이 없습니다." });
  }

  try {
    // Firebase Storage에 파일 업로드
    const blob = bucket.file(`uploads/${fileName}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // 파일을 Firebase에 업로드
    blobStream.on("error", (err) => {
      console.log("파일 업로드 실패:", err);
      res.status(500).send({
        success: false,
        message: "파일 업로드 중 오류가 발생했습니다.",
      });
    });

    blobStream.on("finish", async () => {
      // 파일 메타데이터 설정 (다운로드 토큰 추가)
      try {
        await blob.setMetadata({
          metadata: {
            firebaseStorageDownloadTokens: Date.now().toString(),
          },
        });

        // 메타데이터를 통해 token을 포함한 URL 가져오기
        const [metadata] = await blob.getMetadata();
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media&token=${
          metadata.metadata.firebaseStorageDownloadTokens
        }`;

        res.send({
          success: true,
          message: "파일 업로드 성공",
          url: fileUrl, // token이 포함된 URL 반환
        });
      } catch (metadataError) {
        console.error("파일 메타데이터 업데이트 실패:", metadataError);
        res.status(500).send({
          success: false,
          message: "파일 메타데이터 업데이트 중 오류가 발생했습니다.",
        });
      }
    });

    blobStream.end(req.file.buffer); // multer로 받은 파일 버퍼를 Firebase에 업로드
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    res.status(500).send({
      success: false,
      message: "파일 업로드 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
