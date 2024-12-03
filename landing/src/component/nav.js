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
      <Typography.Link
        style={navStyle}
        onClick={() => (window.location.hash = "#1")}
      >
        MAIN
      </Typography.Link>
      <Typography.Link
        style={navStyle}
        onClick={() => (window.location.hash = "#2")}
      >
        INTRO
      </Typography.Link>
      <Typography.Link
        style={navStyle}
        onClick={() => (window.location.hash = "#5")}
      >
        SERVICE
      </Typography.Link>
      <Typography.Link
        style={navStyle}
        onClick={() => (window.location.hash = "#9")}
      >
        CUSTOMER
      </Typography.Link>
      <Typography.Link
        style={navStyle}
        onClick={() => (window.location.hash = "#10")}
      >
        CONTACT
      </Typography.Link>
    </Space>
  );
}

export default Nav;
