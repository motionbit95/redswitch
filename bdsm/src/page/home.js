import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { useMediaQuery } from "react-responsive";
import AdCarousel from "../component/advertise";
import { useNavigate } from "react-router-dom";

const App = (props) => {
  const { theme, setPage } = props;
  const navigate = useNavigate();

  // Media queries
  const isSmallScreen = useMediaQuery({ maxWidth: 769 });
  const isMediumScreen = useMediaQuery({ minWidth: 769, maxWidth: 1200 });
  const isLargeScreen = useMediaQuery({ minWidth: 1201 });

  const [isAgree, setIsAgree] = useState(false);

  const size = isSmallScreen ? "small" : isMediumScreen ? "medium" : "large";

  const formItemLayout = {
    labelAlign: "left",
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { form } = Form.useForm();

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  // 테스트 링크 공유 버튼
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("URL copied to clipboard!");
        message.success("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
  };

  const onFinish = (values) => {
    navigate("/test", { state: { user_info: values } });
  };

  return (
    <div style={{ overflowX: "hidden", minHeight: "100vh" }}>
      <AdCarousel />
      <Space direction={size === "small" ? "vertical" : "horizontal"}>
        <Row>
          <Col
            span={size === "small" ? 24 : 12}
            className={`container-${size}`}
            style={{
              textAlign: "center",
              backgroundColor: theme === "dark" ? "black" : "#f1f1f1",
            }}
          >
            <Typography.Title
              level={1}
              className={`text-point`}
              style={{
                textShadow:
                  theme === "dark"
                    ? "1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff"
                    : "1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
              }}
            >
              BDSM TEST
            </Typography.Title>
            <Typography.Paragraph className={`title-small`}>
              나의 SEX MBTI는 무엇일까?
            </Typography.Paragraph>
            <Image
              src={require(`../assets/bdsm-${theme}.png`)}
              preview={false}
            />
          </Col>
          <Col
            span={size === "small" ? 24 : 12}
            className={`container-${size}`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Form
                {...formItemLayout}
                form={form}
                onFinish={onFinish}
                requiredMark={false}
              >
                <Form.Item
                  name={"gender"}
                  rules={[
                    {
                      required: true,
                      message: "성별을 선택해주세요!",
                    },
                  ]}
                  label={
                    <Typography.Text
                      className="text-medium"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      성별
                    </Typography.Text>
                  }
                >
                  <Select size="large" defaultValue="-----선택-----">
                    <Select.Option value="남자">남자</Select.Option>
                    <Select.Option value="여자">여자</Select.Option>
                    <Select.Option value="트랜스젠더(MTF)">
                      트랜스젠더(MTF)
                    </Select.Option>
                    <Select.Option value="트랜스젠더(FTM)">
                      트랜스젠더(FTM)
                    </Select.Option>
                    <Select.Option value="기타">기타</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={"age"}
                  rules={[
                    {
                      required: true,
                      message: "연령을 선택해주세요!",
                    },
                  ]}
                  label={
                    <Typography.Text
                      className="text-medium"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      연령
                    </Typography.Text>
                  }
                >
                  <Select size="large" defaultValue="-----선택-----">
                    <Select.Option value="~19">19세 이하</Select.Option>
                    <Select.Option value="20~22">20세~22세</Select.Option>
                    <Select.Option value="23~26">23세~26세</Select.Option>
                    <Select.Option value="27~29">27세~29세</Select.Option>
                    <Select.Option value="30~32">30세~32세</Select.Option>
                    <Select.Option value="33~36">33세~36세</Select.Option>
                    <Select.Option value="37~39">37세~39세</Select.Option>
                    <Select.Option value="40~45">40세~45세</Select.Option>
                    <Select.Option value="46~49">46세~49세</Select.Option>
                    <Select.Option value="50~">50세 이상</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={"sexual_preferance"}
                  rules={[
                    {
                      required: true,
                      message: "성적취향을 선택해주세요!",
                    },
                  ]}
                  label={
                    <Typography.Text
                      className="text-medium"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      성적취향
                    </Typography.Text>
                  }
                >
                  <Select size="large" defaultValue="-----선택-----">
                    <Select.Option value="이성애자">이성애자</Select.Option>
                    <Select.Option value="동성애자">동성애자</Select.Option>
                    <Select.Option value="양성애자">양성애자</Select.Option>
                    <Select.Option value="기타">기타</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={"isAgree"}
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: "이용약관 동의을 확인해주세요!",
                    },
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("이용약관 동의을 확인해주세요!")
                            ),
                    },
                  ]}
                >
                  <Checkbox
                    // value={isAgree}
                    checked={isAgree}
                    onClick={showModal}
                    onChange={(e) => setIsAgree(e.target.checked)}
                  >
                    이용약관 동의(필수)
                  </Checkbox>
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Button
                      size="large"
                      type="primary"
                      style={{ width: "100%" }}
                      htmlType="submit"
                    >
                      🔥 BDSM 테스트하러 가기
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Button
                      size="large"
                      style={{ width: "100%" }}
                      onClick={() => {
                        navigate("/view");
                      }}
                    >
                      ⛓️ BDSM 성향모두보기
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
            <div style={{ paddingBlock: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Button size="large" style={{ width: "100%" }}>
                    설치지점찾기
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    danger
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={() => {
                      window.open("https://redswitch.kr");
                    }}
                  >
                    레드스위치 바로가기
                  </Button>
                </Col>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Button
                    size="large"
                    type="link"
                    onClick={handleShare}
                    style={{
                      color: theme === "dark" ? "#ddd" : "#111",
                    }}
                  >
                    🔗 테스트링크공유하기
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Space>

      <Modal
        title={
          <Typography.Title className="title-small">약관동의</Typography.Title>
        }
        // visible={isModalVisible}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            닫기
          </Button>,
        ]}
      >
        <ul>
          <Space direction="vertical" size={16}>
            <li>
              <Typography.Text
                className="text-medium"
                style={{ textWrap: "wrap" }}
              >
                이 테스트는 성적 행위를 노골적으로 묘사하는 문항을 포함하고
                있습니다. 이러한 표현에 모멸감이나 혐오감을 느끼는 분들의 이용은
                권장하지 않습니다.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text
                className="text-medium"
                style={{ textWrap: "wrap" }}
              >
                이 테스트의 모든 질문은 당사자 간의 완벽한 합의를 바탕으로,
                절대적으로 안전하다는 가정 하에 작성되었습니다.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text
                className="text-medium"
                style={{ textWrap: "wrap" }}
              >
                이 테스트의 결과는 개발자의 주관적인 의견이 반영되어 있습니다.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text
                className="text-medium"
                style={{ textWrap: "wrap" }}
              >
                테스트 결과에 대해서는 어떠한 의미 부여도 하지 마시고, 반드시
                개인적인 참고 용도로만 사용하시기 바랍니다.
              </Typography.Text>
            </li>
            <li>
              <Typography.Text
                className="text-medium"
                style={{ textWrap: "wrap" }}
              >
                이 테스트를 참고하거나 활용하여 발생한 문제에 대한 책임은 모두
                테스트를 이용한 당사자에게 있습니다.
              </Typography.Text>
            </li>
          </Space>
        </ul>
      </Modal>

      <div className={`container-${size} section-${theme}`}>
        <Typography.Title level={1} className={`title-${size}`}>
          당신의 BDSM 유형을 알아보세요
        </Typography.Title>
        <Typography.Paragraph className={`text-${size}`}>
          테스트는 100% 무료이며 익명으로 귀하의 정보가 필요하지 않습니다.
        </Typography.Paragraph>
        <Button size="large" type="primary" onClick={() => navigate("/test")}>
          🔥 BDSM 테스트하러 가기
        </Button>
      </div>
      <AdCarousel />
    </div>
  );
};

export default App;
