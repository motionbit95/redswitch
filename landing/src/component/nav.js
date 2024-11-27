import { Space, Typography } from "antd";
import React from "react";

function Nav(props) {
  const { size, theme } = props;
  const navStyle = {
    fontWeight: "bold",
    fontSize: size === "mobile" ? "10px" : "15px",
    color: "white",
  };
  return (
    <Space
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography.Link style={navStyle}>MAIN</Typography.Link>
      <Typography.Link style={navStyle}>INTRO</Typography.Link>
      <Typography.Link style={navStyle}>SERVICE</Typography.Link>
      <Typography.Link style={navStyle}>CUSTOMER</Typography.Link>
      <Typography.Link style={navStyle}>CONTACT</Typography.Link>
    </Space>
  );
}

export default Nav;
