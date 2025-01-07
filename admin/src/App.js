import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Space,
  Modal,
  Popconfirm,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import LoginForm from "./components/login";
import { AxiosGet, AxiosPut } from "./api";
import useFirebase from "./hook/useFilrebase";
import soundFile from "./assets/VoicesAI_1724058982121.mp3";
import { Tag } from "antd/lib";
import SearchBranch from "./components/popover/searchbranch";
import useSelectedBranch from "./hook/useSelectedBranch";
import OrderDetail from "./components/modal/orderModal";

import AdminRouter from "./pages";
import menu_items from "./components/array/menu";
import NoticeDetail from "./components/popover/notice";

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

  const token = localStorage.getItem("authToken");

  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);
  const [currentUser, setCurrentUser] = useState({});

  // useFirebase 훅을 사용하여 알림 데이터를 가져옴
  const { selectedBranch, setSelectedBranch } = useSelectedBranch();
  const [branchPks, setBranchPks] = useState([selectedBranch?.id]); // branchPks 초기값을 배열로 설정(이끌림호텔 충장점 - 테스트)
  const [selectedAlarm, setSelectedAlarm] = useState(null); // 선택된 알림 상태
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 visibility 상태
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 첫 로드 여부
  const [shouldCheckAlarms, setShouldCheckAlarms] = useState(false); // 특정 함수 이후에 알림 확인 여부

  const isEffectExecuted = useRef(false); // useEffect 중복 실행 방지
  const audioRef = useRef(null); // 알람 반복을 위한 audioRef

  // useFirebase 훅을 사용하여 알림 데이터를 가져옴
  const { alarms, loading } = useFirebase(branchPks);
  const [openPopover, setOpenPopover] = useState(false);

  // redirect
  useEffect(() => {
    if (window.location.pathname === "/") {
      if (!isLoggedIn) {
        window.location.href = "/login";
      } else {
        window.location.href = "/dashboard";
      }
    }
  }, [isLoggedIn]);

  // branchPks 변경 시 호출되는 함수
  const handleBranchChange = (value) => {
    setBranchPks(value);
  };

  // 알림 항목을 클릭할 때 호출되는 함수
  const handleAlarmClick = (alarm) => {
    setSelectedAlarm(alarm); // 클릭한 알림 데이터를 설정
    setOpenPopover(false);
    setIsModalVisible(true); // 모달을 표시
  };

  // 모달을 닫는 함수
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedAlarm(null);

    if (audioRef.current) {
      audioRef.current.pause(); // 소리 중지
      audioRef.current = null;
    }
  };

  // 알림 확인 로직
  useEffect(() => {
    if ((isFirstLoad || shouldCheckAlarms) && alarms.length > 0) {
      if (isEffectExecuted.current) return;
      isEffectExecuted.current = true;

      const latestUnseenAlarm = alarms.find(
        (alarm) => alarm.alarm_status === 0
      );
      if (latestUnseenAlarm) {
        setSelectedAlarm(latestUnseenAlarm);
        setIsModalVisible(true);
        playSound();
      }

      if (isFirstLoad) setIsFirstLoad(false);
      if (shouldCheckAlarms) setShouldCheckAlarms(false);

      setTimeout(() => {
        isEffectExecuted.current = false; // 일정 시간 후 다시 실행 가능하도록 초기화
      }, 100); // 필요에 따라 조정
    }
  }, [isFirstLoad, shouldCheckAlarms, alarms]);

  // alarms 변경 시 실행
  useEffect(() => {
    if (isFirstLoad || alarms.length === 0) return; // 첫 로드나 비어있는 알림은 무시

    if (!isEffectExecuted.current) {
      setShouldCheckAlarms(true);
    }
  }, [alarms]);

  // 알람 발생 시 사운드 실행
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(soundFile);
    audioRef.current.loop = true; // 반복 재생 설정
    audioRef.current
      .play()
      .catch((e) => console.error("Audio play failed:", e));
  };

  // 로그인 시 현재 사용자 정보 가져오기
  useEffect(() => {
    AxiosGet(`/accounts/${localStorage.getItem("id")}`)
      .then((response) => {
        if (response.status === 200) {
          setCurrentUser(response.data);
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          setCurrentUser({});
          localStorage.removeItem("authToken");
          localStorage.removeItem("id");
          setIsLoggedIn(false);
        }
      });
  }, [localStorage.getItem("id")]);

  // 로그아웃
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {/* 모달을 통한 알림 상세 내용 표시 */}
      <Modal
        centered
        title={selectedAlarm?.alarm_title}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={
          <>
            <Popconfirm
              title="주문을 취소하시겠습니까?"
              onConfirm={() => {
                console.log("주문 취소");
                AxiosPut(`/alarms/${selectedAlarm.id}`, { alarm_status: 1 })
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                handleCloseModal();
              }}
            >
              <Button>주문 취소</Button>
            </Popconfirm>
            <Button
              type="primary"
              onClick={() => {
                AxiosPut(`/alarms/${selectedAlarm.id}`, { alarm_status: 1 })
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                handleCloseModal();
              }}
            >
              주문 확인
            </Button>
          </>
        }
        width={600}
        closable={false} // X 버튼을 없애기 위해 추가
      >
        <OrderDetail selectedAlarm={selectedAlarm} />
      </Modal>
      <Layout style={{ minHeight: "100vh", minWidth: "1200px" }}>
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
          }}
        >
          <Space size={"large"}>
            <div
              style={{
                float: "left",
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
            </div>
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
              <div style={{ color: "white" }}>{currentUser.user_id} 님</div>
            </Space>
          </Space>
          <Space size={50}>
            <Space size={"large"}>
              <SearchBranch
                setSelectedBranch={(branches) => {
                  setSelectedBranch(branches[0]);
                  localStorage.setItem(
                    "selectedBranch",
                    JSON.stringify(branches[0])
                  );

                  // 새로고침
                  window.location.reload();
                }}
                selectedBranch={selectedBranch}
                currentUser={currentUser}
              />
              <NoticeDetail
                alarms={alarms}
                openPopover={openPopover}
                setOpenPopover={setOpenPopover}
                handleAlarmClick={handleAlarmClick}
              />
            </Space>
          </Space>
        </Header>
        <Layout>
          <Sider
            width={200}
            style={{
              position: "fixed", // Sider 고정
              top: 64, // Header가 64px이므로 그 아래에 위치
              left: 0,
              height: "100vh", // 화면 전체 높이에 맞게
              background: colorBgContainer,
              overflow: "auto", // 내용이 넘칠 때 스크롤 처리
              zIndex: 99, // Sider가 Header 아래에 오도록 설정
              height: "calc(100vh - 64px)", // 64px 만큼의 Header를 제외한 높이 설정
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              scrollbarWidth: "none", // Firefox에서 스크롤바 숨기기
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[defaultSelectedKeys]}
              defaultOpenKeys={[defaultOpenKeys]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
              items={[
                ...menu_items,
                {
                  key: "logout",
                  icon: React.createElement(LogoutOutlined),
                  label: !isLoggedIn ? (
                    <LoginForm
                      isLoggedIn={isLoggedIn}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  ) : (
                    <div onClick={handleLogout}>로그아웃</div>
                  ),
                },
              ]}
            />
          </Sider>
          <Layout
            style={{
              marginLeft: 200, // Sider의 너비 만큼 여백을 두어야 내용이 겹치지 않음
              padding: "0 24px 24px",
              marginTop: 64, // 헤더 크기만큼 여백을 두어야 내용이 헤더와 겹치지 않음
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            />
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <AdminRouter currentUser={currentUser} />
            </Content>
            <Footer
              style={{
                textAlign: "center",
              }}
            >
              Redswitch ©{new Date().getFullYear()} Created by Redswitch
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
