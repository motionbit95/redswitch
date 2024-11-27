import React from "react";

function Description(props) {
  const { size } = props;
  const descriptionStyle = {
    fontFamily: "SBAggroM",
    color: "white",
    fontSize: size === "mobile" ? "16px" : size === "tablet" ? "20px" : "24px",
    whiteSpace: "nowrap",
  };
  return <div style={descriptionStyle}>{props.description}</div>;
}

export default Description;
