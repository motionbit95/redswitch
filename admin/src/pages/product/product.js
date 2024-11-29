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
  Descriptions,
  Space,
  Typography,
  Switch,
  Popconfirm,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import SearchBranch from "../../components/popover/searchbranch";
import SearchProduct from "../../components/popover/searchproduct";
import ToastEditor from "../../components/toasteditor";
import FileUpload from "../../components/button";
import Material from "./material";

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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // 연관 상품 리스트

  const [useBlurImage, setUseBlurImage] = useState(true);
  const [blurred_image, setBlurredImage] = useState(null);

  // 상품 목록 불러오기
  const fetchProducts = async () => {
    try {
      const response = await AxiosGet(`/products/search/${selectedBranch.id}`);
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

    console.log("선택된 상품 : ", product);
    if (product) {
      AxiosGet(`/products/materials/${product.material_id}`)
        .then((response) => {
          setSelectedProduct(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      if (product.related_products && product.related_products.length > 0) {
        let relatedProducts = [];
        product.related_products.forEach((element) => {
          console.log(element);
          AxiosGet(`/products/materials/${element}`)
            .then((response) => {
              relatedProducts.push(response.data);
              setRelatedProducts(relatedProducts);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    }
    setIsModalVisible(true);
  };

  // 모달 닫기
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 상품 추가/수정 처리
  const handleOk = async () => {
    if (!selectedProduct) {
      message.error("상품를 선택해주세요.");
      return;
    }

    try {
      const values = await form.validateFields();
      if (currentProduct) {
        // 수정
        await AxiosPut(`/products/${currentProduct.PK}`, values);
        message.success("상품이 수정되었습니다.");
      } else {
        // 추가
        let relatedProductPKs = relatedProducts.map((product) => product.pk);

        await AxiosPost("/products", {
          ...values, // 폼에 입력 되는 정보 - 상품명, 가격, 수수료, 상세 설명
          product_code: selectedProduct.product_code, // description에 입력 되는 정보 - 상품 코드
          origin_price: selectedProduct.product_sale, // description에 입력되는 정보 - 상품 원가
          thumbnail: selectedProduct.product_image, // description에 입력되는 정보 - 상품 이미지
          material_id: selectedProduct.pk, // 물자 pk
          blurred_image: "",
          branch_id: selectedBranch.id,
          related_products: relatedProductPKs,
        });
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
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "상품 코드",
      dataIndex: "product_code",
      key: "product_code",
    },
    {
      title: "소비자 노출 상픔명",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "소비자 판매 가격",
      dataIndex: "product_price",
      key: "product_price",
    },
    {
      title: "해당 지점 추가 수수료",
      dataIndex: "additional_fee",
      key: "additional_fee",
    },
    {
      title: "연관 상품수",
      dataIndex: "related_products",
      key: "related_products",
      render: (text, record) => {
        return record.related_products.length;
      },
    },
    {
      title: "작업",
      key: "action",

      fixed: "right",
      width: 100,

      render: (text, record) => (
        <Space>
          <a
            onClick={() => {
              showModal(record);
            }}
          >
            수정
          </a>
          <Popconfirm
            title="상품을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.PK)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),

      // render: (text, record) => (
      //   <div>
      //     <Button
      //       icon={<EditOutlined />}
      //       onClick={() => showModal(record)}
      //       style={{ marginRight: 8 }}
      //     />
      //     <Button
      //       icon={<DeleteOutlined />}
      //       onClick={() => handleDelete(record.PK)}
      //       danger
      //     />
      //   </div>
      // ),
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
        <SearchBranch
          selectedBranch={selectedBranch}
          setSelectedBranch={(branches) => {
            setSelectedBranch(branches[0]);
            localStorage.setItem("selectedBranch", JSON.stringify(branches[0]));
          }}
          multiple={false}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          상품 추가
        </Button>
      </Row>
      <Table size="small" columns={columns} dataSource={products} rowKey="PK" />

      {/* 상품 추가/수정 모달 */}
      <Modal
        title={currentProduct ? "상품 수정" : "상품 추가"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // okText={currentProduct ? "수정" : "추가"}
        // cancelText="취소"
        width={800}
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel}>취소</Button>
            <Button type="primary" onClick={handleOk}>
              {currentProduct ? "수정" : "추가"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" initialValues={currentProduct}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="지점명"
                // name="branch_id"
                rules={[{ required: true, message: "지점 ID를 입력해주세요" }]}
                tooltip={"현재 관리중인 지점명이 표시됩니다."}
              >
                <Input
                  placeholder="지점명"
                  readOnly
                  value={selectedBranch?.branch_name}
                />
              </Form.Item>
            </Col>
          </Row>
          {selectedProduct ? (
            <Descriptions
              title={
                <SearchProduct
                  setSelectedProduct={(products) =>
                    setSelectedProduct(products[0])
                  }
                  setIsModalVisible={setIsModalVisible}
                  multiple={false}
                />
              }
              bordered
              column={2}
            >
              <Descriptions.Item label="거래처명">
                {selectedProduct.provider_name}
              </Descriptions.Item>
              <Descriptions.Item label="상품명">
                {selectedProduct.product_name}
              </Descriptions.Item>
              <Descriptions.Item label="상품코드">
                {selectedProduct.product_code}
              </Descriptions.Item>
              <Descriptions.Item label="원가">
                {selectedProduct.product_sale} 원
              </Descriptions.Item>
              <Descriptions.Item label="이미지">
                <Image
                  src={selectedProduct.original_image}
                  width={200}
                  height={200}
                />
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <SearchProduct
              setSelectedProduct={(products) => setSelectedProduct(products[0])}
              setIsModalVisible={setIsModalVisible}
              multiple={false}
            />
          )}

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Form.Item
                tooltip={"소비자 페이지에 노출되는 상품명입니다."}
                label="소비자 노출 상픔명"
                name="product_name"
                rules={[{ required: true, message: "상품명을 입력해주세요" }]}
              >
                <Input placeholder="소비자 페이지에 노출되는 상품명을 입력해주세요." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="소비자 판매 가격"
                name="product_price"
                rules={[
                  { required: true, message: "판매 가격을 입력해주세요" },
                  {
                    pattern: /^[0-9]*$/,
                    message: "판매 가격는 숫자만 입력 가능입니다.",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} placeholder="1000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                tooltip={"해당 지점 추가 매출"}
                label="해당 지점 추가 수수료"
                name="additional_fee"
                rules={[
                  {
                    pattern: /^[0-9]*$/,
                    message: "지점 추가 수수료는 숫자만 입력 가능입니다.",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} placeholder="1000" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <Space>
                    <div>블라인드 이미지</div>
                    <Switch
                      checkedChildren="사용"
                      unCheckedChildren="사용"
                      onChange={(checked) => setUseBlurImage(!checked)}
                    />
                  </Space>
                }
                name="blurred_image"
                tooltip={"미리보기 방지 이미지, 성인인증 전 노출됩니다."}
              >
                <>
                  {!useBlurImage && (
                    <FileUpload url={blurred_image} setUrl={setBlurredImage} />
                  )}
                </>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="상품 상세 설명" name="product_detail">
                <ToastEditor initialValue={currentProduct?.product_detail} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="추가 판매 유도"
                tooltip={"연관 상품으로 추천됩니다."}
              >
                <SearchProduct
                  setSelectedProduct={(products) =>
                    setRelatedProducts(products)
                  }
                  setIsModalVisible={setIsModalVisible}
                  multiple={true}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Table
                size="small"
                dataSource={relatedProducts}
                columns={[
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
                    title: "거래처명",
                    dataIndex: "provider_name",
                    key: "provider_name",
                  },
                  {
                    title: "원가",
                    dataIndex: "product_sale",
                    key: "product_sale",
                  },
                ]}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductCRUD;
