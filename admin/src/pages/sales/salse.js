import React, { useEffect, useState } from "react";
import {
  Table,
  DatePicker,
  Space,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { AxiosGet } from "../../api";
import SearchBranch from "../../components/popover/searchbranch";
import {
  DownloadOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import useExportToExcel from "../../hook/useExportToExcel";
import usePagination from "../../hook/usePagination";
import { render } from "@testing-library/react";
import { Popover, Tooltip } from "antd/lib";

const { RangePicker } = DatePicker;

const PaymentSummary = (props) => {
  const { currentUser } = props;
  // 한 달 전부터 오늘까지 범위로 기본값 설정
  const defaultRange = [
    dayjs().subtract(1, "month"), // 한 달 전
    dayjs(), // 오늘
  ];

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
      const todayRefunds = payments
        .filter(
          (payment) =>
            dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD") ===
            today
        )
        .filter((payment) => payment.cancelYN === "Y")
        .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);

      const todaySales =
        payments
          .filter(
            (payment) =>
              dayjs(payment.ediDate, "YYYYMMDDHHmmss").format("YYYY-MM-DD") ===
              today
          )
          .filter((payment) => payment.cancelYN === "N")
          .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0) -
        todayRefunds;

      console.log(todayRefunds);

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
    console.log("selectedBranch:", selectedBranch);
    handleDateChange(selectedRange);
  }, [selectedBranch]);

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
    const totalTransactions = paymentsWithOrders.filter(
      (payment) => payment.cancelYN === "N"
    ).length; // 전체 결제건수
    const refundTransactions = paymentsWithOrders.filter(
      (payment) => payment.cancelYN === "Y"
    ).length; // 환불 건수
    const refundAmount = paymentsWithOrders
      .filter((payment) => payment.cancelYN === "Y")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);
    const totalAmount =
      paymentsWithOrders
        .filter((payment) => payment.cancelYN === "N")
        .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0) -
      refundAmount;

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
    const totalTransactions = datePayments.filter(
      (payment) => payment.cancelYN === "N"
    ).length;
    const refundTransactions = datePayments.filter(
      (payment) => payment.cancelYN === "Y"
    ).length;
    const refundAmount = datePayments
      .filter((payment) => payment.cancelYN === "Y")
      .reduce((sum, payment) => sum + Number(payment.goodsAmt), 0);
    const total = totalAmount - refundAmount;

    return {
      key: date,
      date,
      totalAmount,
      totalTransactions,
      refundTransactions,
      refundAmount,
      total,
    };
  });

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "영업일",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "결제건수",
      dataIndex: "totalTransactions",
      key: "totalTransactions",
      sorter: (a, b) => a.totalTransactions - b.totalTransactions,
    },
    {
      title: "환불건수",
      dataIndex: "refundTransactions",
      key: "refundTransactions",
      sorter: (a, b) => a.refundTransactions - b.refundTransactions,
    },
    {
      title: "총 결제금액",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => `${value.toLocaleString("ko-KR")}원`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "총 환불금액",
      dataIndex: "refundAmount",
      key: "refundAmount",
      render: (value) => `${value.toLocaleString("ko-KR")}원`,
      sorter: (a, b) => a.refundAmount - b.refundAmount,
    },
    {
      title: "총 매출금액",
      dataIndex: "total",
      key: "total",
      render: (value, record) => `${value.toLocaleString("ko-KR")}원`,
    },
    {
      title: "자세히보기",
      key: "action",

      render: (_, record) => (
        <Button
          icon={<SearchOutlined />}
          onClick={() => {
            setSelectedDate(record.date);
            setIsModalOpen(true);
          }}
        />
      ),
    },
  ];

  // Use the custom hook to export data to Excel
  const exportToExcel = useExportToExcel(
    dataSource,
    columns,
    [],
    "매출관리_기간별조회_" + dayjs().format("YYYYMMDD")
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Space direction="horizontal" size={8}>
        <SearchBranch
          selectedBranch={selectedBranch}
          setSelectedBranch={(branches) => {
            setSelectedBranch(branches[0]);
          }}
          multiple={false}
          currentUser={currentUser}
        />
        <RangePicker
          onChange={handleDateChange}
          defaultValue={defaultRange} // 기본값 설정
        />
      </Space>
      <Typography.Title
        level={3}
        style={{ marginTop: "20px", fontWeight: "bold" }}
      >
        기간별 조회
      </Typography.Title>
      <div>
        {stats && (
          <Row gutter={16} justify="space-between">
            <Col span={6}>
              <Card
                size="small"
                title="금일 매출"
                bordered={false}
                style={{ height: "100%" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3 style={{ marginBottom: "0" }}>
                  {dailySales.today.toLocaleString("ko-KR")}원
                </h3>
                <Typography.Text type="secondary">
                  전일매출 {dailySales.yesterday.toLocaleString("ko-KR")}원
                </Typography.Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                title="총 매출금액"
                bordered={false}
                style={{ height: "100%" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Space>
                  <h3>{stats.totalAmount.toLocaleString("ko-KR")}원</h3>
                  <Tooltip
                    placement="topLeft"
                    title={
                      <div>
                        <div style={{ opacity: 0.5 }}>
                          결제 :{" "}
                          {(
                            stats.totalAmount + stats.refundAmount
                          ).toLocaleString("ko-KR")}
                          원
                        </div>
                        <div style={{ opacity: 0.5 }}>
                          환불 : {stats.refundAmount.toLocaleString("ko-KR")}원
                        </div>
                      </div>
                    }
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                title="총 결제건수 / 환불건수"
                bordered={false}
                style={{ height: "100%" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3>
                  {stats.totalTransactions} / {stats.refundTransactions}
                </h3>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                title="환불율"
                bordered={false}
                style={{ height: "100%" }}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3>
                  {(stats.totalTransactions !== 0
                    ? stats.refundTransactions / stats.totalTransactions
                    : 0) * 100}
                  %
                </h3>
              </Card>
            </Col>
          </Row>
        )}
      </div>
      <Button
        style={{ float: "right" }}
        icon={<DownloadOutlined />}
        onClick={exportToExcel}
      >
        엑셀 다운로드
      </Button>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />

      <DetailModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        payments={groupedPayments[selectedDate]}
        selectedDate={selectedDate}
      />
    </Space>
  );
};

const DetailModal = ({
  isModalOpen,
  setIsModalOpen,
  payments,
  selectedDate,
}) => {
  const { pagination, setPagination, handleTableChange } = usePagination(10);

  useEffect(() => {
    console.log(payments);
  }, [payments]);

  const columns = [
    {
      title: "No.",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "TID",
      dataIndex: "tid",
      key: "tid",
    },
    {
      title: "주문번호",
      dataIndex: "ordNo",
      key: "ordNo",
    },
    {
      title: "결제(취소)일시",
      dataIndex: "ediDate",
      key: "ediDate",
      render: (value) =>
        dayjs(value, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "취소여부",
      dataIndex: "cancelYN",
      key: "cancelYN",
      render: (value) => (
        <div style={{ opacity: value === "N" ? 1 : 0.5 }}>
          {value === "N" ? "결제완료" : "취소완료"}
        </div>
      ),
    },
    {
      title: "매출",
      dataIndex: "goodsAmt",
      key: "goodsAmt",
      render: (value, record) => (
        <div style={{ opacity: record.cancelYN === "N" ? 1 : 0.5 }}>
          {`${record.cancelYN === "N" ? "+" : "-"}${value.toLocaleString(
            "ko-KR"
          )}원`}
        </div>
      ),
    },
  ];

  const exportToExcel = useExportToExcel(
    payments,
    columns.slice(1),
    [],
    "결제내역_" + selectedDate
  );

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      width={1000}
      footer={[
        <Button
          key="submit"
          // type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
        >
          엑셀 다운로드
        </Button>,
        <Button key="back" onClick={() => setIsModalOpen(false)}>
          취소
        </Button>,
      ]}
    >
      <Table
        size="small"
        dataSource={payments}
        columns={columns}
        pagination={{
          ...pagination,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </Modal>
  );
};
export default PaymentSummary;
