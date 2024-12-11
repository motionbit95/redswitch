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

const AddModal = (props) => {
  const { data, onComplete, isModalOpen, setIsModalOpen } = props;
  const [form] = Form.useForm();
  const [products, setProducts] = useState(data);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  const handleQuantityChange = (value, record) => {
    console.log(value, record);
    setProducts((prevData) =>
      prevData.map((item) =>
        item.PK === record ? { ...item, ordered_cnt: value } : item
      )
    );
  };

  // 삭제 기능
  const handleDelete = (record) => {
    console.log(
      products.filter((item) => item.PK !== record),
      record
    );
    setProducts((prevData) => prevData.filter((item) => item.PK !== record));
  };

  const handleSubmit = async () => {
    if (!products.length) {
      message.error("발주할 상품이 없습니다.");
      return;
    }

    // if (products.some((item) => !item.ordered_cnt || item.ordered_cnt <= 0)) {
    //   message.error("발주수량을 입력해주세요.");
    //   return;
    // }

    console.log(
      products,
      products.map((item) => ({
        product_pk: item.PK,
        ordered_cnt: item.ordered_cnt,
      }))
    );
    // setIsModalOpen(false);
    // onComplete();
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      width={800}
      title="발주 추가"
      onCancel={() => {
        setProducts([]);
        onComplete();
        setIsModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            setProducts([]);
            onComplete();
            setIsModalOpen(false);
          }}
        >
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          확인
        </Button>,
      ]}
    >
      <Table
        size="small"
        dataSource={products}
        columns={[
          {
            title: "No.",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
          },
          {
            title: "상품명",
            dataIndex: "product_name",
            key: "product_name",
          },
          {
            title: "현재 재고",
            dataIndex: "inventory_cnt",
            key: "inventory_cnt",
          },
          {
            title: "발주수량",
            dataIndex: "ordered_cnt",
            key: "ordered_cnt",

            render: (_, record) => (
              <InputNumber
                size="small"
                defaultValue={record.ordered_cnt || 0}
                min={1}
                onChange={(value) => handleQuantityChange(value, record.PK)}
              />
            ),
          },
          {
            title: "동작",
            key: "action",

            render: (_, record) => (
              <Space>
                <a onClick={() => handleDelete(record.PK)}>삭제</a>
              </Space>
            ),
          },
        ]}
      />
    </Modal>
  );
};

const Inventory = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem("selectedBranch")
      ? JSON.parse(localStorage.getItem("selectedBranch"))
      : null
  );
  const [products, setProducts] = useState([]);

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editRowKey, setEditRowKey] = useState(null);
  const [editedInventory, setEditedInventory] = useState({});

  // 상품 목록 불러오기
  const fetchProducts = async () => {
    try {
      const productsResponse = await AxiosGet(
        `/products/search/${selectedBranch.id}`
      );
      const inventoriesResponse = await AxiosGet(`/products/inventories`);

      console.log("Products:", productsResponse.data);
      console.log("Inventories:", inventoriesResponse.data);

      const inventoriesMap = {};
      inventoriesResponse.data.forEach((inventory) => {
        inventoriesMap[inventory.pk] = inventory;
      });

      const productsWithInventories = productsResponse.data.map((product) => ({
        ...product,
        key: product.PK,
        inventory_cnt: inventoriesMap[product.PK]?.inventory_cnt || 0,
        inventory_min_cnt: inventoriesMap[product.PK]?.inventory_min_cnt || 0,
      }));

      setProducts(productsWithInventories);
    } catch (error) {
      message.error("상품 및 재고 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditInventory = (product) => {
    console.log(product.PK);
    setEditRowKey(product.PK);
    setEditedInventory({
      inventory_cnt: product.inventory_cnt || 0,
      inventory_min_cnt: product.inventory_min_cnt || 0,
    });
  };

  const handleInputChange = (field, value, inventory) => {
    console.log(inventory.PK, field, value);
    setEditedInventory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (record) => {
    try {
      if (record.inventory_cnt !== undefined) {
        // 재고 수정
        await AxiosPut(`/products/inventories/${record.PK}`, {
          ...record,
          inventory_cnt: editedInventory.inventory_cnt,
          inventory_min_cnt: editedInventory.inventory_min_cnt,
        });
        message.success("재고가 성공적으로 수정되었습니다.");
        fetchProducts();
      } else {
        // 재고 생성
        console.log(record.PK);
        await AxiosPost(`/products/inventories`, {
          ...record,
          product_pk: record.PK,
          inventory_cnt: editedInventory.inventory_cnt,
          inventory_min_cnt: editedInventory.inventory_min_cnt,
          branch_id: selectedBranch.id,
        });
        message.success("재고가 성공적으로 생성되었습니다.");
      }
      setEditRowKey(null);
      await fetchProducts();

      console.log("Updated products:", products);
    } catch (error) {
      message.error("재고를 저장하는 데 실패했습니다.");
    }
  };

  const handleEditInventoryCancel = () => {
    setEditRowKey(null);
    setEditedInventory({});
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
      width: 100,
      render: (text, record) =>
        editRowKey === record.PK ? (
          <InputNumber
            size="small"
            value={editedInventory.inventory_cnt}
            min={0}
            onChange={(value) =>
              handleInputChange("inventory_cnt", value, record)
            }
          />
        ) : // 재고 수량이 없으면 0
        text ? (
          text
        ) : (
          0
        ),
    },
    {
      title: "재고 한도",
      dataIndex: "inventory_min_cnt",
      key: "inventory_min_cnt",
      width: 100,
      render: (text, record) =>
        editRowKey === record.PK ? (
          <InputNumber
            size="small"
            value={editedInventory.inventory_min_cnt}
            min={0}
            onChange={(value) =>
              handleInputChange("inventory_min_cnt", value, record)
            }
          />
        ) : // 재고 최소 수량이 없으면 0
        text ? (
          text
        ) : (
          0
        ),
    },
    {
      title: "동작",
      key: "action",
      width: 150,

      render: (text, record) => (
        <Space>
          {editRowKey === record.PK ? (
            <>
              <a
                onClick={() => {
                  handleEditInventoryCancel();
                }}
              >
                취소
              </a>
              <a
                onClick={() => {
                  handleSubmit(record);
                }}
              >
                완료
              </a>
            </>
          ) : (
            <a onClick={() => handleEditInventory(record)}>수정</a>
          )}
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const filteredProducts = products.filter((product) =>
      newSelectedRowKeys.includes(product.PK)
    );
    setSelectedProducts(filteredProducts);
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
      {/* 발주 추가 모달 */}
      <AddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={selectedProducts}
        onComplete={(data) => {
          setSelectedRowKeys([]);
        }}
      />
    </div>
  );
};

export default Inventory;
