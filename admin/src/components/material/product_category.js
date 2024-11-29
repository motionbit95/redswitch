import {
  Button,
  Drawer,
  Form,
  Input,
  Popover,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import dayjs from "dayjs";

const ProductCategory = ({ materialList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingRowKey, setIsEditingRowKey] = useState(null); // 현재 수정 중인 row의 key
  const [form] = Form.useForm();

  const [isAddPopoverVisible, setAddPopoverVisible] = useState(false); // 추가 팝오버
  const [categories, setCategories] = useState([]);
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
    if (isEditingRowKey) {
      onUpdateFinish(values);
    } else {
      onAddFinish(values);
    }
  };

  const onAddFinish = async (values) => {
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
      closeAddPopover();
    }
  };

  const onUpdateFinish = async (values) => {
    try {
      const response = await AxiosPut(
        `/products/categories/${values.pk}`,
        values
      );
      if (response.status === 200) {
        message.success("카테고리 수정 성공");
        fetchCategories();
      } else {
        message.error("카테고리 수정 실패");
      }
    } catch (error) {
      message.error("카테고리 수정 중 오류가 발생했습니다.");
    } finally {
      closeEditPopover();
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setAddPopoverVisible(true);
  };

  const handleEdit = (category) => {
    form.setFieldsValue(category);
    setIsEditingRowKey(category.pk); // 현재 수정 중인 row의 key 설정
  };

  const closeAddPopover = () => {
    setAddPopoverVisible(false);
    form.resetFields();
  };

  const closeEditPopover = () => {
    setIsEditingRowKey(null);
    form.resetFields();
  };

  const handleDelete = async (category) => {
    const searchMaterialCode = materialList.map(
      (material) => material.product_category_code
    );
    try {
      if (searchMaterialCode.includes(category.product_category_code)) {
        message.error("해당 카테고리의 상품이 존재합니다.");
      } else {
        await AxiosDelete(`/products/categories/${category.pk}`);
        setCategories(
          categories.filter((categories) => categories.pk !== category.pk)
        );
        message.success("카테고리 삭제 성공");
      }
    } catch (error) {
      message.error("카테고리 삭제 실패");
    }
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
          <Popover
            content={editPopoverContent(record)}
            title="카테고리 수정"
            trigger="click"
            visible={isEditingRowKey === record.pk}
            onVisibleChange={(visible) =>
              visible ? handleEdit(record) : closeEditPopover()
            }
            placement="bottomRight"
          >
            <a>수정</a>
          </Popover>
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

  const addPopoverContent = (
    <div style={{ width: 300 }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="product_category"
          label="카테고리명"
          rules={[{ required: true, message: "카테고리명을 입력해주세요." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="product_category_code"
          label="카테고리 코드"
          rules={[{ required: true, message: "카테고리 코드를 입력해주세요." }]}
        >
          <Input />
        </Form.Item>
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button style={{ marginRight: 8 }} onClick={closeAddPopover}>
            취소
          </Button>
          <Button type="primary" htmlType="submit">
            추가
          </Button>
        </div>
      </Form>
    </div>
  );

  const editPopoverContent = (record) => (
    <div style={{ width: 300 }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="product_category"
          label="카테고리명"
          rules={[{ required: true, message: "카테고리명을 입력해주세요." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="product_category_code"
          label="카테고리 코드"
          rules={[{ required: true, message: "카테고리 코드를 입력해주세요." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="pk" hidden>
          <Input />
        </Form.Item>
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button style={{ marginRight: 8 }} onClick={closeEditPopover}>
            취소
          </Button>
          <Button type="primary" htmlType="submit">
            수정
          </Button>
        </div>
      </Form>
    </div>
  );

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>카테고리 설정</Button>

      <Drawer
        visible={isOpen}
        size="large"
        onClose={() => setIsOpen(false)}
        extra={
          <Space>
            <Popover
              content={addPopoverContent}
              title="카테고리 추가"
              trigger="click"
              visible={isAddPopoverVisible}
              onVisibleChange={(visible) =>
                visible ? handleAdd() : closeAddPopover()
              }
              placement="bottomLeft"
            >
              <Button key="submit" type="primary">
                추가
              </Button>
            </Popover>
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
    </>
  );
};

export default ProductCategory;
