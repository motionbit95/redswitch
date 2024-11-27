import { Button } from "antd";
import { InstagramOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const Pagination = (props) => {
  const isMobile = useMediaQuery({ maxWidth: 680 });
  const isTablet = useMediaQuery({ minWidth: 680, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const size = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return (
    <div
      style={{
        position: "absolute",
        left: size === "mobile" ? "20px" : size === "tablet" ? "40px" : "72px",
        bottom: 64,
        padding: 4,
        color: "white",
      }}
    >
      {props.pageNumber && (
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <text
            style={{
              fontFamily: "SBAggroB",
              fontSize:
                size === "mobile"
                  ? "36px"
                  : size === "tablet"
                  ? "48px"
                  : "64px",
              fontWeight: "bold",
            }}
          >
            {props.pageNumber}
          </text>
          <text
            style={{
              opacity: 0.5,
              fontFamily: "SBAggroM",
              fontSize:
                size === "mobile"
                  ? "20px"
                  : size === "tablet"
                  ? "24px"
                  : "36px",
            }}
          >
            /
          </text>

          <text
            style={{
              fontFamily: "SBAggroM",
              fontSize:
                size === "mobile"
                  ? "20px"
                  : size === "tablet"
                  ? "24px"
                  : "36px",
              position: "relative",
              top: 1,
              opacity: 0.5,
            }}
          >
            {props.groupNumber}
          </text>
        </div>
      )}
    </div>
  );
};

export default Pagination;
