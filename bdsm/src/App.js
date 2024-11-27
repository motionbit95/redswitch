import React, { useEffect, useState } from "react";
import { ConfigProvider, Button, FloatButton, Spin } from "antd";
import { SunOutlined as Sun, MoonOutlined as Moon } from "@ant-design/icons";
import Home from "./page/home";
import Questions from "./page/questions";
import View from "./page/view";
import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import TestResult from "./page/result";

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
      colorBgContainer: "#1f1f1f",
      colorText: "#e6e6e6",
      colorBorder: "#595959",
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
      colorBgContainer: "#2a2a2a",
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

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [page, setPage] = useState("/");

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <ConfigProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          background: theme === "dark" ? "#000" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Home theme={theme} setPage={setPage} />}
            />
            <Route
              path="/test"
              element={<Questions theme={theme} setPage={setPage} />}
            />
            <Route
              path="/view"
              element={<View theme={theme} setPage={setPage} />}
            />
            <Route
              path="/result"
              element={<TestResult theme={theme} setPage={setPage} />}
            />
          </Routes>
        </BrowserRouter>
        {/* <FloatButton
          type={theme === "dark" ? "primary" : "default"}
          icon={theme === "dark" ? <Sun /> : <Moon />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
        /> */}
      </div>
    </ConfigProvider>
  );
};

export default App;
