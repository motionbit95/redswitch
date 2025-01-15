import React from "react";
import { Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import LoginForm from "../login";
import SearchBranch from "../popover/searchbranch";
import useSelectedBranch from "../../hook/useSelectedBranch";
import useCurrentUser from "../../hook/useCurrentUser";

const { Sider } = Layout;

const AppSider = ({
  colorBgContainer,
  defaultSelectedKeys,
  defaultOpenKeys,
  menuItems,
  setIsLoggedIn,
}) => {
  const { selectedBranch, setSelectedBranch } = useSelectedBranch();
  const { currentUser, isLoggedIn, logout } = useCurrentUser();
  return (
    <Sider
      width={200}
      style={{
        position: "fixed",
        top: 64,
        left: 0,
        height: "calc(100vh - 64px)",
        background: colorBgContainer,
        overflowY: "auto",
        zIndex: 99,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        style={{
          position: "sticky", // 상단 고정
          top: 0, // Sider 내부 상단 위치
          backgroundColor: "#f1f1f1",
          padding: 16,
          zIndex: 100, // 다른 요소 위에 표시
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #ddd", // 구분선 추가 (선택 사항)
        }}
      >
        <SearchBranch
          setSelectedBranch={(branches) => {
            setSelectedBranch(branches[0]);
            // 새로고침
            window.location.reload();
          }}
          selectedBranch={selectedBranch}
          currentUser={currentUser}
        />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={[defaultSelectedKeys]}
        defaultOpenKeys={[defaultOpenKeys]}
        style={{ height: "100%", borderRight: 0 }}
        items={[
          ...menuItems,
          {
            key: "logout",
            icon: React.createElement(LogoutOutlined),
            label: !isLoggedIn ? (
              <LoginForm
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            ) : (
              <div onClick={logout}>로그아웃</div>
            ),
          },
        ]}
      />
    </Sider>
  );
};

export default AppSider;
