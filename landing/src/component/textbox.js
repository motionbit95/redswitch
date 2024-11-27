import { Space } from "antd";
import React from "react";

function TextBox(props) {
  const { size } = props;
  const titleStyle = {
    fontFamily: "PartialSansKR-Regular",
    color: "#DA0A18",
    fontSize: size === "mobile" ? "32px" : size === "tablet" ? "48px" : "64px",
    whiteSpace: "nowrap",
    textShadow:
      "1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff",
  };

  const descriptionStyle = {
    fontFamily: "SBAggroM",
    color: "white",
    fontSize: size === "mobile" ? "20px" : size === "tablet" ? "24px" : "32px",
    whiteSpace: "nowrap",
  };
  return (
    <Space direction="vertical" size={"large"}>
      <div style={titleStyle}>{props.title}</div>
      <div style={descriptionStyle}>{props.description}</div>
    </Space>
  );
}

export default TextBox;
