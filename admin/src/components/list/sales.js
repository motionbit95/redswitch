import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, Button, Modal } from "antd";
import dayjs from "dayjs";
import { AxiosGet } from "../../api";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import useExportToExcel from "../../hook/useExportToExcel";
import usePagination from "../../hook/usePagination";

const SalesList = (props) => {
  // 이번 달 1일부터 마지막 날까지 범위로 기본값 설정
  const defaultRange = [
    props.dateRange
      ? props.dateRange.startOf("month")
      : dayjs().startOf("month"), // 이번 달의 첫째 날
    props.dateRange ? props.dateRange.endOf("month") : dayjs().endOf("month"), // 이번 달의 마지막 날
  ];

  // const defaultRange = [
  //   dayjs().startOf("day"),
  //   dayjs().subtract(1, "day").endOf("day"),
  // ];

  useEffect(() => {
    setSelectedRange([
      props.dateRange
        ? props.dateRange.startOf("month")
        : dayjs().startOf("month"), // 이번 달의 첫째 날
      props.dateRange ? props.dateRange.endOf("month") : dayjs().endOf("month"), // 이번 달의 마지막 날
    ]);

    handleDateChange([
      props.dateRange
        ? props.dateRange.startOf("month")
        : dayjs().startOf("month"), // 이번 달의 첫째 날
      props.dateRange ? props.dateRange.endOf("month") : dayjs().endOf("month"), // 이번 달의 마지막 날
    ]);
  }, [props.dateRange]);

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [stats, setStats] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [dailySales, setDailySales] = useState({ today: 0, yesterday: 0 });

  // detail modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const calculateDailySales = () => {
      const today = dayjs().format("YYYY-MM-DD");
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

      // 금일 매출 계산
      const todaySales = payments
        .filter(
          (payment) =>
            dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD") ===
            today
        )
        .filter((payment) => payment.cancelYN === "N")
        .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

      // 전일 매출 계산
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

    calculateDailySales();
  }, [payments]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPayments = async () => {
      try {
        const res = await AxiosGet("/payments");
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await AxiosGet("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayments();
    fetchOrders();
  }, []);

  useEffect(() => {
    handleDateChange(defaultRange);
  }, [payments]);

  // 날짜 범위 변경 처리
  const handleDateChange = (dates) => {
    console.log("날짜 범위 변경 처리", dates);
    setSelectedRange(dates);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      // 지점에 맞는 결제 데이터 필터링
      const filteredPayments = filterPaymentsByBranch();

      if (dates && dates.length === 2) {
        const stats = calculatePaymentStats(filteredPayments, orders, dates);
        setStats(stats);
      }

      // 날짜 범위 필터링
      const dateFilteredPayments = filteredPayments.filter((payment) => {
        const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
        return (
          ediDate.isAfter(dayjs(startDate)) &&
          ediDate.isBefore(dayjs(endDate).endOf("day"))
        );
      });

      // 날짜별로 결제 데이터를 그룹화
      const grouped = groupPaymentsByDate(dateFilteredPayments);
      setGroupedPayments(grouped);
    }
  };

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

  // 결제 통계를 계산하는 함수
  const calculatePaymentStats = (payments, orders, [startDate, endDate]) => {
    if (!startDate || !endDate) return null;

    // 날짜 범위 필터링
    const filteredPayments = payments.filter((payment) => {
      const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss"); // ediDate 파싱
      return (
        ediDate.isAfter(dayjs(startDate)) &&
        ediDate.isBefore(dayjs(endDate).endOf("day"))
      );
    });

    // 해당 주문이 있는 결제만 필터링 (order_code와 ordNo 매칭)
    const paymentsWithOrders = filteredPayments.filter((payment) => {
      return orders.some((order) => order.order_code === payment.ordNo);
    });

    // 데이터 계산
    const totalTransactions = paymentsWithOrders.length; // 전체 결제건수
    const refundTransactions = paymentsWithOrders.filter(
      (payment) => payment.cancelYN === "Y"
    ).length; // 환불 건수
    const totalAmount = paymentsWithOrders
      .filter((payment) => payment.cancelYN === "N")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);
    const refundAmount = paymentsWithOrders
      .filter((payment) => payment.cancelYN === "Y")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    return {
      totalAmount,
      totalTransactions,
      refundTransactions,
      refundAmount,
    };
  };

  // 선택한 지점에 맞는 주문 데이터 필터링
  const filterPaymentsByBranch = () => {
    if (!selectedBranch) return payments; // 지점이 선택되지 않았다면 모든 결제 데이터 반환

    // 선택한 지점에 해당하는 주문번호를 찾기
    const branchOrders = orders.filter(
      (order) => order.branch_pk === selectedBranch.key
    );

    // 해당 주문번호에 맞는 결제 데이터 필터링
    return payments.filter((payment) =>
      branchOrders.some((order) => order.order_code === payment.ordNo)
    );
  };

  // 날짜별로 통계 계산
  const dataSource = Object.keys(groupedPayments).map((date) => {
    const datePayments = groupedPayments[date];
    const totalAmount = datePayments
      .filter((payment) => payment.cancelYN === "N")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);
    const totalTransactions = datePayments.length;
    const refundTransactions = datePayments.filter(
      (payment) => payment.cancelYN === "Y"
    ).length;
    const refundAmount = datePayments
      .filter((payment) => payment.cancelYN === "Y")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

    return {
      key: date,
      date,
      totalAmount,
      totalTransactions,
      refundTransactions,
      refundAmount,
    };
  });

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card
          title={
            "월누적매출(" +
            selectedRange[0].format("MM.DD") +
            "~" +
            selectedRange[1].format("MM.DD") +
            ")"
          }
        >
          <h3>{stats && stats.totalAmount.toLocaleString("ko-KR")}원</h3>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title={"전일매출(" + dayjs().subtract(1, "day").format("MM.DD") + ")"}
        >
          <h3>
            {dailySales && dailySales.yesterday.toLocaleString("ko-KR")}원
          </h3>
        </Card>
      </Col>
    </Row>
  );
};

export default SalesList;
