import { Button, Popover, Table, Form, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../api";
import useSearchFilter from "../../hook/useSearchFilter";

const SearchProduct = ({
  selectedProduct,
  setSelectedProduct,
  multiple = false,
}) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [categories, setCategories] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await AxiosGet("/products/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("카테고리 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (search = "") => {
    try {
      AxiosGet("/products")
        .then((response) => {
          console.log(">>>>>", response.data);
          setProducts(
            response.data
              .map((item) => ({ key: item.PK, ...item }))
              .filter((item) => item.product_name.includes(search))
              .map((item) => ({ key: item.id, ...item }))
          );
        })
        .catch((error) => console.log(error)); // Replace with your endpoint
    } catch (error) {
      message.error("상품 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOK = () => {
    if (!selectedRowKeys.length) {
      message.warning("상품을 선택해주세요.");
      return;
    }

    // selectedRowKeys에 있는 key 값들로 providers에서 해당하는 항목을 찾기
    const selectProducts = products.filter((product) =>
      selectedRowKeys.includes(product.key)
    );

    // 만약 selectedProviders가 비어있다면 잘못된 지점이 선택된 경우
    if (selectProducts.length === 0) {
      message.error("잘못된 지점이 선택되었습니다.");
      return;
    }

    // 선택된 지점들을 상태에 저장
    setSelectedProduct(selectProducts); // 상태를 전체 배열로 설정
    setSelectedRowKeys([]);

    setPopoverVisible(false); // 팝오버 닫기
  };

  const columns = [
    {
      title: "상품 코드",
      dataIndex: "product_code",
      key: "product_code",
      ...getColumnSearchProps("product_code"),
    },
    {
      title: "상품명",
      dataIndex: "product_name",
      key: "product_name",
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "소비자 판매 가격",
      dataIndex: "product_price",
      key: "product_price",
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
  };

  const rowSelection = {
    type: multiple ? "checkbox" : "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const searchProducts = (value) => {
    fetchProducts(value.search);
  };

  const content = (
    <div style={{ width: 700 }}>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
        onFinish={searchProducts}
      >
        <Form.Item name="search" label="검색">
          <Input
            placeholder="상품명을 검색하세요"
            allowClear
            style={{ width: 200 }}
          />
        </Form.Item>
        <Button type="primary" onClick={() => form.submit()}>
          검색
        </Button>
      </Form>
      <Table
        size="small"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <Space style={{ marginTop: 16 }}>
        <Button
          onClick={() => {
            setPopoverVisible(false);
            setSelectedRowKeys([]);
          }}
        >
          닫기
        </Button>
        <Button type="primary" onClick={handleOK}>
          선택
        </Button>
      </Space>
    </div>
  );

  return (
    <div style={{ textAlign: "left" }}>
      <Popover
        content={content}
        title="상품을 선택해주세요."
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        placement="bottomLeft" // 버튼 아래 왼쪽 정렬
      >
        <Button>{selectedProduct?.provider_name || "상품 선택"}</Button>
      </Popover>
    </div>
  );
};

export default SearchProduct;
