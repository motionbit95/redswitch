import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  DotChartOutlined,
  UserOutlined,
  ReadOutlined,
  DollarOutlined,
  InboxOutlined,
  TruckOutlined,
  ShopOutlined,
  TeamOutlined,
  SolutionOutlined,
  NotificationOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Button,
  Space,
  Badge,
  Popover,
  Typography,
  Modal,
  List,
  Tabs,
  Row,
  Col,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import BDSMQuestions from "./pages/bdsm/bdsm_questions";
import BDSMResults from "./pages/bdsm/bdsm_results";
import Account from "./pages/admin/account";
import Provider from "./pages/provider/provider";
import Branch from "./pages/admin/branch";
import Main from "./pages/admin/main";
import Post from "./pages/post/post";
import FranchisePost from "./pages/provider/franchise_post";
import LoginForm from "./components/login";
import Product from "./pages/product/product";
import Inventory from "./pages/product/inventory";
import Purchase_order from "./pages/product/purchase_order";
import Order from "./pages/order/order";
import BDSMStatistics from "./pages/bdsm/bdsm_statistics";
import Material from "./pages/product/material";
import BDSMAdvertise from "./pages/bdsm/bdsm_advertise";
import NoticeBoard from "./pages/post/post";
import InquiryBoard from "./pages/post/inquiry";
import { AxiosGet } from "./api";
import useFirebase from "./hook/useFilrebase";
import Spot from "./pages/admin/spot";
import soundFile from "./assets/VoicesAI_1724058982121.mp3";
import TabPane from "antd/es/tabs/TabPane";
import PaymentSummary from "./pages/sales/salse";
import PaymentSummaryByBranch from "./pages/sales/branch";

const { Header, Content, Sider } = Layout;

let AudioContext;
let audioContext;

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

  const duminotifications = [
    { id: 1, message: "새로운 알림이 도착했습니다." },
    { id: 2, message: "시스템 점검 예정입니다." },
  ];

  const dumiorders = [
    { id: 1, message: "주문이 완료되었습니다." },
    { id: 2, message: "배송이 시작되었습니다." },
  ];

  const defaultOpenKeys = window.location.pathname.split("/")[1];
  const defaultSelectedKeys = window.location.pathname;

  const token = localStorage.getItem("authToken");

  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);
  const [currentUser, setCurrentUser] = useState({});

  // useFirebase 훅을 사용하여 알림 데이터를 가져옴
  const [branchPks, setBranchPks] = useState(["-OCqwefrb7HMt2OMw2qE"]); // branchPks 초기값을 배열로 설정(이끌림호텔 충장점 - 테스트)
  const [selectedAlarm, setSelectedAlarm] = useState(null); // 선택된 알림 상태
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 visibility 상태

  const audioRef = useRef(null); // 알람 반복을 위한 audioRef

  // useFirebase 훅을 사용하여 알림 데이터를 가져옴
  const { alarms, loading } = useFirebase(branchPks);

  // branchPks 변경 시 호출되는 함수
  const handleBranchChange = (value) => {
    setBranchPks(value);
  };

  // 알림 항목을 클릭할 때 호출되는 함수
  const handleAlarmClick = (alarm) => {
    setSelectedAlarm(alarm); // 클릭한 알림 데이터를 설정
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

  // 알림이 추가되면 자동으로 모달을 띄우기 위한 useEffect
  useEffect(() => {
    if (alarms.length > 0) {
      const latestAlarm = alarms[alarms.length - 1]; // 가장 최근 알림
      setSelectedAlarm(latestAlarm); // 최신 알림 설정
      // setIsModalVisible(true); // 모달 표시
    }
  }, [alarms]); // alarms 배열이 변경될 때마다 실행

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

  useEffect(() => {
    console.log("App component mounted");
    console.log(window.location.pathname.split("/")[1]);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await AxiosGet(
          `/accounts/${localStorage.getItem("id")}`
        );
        if (response.status === 200) {
          console.log("유저 정보", response.data);
          setCurrentUser(response.data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          setCurrentUser({});
          localStorage.removeItem("authToken");
          localStorage.removeItem("id");
          setIsLoggedIn(false);
        }
      }
    };

    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
  };

  // 메뉴 항목
  const items = [
    {
      key: "sales",
      icon: React.createElement(DollarOutlined),
      label: "매출분석",
      children: [
        {
          key: "/sales/sales",
          label: <Link to="/sales/sales">기간별 조회</Link>,
        },
        {
          key: "/sales/branch",
          label: <Link to="/sales/branch">지점별 조회</Link>,
        },
      ],
    },
    {
      key: "order",
      icon: React.createElement(TruckOutlined),
      label: <Link to="/order">주문관리</Link>,
      // children: [
      //   {
      //     key: "/order/order",
      //     label: <Link to="/order/order">주문관리</Link>,
      //   },
      // ],
    },
    {
      key: "product",
      icon: React.createElement(InboxOutlined),
      label: "상품관리",
      children: [
        {
          key: "/product/material",
          label: <Link to="/product/material">물자등록</Link>,
        },
        {
          key: "/product/product",
          label: <Link to="/product/product">판매상품관리</Link>,
        },
        {
          key: "/product/inventory",
          label: <Link to="/product/inventory">재고관리</Link>,
        },
        {
          key: "/product/purchase_order",
          label: <Link to="/product/purchase_order">발주관리</Link>,
        },
      ],
    },
    {
      key: "post",
      icon: React.createElement(ReadOutlined),
      label: "게시판",
      children: [
        {
          key: "/post/notification",
          label: <Link to="/post/notification">공지사항</Link>,
        },
        {
          key: "/post/inquiry",
          label: <Link to="/post/inquiry">게시판</Link>,
        },
        {
          key: "/provider/post",
          label: <Link to="/provider/post">가맹점 신청</Link>,
        },
      ],
    },
    {
      key: "provider",
      icon: React.createElement(TeamOutlined),
      label: "거래처관리",
      children: [
        {
          key: "/provider/provider",
          label: <Link to="/provider/provider">거래처관리</Link>,
        },
      ],
    },
    {
      key: "branch",
      icon: React.createElement(ShopOutlined),
      label: "지점관리",
      children: [
        {
          key: "/branch/branch",
          label: <Link to="/branch/branch">지점관리</Link>,
        },
      ],
    },
    {
      key: "admin",
      icon: React.createElement(SolutionOutlined),
      label: "관리자 설정",
      children: [
        {
          key: "/admin/account",
          label: <Link to="/admin/account">계정관리</Link>,
        },
        {
          key: "homepage",
          label: "홈페이지관리",
          children: [
            {
              key: "/admin/spot",
              label: <Link to="/admin/spot">설치지점관리</Link>,
            },
          ],
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
  ];

  return (
    <Router>
      {/* 모달을 통한 알림 상세 내용 표시 */}
      <Modal
        title={selectedAlarm?.alarm_title}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        closable={false} // X 버튼을 없애기 위해 추가
      >
        <p>
          <strong>내용:</strong> {selectedAlarm?.alarm_content}
        </p>
        <p>
          <strong>지점 PK:</strong> {selectedAlarm?.branch_pk}
        </p>
        <p>
          <strong>주문 PK:</strong> {selectedAlarm?.order_pk}
        </p>
        <p>
          <strong>생성 시간:</strong>{" "}
          {selectedAlarm
            ? new Date(selectedAlarm.created_at).toLocaleString()
            : ""}
        </p>
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
          <div
            style={{
              float: "left",
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
            }}
            onClick={() => {
              window.location.href = "/admin";
            }}
          >
            Redswitch
          </div>
          <Space size={50}>
            <div style={{ color: "white" }}>{currentUser.user_id}</div>
            <Space size={"large"}>
              {isLoggedIn ? (
                <Space>
                  <Button onClick={handleLogout}>Logout</Button>
                </Space>
              ) : (
                <LoginForm
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
              <Space style={{ marginTop: "5px" }}>
                <Popover
                  overlayStyle={{ width: 400 }}
                  placement="bottomRight"
                  title={
                    <Typography.Text
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                    >
                      알림
                    </Typography.Text>
                  }
                  content={
                    <Tabs defaultActiveKey="1" centered>
                      <TabPane tab="공지사항" key="1">
                        <List
                          dataSource={duminotifications}
                          renderItem={(item) => (
                            <List.Item>
                              <Row
                                style={{
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                                gutter={6}
                              >
                                <Col>{`${item.id}. ${item.message}`}</Col>
                                <Button
                                  style={{ border: "none" }}
                                  icon={<CloseOutlined />}
                                />
                              </Row>
                            </List.Item>
                          )}
                        />
                      </TabPane>
                      <TabPane tab="주문" key="2">
                        <List
                          dataSource={dumiorders}
                          renderItem={(item) => (
                            <List.Item>
                              <Row
                                style={{
                                  width: "100%",

                                  justifyContent: "space-between",
                                }}
                                gutter={6}
                              >
                                <Col>{`${item.id}. ${item.message}`}</Col>
                                <Button
                                  style={{ border: "none" }}
                                  icon={<CloseOutlined />}
                                />
                              </Row>
                            </List.Item>
                          )}
                        />
                      </TabPane>
                    </Tabs>
                  }
                  trigger="click"
                >
                  <Badge count={5} size="small">
                    <NotificationOutlined
                      style={{
                        fontSize: "20px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    />
                  </Badge>
                </Popover>
              </Space>
              {/* <Switch checked={isDarkMode} onChange={toggleTheme} /> */}
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
              items={items}
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
              {/* 페이지 라우팅 */}
              <Routes>
                <Route path="/admin" element={<Main />} />
                <Route path="/admin/account" element={<Account />} />
                <Route path="/admin/spot" element={<Spot />} />

                <Route path="/branch/branch" element={<Branch />} />

                <Route path="/provider/provider" element={<Provider />} />
                <Route path="/provider/post" element={<FranchisePost />} />

                <Route path="/bdsm/questions" element={<BDSMQuestions />} />
                <Route path="/bdsm/results" element={<BDSMResults />} />
                <Route path="/bdsm/advertise" element={<BDSMAdvertise />} />
                <Route path="/bdsm/trend" element={<BDSMStatistics />} />

                <Route path="/product/material" element={<Material />} />
                <Route path="/product/product" element={<Product />} />
                <Route path="/product/inventory" element={<Inventory />} />
                <Route
                  path="/product/purchase_order"
                  element={<Purchase_order />}
                />

                <Route path="/order" element={<Order />} />

                <Route path="/post/notification" element={<NoticeBoard />} />
                <Route path="/post/inquiry" element={<InquiryBoard />} />

                <Route path="/sales/sales" element={<PaymentSummary />} />
                <Route
                  path="/sales/branch"
                  element={<PaymentSummaryByBranch />}
                />
              </Routes>
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
