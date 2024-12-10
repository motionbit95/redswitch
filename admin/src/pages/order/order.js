import React, { useEffect, useState } from "react";
import { AxiosGet, AxiosPut } from "../../api";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { render } from "@testing-library/react";
import useSearchFilter from "../../hook/useSearchFilter";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    const fetchMaterials = async () => {
      AxiosGet("/products/materials")
        .then((res) => {
          setMaterials(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      AxiosGet("/orders")
        .then((res) => {
          const sortedOrders = res.data.sort((a, b) => {
            // `checked`가 0인 항목을 최상단으로 정렬
            return a.checked === b.checked ? 0 : a.checked === 0 ? -1 : 1;
          });

          console.log(sortedOrders);

          setOrders(sortedOrders);
        })
        .catch((err) => console.error(err));
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      AxiosGet("/branches")
        .then((res) => {
          setBranches(res.data);
        })
        .catch((err) => console.err(err));
    };
    fetchBranches();
  }, [orders]);

  useEffect(() => {
    const fetchPayments = async () => {
      AxiosGet("/payments")
        .then((res) => {
          setPayments(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchPayments();
  }, [orders]);

  useEffect(() => {
    let filteredOrders = [];
    orders.map((order) => {
      let data = payments.filter(
        (payment) => payment.ordNo === order.order_code
      );

      if (data.length > 0) {
        filteredOrders.push(order);
      }
    });

    setFilteredOrders(filteredOrders);
  }, [payments]);

  // Update Checked Status on Server
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

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
    },
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
      ...getColumnSearchProps("order_code"),
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
      ...getColumnSearchProps("delivery_message"),
    },
    {
      title: "주문금액",
      dataIndex: "order_amount",
      key: "order_amount",
      render: (text) => <span>{parseInt(text).toLocaleString()}원</span>,
      sorter: (a, b) => a.order_amount - b.order_amount,
    },
    {
      title: "지점명",
      render: (text, record) => {
        let branch = branches.filter(
          (branch) => branch.id === record.branch_pk
        );
        return <span>{branch[0]?.branch_name}</span>;
      },
    },
    {
      title: "주소",
      dataIndex: "customer_address",
      key: "customer_address",
      render: (text) => <span>{text}호</span>,
      ...getColumnSearchProps("customer_address"),
    },
    {
      title: "주문상태",
      dataIndex: "order_status",
      key: "order_status",
      render: (text, record) => {
        let data = payments.filter(
          (payment) => payment.ordNo === record.order_code
        );
        return (
          <Tag
            color={data.length === 0 ? "" : data.length === 1 ? "green" : "red"}
          >
            {data.length === 0
              ? "결제대기"
              : data.length === 1
              ? "주문완료"
              : "결제취소"}
          </Tag>
        );
      },

      filters: [
        { text: "결제대기", value: 0 },
        { text: "주문완료", value: 1 },
        { text: "결제취소", value: 2 },
      ],
      onFilter: (value, record) => {
        let data = payments.filter(
          (payment) => payment.ordNo === record.order_code
        );
        return data.length === value;
      },
    },
    {
      title: "동작",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        let data = payments.filter(
          (payment) => payment.ordNo === record.order_code
        );
        return (
          <span style={{ display: "flex", gap: "10px" }}>
            {/* {record.order_status !== 0 && <a>결제취소</a>} */}
            <a>삭제</a>
            {data.length === 1 && <a>결제취소</a>}
          </span>
        );
      },
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
      title: "거래처",
      render: (text, record) => {
        let material = materials.filter(
          (material) => material.pk === record.material_id
        );

        return <span>{material[0]?.provider_name}</span>;
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

  const onSubmit = (values) => {
    // 필터링 함수 만들기
    console.log(values);

    console.log(orders);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {/* <OrderFilter onSubmit={onSubmit} /> */}
      <Table
        size="small"
        columns={columns}
        dataSource={filteredOrders}
        rowKey={(record) => record.order_code} // Ensure each row has a unique key
        rowClassName={(record) =>
          record.checked === 0 || !record.checked ? "highlight-row" : ""
        }
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
        }}
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
    </Space>
  );
};

const OrderFilter = (props) => {
  const [form] = Form.useForm();
  const { onSubmit } = props;

  const onFinish = (values) => {
    onSubmit(values);
  };
  return (
    <Card>
      <Form
        layout="inline"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
        form={form}
        onFinish={onFinish}
      >
        <div style={{ display: "flex" }}>
          {/* Form.Item에서 defaultValue로 한 달 전부터 오늘까지 설정 */}
          <Form.Item name="order_date" label="주문날짜">
            <DatePicker.RangePicker
              defaultValue={[dayjs().subtract(1, "month"), dayjs()]}
            />
          </Form.Item>
          <Form.Item name="order_status" label="주문상태">
            <Select defaultValue="전체" style={{ width: 120 }}>
              <Select.Option value="1">주문완료</Select.Option>
              <Select.Option value="2">결제취소</Select.Option>
              <Select.Option value="2">배송완료</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="search_option" label="검색조건">
            <Select defaultValue="---선택---" style={{ width: 120 }}>
              <Select.Option value="product_code">상품코드</Select.Option>
              <Select.Option value="branch">지점별</Select.Option>
              <Select.Option value="region">지역별</Select.Option>
              <Select.Option value="provider">거래처별</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="search_keyword">
            <Input />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            iconPosition="end"
            icon={<SearchOutlined />}
          >
            검색
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Order;
