import React from "react";
import { Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import LoginForm from "../login";

const { Sider } = Layout;

const AppSider = ({
  colorBgContainer,
  defaultSelectedKeys,
  defaultOpenKeys,
  menuItems,
  isLoggedIn,
  setIsLoggedIn,
  logout,
}) => {
  return (
    <Sider
      width={200}
      style={{
        position: "fixed",
        top: 64,
        left: 0,
        height: "calc(100vh - 64px)",
        background: colorBgContainer,
        overflow: "auto",
        zIndex: 99,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
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
