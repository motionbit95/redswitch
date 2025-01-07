import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { AxiosGet } from "../../api";

/**
 * SalesList 컴포넌트: 매출 데이터를 날짜별로 정리하고 표시
 * @param {Object} props - 컴포넌트 속성
 * @param {Object} props.selectedBranch - 선택된 지점 정보
 * @param {Object} props.dateRange - 선택된 날짜 범위
 */
const SalesList = ({ selectedBranch, dateRange }) => {
  // 기본 날짜 범위: 이번 달 1일부터 마지막 날까지
  const defaultRange = [
    dateRange ? dateRange.startOf("month") : dayjs().startOf("month"),
    dateRange ? dateRange.endOf("month") : dayjs().endOf("month"),
  ];

  // 상태값 정의
  const [orders, setOrders] = useState([]); // 주문 데이터
  const [payments, setPayments] = useState([]); // 결제 데이터
  const [groupedPayments, setGroupedPayments] = useState({}); // 날짜별 그룹화된 결제 데이터
  const [selectedRange, setSelectedRange] = useState(defaultRange); // 선택된 날짜 범위
  const [stats, setStats] = useState(null); // 통계 데이터
  const [dailySales, setDailySales] = useState({ today: 0, yesterday: 0 }); // 금일 및 전일 매출

  // 초기 데이터 로드
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

  // 날짜 범위 변경 시 데이터 필터링 및 통계 계산
  useEffect(() => {
    const filteredPayments = filterPaymentsByBranch();
    const dateFilteredPayments = filterPaymentsByDate(
      filteredPayments,
      selectedRange
    );
    setGroupedPayments(groupPaymentsByDate(dateFilteredPayments));

    const calculatedStats = calculatePaymentStats(
      filteredPayments,
      selectedRange
    );
    setStats(calculatedStats);

    calculateDailySales(filteredPayments);
  }, [selectedBranch, selectedRange, payments]);

  /**
   * 특정 지점에 맞는 결제 데이터 필터링
   * @returns {Array} 필터링된 결제 데이터
   */
  const filterPaymentsByBranch = () => {
    if (!selectedBranch) return []; // 지점 미선택 시 결제 데이터 반환 X
    const branchOrders = orders.filter(
      (order) => order.branch_pk === selectedBranch.key
    );
    return payments.filter((payment) =>
      branchOrders.some((order) => order.order_code === payment.ordNo)
    );
  };

  /**
   * 날짜 범위에 맞는 결제 데이터 필터링
   * @param {Array} payments - 결제 데이터
   * @param {Array} range - 날짜 범위 [시작일, 종료일]
   * @returns {Array} 필터링된 결제 데이터
   */
  const filterPaymentsByDate = (payments, range) => {
    const [startDate, endDate] = range;
    return payments.filter((payment) => {
      const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
      return ediDate.isBetween(startDate, endDate, "day", "[]");
    });
  };

  /**
   * 결제 데이터를 날짜별로 그룹화
   * @param {Array} payments - 결제 데이터
   * @returns {Object} 날짜별 그룹화된 데이터
   */
  const groupPaymentsByDate = (payments) => {
    return payments.reduce((acc, payment) => {
      const date = dayjs(payment.ediDate, "YYYYMMDDHHmmss").format(
        "YYYY-MM-DD"
      );
      if (!acc[date]) acc[date] = [];
      acc[date].push(payment);
      return acc;
    }, {});
  };

  /**
   * 통계 데이터 계산
   * @param {Array} payments - 결제 데이터
   * @param {Array} range - 날짜 범위 [시작일, 종료일]
   * @returns {Object} 통계 데이터
   */
  const calculatePaymentStats = (payments, [startDate, endDate]) => {
    const filteredPayments = filterPaymentsByDate(payments, [
      startDate,
      endDate,
    ]);
    const totalAmount = filteredPayments
      .filter((payment) => payment.cancelYN === "N")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);
    const refundAmount = filteredPayments
      .filter((payment) => payment.cancelYN === "Y")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);
    return {
      totalAmount,
      totalTransactions: filteredPayments.length,
      refundAmount,
    };
  };

  /**
   * 금일 및 전일 매출 계산
   * @param {Array} payments - 결제 데이터
   */
  const calculateDailySales = (payments) => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const todaySales = payments
      .filter(
        (payment) =>
          dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD") ===
          today
      )
      .filter((payment) => payment.cancelYN === "N")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    const yesterdaySales = payments
      .filter(
        (payment) =>
          dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD") ===
          yesterday
      )
      .filter((payment) => payment.cancelYN === "N")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    setDailySales({ today: todaySales, yesterday: yesterdaySales });
  };

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
