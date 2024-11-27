import React from "react";
import Logo from "../component/logo";
import { Col, Row, Space } from "antd";
import Nav from "../component/nav";

function Header(props) {
  const { size } = props;
  return (
    <Row
      align="middle"
      justify="space-between"
      style={{
        backgroundColor: "black",
        zIndex: 999,
        minWidth: "300px",
        paddingInline:
          size === "mobile" ? "20px" : size === "tablet" ? "40px" : "72px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        paddingBlock: "16px",
      }}
    >
      <Col span={size === "mobile" ? 24 : 8}>
        <Logo {...props} />
      </Col>
      <Col span={size === "mobile" ? 24 : 16}>
        <Nav {...props} />
      </Col>
    </Row>
  );
}

export default Header;
