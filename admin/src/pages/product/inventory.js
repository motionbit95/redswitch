import { Button, Col, Form, Input, Modal, Row, Table } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import SearchBranch from "../../components/popover/searchbranch";

const InventoryAddModal = (props) => {
  const [form] = Form.useForm();
  return (
    <Modal
      centered
      open={props.isModalOpen}
      onCancel={() => props.setIsModalOpen(false)}
    ></Modal>
  );
};

const InventoryEditModal = (props) => {
  return (
    <Modal
      centered
      open={props.isEditModalOpen}
      onCancel={() => props.setIsEditModalOpen(false)}
    ></Modal>
  );
};

const Inventory = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState();

  const handleDelete = (id) => {
    console.log(id);
  };

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
      title: "재고 수량",
      dataIndex: "inventory_cnt",
      key: "inventory_cnt",
    },
    {
      title: "재고 최소 수량",
      dataIndex: "inventory_min_cnt",
      key: "inventory_min_cnt",
    },
    {
      title: "동작",
      key: "action",

      render: (text, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => record}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.PK)}
            danger
          />
        </div>
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
        <SearchBranch
          selectedBranch={selectedBranch}
          setSelectedBranch={(branches) => setSelectedBranch(branches[0])}
          multiple={false}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          상품 추가
        </Button>
      </Row>
      <Table
        size="small"
        columns={columns}
        dataSource={[]}
        pagination={{ pageSize: 10 }}
      />
      {/* 재고 추가 모달 */}
      <InventoryAddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <InventoryEditModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
    </div>
  );
};

export default Inventory;
