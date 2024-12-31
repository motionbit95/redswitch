import { Calendar, ConfigProvider, Space, Typography, Badge } from "antd";
import React, { useEffect, useState } from "react";
import locale from "antd/lib/locale/ko_KR"; // 우린 한국인이니까 ko_KR를 불러옵시다
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { AxiosGet } from "../api";
dayjs.locale("ko");

const getListData = (value, rawData) => {
  const dateKey = value.format("YYYY-MM-DD"); // value에서 날짜 키를 생성
  const records = rawData[dateKey] || []; // 해당 날짜의 데이터를 가져옴
  let totalPayment = 0; // 총 결제금액
  let totalRefund = 0; // 총 환불금액

  records.forEach((record) => {
    const amount = parseFloat(record.goodsAmt || "0");
    if (record.cancelYN === "N") {
      totalPayment += amount; // 결제된 금액 누적
    } else if (record.cancelYN === "Y") {
      totalRefund += amount; // 환불된 금액 누적
    }
  });

  // 리스트 데이터를 반환
  return [
    {
      type: "success",
      content: `${totalPayment}원`,
    },
  ];
};

const RCalendar = (props) => {
  const { setDateRange } = props;
  const [groupedPayments, setGroupedPayments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await AxiosGet("/payments");

        const payments = response.data;

        const startDate = selectedDate.startOf("month");
        const endDate = selectedDate.endOf("month");

        console.log(startDate, endDate);

        const dateFilteredPayments = payments.filter((payment) => {
          const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
          return (
            ediDate.isAfter(dayjs(startDate)) &&
            ediDate.isBefore(dayjs(endDate).endOf("day"))
          );
        });

        // 날짜별로 결제 데이터를 지점별로 그룹화
        const grouped = groupPaymentsByDate(dateFilteredPayments);
        setGroupedPayments(grouped);

        console.log(grouped);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    fetchPayment();
  }, [selectedDate]);

  // 결제 데이터를 날짜별로 그룹화하는 함수
  const groupPaymentsByDate = (payments) => {
    return payments.reduce((acc, payment) => {
      const date = dayjs(payment.ediDate, "YYYYMMDDHHmmss").format(
        "YYYY-MM-DD"
      );
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(payment);
      return acc;
    }, {});
  };

  useEffect(() => {
    console.log(selectedDate);
    setDateRange(selectedDate);
  }, [selectedDate]);

  const cellRender = (value, rawData) => {
    const listData = getListData(value, rawData);

    return (
      <div flex={1}>
        <Space direction="vertical">
          {listData.map(
            (item, index) =>
              parseInt(item.content) > 0 && (
                <Space key={index}>
                  <Typography.Text style={{ fontSize: "10px" }}>
                    {parseInt(item.content).toLocaleString()}
                  </Typography.Text>
                </Space>
              )
          )}
        </Space>
      </div>
    );
  };

  return (
    <ConfigProvider locale={locale}>
      <Calendar
        cellRender={(value) => cellRender(value, groupedPayments)}
        onSelect={setSelectedDate}
      />
    </ConfigProvider>
  );
};

export default RCalendar;
