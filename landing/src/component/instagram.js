import { Button } from "antd";
import { InstagramOutlined } from "@ant-design/icons";

const InstagramButton = () => (
  <div
    style={{
      position: "fixed",
      right: 24,
      bottom: 48,
      borderRadius: "50%",
      background: "linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)",
      padding: 4,
      cursor: "pointer",
      transition: "transform 0.2s ease-in-out",
    }}
    onClick={() =>
      window.open(
        "https://www.instagram.com/redswitch.inc?igsh=MWkyd3B5bXI2d3kwbw=="
      )
    }
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <Button
      icon={<InstagramOutlined style={{ fontSize: 24, color: "white" }} />}
      shape="circle"
      type="ghost"
      style={{
        background: "transparent",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  </div>
);

export default InstagramButton;
