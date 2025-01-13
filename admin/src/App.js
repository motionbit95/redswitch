import React, { useEffect, useState } from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { Footer } from "antd/es/layout/layout";
import useFirebase from "./hook/useFilrebase";
import useSelectedBranch from "./hook/useSelectedBranch";
import AdminRouter from "./pages";
import HeaderComponent from "./components/layout/HeaderComponent";
import useCurrentUser from "./hook/useCurrentUser";
import useAlarmManager from "./hook/useAlarmManager";
import AlarmModal from "./components/modal/AlarmModal";
import AppSider from "./components/layout/AppSider";
import MenuItems from "./components/array/menu";
import { Layout, theme } from "antd";

const { Header, Content, Sider } = Layout;

let AudioContext;
let audioContext;

// 음성 권한 요청 함수
window.onload = function () {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(() => {
      AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
    })
    .catch((e) => {
      console.error(`Audio permissions denied: ${e}`);
    });
};

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const defaultOpenKeys = window.location.pathname.split("/")[1] || "dashboard";
  const defaultSelectedKeys = window.location.pathname;

  const { currentUser, isLoggedIn, setIsLoggedIn, logout } = useCurrentUser();
  const { selectedBranch, setSelectedBranch } = useSelectedBranch();
  const [openPopover, setOpenPopover] = useState(false);

  // Redirect logic
  useEffect(() => {
    if (window.location.pathname === "/") {
    }
  }, [isLoggedIn]);

  // 알람 훅 사용
  const { alarms } = useFirebase([selectedBranch?.id]);
  const { selectedAlarm, isModalVisible, handleAlarmClick, handleCloseModal } =
    useAlarmManager(alarms);

  const layoutStyles = {
    minHeight: "100vh",
    minWidth: "1200px",
  };

  const contentStyles = {
    padding: 24,
    margin: 0,
    minHeight: 280,
    background: colorBgContainer,
    borderRadius: borderRadiusLG,
  };

  const mainLayoutStyles = {
    marginLeft: 200,
    padding: 24,
    marginTop: 64,
  };

  const footerStyles = {
    textAlign: "center",
  };

  const menu_items = MenuItems({ currentUser });

  return (
    <Router>
      {/* 주문 알람 모달입니다. */}
      <AlarmModal
        selectedAlarm={selectedAlarm}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />

      <Layout style={layoutStyles}>
        {/* 헤더 */}
        <HeaderComponent
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          alarms={alarms}
          openPopover={openPopover}
          setOpenPopover={setOpenPopover}
          handleAlarmClick={handleAlarmClick}
          handleLogout={logout}
        />

        <Layout>
          {/* 사이드 메뉴 */}
          <AppSider
            colorBgContainer={colorBgContainer}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            menuItems={menu_items}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            logout={logout}
          />
          <Layout style={mainLayoutStyles}>
            <Content style={contentStyles}>
              <AdminRouter currentUser={currentUser} />
            </Content>
            <Footer style={footerStyles}>
              Redswitch ©{new Date().getFullYear()} Created by Redswitch
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
