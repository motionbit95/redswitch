import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import Searchprovider from "../../components/searchprovider";
import Addproduct from "../../components/material/product_add";
import ProductCategory from "../../components/material/product_category";
import { AxiosDelete, AxiosGet, AxiosPut } from "../../api";
import FileUpload from "../../components/button";

const Material = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({
    provider: "",
  });
  const [materialList, setMaterialList] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    localStorage.getItem("selectedProvider")
      ? JSON.parse(localStorage.getItem("selectedProvider"))
      : null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    if (selectedProvider) {
      localStorage.setItem(
        "selectedProvider",
        JSON.stringify(selectedProvider)
      );
      handleSearchMaterials();
    }
  }, [selectedProvider]);

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const handleSearchMaterials = async () => {
    console.log(">>>>>>", selectedProvider.provider_name);
    try {
      const response = await AxiosGet(
        `/products/materials/search/${selectedProvider.id}`
      );
      setMaterialList(response.data);
    } catch (error) {
      message.error("실패");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await AxiosGet("/products/categories"); // Replace with your endpoint
      setCategories(response.data);
    } catch (error) {
      message.error("실패");
    } finally {
      setLoading(false);
      // console.log(categories);
    }
  };

  const handleDelete = async (material) => {
    console.log(material);
    try {
      await AxiosDelete(`/products/materials/${material}`);
      handleSearchMaterials();
      message.success("상품 삭제 성공");
    } catch (error) {
      message.error("상품 삭제 실패");
    }
  };

  // Edit material - Open modal
  const handleEdit = (material) => {
    console.log(material);
    setCurrentMaterial(material);
    setEditModalOpen(true);
  };

  const onUpdateProductFinish = async (values) => {
    console.log(values);
    // try {
    //   const response = await AxiosPut(
    //     `/products/materials/${values.pk}`,
    //     values
    //   );
    //   if (response.status === 200) {
    //     message.success("상품 수정 성공");
    //     handleSearchMaterials();
    //   } else {
    //     message.error("상품 수정 실패");
    //   }
    // } catch (error) {
    //   message.error("상품 수정 중 오류가 발생했습니다.");
    // } finally {
    //   setEditModalOpen(false);
    // }
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  // Update pagination state on change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleChange = (pagination, filters, sorter) => {
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
      title: "카테고리",
      dataIndex: "product_category_code",
      key: "product_category_code",

      render: (text) => {
        const category = categories.find(
          (category) => category.product_category_code === text
        );
        return category ? category.product_category : "Unknown";
      },
    },
    {
      title: "원가",
      dataIndex: "product_sale",
      key: "product_sale",
    },
    {
      title: "동작",
      key: "actions",

      render: (text, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="상품을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.pk)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Searchprovider
            setSelectedProvider={setSelectedProvider}
            setisSelectedProvider={setIsSelected}
            onComplete={handleSearchMaterials}
          />
          {selectedProvider && (
            <>
              <div>{selectedProvider?.provider_name}</div>
            </>
          )}
        </Space>
        <Space>
          <ProductCategory />
          <Addproduct
            isSelected={isSelected}
            selectedProvider={selectedProvider}
            categories={categories}
            onComplete={() => {
              if (selectedProvider) {
                handleSearchMaterials(); // 선택된 가맹점이 있는 경우만 데이터를 다시 불러옴
              }
            }}
          />
        </Space>
      </Space>

      <Table
        size="small"
        columns={columns}
        dataSource={materialList}
        rowKey="id"
        loading={loading}
        onChange={(pagination, filters, sorter) => {
          handleTableChange(pagination);
          handleChange(pagination, filters, sorter);
        }}
        pagination={{
          ...pagination,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
      <Modal
        title="상품 수정"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setEditModalOpen(false)}>
            취소
          </Button>,
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            수정
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={onUpdateProductFinish}
          initialValues={currentMaterial}
          layout="vertical"
          style={{ width: "100%" }}
        >
          <Form.Item
            label="상품명"
            name="product_name"
            rules={[{ required: true, message: "상품명을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="상품코드"
            name="product_code"
            rules={[{ required: true, message: "상품코드을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="원가"
            name="product_sale"
            rules={[{ required: true, message: "원가을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product_category_code"
                label="카테고리"
                rules={[{ required: true }]}
              >
                <Select>
                  {categories.map(
                    ({ product_category, product_category_code }, index) => (
                      <Select.Option key={index} value={product_category_code}>
                        {product_category}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="original_image" label="상품이미지">
                <FileUpload />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Space>
  );
};

export default Material;
