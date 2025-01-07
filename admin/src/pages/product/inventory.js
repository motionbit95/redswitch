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
import useSearchFilter from "../../hook/useSearchFilter";
import usePagination from "../../hook/usePagination";
import { set } from "firebase/database";

// 발주 추가 모달
const AddModal = (props) => {
  const { data, onComplete, isModalOpen, setIsModalOpen, selectedBranch } =
    props;
  const [form] = Form.useForm();
  const [products, setProducts] = useState(data);

  useEffect(() => {
    setProducts(data);
    console.log("요기!!!!!", products);
  }, [data]);

  // 발주 수량 변경
  const handleQuantityChange = (value, record) => {
    console.log(value, record);
    setProducts((prevData) =>
      prevData.map((item) =>
        item.key === record ? { ...item, ordered_cnt: value } : item
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

  // 발주 신청 - 지점
  const handleSubmit = async () => {
    if (!products.length) {
      message.error("발주할 상품이 없습니다.");
      return;
    }

    // if (products.some((item) => !item.ordered_cnt || item.ordered_cnt <= 0)) {
    //   message.error("발주수량을 입력해주세요.");
    //   return;
    // }

    if (!selectedBranch) {
      message.error("지점을 선택해주세요.");
      return;
    }

    // ordering_history (발주내역) 생성 시 발주상품 생성하도록 수정 - 20241224
    try {
      const formattedProducts = products.map((product) => ({
        material_id: product.material_id, // 서버에서 사용되는 상품 식별자
        ordered_cnt: product.ordered_cnt, // 발주 수량
      }));
      console.log("발주 상품 등록 > ", formattedProducts);

      const response = await AxiosPost("/products/ordering_history", {
        branch_id: selectedBranch.id,
        products: formattedProducts,
      });
      if (response.status === 201) {
        console.log("발주 상품 등록 완료 > ", response.data);
        setIsModalOpen(false);
        onComplete();
      } else {
        message.error("발주 상품 생성 실패");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
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
          defaultValue={0}
          value={record.ordered_cnt || 0}
          min={1}
          onChange={(value) => handleQuantityChange(value, record.key)}
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
  ];

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
      <Table size="small" dataSource={products} columns={columns} />
    </Modal>
  );
};

const Inventory = (props) => {
  const [form] = Form.useForm();
  const { currentUser } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getColumnSearchProps } = useSearchFilter();

  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem("selectedBranch")
      ? JSON.parse(localStorage.getItem("selectedBranch"))
      : null
  );

  const [editRowKey, setEditRowKey] = useState(null);
  const [editedInventory, setEditedInventory] = useState({});

  const { pagination, setPagination, handleTableChange } = usePagination(10); // Default page size is 10

  useEffect(() => {
    if (selectedBranch) {
      fetchProducts();
      fetchInventories();
    }
  }, [selectedBranch]);

  // 상품 목록 불러오기
  const fetchProducts = async () => {
    try {
      const response = await AxiosGet(`/products/search/${selectedBranch.id}`);
      setProducts(response.data);
    } catch (error) {
      message.error("상품을 불러오는 데 실패했습니다.");
    }
  };

  // 재고 목록 불러오기
  const fetchInventories = async () => {
    try {
      const response = await AxiosGet(`/products/inventories/`);
      setInventories(response.data);
    } catch (error) {
      message.error("재고 목록을 불러오는 데 실패했습니다.");
    }
  };

  // 필터된 재고 목록
  useEffect(() => {
    const filteredInventories = products.map((product) => {
      const matchingInventory = inventories.find(
        (inventory) => inventory.pk === product.PK
      );

      // 매칭되는 재고가 있다면 데이터 결합
      if (matchingInventory) {
        return {
          product_code: product.product_code,
          product_name: product.product_name,
          inventory_cnt: matchingInventory.inventory_cnt || 0,
          inventory_min_cnt: matchingInventory.inventory_min_cnt || 0,
          ordered_cnt: matchingInventory.ordered_cnt || 0,
          key: product.PK,
          material_id: product.material_id,
        };
      }

      // 매칭되는 재고가 없으면 기본값 반환
      return {
        product_code: product.product_code,
        product_name: product.product_name,
        inventory_cnt: 0,
        inventory_min_cnt: 0,
        ordered_cnt: 0,
        key: product.PK,
        material_id: product.material_id,
      };
    });

    setFilteredInventories(filteredInventories);
  }, [products, inventories]);

  // 상품 수정 버튼
  const handleEditInventory = (product) => {
    console.log(product.PK);
    setEditRowKey(product.PK);
    setEditedInventory({
      inventory_cnt: product.inventory_cnt || 0,
      inventory_min_cnt: product.inventory_min_cnt || 0,
    });
  };

  // 재고 수량 변경
  const handleInputChange = (field, value, inventory) => {
    console.log(inventory.PK, field, value);
    setEditedInventory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 재고 수량 변경 완료 버튼
  const handleSubmit = async (record) => {
    console.log(
      "인벤토리 수량은?",
      record.inventory_cnt,
      record.inventory_min_cnt
    );
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

  // 재고 수량 변경 취소 버튼
  const handleEditInventoryCancel = () => {
    setEditRowKey(null);
    setEditedInventory({});
  };

  // 페이지 변경 이벤트
  const handlePageChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
  };

  // 발주 선택 리스트
  const onSelectChange = (newSelectedRowKeys) => {
    console.log(
      "selectedRowKeys changed: ",
      newSelectedRowKeys,
      filteredInventories
    );
    setSelectedRowKeys(newSelectedRowKeys);
    const filteredProducts = filteredInventories.filter((product) =>
      newSelectedRowKeys.includes(product.key)
    );
    console.log("????", filteredProducts);
    setSelectedProducts(filteredProducts);
  };

  // 테이블 row 선택 체크박스
  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
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
      ...getColumnSearchProps("product_name"),
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
        ) : (
          // 재고 수량이 재고 한도보다 작으면 빨간색
          <div
            style={{
              color:
                record.inventory_cnt <= record.inventory_min_cnt
                  ? "red"
                  : "inherit",
            }}
          >
            {`${text}` || 0}
          </div>
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
        ) : (
          // 재고 최소 수량이 없으면 0
          <div>{`${text}` || 0}</div>
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
          currentUser={currentUser}
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
        dataSource={filteredInventories}
        rowSelection={rowSelection}
        onChange={(pagination) => {
          handleTableChange(pagination);
          handlePageChange(pagination);
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
        selectedBranch={selectedBranch}
        onComplete={(data) => {
          setSelectedRowKeys([]);
        }}
      />
    </div>
  );
};

export default Inventory;
