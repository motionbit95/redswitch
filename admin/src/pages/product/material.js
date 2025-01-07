// Material.js - 물자 관리 화면 컴포넌트
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import Searchprovider from "../../components/popover/searchprovider";
import Addproduct from "../../components/material/product_add";
import ProductCategory from "../../components/material/product_category";
import { AxiosDelete, AxiosGet, AxiosPut } from "../../api";
import usePagination from "../../hook/usePagination";
import FileUpload from "../../components/button";

const Material = ({ currentUser }) => {
  // State 관리
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchFilters, setSearchFilters] = useState({ provider: "" });
  const [materialList, setMaterialList] = useState([]);
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

  const { pagination, setPagination, handleTableChange } = usePagination();

  // 중복된 카테고리 코드 제거
  const usedCodes = [
    ...new Set(materialList.map((item) => item.product_category_code)),
  ];

  // 거래처 선택 시 데이터 로드
  useEffect(() => {
    if (selectedProvider) {
      localStorage.setItem(
        "selectedProvider",
        JSON.stringify(selectedProvider)
      );
      fetchMaterials();
    }
  }, [selectedProvider]);

  // 카테고리 데이터 로드
  useEffect(() => {
    fetchCategories();
  }, []);

  // 물자 검색 API 호출
  const fetchMaterials = async () => {
    try {
      const response = await AxiosGet(
        `/products/materials/search/${selectedProvider.id}`
      );
      setMaterialList(response.data);
    } catch (error) {
      message.error("물자 검색 실패");
    }
  };

  // 카테고리 API 호출
  const fetchCategories = async () => {
    try {
      const response = await AxiosGet("/products/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("카테고리 불러오기 실패");
    }
  };

  // 상품 삭제 처리
  const handleDelete = async (pk) => {
    try {
      await AxiosDelete(`/products/materials/${pk}`);
      fetchMaterials();
      message.success("상품 삭제 성공");
    } catch (error) {
      message.error("상품 삭제 실패");
    }
  };

  // 수정 모달 열기
  const handleEdit = (material) => {
    setCurrentMaterial(material);
    setEditModalOpen(true);
  };

  // 상품 수정 API 호출
  const handleUpdate = async (values) => {
    try {
      const response = await AxiosPut(
        `/products/materials/${currentMaterial.pk}`,
        values
      );
      if (response.status === 200) {
        message.success("상품 수정 성공");
        fetchMaterials();
      } else {
        message.error("상품 수정 실패");
      }
    } catch (error) {
      message.error("상품 수정 중 오류가 발생했습니다.");
    } finally {
      setEditModalOpen(false);
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "No.",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      fixed: "left",
      width: 50,
    },
    {
      title: "상품 이미지",
      dataIndex: "original_image",
      render: (text) =>
        text ? (
          <Image src={text} alt="product" style={{ width: 40, height: 40 }} />
        ) : (
          <div
            style={{ width: 40, height: 40, backgroundColor: "#f1f1f1" }}
          ></div>
        ),
    },
    {
      title: "상품명",
      dataIndex: "product_name",
    },
    {
      title: "상품코드",
      dataIndex: "product_code",
    },
    {
      title: "카테고리",
      dataIndex: "product_category_code",
      render: (text) => {
        const category = categories.find(
          (cat) => cat.product_category_code === text
        );
        return category ? category.product_category : "Unknown";
      },
    },
    {
      title: "소비자가",
      dataIndex: "product_sale",
      render: (text) => `${parseInt(text).toLocaleString("ko-KR")}원`,
    },
    {
      title: "동작",
      key: "actions",
      render: (_, record) => (
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
      {currentUser.permission === "3" ? (
        <Alert
          type="warning"
          showIcon
          description="지사관리자 이상 권한만 접근 가능합니다."
        />
      ) : (
        <>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Searchprovider
              selectedProvider={selectedProvider}
              setSelectedProvider={(providers) =>
                setSelectedProvider(providers[0])
              }
              multiple={false}
            />
            <Space>
              <ProductCategory usedCodes={usedCodes} />
              <Addproduct
                selectedProvider={selectedProvider}
                categories={categories}
                onComplete={fetchMaterials}
              />
            </Space>
          </Space>

          <Table
            size="small"
            columns={columns}
            dataSource={materialList}
            rowKey="id"
            loading={loading}
            onChange={handleTableChange}
            pagination={{
              ...pagination,
              defaultPageSize: 10,
              showSizeChanger: true,
            }}
          />

          <Modal
            centered
            title="상품 수정"
            open={editModalOpen}
            onCancel={() => setEditModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setEditModalOpen(false)}>
                취소
              </Button>,
              <Button
                key="submit"
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
              onFinish={handleUpdate}
              initialValues={currentMaterial}
              layout="vertical"
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
                rules={[{ required: true, message: "상품코드를 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="소비자가"
                name="product_sale"
                rules={[{ required: true, message: "소비자가를 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="카테고리"
                    name="product_category_code"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {categories.map((category) => (
                        <Select.Option
                          key={category.product_category_code}
                          value={category.product_category_code}
                        >
                          {category.product_category}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="original_image" label="상품이미지">
                    <FileUpload
                      url={form.getFieldValue("original_image")}
                      setUrl={(url) =>
                        form.setFieldsValue({ original_image: url })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="blind_image" label="블라인드 이미지">
                    <FileUpload
                      url={form.getFieldValue("blind_image")}
                      setUrl={(url) =>
                        form.setFieldsValue({ blind_image: url })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </>
      )}
    </Space>
  );
};

export default Material;
