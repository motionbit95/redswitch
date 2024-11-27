import React from "react";
import { Alert, Flex, Spin } from "antd";

function Loading({ isLoding }) {
  return (
    <div
      style={{
        display: isLoding ? "flex" : "none",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <Spin size="large" spinning={isLoding} />
    </div>
  );
}

export default Loading;
