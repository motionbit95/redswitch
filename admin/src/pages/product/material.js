import {
  Alert,
  Button,
  Col,
  Descriptions,
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
import ProductCategory from "../../components/material/product_category";
import { AxiosDelete, AxiosGet, AxiosPut, AxiosPost } from "../../api";
import usePagination from "../../hook/usePagination";
import FileUpload from "../../components/button";
import useSearchFilter from "../../hook/useSearchFilter";

const MaterialModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  formFields,
  extraFields,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Modal
      open={visible}
      title={initialValues ? "상품 수정" : "상품 추가"}
      width={800}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>취소</Button>
          <Button
            type="primary"
            onClick={() => onSubmit(form.getFieldsValue())}
          >
            저장
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={() => onSubmit(form.getFieldsValue())}
      >
        <Descriptions column={2} bordered>
          {formFields.map((field) => (
            <Descriptions.Item
              span={field.name === "product_name" ? 2 : 1}
              key={field.name}
              label={field.label}
            >
              <Form.Item name={field.name} rules={field.rules}>
                {field.type === "select" ? (
                  <Select
                    options={field.options}
                    defaultValue={
                      initialValues?.[field.name] || field.options?.[0]?.value
                    }
                    onChange={(value) =>
                      form.setFieldsValue({ [field.name]: value })
                    }
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    defaultValue={initialValues?.[field.name] || ""}
                    onChange={(e) =>
                      form.setFieldsValue({ [field.name]: e.target.value })
                    }
                  />
                )}
              </Form.Item>
            </Descriptions.Item>
          ))}

          {extraFields.map((field) => (
            <>
              <Descriptions.Item
                key={field.name}
                span={field.name === "product_detail_image" ? 2 : 1}
                label={
                  <Space direction="vertical">
                    <div>{field.label}</div>
                    <Form.Item name={field.name}>
                      {field.name === "product_detail_image" && (
                        <FileUpload
                          url={form.getFieldValue("product_detail_image")}
                          setUrl={(url) =>
                            form.setFieldsValue({ product_detail_image: url })
                          }
                        />
                      )}
                      {field.name === "original_image" && (
                        <FileUpload
                          url={form.getFieldValue("original_image")}
                          setUrl={(url) =>
                            form.setFieldsValue({ original_image: url })
                          }
                        />
                      )}
                      {field.name === "blind_image" && (
                        <FileUpload
                          url={form.getFieldValue("blind_image")}
                          setUrl={(url) =>
                            form.setFieldsValue({ blind_image: url })
                          }
                        />
                      )}
                    </Form.Item>
                  </Space>
                }
              >
                <div
                  style={{
                    height: field.name === "product_detail_image" ? 300 : 100,
                    overflow: "scroll",
                  }}
                >
                  <Image
                    preview={false}
                    src={form.getFieldValue(field.name)}
                    style={{
                      objectFit: "contain",
                      width:
                        field.name === "product_detail_image" ? "100%" : 100,
                    }}
                  />
                </div>
              </Descriptions.Item>
            </>
          ))}
        </Descriptions>
      </Form>
    </Modal>
  );
};

const Material = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [materialList, setMaterialList] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(
    localStorage.getItem("selectedProvider")
      ? JSON.parse(localStorage.getItem("selectedProvider"))
      : null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [categories, setCategories] = useState([]);
  const { pagination, handleTableChange } = usePagination();

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    if (selectedProvider) {
      localStorage.setItem(
        "selectedProvider",
        JSON.stringify(selectedProvider)
      );
      fetchMaterials();
    }
  }, [selectedProvider]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await AxiosGet("/products/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("카테고리 불러오기 실패");
    }
  };

  const handleDelete = async (pk) => {
    try {
      await AxiosDelete(`/products/materials/${pk}`);
      fetchMaterials();
      message.success("상품 삭제 성공");
    } catch (error) {
      message.error("상품 삭제 실패");
    }
  };

  const handleEdit = (material) => {
    setCurrentMaterial(material);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentMaterial(null);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      console.log({
        ...values,
        provider_id: selectedProvider.id,
        provider_name: selectedProvider.provider_name,
        provider_code: selectedProvider.provider_code,
      });
      const apiCall = currentMaterial
        ? AxiosPut(`/products/materials/${currentMaterial.pk}`, values)
        : AxiosPost("/products/materials", {
            ...values,
            provider_id: selectedProvider.id,
            provider_name: selectedProvider.provider_name,
            provider_code: selectedProvider.provider_code,
          });

      const response = await apiCall;
      if (response.status === (currentMaterial ? 200 : 201)) {
        message.success(currentMaterial ? "상품 수정 성공" : "상품 추가 성공");
        fetchMaterials();
        setModalOpen(false);
      } else {
        message.error("상품 처리 실패");
      }
    } catch (error) {
      message.error("상품 처리 중 오류가 발생했습니다.");
    }
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
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "상품코드",
      dataIndex: "product_code",
      ...getColumnSearchProps("product_code"),
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
      filters: categories.map((category) => ({
        text: category.product_category,
        value: category.product_category_code,
      })),
      onFilter: (value, record) => record.product_category_code === value,
    },
    {
      title: "소비자가",
      dataIndex: "product_sale",
      render: (text) => `${parseInt(text).toLocaleString("ko-KR")}원`,
      sorter: (a, b) => a.product_sale - b.product_sale,
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
              <ProductCategory
                usedCodes={[
                  ...new Set(
                    materialList.map((item) => item.product_category_code)
                  ),
                ]}
                materialList={materialList}
              />
              <Button
                type="primary"
                disabled={!selectedProvider}
                onClick={handleAdd}
              >
                상품 추가
              </Button>
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

          <MaterialModal
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleSubmit}
            initialValues={currentMaterial}
            formFields={[
              {
                name: "product_name",
                label: "상품명",
                rules: [{ required: true, message: "상품명을 입력해주세요" }],
              },
              {
                name: "product_sale",
                label: "소비자가",
                rules: [{ required: true, message: "소비자가를 입력해주세요" }],
              },
              {
                name: "product_category_code",
                label: "카테고리",
                type: "select",
                options: categories.map((category) => ({
                  value: category.product_category_code,
                  label: category.product_category,
                })),
                rules: [{ required: true }],
              },
            ]}
            extraFields={[
              {
                name: "original_image",
                label: "상품이미지",
                type: "file",
              },
              {
                name: "blind_image",
                label: "블라인드 이미지",
                type: "file",
              },
              {
                name: "product_detail_image",
                label: "상품상세이미지",
                type: "file",
              },
            ]}
          />
        </>
      )}
    </Space>
  );
};

export default Material;
