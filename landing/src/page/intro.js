import React from "react";
import TextBox from "../component/textbox";
import Description from "../component/description";
import { useMediaQuery } from "react-responsive";
import { Col, Image, Row, Space } from "antd";

export function Intro1(props) {
  const { size } = props;
  return (
    <Row
      gutter={[16, 16]}
      style={{
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flex: 1,
        height: "100vh",
        paddingTop: "80px",
        paddingInline:
          size === "mobile" ? "20px" : size === "tablet" ? "48px" : "72px",
      }}
    >
      <Col
        span={size === "mobile" ? 24 : size === "tablet" ? 9 : 12}
        style={{ padding: "20px", zIndex: 999 }}
      >
        <Space direction="vertical" size={"large"}>
          <TextBox
            size={size}
            title="Adult Toy"
            description="성인용품 사용해보신적 있나요?"
          />
          <Space direction="vertical">
            <Description
              size={size}
              description={`대답하기 부끄러운 것은 저 뿐만이 아니겠죠?`}
            />
            <div>
              <Description
                size={size}
                description={`우리는 성적인 존재가 아닌 척 하는 데에`}
              />
              <Description
                size={size}
                description={`너무 오랜 시간을 보냈습니다.`}
              />
            </div>
          </Space>
        </Space>
      </Col>
      <Col
        span={size === "mobile" ? 24 : size === "tablet" ? 15 : 12}
        style={{
          padding: "20px",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          display: "flex",
        }}
      >
        <Space direction="vertical">
          <Image
            preview={false}
            src={require("../asset/section/IMAGE_2.png")}
          />
        </Space>
      </Col>
    </Row>
  );
}

export function Intro2(props) {
  return <div></div>;
}

export function Intro3(props) {
  return <div></div>;
}
