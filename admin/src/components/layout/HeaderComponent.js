import React from "react";
import { Space, Tag, Button, Layout } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import SearchBranch from "../popover/searchbranch";
import NoticeDetail from "../popover/notice";
import useCurrentUser from "../../hook/useCurrentUser";

const { Header } = Layout;

const HeaderComponent = ({
  selectedBranch,
  setSelectedBranch,
  alarms,
  openPopover,
  setOpenPopover,
  handleAlarmClick,
  handleLogout,
}) => {
  const { currentUser, isLoggedIn, logout } = useCurrentUser();

  return (
    <Header
      style={{
        position: "fixed", // 고정된 헤더
        top: 0,
        left: 0,
        zIndex: 100, // 다른 요소들보다 위에
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#001529",
        padding: "0 20px",
      }}
    >
      <Space
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Space size={"large"}>
          <Space
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Redswitch
          </Space>
          {/* <SearchBranch
            setSelectedBranch={(branches) => {
              setSelectedBranch(branches[0]);
              // 새로고침
              window.location.reload();
            }}
            selectedBranch={selectedBranch}
            currentUser={currentUser}
          /> */}
        </Space>
        <Space size={"large"}>
          <Space size={"large"}>
            <Space>
              <Tag
                color={
                  currentUser.permission === "1"
                    ? "red"
                    : currentUser.permission === "2"
                    ? "blue"
                    : "green"
                }
              >
                {currentUser.permission === "1"
                  ? "본사관리자"
                  : currentUser.permission === "2"
                  ? "지사관리자"
                  : "지점관리자"}
              </Tag>
              <div style={{ color: "white", whiteSpace: "nowrap" }}>
                {currentUser.user_name} 님
              </div>
            </Space>
            <NoticeDetail
              alarms={alarms}
              openPopover={openPopover}
              setOpenPopover={setOpenPopover}
              handleAlarmClick={handleAlarmClick}
            />
          </Space>
          <Button
            // icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </Space>
      </Space>
    </Header>
  );
};

export default HeaderComponent;
