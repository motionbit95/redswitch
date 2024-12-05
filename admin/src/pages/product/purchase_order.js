import { Button, Col, Form, Input, Modal, Row, Table } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import SearchProvider from "../../components/popover/searchprovider";
import SearchProduct from "../../components/popover/searchproduct";

const PurchaseAddModal = (props) => {
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: "상품명",
    },
    {
      title: "상품코드",
    },
    {
      title: "수량",
    },
  ];
  return (
    <Modal
      centered
      open={props.isModalOpen}
      width={700}
      onCancel={() => props.setIsModalOpen(false)}
    >
      <SearchProduct
        setSelectedProduct={(products) => setSelectedProduct(products[0])}
        setIsModalVisible={setIsModalVisible}
        multiple={false}
      />
      <Table columns={columns} />
    </Modal>
  );
};

const PurchaseEditModal = (props) => {
  return (
    <Modal
      centered
      open={props.isEditModalOpen}
      onCancel={() => props.setIsEditModalOpen(false)}
    ></Modal>
  );
};

const Purchase_order = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState();

  const handleDelete = (id) => {
    console.log(id);
  };

  const columns = [
    {
      title: "발주 일자",
    },
    {
      title: "거래처 명",
    },
    {
      title: "수령 여부",
    },
    {
      title: "입고 일자",
    },
    {
      title: "자세히보기",
      key: "action",

      render: (_, record) => <Button icon={<SearchOutlined />} />,
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          발주 추가
        </Button>
      </Row>
      <Table
        size="small"
        columns={columns}
        dataSource={[]}
        pagination={{ pageSize: 10 }}
      />
      {/* 재고 추가 모달 */}
      <PurchaseAddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <PurchaseEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </div>
  );
};

export default Purchase_order;
