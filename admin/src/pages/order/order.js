import React, { useEffect, useState } from "react";
import { AxiosGet, AxiosPut } from "../../api";
import { Button, Col, DatePicker, Form, Input, Row, Select, Table } from "antd";
import { render } from "@testing-library/react";
import dayjs from "dayjs";

const orderStatus = ["결제대기", "주문완료", "주문삭제"];
const Order = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      AxiosGet("/orders")
        .then((res) => {
          const sortedOrders = res.data.sort((a, b) => {
            // `checked`가 0인 항목을 최상단으로 정렬
            return a.checked === b.checked ? 0 : a.checked === 0 ? -1 : 1;
          });
          setOrders(sortedOrders);
        })
        .catch((err) => console.log(err));
    };

    fetchOrders();
  }, []);

  // Update Checked Status on Server
  const updateCheckedStatus = async (id) => {
    console.log(id);
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

  const columns = [
    {
      title: "주문일시",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
    {
      title: "주문번호",
      dataIndex: "order_code",
      key: "order_code",
    },
    // {
    //   title: "주문명",
    //   dataIndex: "goods_name",
    //   key: "goods_name",
    // },
    {
      title: "배송메세지",
      dataIndex: "delivery_message",
      key: "delivery_message",
    },
    {
      title: "주문금액",
      dataIndex: "order_amount",
      key: "order_amount",
      render: (text) => <span>{parseInt(text).toLocaleString()}원</span>,
    },
    {
      title: "주문상태",
      dataIndex: "order_status",
      key: "order_status",
      render: (text) => <span>{orderStatus[parseInt(text)]}</span>,
    },
    {
      title: "동작",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span>
          {record.order_status !== 0 && <Button type="link">결제취소</Button>}
          <Button type="link">삭제</Button>
        </span>
      ),
    },
  ];

  // Sub Table columns
  const subColumns = [
    {
      title: "상품코드",
      dataIndex: "product_code",
      key: "product_code",
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
      render: (text) => <span>{parseInt(text).toLocaleString()}원</span>,
    },
    {
      title: "지점추가매출",
      dataIndex: "additional_fee",
      key: "additional_fee",
      render: (text) => <span>{parseInt(text).toLocaleString()}원</span>,
    },
    {
      title: "옵션",
      dataIndex: "option",
      key: "option",
      render: (text, record) => {
        // Parse text into an array if it's JSON-like
        let optionArray;
        try {
          optionArray = typeof text === "string" ? JSON.parse(text) : text;
        } catch (e) {
          optionArray = [];
        }

        if (Array.isArray(optionArray) && optionArray.length > 0) {
          return (
            <span>
              {optionArray.map((option, index) => {
                const { optionName, optionPrice } = option;
                return (
                  <span key={index}>
                    {optionName} (+{parseInt(optionPrice).toLocaleString()}원)
                    {index < optionArray.length - 1 && ", "}
                  </span>
                );
              })}
            </span>
          );
        }

        // Fallback if parsing fails or data is empty
        return <span>-</span>;
      },
    },
    {
      title: "합계",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span>{parseInt(text).toLocaleString()}원</span>,
    },
  ];

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={orders}
      rowKey={(record) => record.order_code} // Ensure each row has a unique key
      rowClassName={(record) =>
        record.checked === 0 || !record.checked ? "highlight-row" : ""
      }
      expandable={{
        expandedRowRender: (record) => {
          return (
            <Table
              size="small"
              columns={subColumns}
              dataSource={record.select_products}
              rowKey={(item) => `${record.order_code}-${item.product_name}`} // Ensure sub-rows also have unique keys
              pagination={false}
            />
          );
        },
        onExpand: (expanded, record) => {
          if ((expanded && record.checked === 0) || !record.checked) {
            updateCheckedStatus(record.id); // Update when row is expanded
          }
        },
        rowExpandable: (record) =>
          record.select_products && record.select_products.length > 0, // Expand only if items exist
      }}
    />
  );
};

export default Order;
