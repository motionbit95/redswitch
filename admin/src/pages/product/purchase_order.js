import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import SearchProvider from "../../components/popover/searchprovider";
import SearchMaterial from "../../components/popover/searchmaterial";
import { useNavigate } from "react-router-dom";
import { AxiosDelete, AxiosGet, AxiosPost } from "../../api";
import dayjs from "dayjs";

const Purchase_order = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    console.log("orderHistory", orderHistory);
    fetchOrders();
  }, []);

  // 발주 이력 가져오기 (본사 기준)
  const fetchOrders = async () => {
    if (!selectedProvider) {
      return;
    }
    try {
      const response = await AxiosGet("/products/ordering_history");
      setOrderHistory(response.data);
    } catch (error) {
      message.error("발주 이력을 불러오는 데 실패했습니다.");
    }
  };

  // 발주 내역 수정
  const handleEditSubmit = () => {
    console.log();
  };

  // 발주 내역 확인 버튼
  const handleDetail = (id) => {
    console.log(id);
  };

  // 발주 이력 삭제
  const handleDelete = (id) => {
    AxiosDelete(`/products/ordering_history/${id}`)
      .then((response) => {
        fetchOrders();
        message.success("발주 이력이 성공적으로 삭제되었습니다.");
      })
      .catch((error) => {
        console.error("발주 이력 삭제 오류:", error);
        message.error("발주 이력을 삭제하는 데 실패했습니다.");
      });
  };

  const columns = [
    {
      title: "발주 일자",
      dataIndex: "created_at",
      key: "created_at",

      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),

      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "지점 명",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "발주 상태",
    },
    {
      title: "입고 일자",
    },
    {
      title: "발주 내역",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<SearchOutlined />}
          onClick={() => handleDetail(record)}
        />
      ),
    },
    {
      title: "동작",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="발주 이력을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.pk)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginTop: 45 }} />
      <Table
        size="small"
        columns={columns}
        dataSource={orderHistory}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Purchase_order;
