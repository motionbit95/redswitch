import React, { useEffect, useState } from "react";
import {
  Card,
  Empty,
  Row,
  Space,
  Typography,
  Carousel,
  Modal,
  Checkbox,
  Button,
} from "antd";
import { EnvironmentOutlined, WhatsAppOutlined } from "@ant-design/icons";
import ProductListPage from "./ProductListPage";
import { useMediaQuery } from "react-responsive";
import { Footer } from "../component/Footer";
import { mainPageStyles } from "../styles"; // Import the styles

import Eziok from "../eziok/eziok_react_index";

function MainPage(props) {
  const { branch, theme } = props;
  const [branchInfo, setBranchInfo] = useState(null);
  const [isAgree, setIsAgree] = useState(false); // 개인정보 동의 여부
  const [isCertified, setIsCertified] = useState(
    localStorage.getItem("token") ? true : false
  ); // 인증 여부
  const [isCertModalVisible, setIsCertModalVisible] = useState(false); // 모달 트리거
  const token = localStorage.getItem("token");

  const isLarge = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBranchInfo = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/branches/${branch}`
      );
      const data = await response.json();
      console.log(data);
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

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_SERVER_URL}/accounts/verify-token`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ token: token }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.status !== 200) {
  //       const error = new Error(data.message);
  //       error.response = data;
  //       setIsCertified(false);
  //     } else {
  //       console.log(data);
  //       setIsCertified(true);
  //     }
  //   };

  //   verifyToken();
  // }, [token]);

  const onCert = async (script) => {
    console.log("onCert", script);
    if (!script) {
      // 인증 성공시에만
      return;
    }
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
                style={mainPageStyles.carouselImage}
                onClick={() =>
                  (window.location.href = "https://redswitch-bdsm.netlify.app")
                }
              />
              <img
                src={require("../asset/cert_banner.png")}
                alt={"banner2"}
                style={mainPageStyles.carouselImage}
                onClick={() => setIsCertModalVisible(true)}
              />
            </Carousel>
          ) : (
            <Space size={"large"} style={mainPageStyles.bannerSpace}>
              <img
                src={require("../asset/bdsm_banner.png")}
                alt={"banner1"}
                style={mainPageStyles.carouselImage}
                onClick={() =>
                  (window.location.href = "https://redswitch-bdsm.netlify.app")
                }
              />
              <img
                src={require("../asset/cert_banner.png")}
                alt={"banner2"}
                style={mainPageStyles.carouselImage}
                onClick={() => setIsCertModalVisible(true)}
              />
            </Space>
          )}

          {/* Branch Info Card */}
          <Row justify="center" style={mainPageStyles.row}>
            <Card style={mainPageStyles.card}>
              <Typography.Text style={mainPageStyles.branchTitle}>
                {branchInfo.branch_name}
              </Typography.Text>
              <div style={mainPageStyles.branchInfoContainer}>
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
            handleOpen={() => setIsCertModalVisible(true)}
          />
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={mainPageStyles.emptyStyle}
        />
      )}

      <Modal
        visible={isCertModalVisible}
        onCancel={() => setIsCertModalVisible(false)}
        footer={null}
        title="성인인증"
        style={mainPageStyles.modalStyle}
      >
        <div style={mainPageStyles.certificationModal}>
          <div style={mainPageStyles.ageCircle}>19</div>
        </div>
        <h3>회원님, 본 상품은 성인인증이 필요합니다.</h3>
        <div style={mainPageStyles.modalContent}>
          <div style={mainPageStyles.modalText}>
            본 상품은 청소년 유해매체물로서 ⌜정보통신망 이용촉진 및 정보보호
            등에 관한 법률⌟ 및 ⌜청소년보호법⌟에 따라 만 19세 미만의 청소년이
            이용할 수 없습니다. 이용을 원하시면 본인인증을 진행해주시기
            바랍니다.
          </div>
          <div style={mainPageStyles.modalText}>
            동의 거부 시 서비스 이용이 제한됩니다. 수집된 정보는 성인인증을 위한
            수단으로만 사용되며, 그 외 다른 목적으로 수집되지 않습니다.
          </div>
          <Checkbox onChange={(e) => setIsAgree(e.target.checked)}>
            개인 정보 수집 및 이용동의
          </Checkbox>
          {isAgree && <Eziok onCert={onCert} />}
          {/* <Button
            disabled={!isAgree}
            type="primary"
            danger
            size="large"
            style={mainPageStyles.certButton}
            onClick={onCert}
          >
            휴대폰 본인 인증
          </Button> */}
        </div>
      </Modal>
      <Footer theme={theme} />
    </div>
  );
}

export default MainPage;
