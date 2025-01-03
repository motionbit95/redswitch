import { Button, Col, Row, Space } from "antd";
import React, { useEffect } from "react";
import {
  FundOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

function BottomNavbar(props) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [menu, setMenu] = React.useState(0);
  useEffect(() => {
    if (window.location.href.includes("spot")) {
      setMenu(0);
    }

    if (window.location.href.includes("cart")) {
      setMenu(2);
    }

    if (window.location.href.includes("order")) {
      setMenu(3);
    }
  }, []);
  return (
    <div
      style={{
        display: "flex",
        position: "sticky",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "10px",
        justifyContent: "center",
        backgroundColor: props.theme === "dark" ? "#1e1e1e" : "white",
        boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row gutter={[16, 16]} style={{ width: "100%" }}>
        <Col
          onClick={() => {
            setMenu(0);
            window.location.href = `/spot/${localStorage.getItem("branch")}`;
          }}
          span={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
              color: menu === 0 ? "#f5222d" : "#8c8c8c",
            }}
          >
            <HomeOutlined
              style={{
                fontSize: isMobile ? "16px" : "24px",
              }}
            />
            <div>홈</div>
          </div>
        </Col>
        <Col
          onClick={() => {
            window.open("https://redswitch-bdsm.netlify.app/");
          }}
          span={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
              color: "#8c8c8c",
            }}
          >
            <FundOutlined style={{ fontSize: isMobile ? "16px" : "24px" }} />
            <div>BDSM</div>
          </div>
        </Col>
        <Col
          onClick={() => {
            setMenu(2);
            window.location.href = "/cart";
          }}
          span={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
              color: menu === 2 ? "#f5222d" : "#8c8c8c",
            }}
          >
            <ShoppingCartOutlined
              style={{ fontSize: isMobile ? "16px" : "24px" }}
            />
            <div>장바구니</div>
          </div>
        </Col>
        <Col
          span={6}
          style={{ display: "flex", justifyContent: "center" }}
          onClick={() => {
            setMenu(2);
            window.location.href = "/order";
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
              color: menu === 3 ? "#f5222d" : "#8c8c8c",
            }}
          >
            <UserOutlined style={{ fontSize: isMobile ? "16px" : "24px" }} />
            <div>주문내역</div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BottomNavbar;
