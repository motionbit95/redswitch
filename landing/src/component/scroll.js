import { Image } from "antd";
import React from "react";

function Scroll(props) {
  const { size } = props;
  return (
    <div style={{ position: "fixed", left: 0, bottom: 0, zIndex: 999 }}>
      <Image
        preview={false}
        src={require("../asset/image/SCROLL.png")}
        alt="scroll"
        style={{
          width: size === "desktop" ? "80px" : "60px",
          transform:
            size === "desktop" ? "translateY(0px)" : "translateY(-50%)",
        }}
      ></Image>
    </div>
  );
}

export default Scroll;
