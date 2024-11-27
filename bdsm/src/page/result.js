import { Button, Col, message, Row, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosGet, AxiosPost } from "../api";
import ResultChart from "../component/result_chart";
import Footer from "../component/Footer";

function TestResult(props) {
  const { theme, setPage } = props;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(result === null);
  const location = useLocation();
  const navigate = useNavigate();
  // const anwers = location.state.answers;

  useEffect(() => {
    // console.log("answer!!!", anwers);

    console.log(`/bdsm/scores/${location.pathname.split("/").pop()}`);

    // result 데이터를 가지고 옵니다
    AxiosGet(`/bdsm/scores/${location.pathname.split("/").pop()}`).then(
      (res) => {
        if (res.status === 200) {
          const data = res.data;
          setResult(data);
        }
      }
    );
  }, []);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("URL이 복사되었습니다!");
        message.success("URL이 복사되었습니다!");
      })
      .catch((error) => {
        console.error("URL 복사에 실패했습니다. : ", error);
      });
  };

  return (
    <Space
      direction="vertical"
      className="center"
      size="large"
      style={{ minHeight: "100vh", width: "100%", maxWidth: "780px" }}
    >
      <div>
        <Typography.Title level={2}>BDSM TEST 결과</Typography.Title>
        <Typography.Text>
          새부정보를 보려면 카테고리를 클릭하세요.
        </Typography.Text>
      </div>
      <ResultChart data={result ? result : {}} />
      <Row gutter={[16, 16]} style={{ width: "90%", margin: "0 auto" }}>
        <Col span={24}>
          <Button
            size="large"
            type="primary"
            onClick={handleShare}
            style={{
              width: "100%",
            }}
          >
            🔗 테스트결과공유하기
          </Button>
        </Col>
        <Col span={24}>
          <Button
            size="large"
            style={{ width: "100%" }}
            onClick={() => {
              navigate("/view");
            }}
          >
            ⛓️ BDSM 성향모두보기
          </Button>
        </Col>
        <Col span={12}>
          <Button
            size="large"
            danger
            type="primary"
            style={{ width: "100%" }}
            onClick={() => {
              window.open("https://redswitch.kr");
            }}
          >
            레드스위치 바로가기
          </Button>
        </Col>
        <Col span={12}>
          <Button size="large" style={{ width: "100%" }}>
            설치지점찾기
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ width: "90%", margin: "0 auto" }}>
        <Col span={24}>
          <Typography.Title level={3}>
            내 성향에 맞는 성인용품은?
          </Typography.Title>
        </Col>
        {Array.from({ length: 15 }, (_, index) => (
          <Col span={8} key={index}>
            <div
              onClick={() => {
                window.open("https://redswitch.kr");
              }}
              style={{
                width: "100%",
                aspectRatio: "1/1",
                backgroundColor: "#d9d9d9",
              }}
            />
          </Col>
        ))}
      </Row>

      <Footer theme={theme} />
    </Space>
  );
}

export default TestResult;
