import React, { useEffect, useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const FileUpload = (props) => {
  const { url, setUrl } = props;
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    console.log(url);
    if (url) {
      setFileList([
        {
          uid: "-1",
          name: decodeURIComponent(url.split("/").pop().split("?")[0]),
          status: "done",
          url: url,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [url]);

  const uploadProps = {
    name: "file", // 서버에서 받을 필드 이름
    maxCount: 1,
    beforeUpload: async (file) => {
      setLoading(true);
      const fileName = encodeURIComponent(file.name); // URL 인코딩
      const formData = new FormData();
      formData.append("file", file, fileName); // 파일을 FormData에 추가

      console.log(file); // 파일 확인

      try {
        // sjpark - AxiosPost 쓰면 오류남....
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // 반드시 multipart/form-data 형식으로 전송
            },
          }
        );
        console.log("파일 업로드 성공:", response.data);
        setUrl(response.data.url);
        setFileList([
          {
            uid: "-1",
            name: decodeURIComponent(
              response.data.url.split("/").pop().split("?")[0]
            ),
            status: "done",
            url: response.data.url,
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        setLoading(false);
      }

      return false; // 자동 업로드 방지
    },
  };

  return (
    <Upload fileList={fileList} {...uploadProps}>
      <Button loading={loading} icon={<UploadOutlined />}>
        파일 업로드
      </Button>
    </Upload>
  );
};

export default FileUpload;
