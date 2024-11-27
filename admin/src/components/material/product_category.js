import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { AxiosDelete, AxiosGet, AxiosPost } from "../../api";

const ProductCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    console.log(categories);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await AxiosGet("/products/categories"); // Replace with your endpoint
      setCategories(response.data);
    } catch (error) {
      message.error("실패");
    } finally {
      setLoading(false);
      console.log(categories);
    }
  };

  const onAddFinish = async (values) => {
    console.log("Success:", values);
    try {
      const response = await AxiosPost("/products/categories", values);
      if (response.status === 201) {
        message.success("카테고리 추가 성공");
        setIsModalOpen(false);
        fetchCategories();
      } else {
        message.error("카테고리 추가 실패");
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("상품 카테고리와 코드가 필요합니다.");
    }
  };

  const handleEdit = (category) => {
    console.log(category);
    form.setFieldsValue(category); // Set the form fields to current category values
    setIsModalOpen(true);
  };

  const handleDelete = async (pk) => {
    console.log(pk);
    try {
      await AxiosDelete(`/products/categories/${pk}`);
      setCategories(categories.filter((categories) => categories.pk !== pk));
      message.success("가맹점 삭제 성공");
    } catch (error) {
      message.error("가맹점 삭제 실패");
    }
  };

  const columns = [
    {
      title: "카테고리",
      dataIndex: "product_category",
      key: "product_category",

      sorter: (a, b) => {
        return a.product_category.localeCompare(b.product_category);
      },
    },
    {
      title: "상품 카테고리 코드",
      dataIndex: "product_category_code",
      key: "product_category_code",
    },
    {
      title: "생성일",
      dataIndex: "created_at",
      key: "created_at",

      render: (text) => {
        const date = new Date(text);
        return date.toLocaleString();
      },

      sorter: (a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
      },
    },
    {
      title: "동작",
      key: "actions",

      render: (text, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="카테고리를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.pk)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>카테고리 설정</Button>

      <Drawer
        open={isOpen}
        size="large"
        onClose={() => setIsOpen(false)}
        extra={
          <Space>
            <Button
              key="submit"
              type="primary"
              onClick={() => setIsModalOpen(true)}
            >
              추가
            </Button>
            <Button key="back" onClick={() => setIsOpen(false)}>
              닫기
            </Button>
          </Space>
        }
      >
        <Table
          size="small"
          rowKey="categories"
          dataSource={categories}
          loading={loading}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Drawer>
      <Modal
        width={320}
        open={isModalOpen}
        zIndex={1100}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        title="카테고리 추가"
        centered
        footer={[
          <Button
            key="back"
            onClick={() => {
              form.resetFields();
              setIsModalOpen(false);
            }}
          >
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            추가
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onAddFinish} layout="vertical">
          <Form.Item name="product_category" label="카테고리명">
            <Input />
          </Form.Item>
          <Form.Item name="product_category_code" label="카테고리 코드">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductCategory;
