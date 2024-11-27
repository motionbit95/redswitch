import {
  Card,
  Empty,
  FloatButton,
  Input,
  Row,
  Space,
  Typography,
  Carousel,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import { EnvironmentOutlined, WhatsAppOutlined } from "@ant-design/icons";
import TabPane from "antd/es/tabs/TabPane";
import ProductListPage from "./ProductListPage";
import { useMediaQuery } from "react-responsive";

const { Search } = Input;

function MainPage(props) {
  const { branch } = props;
  const [branchInfo, setBranchInfo] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const isLarge = useMediaQuery({ minWidth: 1024 });

  // 임의 데이터
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];
  const visibleItemId = 1; // 기본 선택된 탭 인덱스

  // 클릭시 스크롤 이동 함수
  const moveToScroll = (index) => {
    // 실제 스크롤 이동 처리 코드 (예시)
    console.log(`Scrolling to category ${index}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBranchInfo = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/branches/${branch}`
      );
      const data = await response.json();
      if (response.status !== 200) {
        const error = new Error(data.message);
        error.response = data;
        setBranchInfo(null);
      } else {
        console.log(data);
        setBranchInfo(data);
      }
    };
    fetchBranchInfo();
  }, [branch]);

  return (
    <div>
      {branchInfo ? (
        <>
          {/* Carousel - now below the logo */}
          {!isLarge ? (
            <Carousel autoplay effect="fade">
              <img
                src={require("../asset/bdsm_banner.png")}
                alt={"banner1"}
                style={{ width: "100%", height: "auto" }}
              />
              <img
                src={require("../asset/cert_banner.png")}
                alt={"banner2"}
                style={{ width: "100%", height: "auto" }}
              />
            </Carousel>
          ) : (
            <Space size={"large"} style={{ marginBottom: "10px" }}>
              <img
                src={require("../asset/bdsm_banner.png")}
                alt={"banner1"}
                style={{ width: "100%", height: "auto" }}
              />
              <img
                src={require("../asset/cert_banner.png")}
                alt={"banner2"}
                style={{ width: "100%", height: "auto" }}
              />
            </Space>
          )}

          {/* Branch Info Card */}
          <Row
            justify="center"
            style={{ marginBottom: "10px", padding: "0 10px" }}
          >
            <Card
              style={{
                width: "100%",
                // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography.Text
                style={{ fontWeight: "bold", fontSize: "x-large" }}
              >
                {branchInfo.branch_name}
              </Typography.Text>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Space>
                  <EnvironmentOutlined />
                  <Typography.Text>{branchInfo.branch_address}</Typography.Text>
                </Space>
                <Space>
                  <WhatsAppOutlined />
                  <Typography.Text>{branchInfo.branch_contact}</Typography.Text>
                </Space>
              </div>
            </Card>
          </Row>

          <ProductListPage theme={props.theme} branch={branchInfo} />
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: "100px" }}
        />
      )}
    </div>
  );
}

export default MainPage;
