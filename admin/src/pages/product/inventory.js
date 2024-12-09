import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import SearchBranch from "../../components/popover/searchbranch";
import { useEffect } from "react";
import { AxiosGet, AxiosPost, AxiosPut } from "../../api";

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

const Inventory = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem("selectedBranch")
      ? JSON.parse(localStorage.getItem("selectedBranch"))
      : null
  );
  const [products, setProducts] = useState([]);

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRowKey, setEditRowKey] = useState(null);

  // 상품 목록 불러오기
  const fetchProducts = async () => {
    try {
      const response = await AxiosGet(`/products/search/${selectedBranch.id}`);
      const productsWithKeys = response.data.map((product) => ({
        ...product,
        key: product.PK,
      }));
      setProducts(productsWithKeys);
    } catch (error) {
      message.error("상품 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditInventory = (inventory) => {
    setEditRowKey(inventory.key);
  };

  const handleEditInventoryCancel = () => {
    setEditRowKey(null);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleTablePageChange = (pagination) => {
    setPagination(pagination);
  };

  const handlePageChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "No.",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      fixed: "left",
      width: 50,
    },
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
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
          setSelectedBranch={(branches) => {
            setSelectedBranch(branches[0]);
            localStorage.setItem("selectedBranch", JSON.stringify(branches[0]));
          }}
          multiple={false}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          disabled={selectedRowKeys.length === 0}
          onClick={() => setIsModalOpen(true)}
        >
          발주 추가
        </Button>
      </Row>
      <Table
        size="small"
        columns={columns}
        dataSource={products}
        rowSelection={rowSelection}
        onChange={(pagination, filters, sorter) => {
          handleTablePageChange(pagination);
          handlePageChange(pagination, filters, sorter);
        }}
        pagination={{
          ...pagination,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
      {/* 재고 추가 모달 */}
      <InventoryAddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Inventory;
