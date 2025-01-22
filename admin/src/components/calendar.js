import {
  Calendar,
  ConfigProvider,
  Space,
  Typography,
  Badge,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import locale from "antd/lib/locale/ko_KR"; // 한국어 로케일 설정
import dayjs from "dayjs";
import "dayjs/locale/ko"; // dayjs 한국어 설정
import { AxiosGet } from "../api";

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
const RCalendar = ({ setDateRange }) => {
  const [groupedPayments, setGroupedPayments] = useState({}); // 날짜별 그룹화된 결제 데이터
  const [selectedDate, setSelectedDate] = useState(dayjs()); // 선택된 날짜 (기본값: 오늘)

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
      { date: "2025-01-22", text: "중요 일정", type: "warning" },
      { date: "2025-01-25", text: "회의 예정", type: "success" },
    ];

    // 현재 셀의 날짜와 customData의 날짜를 비교
    const matchingData = customData.find(
      (item) => item.date === date.format("YYYY-MM-DD")
    );

    return matchingData ? (
      <div>
        <Badge status={matchingData.type} text={matchingData.text} />
      </div>
    ) : null;
  };

  return (
    <ConfigProvider locale={locale}>
      <Calendar
        // dateCellRender={dateCellRender} // 날짜 셀 커스텀 렌더링
        onSelect={setSelectedDate} // 날짜 선택 이벤트 핸들러
      />
    </ConfigProvider>
  );
};

export default RCalendar;
