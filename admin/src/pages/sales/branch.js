import React, { useEffect, useState } from "react";
import { Table, DatePicker, Space, Typography, Button } from "antd";
import dayjs from "dayjs";
import { AxiosGet } from "../../api";
import useSearchFilter from "../../hook/useSearchFilter";
import useExportToExcel from "../../hook/useExportToExcel";
import { DownloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const PaymentSummaryByBranch = () => {
  // 한 달 전부터 오늘까지 범위로 기본값 설정
  const defaultRange = [
    dayjs().subtract(1, "month"), // 한 달 전
    dayjs(), // 오늘
  ];

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [branches, setBranches] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    if (payments && orders && selectedRange) handleDateChange(selectedRange);
  }, [orders]);

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

    const fetchBranches = async () => {
      try {
        const res = await AxiosGet("/branches");
        setBranches(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBranches();
    fetchPayments();
    fetchOrders();
  }, []);

  // 날짜 범위 변경 처리
  const handleDateChange = (dates) => {
    console.log("날짜 범위 변경 처리", dates);
    if (!dates) return;
    setSelectedRange(dates);

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      // 날짜 범위 필터링
      const dateFilteredPayments = payments.filter((payment) => {
        const ediDate = dayjs(payment.ediDate, "YYYYMMDDHHmmss");
        return (
          ediDate.isAfter(dayjs(startDate)) &&
          ediDate.isBefore(dayjs(endDate).endOf("day"))
        );
      });

      // 날짜별로 결제 데이터를 지점별로 그룹화
      const grouped = groupPaymentsByBranch(dateFilteredPayments);
      setGroupedPayments(grouped);
    }
  };

  // 결제 데이터를 지점별로 그룹화하는 함수
  const groupPaymentsByBranch = (payments) => {
    return payments.reduce((acc, payment) => {
      // Filter payments by branch
      const branchId = orders.find(
        (order) => order.order_code === payment.ordNo
      )?.branch_pk;
      if (!branchId) return acc; // If no branch found, skip

      const branchAddress = branches.find(
        (branch) => branch.id === branchId
      )?.branch_address;

      const branchName = branches.find(
        (branch) => branch.id === branchId
      )?.branch_name;

      const startDate = dayjs(selectedRange[0])
        ? dayjs(selectedRange[0])
        : dayjs();
      const endDate = dayjs(selectedRange[1])
        ? dayjs(selectedRange[1])
        : dayjs();
      const dateRange = `${startDate.format("YYYY-MM-DD")} ~ ${endDate.format(
        "YYYY-MM-DD"
      )}`;

      if (!acc[branchId]) {
        acc[branchId] = {
          branchId,
          totalAmount: 0,
          totalTransactions: 0,
          refundTransactions: 0,
          refundAmount: 0,
          branchAddress,
          branchName,
          dateRange,
        };
      }

      const branchData = acc[branchId];

      console.log(branchData);

      // Calculate total amount for payments and refunds
      const amount = Number(payment.goodsAmt);
      if (payment.cancelYN === "N") {
        branchData.totalAmount += amount;
        branchData.totalTransactions += 1;
      } else {
        branchData.refundAmount += amount;
        branchData.refundTransactions += 1;
      }

      return acc;
    }, {});
  };

  // 테이블에 표시할 데이터 포맷
  const dataSource = Object.keys(groupedPayments).map((branchId) => {
    const branchData = groupedPayments[branchId];

    return {
      key: branchId,
      branchId,
      totalAmount: branchData.totalAmount,
      totalTransactions: branchData.totalTransactions,
      refundTransactions: branchData.refundTransactions,
      refundAmount: branchData.refundAmount,
      branchName: branchData.branchName,
      branchAddress:
        branchData.branchAddress.split(" ")[0] +
        " " +
        branchData.branchAddress.split(" ")[1],
      dateRange: branchData.dateRange,
    };
  });

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "기간",
      dataIndex: "dateRange",
      key: "dateRange",
    },
    {
      title: "지점명",
      dataIndex: "branchName",
      key: "branchName",
      ...getColumnSearchProps("branchName"),
    },
    {
      title: "지역",
      dataIndex: "branchAddress",
      key: "branchAddress",
      ...getColumnSearchProps("branchAddress"),
    },
    {
      title: "결제건수",
      dataIndex: "totalTransactions",
      key: "totalTransactions",
      sorter: (a, b) => a.totalTransactions - b.totalTransactions,
    },
    {
      title: "총매출",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => `${value.toLocaleString("ko-KR")}원`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "환불건수",
      dataIndex: "refundTransactions",
      key: "refundTransactions",
      sorter: (a, b) => a.refundTransactions - b.refundTransactions,
    },
    {
      title: "환불금액",
      dataIndex: "refundAmount",
      key: "refundAmount",
      render: (value) => `${value.toLocaleString("ko-KR")}원`,
      sorter: (a, b) => a.refundAmount - b.refundAmount,
    },
    // 하단 부분 정의 필요
    {
      title: "지점추가매출",
    },
    {
      title: "정산예정금",
    },
    {
      title: "재고자산변동",
    },
    {
      title: "수익금",
    },
  ];

  // Use the custom hook to export data to Excel
  const exportToExcel = useExportToExcel(
    dataSource,
    columns,
    [],
    "매출분석_지점별조회_" + dayjs().format("YYYYMMDD")
  );

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Space direction="horizontal" size={8}>
        <RangePicker
          onChange={handleDateChange}
          defaultValue={defaultRange} // 기본값 설정
        />
      </Space>
      <Typography.Title
        level={3}
        style={{ marginTop: "20px", fontWeight: "bold" }}
      >
        지점별 조회
      </Typography.Title>
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
    </Space>
  );
};

export default PaymentSummaryByBranch;
