import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ReadOutlined,
  DollarOutlined,
  InboxOutlined,
  TruckOutlined,
  ShopOutlined,
  TeamOutlined,
  SolutionOutlined,
  NotificationOutlined,
  CloseOutlined,
  HomeOutlined,
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
  Popconfirm,
  Image,
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
import { AxiosGet, AxiosPut } from "./api";
import useFirebase from "./hook/useFilrebase";
import Spot from "./pages/admin/spot";
import soundFile from "./assets/VoicesAI_1724058982121.mp3";
import TabPane from "antd/es/tabs/TabPane";
import PaymentSummary from "./pages/sales/salse";
import PaymentSummaryByBranch from "./pages/sales/branch";
import NoticeList from "./components/list/notice";
import { use } from "react";
import { Descriptions, Tag } from "antd/lib";

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

  const defaultOpenKeys = window.location.pathname.split("/")[1] || "dashboard";
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
  const [openPopover, setOpenPopover] = useState(false);

  // redirect
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      if (window.location.pathname === "/") {
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

  const [isFirstLoad, setIsFirstLoad] = useState(true); // 첫 로드 여부
  const [shouldCheckAlarms, setShouldCheckAlarms] = useState(false); // 특정 함수 이후에 알림 확인 여부

  const isEffectExecuted = useRef(false); // useEffect 중복 실행 방지

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
      key: "/dashboard",
      icon: React.createElement(HomeOutlined),
      label: <Link to="/dashboard">홈</Link>,
    },
    {
      key: "sales",
      icon: React.createElement(DollarOutlined),
      label: "매출관리",
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
      key: "/order",
      icon: React.createElement(TruckOutlined),
      label: <Link to="/order">주문관리</Link>,
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
      label: <Link to="/provider/provider">거래처관리</Link>,
    },
    {
      key: "branch",
      icon: React.createElement(ShopOutlined),
      label: <Link to="/branch/branch">지점관리</Link>,
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
  ];

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
          <div
            style={{
              float: "left",
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
            }}
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Redswitch
          </div>
          <Space size={50}>
            <div style={{ color: "white" }}>{currentUser.user_id} 님</div>
            <Space size={"large"}>
              {isLoggedIn ? (
                <Space>
                  <Button onClick={handleLogout}>로그아웃</Button>
                </Space>
              ) : (
                <LoginForm
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )}
              <Space style={{ marginTop: "5px" }}>
                <Popover
                  open={openPopover}
                  overlayStyle={{ width: 400 }}
                  placement="bottomRight"
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Text
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        알림
                      </Typography.Text>
                      <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setOpenPopover(false)}
                      />
                    </div>
                  }
                  content={
                    <Tabs defaultActiveKey="1" centered>
                      <TabPane tab="공지사항" key="1">
                        <NoticeList />
                        {/* <List
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
                        /> */}
                      </TabPane>
                      <TabPane tab="주문" key="2">
                        <List
                          dataSource={alarms.slice(0, 5)}
                          renderItem={(item) => (
                            <List.Item
                              onClick={() => handleAlarmClick(item)}
                              style={{
                                backgroundColor:
                                  item.alarm_status === 0
                                    ? "lightred"
                                    : "white",
                              }}
                            >
                              <Row
                                style={{
                                  width: "100%",

                                  justifyContent: "space-between",
                                }}
                                gutter={6}
                              >
                                <Col span={16}>
                                  <div style={{ fontWeight: "bold" }}>
                                    {item.alarm_title}
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", opacity: "0.7" }}
                                  >
                                    {item.alarm_content}
                                  </div>
                                </Col>
                                <Col span={8} style={{ textAlign: "right" }}>
                                  <Space>
                                    <div style={{ opacity: "0.7" }}>
                                      {new Date(
                                        item.created_at
                                      ).toLocaleTimeString()}
                                    </div>
                                    {/* <Button
                                      style={{ border: "none" }}
                                      icon={<CloseOutlined />}
                                    /> */}
                                  </Space>
                                </Col>
                              </Row>
                            </List.Item>
                          )}
                        />
                      </TabPane>
                    </Tabs>
                  }
                  trigger="click"
                >
                  <Badge
                    count={5}
                    size="small"
                    onClick={() => setOpenPopover(true)}
                  >
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
                <Route
                  path="/dashboard"
                  element={<Main currentUser={currentUser} />}
                />
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
                <Route
                  path="/product/product"
                  element={<Product currentUser={currentUser} />}
                />
                <Route
                  path="/product/inventory"
                  element={<Inventory currentUser={currentUser} />}
                />
                <Route
                  path="/product/purchase_order"
                  element={<Purchase_order />}
                />

                <Route
                  path="/order"
                  element={<Order currentUser={currentUser} />}
                />

                <Route
                  path="/post/notification"
                  element={<NoticeBoard currentUser={currentUser} />}
                />
                <Route
                  path="/post/inquiry"
                  element={<InquiryBoard currentUser={currentUser} />}
                />

                <Route
                  path="/sales/sales"
                  element={<PaymentSummary currentUser={currentUser} />}
                />
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

const OrderDetail = ({ selectedAlarm }) => {
  const [order, setOrder] = useState();
  const [branch, setBranch] = useState();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await AxiosGet("/orders/" + selectedAlarm.order_pk);
        const order = response.data;
        console.log(order);
        setOrder(order);

        let res = await AxiosGet("/branches/" + order.branch_pk);
        const branch = res.data;
        setBranch(branch);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrder();
  }, []);

  return (
    <Descriptions title={""} bordered column={2}>
      <Descriptions.Item span={2} label="주문내용">
        {selectedAlarm?.alarm_content}
      </Descriptions.Item>
      <Descriptions.Item label="주문지점">
        {branch?.branch_name}
      </Descriptions.Item>
      <Descriptions.Item span={2} label="주문번호">
        {order?.order_code}
      </Descriptions.Item>
      <Descriptions.Item label="주문일시">
        {order?.created_at ? new Date(order?.created_at).toLocaleString() : ""}
      </Descriptions.Item>
      <Descriptions.Item label="주문금액">
        {order?.order_amount.toLocaleString()}원
      </Descriptions.Item>
      {/* <Descriptions.Item span={2} label="주문상태">
        <Tag>
          {order?.order_status === 0
            ? "결제대기"
            : order?.order_status === 1
            ? "결제완료"
            : "주문취소"}
        </Tag>
      </Descriptions.Item> */}
      <Descriptions.Item span={2} label="주문상세">
        {order?.select_products?.map((product, index) => (
          <Space>
            <Image
              src={product.blurred_image || "https://via.placeholder.com/120"}
              alt={product.product_name}
              width={60}
              height={60}
            />
            <div key={index}>
              <div>{product.product_name}</div>
              {product.option?.map((option, index) => (
                <div key={index}>
                  {option.optionName} : {option.optionValue}
                </div>
              ))}
              <div style={{ opacity: "0.5", fontSize: "small" }}>
                {parseInt(product.amount).toLocaleString("ko-KR")}원 |{" "}
                {product.count}개
              </div>
            </div>
          </Space>
        ))}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default App;
