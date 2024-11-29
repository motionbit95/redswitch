import React from "react";
import { Form, Input, Button, InputNumber, Row, Col, message } from "antd";
import { useMediaQuery } from "react-responsive";
import axios from "axios";

const CenteredForm = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      // 서버로 POST 요청
      const response = await axios.post(
        "http://localhost:8080/posts/franchises",
        values
      );
      console.log("Response:", response.data);

      message.success("신청이 성공적으로 완료되었습니다!");
    } catch (error) {
      console.error("Error:", error);
      message.error("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className="page"
      style={{
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: isMobile ? "16px" : "24px", // 모바일에서 패딩을 줄임
          borderRadius: "8px",
          backgroundColor: "#121212",
          color: "#fff",
          zIndex: 99,
          marginBottom: isMobile ? "96px" : "64px",
        }}
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onBlur"
          style={{ gap: isMobile ? "8px" : "16px" }} // 모바일에서 Form.Item 간 간격 조절
        >
          <Row gutter={isMobile ? 8 : 16}>
            <Col span={12}>
              <Form.Item
                name="franchise_name"
                rules={[
                  { required: true, message: "가맹점명을 입력해주세요." },
                ]}
                style={{ marginBottom: isMobile ? "8px" : "16px" }}
              >
                <Input placeholder="가맹점명" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="franchise_manager"
                rules={[
                  { required: true, message: "담당자 이름을 입력해주세요." },
                ]}
                style={{ marginBottom: isMobile ? "8px" : "16px" }}
              >
                <Input placeholder="담당자 이름" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={isMobile ? 8 : 16}>
            <Col span={12}>
              <Form.Item
                name="franchise_manager_phone"
                rules={[
                  { required: true, message: "담당자 연락처를 입력해주세요." },
                ]}
                style={{ marginBottom: isMobile ? "8px" : "16px" }}
              >
                <Input placeholder="담당자 연락처" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="franchise_manager_email"
                rules={[
                  { required: true, message: "담당자 이메일을 입력해주세요." },
                  {
                    type: "email",
                    message: "이메일 형식이 올바르지 않습니다.",
                  },
                ]}
                style={{ marginBottom: isMobile ? "8px" : "16px" }}
              >
                <Input placeholder="담당자 이메일" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="franchise_address"
            rules={[{ required: true, message: "가맹점 주소를 입력해주세요." }]}
            style={{ marginBottom: isMobile ? "8px" : "16px" }}
          >
            <Input placeholder="가맹점 주소" />
          </Form.Item>

          <Form.Item
            name="franchise_room_cnt"
            rules={[{ required: true, message: "객실 수를 입력해주세요." }]}
            style={{ marginBottom: isMobile ? "8px" : "16px" }}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              placeholder="객실 수"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" danger htmlType="submit" block>
              신청하기
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CenteredForm;
