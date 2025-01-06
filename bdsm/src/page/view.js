import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Button, Col, Image, Row, Typography } from "antd";
import { useMediaQuery } from "react-responsive";

function View(props) {
  const navigate = useNavigate();
  const { theme, setPage } = props;
  const isSmallScreen = useMediaQuery({ maxWidth: 769 });
  const isMediumScreen = useMediaQuery({ minWidth: 769, maxWidth: 1200 });
  const isLargeScreen = useMediaQuery({ minWidth: 1201 });
  const size = isSmallScreen ? "small" : isMediumScreen ? "medium" : "large";

  const colCount = isSmallScreen ? 2 : isMediumScreen ? 3 : 4;
  const colCounts = {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let colCode = "";
  const cols = [];
  for (let i = 0; i < 22; i++) {
    cols.push(
      <Col key={i.toString()} span={24 / colCount}>
        <div
          style={{
            width: "100%", // 원하는 정사각형 크기
            height: "auto",
            aspectRatio: "1 / 1",
            overflow: "hidden", // 이미지가 컨테이너를 넘어가지 않도록 숨김
          }}
        >
          <Image
            src={require(`../assets/bdsm_type/${i + 1}.jpg`)}
            style={{ border: "1px solid #8c8c8c", objectFit: "scale-down" }}
          />
        </div>
      </Col>
    );
    colCode += `  <Col span={${24 / colCount}} />\n`;
  }

  return (
    <div style={{ overflowX: "hidden" }}>
      <div className={`container-${size} section-${theme}`}>
        <Typography.Title level={1} className={`title-${size}`}>
          알고 싶은 성향을 선택하세요.
        </Typography.Title>
      </div>
      <Row gutter={[16, 16]} className={`container-${size}`}>
        {cols}
      </Row>
      <div className={`container-${size} section-${theme}`}>
        <Typography.Title level={1} className={`title-${size}`}>
          당신의 BDSM 유형을 알아보세요
        </Typography.Title>
        <Typography.Paragraph>
          테스트는 100% 무료이며 익명으로 귀하의 정보가 필요하지 않습니다.
        </Typography.Paragraph>
        <Button size="large" type="primary" onClick={() => navigate("/test")}>
          🔥 BDSM 테스트하러 가기
        </Button>
      </div>
    </div>
  );
}

export default View;
