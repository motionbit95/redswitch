import {
  Card,
  Empty,
  Input,
  Row,
  Space,
  Typography,
  Carousel,
  Modal,
  Checkbox,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { EnvironmentOutlined, WhatsAppOutlined } from "@ant-design/icons";
import ProductListPage from "./ProductListPage";
import { useMediaQuery } from "react-responsive";
import { Footer } from "../component/Footer";

function MainPage(props) {
  const { branch, theme } = props;
  const [branchInfo, setBranchInfo] = useState(null);
  const [isAgree, setIsAgree] = useState(false); // 개인정보 동의 여부
  const [isCertified, setIsCertified] = useState(false); // 인증 여부
  const [isCertModalVisible, setIsCertModalVisible] = useState(false); // 모달 트리거

  const isLarge = useMediaQuery({ minWidth: 1024 });

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
        setBranchInfo(data);
      }
    };
    fetchBranchInfo();
  }, [branch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const verifyToken = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/accounts/verify-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }
      );
      const data = await response.json();
      if (response.status !== 200) {
        const error = new Error(data.message);
        error.response = data;
        setIsCertified(false);
      } else {
        console.log(data);
        setIsCertified(true);
      }
    };

    if (token) {
      verifyToken();
    }
  }, []);

  const onCert = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/accounts/anonymous-login`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
    if (response.status !== 200) {
      const error = new Error(data.message);
      error.response = data;
      setIsCertified(false);
    } else {
      console.log(data);
      localStorage.setItem("token", data.token);
      setIsCertified(true);
    }

    setIsCertModalVisible(false);
  };

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
                onClick={() => setIsCertModalVisible(true)}
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
                onClick={() => setIsCertModalVisible(true)}
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

          <ProductListPage
            theme={props.theme}
            branch={branchInfo}
            isCertified={isCertified}
          />
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: "100px" }}
        />
      )}

      <Modal
        visible={isCertModalVisible}
        onCancel={() => setIsCertModalVisible(false)}
        footer={null}
        title="성인인증"
        style={{ textAlign: "center" }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", margin: "10px" }}
        >
          <div
            style={{
              fontSize: "xx-large",
              marginRight: "10px",
              fontWeight: "bold",
              border: "3px solid #ff4d4f",
              padding: "10px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          >
            19
          </div>
        </div>
        <h3>회원님, 본 상품은 성인인증이 필요합니다.</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "small", opacity: "0.7", textAlign: "left" }}>
            본 상품은 청소년 유해매체물로서 ⌜정보통신망 이용촉진 및 정보보호
            등에 관한 법률⌟ 및 ⌜청소년보호법⌟에 따라 만 19세 미만의 청소년이
            이용할 수 없습니다. 이용을 원하시면 본인인증을 진행해주시기
            바랍니다.
          </div>
          <div style={{ fontSize: "small", opacity: "0.7", textAlign: "left" }}>
            동의 거부 시 서비스 이용이 제한됩니다. 수집된 정보는 성인인증을 위한
            수단으로만 사용되며, 그 외 다른 목적으로 수집되지 않습니다.
          </div>
          <Checkbox onChange={(e) => setIsAgree(e.target.checked)}>
            개인 정보 수집 및 이용동의
          </Checkbox>
          <Button
            disabled={!isAgree}
            type="primary"
            danger
            size="large"
            style={{ width: "100%" }}
            onClick={onCert}
          >
            휴대폰 본인 인증
          </Button>
        </div>
      </Modal>
      <Footer theme={theme} />
    </div>
  );
}

export default MainPage;
