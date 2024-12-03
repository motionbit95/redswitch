import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import { useMediaQuery } from "react-responsive";
import { UpOutlined, LeftOutlined } from "@ant-design/icons";
import axios from "axios";

const CenteredForm = (props) => {
  const { size } = props;
  const [open, setOpen] = useState(false);

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
    <>
      <div
        style={{
          position: "fixed",
          bottom: size === "mobile" ? 0 : "50%",
          right: 0,
          zIndex: 999,
          backgroundColor: "#333333",
          width: size === "mobile" ? "100%" : "50px",
          height: size === "mobile" ? "40px" : "200px",
          textAlign: "center",
          display: "flex",
          flexDirection: size === "mobile" ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
          borderRadius: size === "mobile" ? 0 : "8px",
          color: "white",
          cursor: "pointer",
        }}
      >
        {size === "mobile" ? (
          <>
            <UpOutlined style={{ fontSize: "18px", marginRight: "8px" }} />
            <div>가맹점 신청하기</div>
          </>
        ) : (
          <>
            <LeftOutlined style={{ fontSize: "24px", marginBottom: "8px" }} />
            <div
              style={{
                writingMode: "vertical-rl",
              }}
            >
              가맹점 신청하기
            </div>
          </>
        )}
      </div>

      <Modal open={open} onCancel={() => setOpen(false)} width={500} centered>
        <Form
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onBlur"
          style={{ gap: size ? "8px" : "16px" }} // 모바일에서 Form.Item 간 간격 조절
        >
          <Row gutter={size ? 8 : 16}>
            <Col span={12}>
              <Form.Item
                name="franchise_name"
                rules={[
                  { required: true, message: "가맹점명을 입력해주세요." },
                ]}
                style={{ marginBottom: size ? "8px" : "16px" }}
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
                style={{ marginBottom: size ? "8px" : "16px" }}
              >
                <Input placeholder="담당자 이름" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={size ? 8 : 16}>
            <Col span={12}>
              <Form.Item
                name="franchise_manager_phone"
                rules={[
                  {
                    required: true,
                    message: "담당자 전화번호를 입력해주세요.",
                  },
                ]}
                style={{ marginBottom: size ? "8px" : "16px" }}
              >
                <Input placeholder="담당자 전화번호" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="franchise_manager_email"
                rules={[
                  {
                    required: true,
                    message: "담당자 이메일을 입력해주세요.",
                  },
                  {
                    type: "email",
                    message: "이메일 형식이 올바르지 않습니다.",
                  },
                ]}
                style={{ marginBottom: size ? "8px" : "16px" }}
              >
                <Input placeholder="담당자 이메일" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="franchise_address"
            rules={[{ required: true, message: "가맹점 주소를 입력해주세요." }]}
            style={{ marginBottom: size ? "8px" : "16px" }}
          >
            <Input placeholder="가맹점 주소" />
          </Form.Item>

          <Form.Item
            name="franchise_room_cnt"
            rules={[{ required: true, message: "객실 수를 입력해주세요." }]}
            style={{ marginBottom: size ? "8px" : "16px" }}
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
      </Modal>
    </>
  );
};

export default CenteredForm;
