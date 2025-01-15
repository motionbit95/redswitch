import React from "react";
import { Space, Button, Input, Card, Image, Row, Col, Select } from "antd";
import { AxiosGet } from "../api";
import { useState } from "react";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const Spot = (props) => {
  const { theme, setPage } = props;

  // Media queries
  const isSmallScreen = useMediaQuery({ maxWidth: 769 });
  const isMediumScreen = useMediaQuery({ minWidth: 769, maxWidth: 1200 });
  const isLargeScreen = useMediaQuery({ minWidth: 1201 });

  const size = isSmallScreen ? "small" : isMediumScreen ? "medium" : "large";
  const [spots, setSpots] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await AxiosGet("/spots");
        console.log("Spot fetched:", response.data);
        setSpots(response.data);
      } catch (error) {
        console.error("Error fetching Spot:", error);
      }
    };
    // 상품 가지고 오기
    fetchSpots();
  }, []);
  return (
    <div
      style={{
        overflowX: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Space
        direction={size === "small" ? "vertical" : "horizontal"}
        style={{ width: "100%" }}
      >
        <Row>
          <Col
            span={size === "small" ? 24 : 12}
            style={{
              padding: "16px",
              display: "flex",
              gap: "10px",
              // backgroundColor: "#f0f0f0",
            }}
          >
            <Button></Button>
            <Select style={{ width: "100%" }} />
            <Select style={{ width: "100%" }} />
            <Button>검색</Button>
          </Col>
          <Col span={size === "small" ? 24 : 12}>
            <Space direction="vertical" style={{ padding: "16px" }}>
              <Card
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                color="#f0f0f0"
              >
                <Space direction="vertical" style={{ gap: "3px" }}>
                  <div>spot_name</div>
                  <div>spot_address</div>
                  <div>spot_address_detail</div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>
      <Space style={{ width: "100%", padding: "16px" }}>
        <Row>
          <Col>
            <Button size="large">뒤로가기</Button>
          </Col>
          <Col>
            <Button size="large">테스트하러가기</Button>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Spot;
