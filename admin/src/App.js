import React, { useEffect, useState } from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { Layout, theme } from "antd";
import { Footer } from "antd/es/layout/layout";
import {
  ShopOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import useFirebase from "./hook/useFilrebase";
import useSelectedBranch from "./hook/useSelectedBranch";
import AdminRouter from "./pages";
import menu_items from "./components/array/menu";
import HeaderComponent from "./components/layout/HeaderComponent";
import useCurrentUser from "./hook/useCurrentUser";
import useAlarmManager from "./hook/useAlarmManager";
import AlarmModal from "./components/modal/AlarmModal";
import AppSider from "./components/layout/AppSider";

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
      window.location.href = isLoggedIn ? "/dashboard" : "/login";
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
            menuItems={[
              ...menu_items,
              {
                key: "provider",
                icon: React.createElement(TeamOutlined),
                label: <Link to="/provider/provider">거래처관리</Link>,
                hidden: currentUser.permission === "3",
              },
              {
                key: "branch",
                icon: React.createElement(ShopOutlined),
                label: <Link to="/branch/branch">지점관리</Link>,
                hidden: currentUser.permission === "3",
              },
              {
                key: "admin",
                icon: React.createElement(SolutionOutlined),
                label: "관리자 설정",
                hidden: currentUser.permission !== "1",
                children: [
                  {
                    key: "/provider/post",
                    label: <Link to="/provider/post">가맹점 신청</Link>,
                  },
                  {
                    key: "/admin/account",
                    label: <Link to="/admin/account">계정관리</Link>,
                  },
                  {
                    key: "homepage",
                    label: <Link to="/admin/spot">홈페이지관리</Link>,
                  },
                  {
                    key: "bdsm",
                    // icon: React.createElement(DotChartOutlined),
                    label: "BDSM",
                    children: [
                      {
                        key: "/bdsm/questions",
                        label: <Link to="/bdsm/questions">문항관리</Link>,
                      },
                      {
                        key: "/bdsm/results",
                        label: <Link to="/bdsm/results">성향관리</Link>,
                      },
                      {
                        key: "/bdsm/advertise",
                        label: <Link to="/bdsm/advertise">광고관리</Link>,
                      },
                      {
                        key: "/bdsm/trend",
                        label: <Link to="/bdsm/trend">통계관리</Link>,
                      },
                    ],
                  },
                ],
              },
            ]}
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
