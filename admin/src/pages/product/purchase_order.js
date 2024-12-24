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

const DetailModal = ({ isModalOpen, setIsModalOpen, historyPK }) => {
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      console.log(historyPK);
      try {
        const response = await AxiosGet(
          `/products/ordering-products/history/${historyPK}`
        );
        console.log(response.data);
      } catch (error) {
        message.error("발주 내역을 불러오는 데 실패했습니다.");
      }
    };

    if (!historyPK) {
      return;
    }
    fetchPurchaseOrder();
  }, [historyPK]);

  return (
    <Modal
      title="발주 내역"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <p>id: {historyPK}</p>
    </Modal>
  );
};

const Purchase_order = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [branches, setBranches] = useState([]);
  const [historyPK, setHistoryPK] = useState(null);

  // 발주 이력 가져오기 (본사 기준)
  useEffect(() => {
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
  }, [orderHistory]);

  // 발주 내역 수정
  const handleEditSubmit = () => {
    console.log();
  };

  // 발주 내역 확인 버튼
  const handleDetail = (record) => {
    console.log(record);
    setIsModalOpen(true);
    setHistoryPK(record.pk);
  };

  // 발주 이력 삭제
  const handleDelete = (id) => {
    AxiosDelete(`/products/ordering_history/${id}`)
      .then((response) => {
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

      render: (text, record) => {
        let branch = branches.filter(
          (branch) => branch.id === record.branch_id
        );
        return <span>{branch[0]?.branch_name}</span>;
      },
    },
    {
      title: "발주 상태",
      dataIndex: "arrive",
      key: "arrive",
      render: (text) => <span>{text}</span>,
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

      <DetailModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        historyPK={historyPK}
      />
    </div>
  );
};

export default Purchase_order;
