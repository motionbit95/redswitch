import React from "react";
import TextBox from "../component/textbox";
import Description from "../component/description";
import { useMediaQuery } from "react-responsive";
import { Button, Col, Image, Row, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export function Customer(props) {
  const { size } = props;
  const [spot, setSpot] = useState([]);
  const [logoIndex, setLogoIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const handleNext = () => {
    // 로고의 경우, index가 마지막에 도달하면 처음으로 돌아가도록 설정
    if (logoIndex < spot.length - 3) {
      setLogoIndex(logoIndex + 1);
    } else {
      setLogoIndex(0); // 끝에 도달하면 첫 번째로 돌아가기
    }
  };

  const handlePrev = () => {
    // 로고가 처음에 도달하면 마지막으로 돌아가도록 설정
    if (logoIndex > 0) {
      setLogoIndex(logoIndex - 1);
    } else {
      setLogoIndex(spot.length - 3); // 처음에 도달하면 마지막으로 돌아가기
    }
  };

  const handleNextImage = () => {
    // 이미지의 경우, index가 마지막에 도달하면 처음으로 돌아가도록 설정
    if (imageIndex < spot.length - 2) {
      setImageIndex(imageIndex + 1);
    } else {
      setImageIndex(0); // 끝에 도달하면 첫 번째로 돌아가기
    }
  };

  const handlePrevImage = () => {
    // 이미지가 처음에 도달하면 마지막으로 돌아가도록 설정
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    } else {
      setImageIndex(spot.length - 2); // 처음에 도달하면 마지막으로 돌아가기
    }
  };

  // 로고 3개 표시
  const visibleLogos = spot.slice(logoIndex, logoIndex + 3);

  // 이미지 2개 표시
  const visibleImages = spot.slice(imageIndex, imageIndex + 2);

  useEffect(() => {
    fetchSpot();
  }, []);

  const fetchSpot = async () => {
    try {
      const response = await axios
        .get(
          `https://port-0-redswitch-lxwmkqxz2d25ae69.sel5.cloudtype.app/spots`
        )
        .then((response) => {
          console.log("Spot fetched:", response.data);
          setSpot(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Row
      gutter={[16, 16]}
      style={{
        overflow: "hidden",
        height: "100vh",
        maxWidth: "770px",
        maxHeight: size === "mobile" ? "600px" : "100vh",
        justifyContent: "center",
        display: "flex",
        flex: 1,
        paddingTop: "80px",
        paddingInline:
          size === "mobile" ? "0px" : size === "tablet" ? "48px" : "72px",
      }}
    >
      <Col
        span={24}
        style={{
          padding: size === "mobile" ? "0px" : "20px",
          marginBottom: size === "mobile" ? "0px" : "60px",
        }}
      >
        <Image
          preview={false}
          style={{
            marginTop: size === "mobile" ? "80px" : "0px",
            marginBottom:
              size === "mobile" ? "60px" : size === "tablet" ? "160px" : "60px",
          }}
          src={require("../asset/page/9_title.png")}
        />
        <Col
          span={24}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            marginBottom: "60px",
          }}
        >
          <Space direction="vertical" align="center">
            <Button
              // onClick={() =>
              //   window.open(`/https://redswitch-bdsm.netlify.app/spot`)
              // }
              style={{ backgroundColor: "#333333", color: "white" }}
            >
              주변 설치 지점 검색
            </Button>
            <Space
              direction="vertical"
              align="center"
              size={size === "mobile" ? "large" : "medium"}
              style={{ width: "100%" }}
            >
              <Space
                style={{
                  display: "flex",
                }}
              >
                <Button
                  style={{ borderRadius: "50%" }}
                  icon={<LeftOutlined />}
                  onClick={handlePrev}
                />
                <Space style={{ padding: size === "mobile" ? "10px" : "20px" }}>
                  {visibleLogos.map((spot, idx) => (
                    <Image
                      style={{
                        width: size === "mobile" ? "50px" : "100px",
                        height: size === "mobile" ? "50px" : "100px",
                        borderRadius: "50%",
                      }}
                      preview={false}
                      src={spot.spot_logo}
                    />
                  ))}
                </Space>
                <Button
                  style={{ borderRadius: "50%" }}
                  icon={<RightOutlined />}
                  onClick={handleNext}
                />
              </Space>
              <Space
                style={{
                  display: "flex",
                }}
              >
                <Button
                  style={{ borderRadius: "50%" }}
                  icon={<LeftOutlined />}
                  onClick={handlePrevImage}
                />
                <Space style={{ padding: size === "mobile" ? 0 : "20px" }}>
                  {visibleImages.map((spot, idx) => (
                    <Image
                      style={{
                        width: size === "mobile" ? "80px" : "120px",
                        height: size === "mobile" ? "80px" : "120px",
                        backgroundColor: "#f1f1f1",
                        borderRadius: "20%",
                        border: "1px solid #f1f1f1",
                      }}
                      preview={false}
                      src={spot.spot_image}
                    />
                  ))}
                </Space>
                <Button
                  style={{ borderRadius: "50%" }}
                  icon={<RightOutlined />}
                  onClick={handleNextImage}
                />
              </Space>
            </Space>
          </Space>
        </Col>
      </Col>
    </Row>
  );
}
