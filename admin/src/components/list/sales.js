import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { AxiosGet } from "../../api";
import { useDailySales, usePaymentStats } from "../../hook/usePaymentsStats";

const SalesList = ({ selectedBranch, dateRange }) => {
  const defaultRange = [
    dateRange ? dateRange.startOf("month") : dayjs().startOf("month"),
    dateRange ? dateRange.endOf("month") : dayjs().endOf("month"),
  ];

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState([]); // 그룹화된 결제 데이터 상태 추가
  const [selectedRange, setSelectedRange] = useState(defaultRange);

  useEffect(() => {
    setSelectedRange([
      dateRange ? dateRange.startOf("month") : dayjs().startOf("month"),
      dateRange ? dateRange.endOf("month") : dayjs().endOf("month"),
    ]);
  }, [dateRange]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, ordersRes] = await Promise.all([
          AxiosGet("/payments"),
          AxiosGet("/orders"),
        ]);
        setPayments(paymentsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("데이터 로드 오류:", error);
      }
    };
    fetchData();
  }, []);

  // 날짜 범위 변경 시 데이터 필터링 및 계산
  useEffect(() => {
    if (!selectedBranch) return;

    const filteredPayments = filterPaymentsByBranch();
    const dateFilteredPayments = filterPaymentsByDate(
      filteredPayments,
      selectedRange
    );

    // 날짜별 결제 데이터 그룹화 후 상태 업데이트
    const groupedPayments = groupPaymentsByDate(dateFilteredPayments);
    setGroupedPayments(groupedPayments); // 상태 업데이트
  }, [selectedBranch, selectedRange, payments]);

  const filterPaymentsByBranch = () => {
    if (!selectedBranch) return [];
    const branchOrders = orders.filter(
      (order) => order.branch_pk === selectedBranch.key
    );
    return payments?.filter((payment) =>
      branchOrders.some((order) => order.order_code === payment.ordNo)
    );
  };

  const filterPaymentsByDate = (payments, range) => {
    const [startDate, endDate] = range;
    return payments.filter((payment) => {
      const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
      return ediDate.isBetween(startDate, endDate, "day", "[]");
    });
  };

  const groupPaymentsByDate = (payments) => {
    const grouped = payments.reduce((acc, payment) => {
      const date = dayjs(payment.ediDate, "YYYYMMDDHHmmss").format(
        "YYYY-MM-DD"
      );
      if (!acc[date]) acc[date] = [];
      acc[date].push(payment);
      return acc;
    }, {});

    // Convert the grouped object into an array
    return Object.entries(grouped).map(([date, payments]) => ({
      date,
      payments,
    }));
  };
  // 통계 계산
  const stats = usePaymentStats(groupedPayments, selectedRange); // 통계 계산
  // 금일 및 전일 매출 계산
  const dailySales = useDailySales(groupedPayments);

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card
          title={`월 누적 매출 (${selectedRange[0].format(
            "MM.DD"
          )} ~ ${selectedRange[1].format("MM.DD")})`}
        >
          <h3>{stats?.totalAmount?.toLocaleString("ko-KR") || 0}원</h3>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title={`전일 매출 (${dayjs().subtract(1, "day").format("MM.DD")})`}
        >
          <h3>{dailySales.yesterday.toLocaleString("ko-KR")}원</h3>
        </Card>
      </Col>
    </Row>
  );
};

export default SalesList;
