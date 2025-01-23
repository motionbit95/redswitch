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
} from "antd";
import React, { useEffect, useState } from "react";
import locale from "antd/lib/locale/ko_KR"; // 한국어 로케일 설정
import dayjs from "dayjs";
import "dayjs/locale/ko"; // dayjs 한국어 설정
import { AxiosGet, AxiosPost } from "../api";

dayjs.locale("ko");

/**
 * 특정 날짜의 결제 데이터를 가공하여 표시할 데이터를 반환합니다.
 * @param {dayjs.Dayjs} value - 날짜 값
 * @param {Object} rawData - 결제 데이터 객체 (날짜별 그룹화)
 * @returns {Array} 리스트 데이터 배열
 */
const getListData = (value, rawData) => {
  const dateKey = value.format("YYYY-MM-DD"); // 날짜 키 생성
  const records = rawData[dateKey] || []; // 해당 날짜의 데이터 가져오기

  let totalPayment = 0; // 총 결제 금액
  let totalRefund = 0; // 총 환불 금액

  records.forEach((record) => {
    const amount = parseFloat(record.goodsAmt || "0");
    if (record.cancelYN === "N") {
      totalPayment += amount; // 결제 금액 합산
    } else if (record.cancelYN === "Y") {
      totalRefund += amount; // 환불 금액 합산
    }
  });

  return [{ type: "success", content: `${totalPayment}원` }]; // 가공된 데이터 반환
};

/**
 * 결제 데이터를 날짜별로 그룹화하는 함수
 * @param {Array} payments - 결제 데이터 배열
 * @returns {Object} 날짜별로 그룹화된 결제 데이터 객체
 */
const groupPaymentsByDate = (payments) => {
  return payments.reduce((acc, payment) => {
    const date = dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(payment);
    return acc;
  }, {});
};

/**
 * RCalendar 컴포넌트: 결제 데이터를 기반으로 캘린더를 렌더링합니다.
 * @param {Object} props - 컴포넌트 속성
 * @param {Function} props.setDateRange - 날짜 범위 설정 함수
 */
const RCalendar = ({ setDateRange, currentUser }) => {
  const [groupedPayments, setGroupedPayments] = useState({}); // 날짜별 그룹화된 결제 데이터
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 선택된 날짜 (기본값: 오늘)
  const [visible, setVisible] = useState(false); // Drawer의 시퀀스
  const [calendars, setCalendars] = useState([]);
  const [form] = Form.useForm();

  // 결제 데이터를 API에서 불러옵니다.
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await AxiosGet("/payments");
        const payments = response.data;

        // 선택된 날짜 범위 내 데이터를 필터링
        const startDate = selectedDate.startOf("month");
        const endDate = selectedDate.endOf("month");

        const dateFilteredPayments = payments.filter((payment) => {
          const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
          return ediDate.isBetween(startDate, endDate, "day", "[]");
        });

        // 필터링된 데이터를 날짜별로 그룹화
        const grouped = groupPaymentsByDate(dateFilteredPayments);
        setGroupedPayments(grouped);
      } catch (error) {
        console.error("결제 데이터 가져오기 오류:", error);
      }
    };

    fetchPayment();
  }, [selectedDate]); // 선택된 날짜가 변경될 때마다 실행

  // 선택된 날짜 범위 업데이트
  useEffect(() => {
    setDateRange(selectedDate);
  }, [selectedDate, setDateRange]);

  useEffect(() => {
    AxiosGet("/posts/calendars")
      .then((response) => {
        console.log("response", response);
        setCalendars(response.data);
      })
      .catch((error) => {
        console.error("Error fetching calendars:", error);
        message.error("가져오기 실패");
      });
  }, []);

  // 캘린더의 날짜 셀을 커스텀 렌더링합니다.
  const cellRender = (value) => {
    const listData = getListData(value, groupedPayments);
    return (
      <Space direction="vertical">
        {listData.map(
          (item, index) =>
            parseInt(item.content) > 0 && (
              <Typography.Text key={index} style={{ fontSize: "10px" }}>
                {parseInt(item.content).toLocaleString()} 원
              </Typography.Text>
            )
        )}
      </Space>
    );
  };

  const dateCellRender = (date) => {
    // 특정 날짜에 문구를 추가
    const customData = [
      {
        start_date: "2025-01-20",
        end_date: "2025-01-22",
        title: "중요 일정",
        type: "processing",
      },
      {
        start_date: "2025-01-24",
        end_date: "2025-01-25",
        title: "회의 예정",
        type: "warning",
      },
      {
        start_date: "2025-01-22",
        end_date: "2025-01-25",
        title: "중복 일정",
        type: "success",
      },
    ];

    // 현재 셀의 날짜가 customData의 날짜 범위에 포함된 모든 항목 필터링
    const matchingData = customData.filter((item) => {
      const startDate = dayjs(item.start_date, "YYYY-MM-DD");
      const endDate = dayjs(item.end_date, "YYYY-MM-DD");
      return date.isBetween(startDate, endDate, "day", "[]"); // []는 경계 포함
    });

    // 매칭된 모든 데이터를 렌더링
    return matchingData.length ? (
      <div>
        {matchingData.map((item, index) => (
          <Tooltip key={index} title={item.title}>
            <div style={{ width: "100%" }}>
              <Tag
                color={item.type ? item.type : "gray"}
                style={{
                  width: "100%",
                  height: "14px",
                  margin: 0,
                }}
              />
            </div>
          </Tooltip>
        ))}
      </div>
    ) : null;
  };

  const onClose = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log(" onFinish ", values);
    try {
      const response = await AxiosPost("/posts/calendars", values);
      console.log("response", response);
      if (response.status === 201) {
        message.success("일정등록 성공");
      }
    } catch (error) {
      console.error("일정등록 오류:", error);
    } finally {
      onClose();
    }
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

      <Calendar
        dateCellRender={dateCellRender} // 날짜 셀 커스텀 렌더링
        onSelect={setSelectedDate} // 날짜 선택 이벤트 핸들러
      />

      <AddDrawer
        form={form}
        visible={visible}
        onClose={onClose}
        onFinish={onFinish}
      />
    </ConfigProvider>
  );
};

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
            onConfirm={() => {
              form.submit();
            }}
            onCancel={() => {}}
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
              rules={[
                {
                  required: true,
                  message: "제목을 입력해주세요.",
                },
              ]}
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
              rules={[
                {
                  required: true,
                  message: "시작일을 선택해주세요.",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="end_date"
              label="종료일"
              rules={[
                {
                  required: true,
                  message: "종료일을 선택해주세요.",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default RCalendar;
