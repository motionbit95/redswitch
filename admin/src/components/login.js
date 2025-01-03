import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Flex,
  Row,
  Col,
  Modal,
  theme,
  message,
  Typography,
  Drawer,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosPost } from "../api";
const LoginForm = ({ isLoggedIn, setIsLoggedIn }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setOpen(true);
    }
  }, [isLoggedIn]);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    try {
      const response = await AxiosPost("/accounts/login", {
        user_id: values.user_id,
        user_password: values.password,
      });
      if (response.status === 200) {
        const { token, id } = response.data;

        console.log(token, id);

        // 토큰과 아이디를 localStorage에 저장
        localStorage.setItem("authToken", token);
        localStorage.setItem("id", id);

        message.success("로그인 성공");
        setIsLoggedIn(true);
        setOpen(false);
        navigate("/dashboard"); // 로그인 성공 후 대시보드(홈)으로 이동
      } else if (response.status === 404) {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("로그인 실패");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Login
      </Button>
      <Drawer
        width={"100%"}
        height="100vh"
        motion={false}
        bodyStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
        open={open}
        footer={null}
        onClose={() => setOpen(false)}
        closeIcon={null}
        placement="left"
      >
        <Typography.Title
          level={2}
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          레드스위치 관리자포탈
        </Typography.Title>
        <Form
          form={form}
          name="login"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 400,
            margin: "40px auto",
          }}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="user_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your User ID!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="아이디"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="비밀번호"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button block type="primary" htmlType="submit" size="large">
                  로그인
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default LoginForm;
