import React, { useEffect, useState } from "react";
import { AxiosGet, AxiosPut } from "../../api";
import { Button, Card, DatePicker, Input, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import useSearchFilter from "../../hook/useSearchFilter";
import isBetween from "dayjs/plugin/isBetween";
import useSelectedBranch from "../../hook/useSelectedBranch";
import { render } from "@testing-library/react";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const Order = (props) => {
  const { currentUser } = props;
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateRange, setDateRange] = useState([null, null]); // 시작일, 종료일
  const { selectedBranch } = useSelectedBranch();

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await AxiosGet("/products/materials");
        setMaterials(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await AxiosGet("/branches");
        setBranches(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await AxiosGet("/orders");
        const sortedOrders = res.data.sort((a, b) =>
          a.checked === b.checked ? 0 : a.checked === 0 ? -1 : 1
        );

        sortedOrders.forEach((order) => {
          const branch = branches.find(
            (branch) => branch.id === order.branch_pk
          );
          if (branch) {
            order.branch_name = branch.branch_name;
          }
        });

        setOrders(sortedOrders);
        // setFilteredOrders(sortedOrders); // 초기 필터링 데이터
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [branches]);

  useEffect(() => {
    console.log("orders", orders, selectedBranch);
    if (selectedBranch) {
      onSearch();
    } else {
      setFilteredOrders([]);
    }
  }, [orders, selectedBranch]);

  const onSearch = () => {
    let filtered = orders.filter((order) => order.order_status !== 0);

    // 상품 코드 검색
    if (searchKeyword) {
      filtered = filtered.filter((order) =>
        order.select_products.some((product) =>
          product.product_code.includes(searchKeyword)
        )
      );
    }

    // 지점 필터링
    if (selectedBranch) {
      filtered = filtered.filter(
        (order) => selectedBranch.id === order.branch_pk
      );
    }

    // 주문일시 필터링
    if (dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      filtered = filtered.filter((order) => {
        const orderDate = dayjs(order.created_at);
        return orderDate.isBetween(start, end, "day", "[]");
      });
    }

    if (selectedBranch) {
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  };

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
    },
    {
      title: "주문일시",
      dataIndex: "created_at",
      key: "created_at",
      ellipsis: true,
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "주문번호",
      dataIndex: "order_code",
      key: "order_code",
      ...getColumnSearchProps("order_code"),
    },
    {
      title: "배송메세지",
      dataIndex: "delivery_message",
      key: "delivery_message",
      ellipsis: true,
    },
    {
      title: "주문금액",
      dataIndex: "order_amount",
      key: "order_amount",
      render: (text) => `${parseInt(text).toLocaleString()}원`,
    },
    {
      title: "지점명",
      dataIndex: "branch_name",
      key: "branch_name",
      ellipsis: true,
    },
    {
      title: "호실",
      dataIndex: "customer_address",
      key: "customer_address",
      ellipsis: true,
    },
    {
      title: "주문상태",
      dataIndex: "order_status",
      key: "order_status",
      render: (text, record) => {
        return (
          <Tag color={text === 0 ? "" : text === 1 ? "green" : "red"}>
            {text === 0 ? "결제대기" : text === 1 ? "주문완료" : "주문취소"}
          </Tag>
        );
      },
    },
  ];

  const subColumns = [
    {
      title: "상품코드",
      dataIndex: "product_code",
      key: "product_code",
    },
    {
      title: "거래처",
      render: (text, record) => {
        const material = materials.find(
          (material) => material.pk === record.material_id
        );
        return material ? material.provider_name : "";
      },
    },
    {
      title: "상품명",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "수량",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "상품금액",
      dataIndex: "product_price",
      key: "product_price",
      render: (text) => `${parseInt(text).toLocaleString()}원`,
    },
  ];

  // 주문 확인 여부 체크
  const updateCheckedStatus = async (id) => {
    try {
      await AxiosPut(`/orders/${id}`, { checked: 1 }); // Update server
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, checked: 1 } : order
        )
      ); // Update UI
    } catch (error) {
      console.error("Error updating checked status:", error);
    }
  };

  const onReload = () => {
    const totalOrders = orders.filter((order) => order.order_status !== 0);
    setFilteredOrders(totalOrders);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Space>
            {currentUser.permission === "1" && (
              <Button icon={<EyeOutlined />} onClick={onReload}>
                전체보기
              </Button>
            )}
            <RangePicker
              onChange={(dates) => setDateRange(dates)}
              style={{ marginLeft: 10 }}
              allowClear={false}
            />
            <Input
              placeholder="상품코드를 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ width: 300 }}
            />
          </Space>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            검색
          </Button>
        </div>
      </Card>
      <Table
        size="small"
        columns={columns}
        dataSource={filteredOrders}
        rowKey={(record) => record.order_code}
        rowClassName={(record) =>
          record.checked === 0 || !record.checked ? "highlight-row" : ""
        }
        expandable={{
          expandedRowRender: (record) => (
            <Table
              size="small"
              columns={subColumns}
              dataSource={record.select_products}
              rowKey={(item) => `${record.order_code}-${item.product_code}`}
              pagination={false}
            />
          ),
          rowExpandable: (record) =>
            record.select_products && record.select_products.length > 0,
          onExpand: (expanded, record) => {
            if ((expanded && record.checked === 0) || !record.checked) {
              updateCheckedStatus(record.id); // Update when row is expanded
            }
          },
        }}
      />
    </Space>
  );
};

export default Order;
