import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import FileUpload from "../button";
import { AxiosGet, AxiosPost } from "../../api";

const Addproduct = ({ selectedProvider, isSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("여기========", selectedProvider);
    fetchCategories();
  }, [selectedProvider]);

  const handleAddProduct = async (values) => {
    try {
      const response = await AxiosPost("/products/materials", {
        ...values,
        provider_id: selectedProvider.id,
        product_name: values.product_name,
        product_sale: values.product_sale,
        provider_name: selectedProvider.provider_name,
        provider_code: selectedProvider.provider_code,
        product_category_code: values.product_category_code,
      });
      if (response.status === 201) {
        message.success("상품 추가 성공");
        console.log(response.data);
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error("상품 추가 실패");
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("상품 추가 실패");
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

  return (
    <>
      <Button
        type="primary"
        disabled={!selectedProvider}
        onClick={() => setIsModalOpen(true)}
      >
        상품 추가
      </Button>

      <Modal
        open={isModalOpen}
        title="상품 추가"
        centered
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="back"
            onClick={() => {
              form.resetFields();
              setIsModalOpen(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Add
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item label="가맹점명">
            <Input value={selectedProvider?.provider_name} disabled />
          </Form.Item>

          <Form.Item
            name="product_name"
            label="상품명"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product_sale"
            label="원가"
            rules={[{ required: true }]}
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
                  {categories
                    // .map((item) => item.product_category)
                    .map(
                      ({ product_category, product_category_code }, index) => (
                        <Select.Option
                          key={index}
                          value={product_category_code}
                        >
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
    </>
  );
};

export default Addproduct;
