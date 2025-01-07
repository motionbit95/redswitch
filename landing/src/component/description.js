import React from "react";

function Description(props) {
  const { size } = props;
  const descriptionStyle = {
    fontFamily: "SBAggroM",
    color: "white",
    fontSize: size === "mobile" ? "10px" : size === "tablet" ? "18px" : "20px",
    whiteSpace: "nowrap",
  };
  return <div style={descriptionStyle}>{props.description}</div>;
}

export default Description;
