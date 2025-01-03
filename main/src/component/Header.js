import { Button, Space, Typography } from "antd";
import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";

function Header(props) {
  return (
    <div
      style={{
        width: "100%",
        paddingBlock: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: props.theme === "dark" ? "#1e1e1e" : "white",
        borderBottom: "1px solid",
        borderColor: props.theme === "dark" ? "#3a3a3a" : "#f0f0f0",
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
