import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Drawer,
  Typography,
  message,
  Row,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosPost } from "../api";

const LoginForm = ({ isLoggedIn, setIsLoggedIn }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) setOpen(true);
  }, [isLoggedIn]);

  const handleLogin = async (values) => {
    try {
      const { user_id, password } = values;
      console.log("values", values);
      AxiosPost("/accounts/login", {
        user_id,
        user_password: password,
      })
        .then((response) => {
          if (response.status === 200) {
            const { token, id } = response.data;
            localStorage.setItem("authToken", token);
            localStorage.setItem("id", id);
            message.success("로그인 성공");
            console.log(response.data);
            setIsLoggedIn(true);
            setOpen(false);
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          message.error(
            error.response?.data?.error || "로그인에 실패했습니다."
          );
        });
    } catch (error) {
      message.error(error.response?.data?.error || "로그인에 실패했습니다.");
    }
    // try {
    //   const response = await AxiosPost("/accounts/login", values);

    //   if (response.status === 200) {
    //     const { token, id } = response.data;
    //     localStorage.setItem("authToken", token);
    //     localStorage.setItem("id", id);

    //     message.success("로그인 성공");
    //     setIsLoggedIn(true);
    //     setOpen(false);
    //     window.location.href = "/dashboard";
    //   }
    // } catch (error) {
    //   message.error(error.response?.data?.error || "로그인에 실패했습니다.");
    // }
  };

  return (
    <>
      <Button type="text" onClick={() => setOpen(true)}>
        로그인
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width="100%"
        placement="left"
        bodyStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        closeIcon={null}
      >
        <Space direction="vertical" align="center" size="large">
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            레드스위치 관리자포탈
          </Typography.Title>
          <Form
            form={form}
            name="login"
            style={{ maxWidth: 400, width: "100%" }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="user_id"
              rules={[{ required: true, message: "아이디를 입력해주세요!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="아이디"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력해주세요!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="비밀번호"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                로그인
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Drawer>
    </>
  );
};

export default LoginForm;
