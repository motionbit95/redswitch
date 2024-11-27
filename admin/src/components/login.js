import React, { useState } from "react";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosPost } from "../api";
const LoginForm = ({ setIsLoggedIn }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [modalOpen, setModalOpen] = useState(false);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);

    try {
      const response = await AxiosPost("/accounts/login", {
        user_id: values.user_id,
        user_password: values.password,
      });
      if (response.status === 200) {
        message.success("로그인 성공");
        setIsLoggedIn(true);
        setModalOpen(false);
        navigate("/admin");
      } else if (response.status === 404) {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("로그인 실패");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalOpen(true)}>
        Login
      </Button>
      <Modal
        title={
          <Typography.Title
            level={2}
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            레드스위치 관리자포탈
          </Typography.Title>
        }
        open={modalOpen}
        centered
        maskClosable={false}
        footer={null}
        onCancel={() => setModalOpen(false)}
      >
        <Form
          form={form}
          name="login"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
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
      </Modal>
    </>
  );
};
export default LoginForm;
