import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PaymentTest from "./page/Payment";
import PaymentResult from "./page/PaymentResult";
import MainPage from "./page/MainPage";
import { useEffect, useState } from "react";
import {
  ConfigProvider,
  FloatButton,
  Row,
  Space,
  Typography,
  Result,
  Button,
  Checkbox,
} from "antd";
import { Footer } from "./component/Footer";
import Product from "./page/Product";

const darkTheme = {
  components: {
    Button: {
      primaryColor: "white",
      colorPrimary: "#0078d4",
      colorBgContainer: "#1f1f1f",
      colorText: "#ffffff",
      colorTextDisabled: "#595959",
      colorBgContainerDisabled: "#262626",
      controlItemBgActiveDisabled: "#3c3c3c",
      borderColorDisabled: "#3c3c3c",
    },
    Typography: {
      colorTextHeading: "#e6e6e6",
      colorText: "#d9d9d9",
    },
    Form: {
      labelColor: "#e6e6e6",
    },
    Input: {
      colorBgContainer: "#2a2a2a",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
    },
    Select: {
      colorBgContainer: "#2a2a2a",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
      colorBgElevated: "#3a3a3a",
      optionSelectedColor: "#ffffff",
      optionSelectedBg: "#4a4a4a",
    },
    Checkbox: {
      colorBgContainer: "#1f1f1f", // 체크박스 배경색
      colorText: "#e6e6e6", // 체크박스 텍스트 색상
      colorBorder: "#595959", // 기본 테두리 색상
      colorPrimary: "#ff7875", // 기본 체크 상태 색상
      colorChecked: "#ff7875", // 체크된 상태 색상
      colorHover: "#ff9a8d", // 호버 시 색상
      controlOutline: "transparent", // 포커스 아웃라인 제거
    },
    Radio: {
      colorBgContainer: "#1f1f1f",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
    },
    Modal: {
      contentBg: "#1f1f1f",
      headerBg: "#1f1f1f",
      footerBg: "#1f1f1f",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
      titleColor: "#e6e6e6",
    },
    Carousel: {
      colorBgContainer: "#1f1f1f",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
    },
    Card: {
      colorBgContainer: "#3a3a3a",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
      colorBorderSecondary: "#4a4a4a",
    },
  },
};

const lightTheme = {
  components: {
    Button: {
      primaryColor: "white",
      colorPrimary: "#0078d4",
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorTextDisabled: "#bfbfbf",
      colorBgContainerDisabled: "#f5f5f5",
      controlItemBgActiveDisabled: "#e6e6e6",
      borderColorDisabled: "#e6e6e6",
    },
    Typography: {
      colorTextHeading: "#000000",
      colorText: "#4a4a4a",
    },
    Form: {
      labelColor: "#000000",
    },
    Input: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
    },
    Select: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
      colorBgElevated: "#ffffff",
      optionSelectedColor: "#000000",
      optionSelectedBg: "#f0f0f0",
    },
    Checkbox: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
      colorPrimary: "#ff7875", // 기본 체크 상태 색상
      colorChecked: "#ff7875", // 체크된 상태 색상
      colorHover: "#ff9a8d", // 호버 시 색상
      controlOutline: "transparent", // 포커스 아웃라인 제거
    },
    Radio: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
    },
    Modal: {
      contentBg: "#ffffff",
      headerBg: "#ffffff",
      footerBg: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
      titleColor: "#000000",
    },
    Carousel: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
    },
    Card: {
      colorBgContainer: "#ffffff",
      colorText: "#000000",
      colorBorder: "#d9d9d9",
      colorBorderSecondary: "#d9d9d9",
    },
  },
};

function App() {
  const [theme, setTheme] = useState("light");
  const branch = window.location.pathname.split("/").pop();

  return (
    <ConfigProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      {theme === "dark" && (
        <style>{`body { background-color: ${
          theme === "dark" ? "#2e2e2e" : "#fcfcfc"
        } }`}</style>
      )}
      <div
        style={{
          backgroundColor: theme === "dark" ? "#2e2e2e" : "#fcfcfc",
          minWidth: "300px",
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Row>
            <FloatButton.Group shape="circle" style={{ marginBottom: "54px" }}>
              <FloatButton />
              <FloatButton.BackTop visibilityHeight={0} />
            </FloatButton.Group>

            {/* Main Content Section */}
            <div
              style={{
                width: "100%",
                padding: "10px 10px 10px 10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Space
                direction="horizontal"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={require("./asset/redswitchLogo.png")}
                  alt={"logo"}
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "cover",
                  }}
                />
                <Typography.Text
                  style={{ fontSize: "10px", fontWeight: "bold" }}
                >
                  REDSWITCH
                </Typography.Text>
              </Space>

              <Typography.Text
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                비대면 어덜트토이 플랫폼
              </Typography.Text>
            </div>
          </Row>
          <BrowserRouter>
            <Routes>
              <Route
                path="/spot/*"
                element={<MainPage branch={branch} theme={theme} />}
              />
              <Route
                path="/product/*"
                element={<Product branch={branch} theme={theme} />}
              />
              <Route path="/payment" element={<PaymentTest />} />
              <Route
                path="/payment/result"
                element={<PaymentResult branch={branch} />}
              />
              <Route
                path="/*"
                element={
                  <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary">Back Home</Button>}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
