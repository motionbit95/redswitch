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
  Descriptions,
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

const DetailModal = ({
  isModalOpen,
  setIsModalOpen,
  historyPK,
  selectedBranch,
}) => {
  const [orderDetails, setOrderDetails] = useState([]); // 발주 상세 데이터 상태 관리
  const [materials, setMaterials] = useState([]);

  // 발주 내역 불러오기
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      console.log(historyPK);
      try {
        const response = await AxiosGet(
          `/products/ordering-products/history/${historyPK}`
        );
        setOrderDetails(response.data);
      } catch (error) {
        message.error("발주 내역을 불러오는 데 실패했습니다.");
      }
    };

    if (!historyPK) {
      return;
    }
    fetchPurchaseOrder();
  }, [historyPK]);

  // 물자 정보 불러오기
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

  const columns = [
    {
      title: "상품명",
      render: (text, record) => {
        let material = materials.filter(
          (material) => material.pk === record.material_pk
        );

        return <span>{material[0]?.product_name}</span>;
      },
    },
    {
      title: "상품코드",
      render: (text, record) => {
        let material = materials.filter(
          (material) => material.pk === record.material_pk
        );
        return <span>{material[0]?.product_code}</span>;
      },
    },
    {
      title: "수량",
      dataIndex: "ordered_cnt",
      key: "ordered_cnt",
    },
  ];

  return (
    <Modal
      title="발주 내역"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Descriptions
        size="small"
        bordered
        column={2}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="발주지점">{selectedBranch}</Descriptions.Item>
        <Descriptions.Item label="발주 일자">
          {dayjs(orderDetails[0]?.ordering_date).format("YYYY-MM-DD")}
        </Descriptions.Item>
      </Descriptions>
      <Table size="small" columns={columns} dataSource={orderDetails} />
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
  const [selectedBranch, setSelectedBranch] = useState(null);

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

    const branch = branches.find((branch) => branch.id === record.branch_id);
    const branchName = branch ? branch.branch_name : null;

    setSelectedBranch(branchName); // branch_name 저장
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
        selectedBranch={selectedBranch}
      />
    </div>
  );
};

export default Purchase_order;
