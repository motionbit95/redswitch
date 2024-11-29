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
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import dayjs from "dayjs";

const ProductCategory = ({ usedCodes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 추가 or 수정 모드
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const onFinish = async (values) => {
    if (isEditing) {
      // 수정 모드
      onUpdateFinish(values);
    } else {
      // 추가 모드
      onAddFinish(values);
    }
  };

  const onAddFinish = async (values) => {
    const categoryList = [
      ...new Set(categories.map((item) => item.product_category_code)),
    ];

    console.log(categoryList);
    if (categoryList.includes(values.product_category_code)) {
      message.error("이미 등록된 카테고리 코드입니다.");
    } else {
      try {
        const response = await AxiosPost("/products/categories", values);
        if (response.status === 201) {
          message.success("카테고리 추가 성공");
          fetchCategories();
        } else {
          message.error("카테고리 추가 실패");
        }
      } catch (error) {
        message.error("상품 카테고리와 코드가 필요합니다.");
      } finally {
        closeModal();
      }
    }
  };

  const onUpdateFinish = async (values) => {
    console.log(usedCodes);

    if (usedCodes.includes(currentCategory.product_category_code)) {
      message.error("사용중이라 변경 안됩니다.");
      return;
    }

    if (usedCodes.includes(values.product_category_code)) {
      message.error("이미 등록된 카테고리 코드이라 안됩니다.");
      return;
    }

    // try {
    //   const response = await AxiosPut(
    //     `/products/categories/${values.pk}`,
    //     values
    //   );
    //   if (response.status === 200) {
    //     message.success("카테고리 수정 성공");
    //     fetchCategories();
    //   } else {
    //     message.error("카테고리 수정 실패");
    //   }
    // } catch (error) {
    //   message.error("카테고리 수정 중 오류가 발생했습니다.");
    // } finally {
    //   closeModal();
    // }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async (category) => {
    console.log(usedCodes);

    // try {
    //   if (usedCodes.includes(category.product_category_code)) {
    //     message.error("해당 카테고리의 상품이 존재합니다.");
    //   } else {
    //     await AxiosDelete(`/products/categories/${category.pk}`);
    //     setCategories(
    //       categories.filter((categories) => categories.pk !== category.pk)
    //     );
    //     message.success("카테고리 삭제 성공");
    //   }
    // } catch (error) {
    //   message.error("카테고리 삭제 실패");
    // }
  };

  const columns = [
    {
      title: "카테고리",
      dataIndex: "product_category",
      key: "product_category",
      sorter: (a, b) => a.product_category.localeCompare(b.product_category),
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
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "동작",
      key: "actions",
      render: (text, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="카테고리를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record)}
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
        visible={isOpen}
        size="large"
        onClose={() => setIsOpen(false)}
        extra={
          <Space>
            <Button key="submit" type="primary" onClick={handleAdd}>
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
          rowKey="pk"
          dataSource={categories}
          loading={loading}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Drawer>

      <Modal
        width={320}
        visible={isModalOpen}
        zIndex={1100}
        onCancel={closeModal}
        title={isEditing ? "카테고리 수정" : "카테고리 추가"}
        centered
        footer={[
          <Button key="back" onClick={closeModal}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {isEditing ? "수정" : "추가"}
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="product_category" label="카테고리명">
            <Input />
          </Form.Item>
          <Form.Item name="product_category_code" label="카테고리 코드">
            <Input />
          </Form.Item>
          {isEditing && (
            <Form.Item name="pk" hidden>
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ProductCategory;
