import { Button, Space, Typography } from "antd";
import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";

function Header(props) {
  return (
    <div
      style={{
        width: "100%",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Space
        direction="horizontal"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        onClick={() => {
          window.location.href = `/spot/${localStorage.getItem("branch")}`;
        }}
      >
        <img
          src={require("../asset/redswitchLogo.png")}
          alt={"logo"}
          style={{
            width: "32px",
            height: "32px",
            objectFit: "cover",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography.Text style={{ fontSize: "large", fontWeight: "bold" }}>
            REDSWITCH
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: "small",
              marginBottom: "10px",
            }}
          >
            비대면 어덜트토이 플랫폼
          </Typography.Text>
        </div>
      </Space>
      {/* <a
        style={{
          display: window.location.pathname === "/cart" ? "none" : "flex",
          position: "absolute",
          right: "20px",
          color: "#000",
          cursor: "pointer",
        }}
        href="/cart"
      >
        <ShoppingCartOutlined style={{ fontSize: "24px" }} />
      </a> */}
    </div>
  );
}

export default Header;
