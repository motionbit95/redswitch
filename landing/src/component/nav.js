import { Space, Typography } from "antd";
import React, { useEffect, useState } from "react";

function Nav(props) {
  const { size, theme } = props;
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash;
      setHash(hash);
    });
  }, []);
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
        style={{ ...navStyle, color: hash === "#1" ? "red" : "white" }}
        onClick={() => (window.location.hash = "#1")}
      >
        MAIN
      </Typography.Link>
      <Typography.Link
        style={{
          ...navStyle,
          color:
            hash === "#2" || hash === "#3" || hash === "#4" ? "red" : "white",
        }}
        onClick={() => (window.location.hash = "#2")}
      >
        INTRO
      </Typography.Link>
      <Typography.Link
        style={{
          ...navStyle,
          color:
            hash === "#5" || hash === "#6" || hash === "#7" || hash === "#8"
              ? "red"
              : "white",
        }}
        onClick={() => (window.location.hash = "#5")}
      >
        SERVICE
      </Typography.Link>
      <Typography.Link
        style={{
          ...navStyle,
          color: hash === "#9" ? "red" : "white",
        }}
        onClick={() => (window.location.hash = "#9")}
      >
        CUSTOMER
      </Typography.Link>
      <Typography.Link
        style={{
          ...navStyle,
          color: hash === "#10" ? "red" : "white",
        }}
        onClick={() => (window.location.hash = "#10")}
      >
        CONTACT
      </Typography.Link>
    </Space>
  );
}

export default Nav;
