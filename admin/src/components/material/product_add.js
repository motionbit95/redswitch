import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import FileUpload from "../button";
import { AxiosGet, AxiosPost } from "../../api";
import { PlusOutlined } from "@ant-design/icons";

const Addproduct = ({
  selectedProvider,
  isSelected,
  categories,
  onComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddProduct = async (values) => {
    console.log(
      values,
      selectedProvider.provider_name,
      selectedProvider.provider_code,
      selectedProvider.id
    );
    try {
      const response = await AxiosPost("/products/materials", {
        ...values,
        provider_id: selectedProvider.id,
        provider_name: selectedProvider.provider_name,
        provider_code: selectedProvider.provider_code,
      });
      if (response.status === 201) {
        message.success("상품 추가 성공");
        console.log(response.data);
        setIsModalOpen(false);
        form.resetFields();
        onComplete();
      } else {
        message.error("상품 추가 실패");
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("상품 추가 실패");
    }
  };

  return (
    <>
      <Button
        type="primary"
        disabled={!selectedProvider}
        onClick={() => setIsModalOpen(true)}
        icon={<PlusOutlined />}
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
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            추가
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item
            label="거래처명"
            tooltip={"현재 관리중인 거래처명이 표시됩니다."}
          >
            <Input value={selectedProvider?.provider_name} readOnly />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product_name"
                label="상품명"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="product_price"
                label="소비자가"
                tooltip={"상품 소비자가를 입력해주세요."}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
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
              <Form.Item name="product_image" label="상품이미지">
                <FileUpload
                  url={form.getFieldValue("product_image")}
                  setUrl={(url) => form.setFieldsValue({ product_image: url })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="blind_image" label="블라인드 이미지">
                <FileUpload
                  url={form.getFieldValue("blind_image")}
                  setUrl={(url) => form.setFieldsValue({ blind_image: url })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product_detail_image" label="블라인드 이미지">
                <FileUpload
                  url={form.getFieldValue("product_detail_image")}
                  setUrl={(url) =>
                    form.setFieldsValue({ product_detail_image: url })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Addproduct;
