import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Col,
  Descriptions,
  Space,
  Switch,
  Popconfirm,
  Image,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import ToastEditor from "../../components/toasteditor";
import FileUpload from "../../components/button";
import useSearchFilter from "../../hook/useSearchFilter";
import SearchMaterial from "../../components/popover/searchmaterial";
import SearchProduct from "../../components/popover/searchproduct";
import useExportToExcel from "../../hook/useExportToExcel";
import dayjs from "dayjs";
import { DownloadOutlined } from "@ant-design/icons";
import usePagination from "../../hook/usePagination";
import useSelectedBranch from "../../hook/useSelectedBranch";

const ProductCRUD = (props) => {
  const { currentUser } = props;
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();
  const { selectedBranch } = useSelectedBranch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // 연관 상품 리스트

  const [useBlurImage, setUseBlurImage] = useState(false);
  const [blurred_image, setBlurredImage] = useState(null);

  const { getColumnSearchProps } = useSearchFilter();

  // 상품 목록 불러오기
  const fetchProducts = async () => {
    if (!selectedBranch?.id) {
      return;
    }
    try {
      const response = await AxiosGet(`/products/search/${selectedBranch.id}`);
      setProducts(response.data);
    } catch (error) {
      message.error("상품 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedBranch]);

  // 상품 추가/수정 모달 열기
  const showModal = (product = null) => {
    console.log(">>>>>>>>>>", product);
    setCurrentProduct(product);
    form.resetFields();

    if (product) {
      AxiosGet(`/products/materials/${product.material_id}`)
        .then((response) => {
          setSelectedProduct(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      console.log("선택된 상품 : ", product);

      if (product.blurred_image) {
        setUseBlurImage(true);
        setBlurredImage(product.blurred_image);
      } else {
        setUseBlurImage(false);
        setBlurredImage(null);
      }

      if (product.related_products && product.related_products.length > 0) {
        const relatedProductsPromises = product.related_products.map(
          (element) =>
            AxiosGet(`/products/${element}`).then((response) => response.data)
        );

        // 모든 관련 제품의 데이터가 완료되면
        Promise.all(relatedProductsPromises)
          .then((relatedProductsData) => {
            setRelatedProducts(relatedProductsData); // 한 번에 상태 업데이트
          })
          .catch((error) => {
            console.log(error);
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
      message.error("상품을 선택해주세요.");
      return;
    }

    try {
      const values = await form.validateFields();
      console.log(values);

      // 추가 로직
      let relatedProductPKs = relatedProducts.map((product) => product.PK);
      console.log(relatedProductPKs);

      // 수정 로직
      if (currentProduct) {
        const updatedProduct = {
          ...values, // 폼에서 입력된 데이터
          product_code: selectedProduct.product_code, // 상품 코드
          origin_price: selectedProduct.product_sale, // 상품 원가
          thumbnail: selectedProduct.original_image, // 상품 이미지
          material_id: selectedProduct.pk, // 물자 pk
          blurred_image: selectedProduct.blurred_image
            ? selectedProduct.blurred_image
            : selectedProduct.original_image, // 수정할 이미지
          branch_id: selectedBranch.id, // 지점 ID
          related_products: relatedProductPKs, // 관련 상품 ID 리스트
        };

        console.log(updatedProduct);

        // 수정 요청: 현재 상품 PK로 수정 처리
        const response = await AxiosPut(
          `/products/${currentProduct.PK}`,
          updatedProduct
        );

        if (response.status === 200) {
          message.success("상품이 수정되었습니다.");
          fetchProducts(); // 상품 목록 다시 불러오기
          setIsModalVisible(false); // 모달 닫기
        } else {
          message.error("상품 수정 실패");
        }
      } else {
        const newProduct = {
          ...values, // 폼에 입력된 데이터
          product_code: selectedProduct.product_code,
          origin_price: selectedProduct.product_sale,
          thumbnail: selectedProduct.original_image,
          material_id: selectedProduct.pk,
          blurred_image: selectedProduct.blinded_image,
          branch_id: selectedBranch.id,
          related_products: relatedProductPKs, // 추가된 관련 상품들
        };

        console.log(newProduct);

        const response = await AxiosPost("/products", newProduct);

        if (response.status === 201) {
          message.success("상품이 추가되었습니다.");
          fetchProducts(); // 상품 목록 다시 불러오기
          setIsModalVisible(false); // 모달 닫기
        } else {
          message.error("상품 추가 실패");
        }
      }
    } catch (error) {
      console.error(error);
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

  const { pagination, setPagination, handleTableChange } = usePagination(10); // Default page size is 10

  // 소비자 상품 명, 상품 가격 가져오기
  useEffect(() => {
    if (selectedMaterial)
      form.setFieldsValue({
        product_name: selectedMaterial.product_name,
        product_price: selectedMaterial.product_sale,
      });
  }, [selectedMaterial]);

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
      title: "상품코드",
      dataIndex: "product_code",
      key: "product_code",
      ...getColumnSearchProps("product_code"),
    },
    {
      title: "소비자 노출 상품명",
      dataIndex: "product_name",
      key: "product_name",
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "소비자 판매 가격",
      dataIndex: "product_price",
      key: "product_price",
      sorter: (a, b) => a.product_price - b.product_price,
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
        return record.related_products?.length || 0;
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
    },
  ];

  const exportToExcel = useExportToExcel(
    products, // 필터된 주문 데이터
    columns.slice(1, columns.length - 2),
    "판매상품관리" + dayjs().format("YYYYMMDD")
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          상품 추가
        </Button>
        <Button
          style={{ float: "right" }}
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
        >
          엑셀 다운로드
        </Button>
      </Space>
      <Table
        size="small"
        columns={columns}
        dataSource={products}
        rowKey="PK"
        onChange={(pagination) => handleTableChange(pagination)}
        pagination={{
          ...pagination,
          showSizeChanger: true,
        }}
      />

      {/* 상품 추가/수정 모달 */}
      <ProductModal
        open={isModalVisible} // 모달 열기
        handleOk={handleOk} // 모달 추가 및 수정
        handleCancel={handleCancel} // 모달 닫기
        currentProduct={currentProduct} // 상품 정보
        relatedProducts={relatedProducts} // 연관 상품 정보
        setRelatedProducts={setRelatedProducts} // 연관 상품 선택
        selectedMaterial={selectedMaterial} // 물자 정보
        setSelectedMaterial={setSelectedMaterial} // 물자 선택
        selectedBranch={selectedBranch} // 선택된 지점 정보
      />
    </div>
  );
};

const ProductModal = (props) => {
  const {
    open,
    handleOk,
    handleCancel,
    currentProduct,
    relatedProducts,
    setRelatedProducts,
    selectedMaterial,
    setSelectedMaterial,
    selectedBranch,
  } = props;

  const [form] = Form.useForm();
  return (
    <Modal
      title={currentProduct ? "상품 수정" : "상품 추가"}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
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
        {selectedMaterial ? (
          <MaterialDescription
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
          />
        ) : (
          <SearchMaterial
            setSelectedProduct={(products) => setSelectedMaterial(products[0])}
            multiple={false}
          />
        )}

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Form.Item
              tooltip={"소비자 페이지에 노출되는 상품명입니다."}
              label="소비자 노출 상품명"
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
          <Col span={24}>
            <Form.Item label="상품 상세 설명" name="product_detail">
              <ToastEditor initialValue={currentProduct?.product_detail} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="상품 옵션"
              tooltip="옵션 이름과 가격을 입력하세요."
            >
              <Form.List name="options">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "optionName"]}
                          fieldKey={[fieldKey, "optionName"]}
                          rules={[
                            {
                              required: true,
                              message: "옵션 이름을 입력하세요.",
                            },
                          ]}
                        >
                          <Input placeholder="옵션 이름" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "optionPrice"]}
                          fieldKey={[fieldKey, "optionPrice"]}
                          rules={[
                            {
                              required: true,
                              message: "옵션 가격을 입력하세요.",
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "숫자만 입력 가능합니다.",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="옵션 가격"
                            style={{ width: 120 }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        옵션 추가
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="추가 판매 유도"
              tooltip={"연관 상품으로 추천됩니다."}
            >
              <SearchProduct
                setSelectedProduct={(products) => setRelatedProducts(products)}
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
                  title: "소비자 판매 가격",
                  dataIndex: "product_price",
                  key: "product_price",
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const MaterialDescription = (props) => {
  const { selectedMaterial, setSelectedMaterial } = props;
  return (
    <Descriptions
      title={
        <SearchMaterial
          setSelectedProduct={(products) => setSelectedMaterial(products[0])}
          multiple={false}
        />
      }
      bordered
      column={2}
    >
      <Descriptions.Item span={2} label="거래처명">
        {selectedMaterial.provider_name}
      </Descriptions.Item>
      <Descriptions.Item span={2} label="상품명">
        {selectedMaterial.product_name}
      </Descriptions.Item>
      <Descriptions.Item label="상품코드">
        {selectedMaterial.product_code}
      </Descriptions.Item>
      <Descriptions.Item label="원가">
        {selectedMaterial.product_sale} 원
      </Descriptions.Item>
      <Descriptions.Item label="이미지">
        <Image src={selectedMaterial.original_image} width={150} height={150} />
      </Descriptions.Item>
      <Descriptions.Item label="블라인드 이미지">
        <Image src={selectedMaterial.blurred_image} width={150} height={150} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ProductCRUD;
