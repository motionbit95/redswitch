import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import SelectBranch from "../../components/searchbranch";

const ProductCRUD = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();
  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem("selectedBranch")
      ? JSON.parse(localStorage.getItem("selectedBranch"))
      : null
  );

  // 상품 목록 불러오기
  const fetchProducts = async () => {
    try {
      const response = await AxiosGet("/products");
      setProducts(response.data);
    } catch (error) {
      message.error("상품 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 상품 추가/수정 모달 열기
  const showModal = (product = null) => {
    setCurrentProduct(product);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 모달 닫기
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 상품 추가/수정 처리
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentProduct) {
        // 수정
        await AxiosPut(`/products/${currentProduct.PK}`, values);
        message.success("상품이 수정되었습니다.");
      } else {
        // 추가
        await AxiosPost("/products", values);
        message.success("상품이 추가되었습니다.");
      }
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error("상품을 처리하는 데 실패했습니다.");
    }
  };

  // 상품 삭제 처리
  const handleDelete = async (PK) => {
    try {
      await AxiosDelete(`/products/${PK}`);
      message.success("상품이 삭제되었습니다.");
      fetchProducts();
    } catch (error) {
      message.error("상품 삭제에 실패했습니다.");
    }
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "상품 코드",
      dataIndex: "product_code",
      key: "product_code",
    },
    {
      title: "상품명",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "가격",
      dataIndex: "product_price",
      key: "product_price",
    },
    {
      title: "작업",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.PK)}
            danger
          />
        </div>
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
        <SelectBranch
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          상품 추가
        </Button>
      </Row>
      <Table columns={columns} dataSource={products} rowKey="PK" />

      {/* 상품 추가/수정 모달 */}
      <Modal
        title={currentProduct ? "상품 수정" : "상품 추가"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={currentProduct ? "수정" : "추가"}
      >
        <Form form={form} layout="vertical" initialValues={currentProduct}>
          <Form.Item
            label="지점 ID"
            name="branch_id"
            rules={[{ required: true, message: "지점 ID를 입력해주세요" }]}
          >
            <Input placeholder="지점 ID" />
          </Form.Item>
          <Button style={{ marginBottom: 16 }}>상품 코드 검색</Button>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="상품 코드"
                name="product_code"
                rules={[
                  { required: true, message: "상품 코드를 입력해주세요" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="상품명"
                name="product_name"
                rules={[{ required: true, message: "상품명을 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="판매 가격"
            name="product_price"
            rules={[{ required: true, message: "판매 가격을 입력해주세요" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="상품 이미지"
                name="product_image"
                rules={[
                  { required: true, message: "상품 이미지 URL을 입력해주세요" },
                ]}
              >
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>이미지 업로드</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="미리보기 방지 이미지" name="blurred_image">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>이미지 업로드</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCRUD;
