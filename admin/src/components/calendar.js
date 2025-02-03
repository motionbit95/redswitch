import {
  Calendar,
  ConfigProvider,
  Space,
  Typography,
  Tag,
  Button,
  Tooltip,
  Drawer,
  Form,
  Popconfirm,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  message,
  Modal,
  Card,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import locale from "antd/lib/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { AxiosDelete, AxiosGet, AxiosPost } from "../api";

dayjs.locale("ko");

/**
 * 일정 추가 Drawer 컴포넌트
 */
const AddDrawer = ({ form, visible, onClose, onFinish }) => {
  const { TextArea } = Input;
  return (
    <Drawer
      title="일정등록"
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      extra={
        <Space>
          <Popconfirm
            title="일정을 등록하시겠습니까?"
            onConfirm={() => form.submit()}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">등록</Button>
          </Popconfirm>
        </Space>
      }
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={8}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="type" label="키워드 색상">
              <Select>
                <Select.Option value="green">녹색</Select.Option>
                <Select.Option value="yellow">노랑색</Select.Option>
                <Select.Option value="red">빨간색</Select.Option>
                <Select.Option value="blue">파란색</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="content" label="내용">
          <TextArea />
        </Form.Item>
        <Row gutter={16}>
          <Col>
            <Form.Item
              name="start_date"
              label="시작일"
              rules={[{ required: true, message: "시작일을 선택해주세요." }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="end_date"
              label="종료일"
              rules={[{ required: true, message: "종료일을 선택해주세요." }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

/**
 * 일정 상세 Modal 컴포넌트
 */
const DetailModal = ({ open, onClose, data, currentUser, onDelete }) => {
  return (
    <Modal
      title="상세 보기"
      open={open}
      width={700}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} style={{ borderRadius: "8px" }}>
          닫기
        </Button>,
      ]}
    >
      {/* 여기 부분 이쁘게 꾸며줘! data는 일정 배열로 들어옴 */}
      {/* <div>{JSON.stringify(data, null, 2)}</div> */}
      <Space size={"large"} direction="vertical" style={{ width: "100%" }}>
        {data.map((item, index) => (
          <Card key={index}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {item.title}
                </Typography.Title>
                <Typography.Text style={{ color: "#888" }}>
                  {`등록일 : ${dayjs(item.createdAt).format("YYYY-MM-DD")}`}
                </Typography.Text>
              </Space>
              <Typography.Text style={{ color: "#888" }}>
                {dayjs(item.start_date).format("YYYY-MM-DD")} ~{" "}
                {dayjs(item.end_date).format("YYYY-MM-DD")}
              </Typography.Text>
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  minHeight: "100px",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                <Typography.Text>{item.content}</Typography.Text>
              </div>
              {currentUser?.permission === "1" && (
                <Popconfirm
                  title="삭제하시겠습니까?"
                  onConfirm={() => {
                    onDelete(item.id);
                  }}
                >
                  <Button danger>삭제</Button>
                </Popconfirm>
              )}
            </Space>
          </Card>
        ))}
      </Space>
    </Modal>
  );
};

/**
 * RCalendar 컴포넌트
 */
const RCalendar = ({ setDateRange, currentUser }) => {
  const [calendars, setCalendars] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [form] = Form.useForm();

  const fetchPlans = useCallback(async () => {
    try {
      const response = await AxiosGet("/posts/calendars");
      setCalendars(response.data);
    } catch (error) {
      console.error("일정 리스트 가져오기 오류:", error);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const dateCellRender = useCallback(
    (date) => {
      const matchingData = calendars.filter((item) => {
        const startDate = dayjs(item.start_date);
        const endDate = dayjs(item.end_date);
        return date.isBetween(startDate, endDate, "day", "[]");
      });

      return matchingData.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {matchingData.map((item, index) => (
            <Tooltip key={index} title={item.title}>
              <Tag
                color={item.type || "gray"}
                style={{
                  textAlign: "center",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px",
                  margin: 0,
                }}
              >
                {item.title}
              </Tag>
            </Tooltip>
          ))}
        </div>
      ) : null;
    },
    [calendars]
  );

  const handleSelectDate = (date) => {
    const matchingData = calendars.filter((item) => {
      const startDate = dayjs(item.start_date);
      const endDate = dayjs(item.end_date);
      return date.isBetween(startDate, endDate, "day", "[]");
    });

    if (matchingData.length) {
      setModalData(matchingData);
      setModalOpen(true);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await AxiosPost("/posts/calendars", values);
      if (response.status === 200) {
        console.log(response);
        message.success("일정등록 성공");
        fetchPlans(); // 일정 등록 후 리스트 갱신
      }
    } catch (error) {
      console.error("일정등록 오류:", error);
    } finally {
      setVisible(false);
      form.resetFields();
    }
  };

  const onDelete = async (id) => {
    console.log(id);
    await AxiosDelete(`/posts/calendars/${id}`)
      .then(() => {
        message.success("일정 삭제 성공");
        fetchPlans();
        setModalOpen(false);
      })
      .catch((error) => {
        console.error("일정 삭제 오류:", error);
      });
  };

  return (
    <ConfigProvider locale={locale}>
      {currentUser?.permission === "1" && (
        <Button
          style={{ position: "absolute", left: 8, top: 12 }}
          onClick={() => setVisible(true)}
        >
          일정등록
        </Button>
      )}

      <Calendar cellRender={dateCellRender} onSelect={handleSelectDate} />

      <AddDrawer
        form={form}
        visible={visible}
        onClose={() => setVisible(false)}
        onFinish={onFinish}
      />

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
        currentUser={currentUser}
        onDelete={onDelete}
      />
    </ConfigProvider>
  );
};

export default RCalendar;
