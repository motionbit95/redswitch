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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 44,
              fontFamily: "revert",
              padding: "0 0 20px 0",
            }}
          >
            Login
          </div>
        }
        width={440}
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
            minWidth: 300,
            minHeight: 270,
            alignContent: "center",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="user_id"
            rules={[
              {
                required: true,
                message: "Please input your User ID!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="ID" />
          </Form.Item>
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
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Row gutter={8} justify={"center"}>
              <Col span={12}>
                <Button block type="primary" htmlType="submit">
                  Login
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default LoginForm;
