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

const PurchaseAddModal = (props) => {
  const [form] = Form.useForm();
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    console.log("선택된 물자들!!!!>>>>>", selectedMaterials);
  }, [selectedMaterials]);

  const columns = [
    {
      title: "상품명",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "상품코드",
      dataIndex: "product_code",
      key: "product_code",
    },
    {
      title: "수량",
      dataIndex: "ordered_cnt",
      key: "ordered_cnt",
      render: (_, record) => (
        <InputNumber
          type="number"
          defaultValue={record.ordered_cnt || 1}
          min={1}
          onChange={(value) => handleQuantityChange(record.key, value)}
        />
      ),
    },
    {
      title: "삭제",
      key: "delete",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.key)}>
          삭제
        </Button>
      ),
    },
  ];

  const handleQuantityChange = (key, ordered_cnt) => {
    setSelectedMaterials((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, ordered_cnt: ordered_cnt } : item
      )
    );
  };

  const handleDelete = (key) => {
    setSelectedMaterials((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSubmit = async () => {
    if (!selectedMaterials.length) {
      message.error("발주할 상품이 없습니다.");
      return;
    }

    // try {
    //   const data = selectedMaterials.map((item) => ({
    //     provider_id: item.provider_id,
    //     material_pk: item.material_pk,
    //     product_code: item.product_code,
    //     provider_code: item.provider_code,
    //     ordered_cnt: item.ordered_cnt,
    //   }));

    //   await AxiosPost("/products/ordering_product", data);

    //   message.success("발주상품이 성공적으로 저장되었습니다.");
    //   props.setIsModalOpen(false);
    //   setSelectedMaterials([]);
    // } catch (error) {
    //   console.error("발주 저장 오류:", error);
    //   message.error("발주 저장에 실패했습니다.");
    // }
  };

  const handleCancel = () => {
    setSelectedMaterials([]);
    props.setIsModalOpen(false);
  };

  return (
    <Modal
      title="발주 추가"
      centered
      open={props.isModalOpen}
      width={1000}
      onCancel={handleCancel}
      footer={[
        <Button onClick={handleCancel}>취소</Button>,
        <Button onClick={handleSubmit}>저장</Button>,
      ]}
    >
      <SearchMaterial
        setSelectedProduct={(products) =>
          setSelectedMaterials((prev) => [
            ...prev,
            ...products.map((product) => ({ ...product, ordered_cnt: 1 })),
          ])
        }
        multiple={true}
      />
      <Table
        columns={columns}
        dataSource={selectedMaterials}
        rowKey="key"
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

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

  const fetchOrders = async () => {
    if (!selectedProvider) {
      return;
    }
    try {
      const response = await AxiosGet("/products/ordering_history");
      setOrderHistory(response.data);
      const filteredOrders = response.data.filter(
        (order) => order?.provider_id === selectedProvider?.id
      );

      setOrderHistory(filteredOrders);
    } catch (error) {
      message.error("발주 이력을 불러오는 데 실패했습니다.");
    }
  };

  const handleOrder = async () => {
    if (!selectedProvider) {
      message.error("다시 거래처를 선택해주세요.");
      return;
    }

    try {
      // 발주 이력 생성 요청
      const response = await AxiosPost("/products/ordering_history", {
        provider_id: selectedProvider.id,
        arrive: false, // 기본값
      });

      // 서버 응답 처리
      if (response && response.status === 201) {
        message.success("발주 이력이 성공적으로 저장되었습니다.");
        console.log("생성된 발주 이력:", response.data);
        // 필요 시 발주 이력 ID를 상태로 저장하거나 추가 작업 수행
        setIsModalOpen(true);
        fetchOrders();
      }
    } catch (error) {
      console.error("발주 이력 저장 오류:", error);
      message.error("발주 이력을 저장하는 데 실패했습니다.");
    }
  };

  const handleEdit = (id) => {
    setIsEditModalOpen(true);
  };

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
      title: "거래처 명",
      dataIndex: "provider_name",
      key: "provider_name",
    },
    {
      title: "수령 여부",
    },
    {
      title: "입고 일자",
    },
    {
      title: "동작",
      key: "action",
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              handleEdit(record.pk);
            }}
          >
            수정
          </a>
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
      <Row
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <SearchProvider
          selectedProvider={selectedProvider}
          setSelectedProvider={(providers) => setSelectedProvider(providers[0])}
          multiple={false}
        />
        <Popconfirm
          title="발주 이력을 추가하시겠습니까?"
          onConfirm={handleOrder}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!selectedProvider}
          >
            발주 추가
          </Button>
        </Popconfirm>
      </Row>
      <Table
        size="small"
        columns={columns}
        dataSource={orderHistory}
        pagination={{ pageSize: 10 }}
      />

      {/* 재고 추가, 수정 모달 */}
      <PurchaseAddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Purchase_order;
