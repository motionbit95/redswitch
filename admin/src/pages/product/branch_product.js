import React, { useEffect, useState } from "react";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import Filter from "../../components/filter";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import useSelectedBranch from "../../hook/useSelectedBranch";
import SearchMaterial from "../../components/popover/searchmaterial";
import FileUpload from "../../components/button";
import {
  DownloadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import SearchProduct from "../../components/popover/searchproduct";
import FormItem from "antd/es/form/FormItem";
import useExportToExcel from "../../hook/useExportToExcel";
import usePagination from "../../hook/usePagination";
import useSearchFilter from "../../hook/useSearchFilter";
import dayjs from "dayjs";

const { Item } = Descriptions;
const { Option } = Select;
const { Tag } = Descriptions;

function Product(props) {
  const [filter, setFilter] = useState(""); // 필터 상태 추가
  const [keyword, setKeyword] = useState(null); // 검색어 상태 추가
  const [products, setProducts] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const onSearch = (value, record) => {
    if (value && record) {
      console.log(value, record);
      AxiosGet(`/products/search?keyword=${record}&filter=${value}`)
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(error);
          setProducts([]);
        });
    } else {
      AxiosGet(`/products`)
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(error);
          setProducts([]);
        });
    }
  };

  const showModal = (product = null) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  // 상품 삭제 처리
  const handleDelete = async (PK) => {
    try {
      await AxiosDelete(`/products/${PK}`);
      message.success("상품이 삭제되었습니다.");
      onSearch(filter, keyword);
    } catch (error) {
      message.error("상품 삭제에 실패했습니다.");
    }
  };

  const { getColumnSearchProps } = useSearchFilter();

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
      dataIndex: "product_image",
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

  const { pagination, setPagination, handleTableChange } = usePagination(10); // Default page size is 10

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Filter onChange={setFilter} value={filter} onSearch={onSearch} />
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

      <ProductModal
        open={isModalVisible}
        setOpen={(open) => {
          setIsModalVisible(open);
          onSearch(filter, keyword);
        }}
        currentProduct={currentProduct}
      />
    </Space>
  );
}

const ProductModal = (props) => {
  const { open, setOpen, currentProduct } = props;
  // const [visible, setVisible] = useState(false);
  const { selectedBranch } = useSelectedBranch();
  const [selectedMaterial, setSelectedMaterial] = useState(
    currentProduct || null
  );
  const [product, setProduct] = useState(null);

  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      console.log("currentProduct", currentProduct);
      form.setFieldsValue(currentProduct);
      // setProduct(currentProduct);
      // setSelectedMaterial(currentProduct);
    }
  }, [open]);

  const extraFields = [
    {
      name: "product_image",
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
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosGet("/products/categories");
        setCategories(response.data);
        console.log(
          selectedMaterial?.product_category_code,
          response.data.find(
            (category) =>
              category.product_category_code ===
              selectedMaterial?.product_category_code
          )
        );
      } catch (error) {
        message.error("카테고리 불러오기 실패");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedMaterial) {
      form.setFieldsValue(selectedMaterial);
    }
  }, [selectedMaterial]);

  const copyMaterialToProduct = (material) => {
    console.log("copyMaterialToProduct", material);
    form.setFieldsValue(material);
    setProduct(material);
    setSelectedMaterial(material);
  };

  const onFinish = async (values) => {
    console.log("Success:", values);

    try {
      if (currentProduct) {
        await AxiosPut(`/products/${currentProduct.PK}`, values)
          .then((response) => {
            console.log("response", response);
            message.success("상품 수정 성공");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const response = await AxiosPost("/products", {
          ...values,
          branch_id: selectedBranch.id,
          material_id: selectedMaterial.pk,
        });
        console.log("response", response);
        message.success("상품 추가 성공");
      }

      setOpen(false);
    } catch (error) {
      message.error("상품 추가 실패");
    }
  };

  return (
    <div>
      {/* <Button
        type="primary"
        onClick={() => {
          if (!selectedBranch) {
            message.error("지점을 선택해주세요.");
            return;
          }
          setVisible(true);
        }}
      >
        상품 추가
      </Button> */}
      <Modal
        visible={open}
        onCancel={() => setOpen(false)}
        title={currentProduct ? "상품 수정" : "상품 추가"}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            취소
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              onFinish(form.getFieldsValue());
            }}
          >
            {currentProduct ? "상품 수정" : "상품 추가"}
          </Button>,
        ]} // footer를 비워줌
        width={800}
      >
        {/* 상품 추가 컴포넌트 */}
        {selectedBranch && <h3>{selectedBranch.branch_name}</h3>}

        <Form form={form} layout="vertical">
          <Descriptions
            title=""
            bordered
            column={2}
            labelStyle={{ width: "120px" }}
            contentStyle={{ width: "300px" }}
          >
            <Item
              span={2}
              label={
                <Space>
                  <SearchMaterial
                    setSelectedProduct={(products) => {
                      copyMaterialToProduct(products[0]);
                    }}
                    multiple={false}
                  />
                </Space>
              }
            >
              <Form.Item name="product_name" style={{ margin: 0 }}>
                <Input
                  value={product?.product_name}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      product_name: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </Item>
            <Item label="상품코드">
              <Form.Item name="product_code" style={{ margin: 0 }}>
                {selectedMaterial?.product_code}
              </Form.Item>
            </Item>
            <Item label="거래처">
              <FormItem name="provider_name" style={{ margin: 0 }}>
                {selectedMaterial?.provider_name}
              </FormItem>
            </Item>
            <Item label="카테고리">
              <Form.Item name="product_category_code" style={{ margin: 0 }}>
                {
                  categories.find(
                    (category) =>
                      category.product_category_code ===
                      selectedMaterial?.product_category_code
                  )?.product_category
                }
              </Form.Item>
            </Item>
            <Item label="판매가격">
              <Form.Item name="product_price" style={{ margin: 0 }}>
                <Input
                  value={Number(product?.product_price || 0)}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      product_price: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </Item>
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
                        {field.name === "product_image" && (
                          <FileUpload
                            url={form.getFieldValue("product_image")}
                            setUrl={(url) =>
                              form.setFieldsValue({ product_image: url })
                            }
                          />
                        )}
                        {/* {field.name === "blind_image" && (
                        <FileUpload
                          url={form.getFieldValue("blind_image")}
                          setUrl={(url) =>
                            form.setFieldsValue({ blind_image: url })
                          }
                        />
                      )} */}
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
            <Item span={2} label="지점 추가 매출" name="additional_fee">
              <Input style={{ width: "100%" }} placeholder="1000" />
            </Item>
            {/* Options Form List */}
            <Item span={2} label="상품 옵션">
              {/* 여기에 옵션을 추가하는 UI를 추가해라 */}
              <ProductOptionsForm form={form} />
            </Item>

            <Item
              span={2}
              label={
                <Space direction="vertical">
                  <div>{"추가 판매 유도"}</div>
                  <SearchProduct
                    setSelectedProduct={(products) =>
                      setRelatedProducts(products)
                    }
                    multiple={true}
                  />
                </Space>
              }
            >
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
                  pagination={{ pageSize: 5 }}
                />
              </Col>
            </Item>
          </Descriptions>
        </Form>
      </Modal>
    </div>
  );
};

const ProductOptionsForm = (props) => {
  const { form } = props;
  const [options, setOptions] = useState([]);

  // const onFinish = (values) => {
  //   console.log("폼 값:", values);
  //   setOptions(values.options);
  // };

  return (
    <div>
      <Form
        form={form}
        // onFinish={onFinish}
        name="product-options"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.List
          name="options"
          initialValue={options}
          rules={[
            {
              validator: async (_, options) => {
                if (!options || options.length < 1) {
                  return Promise.reject(
                    new Error("적어도 하나의 옵션을 추가해야 합니다.")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <Space direction="vertical">
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                옵션 추가
              </Button>
              {fields.map(
                (
                  { key, fieldKey, name, fieldName, fieldId, fieldData },
                  index
                ) => (
                  <Space key={key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      {...fieldData}
                      name={[name, "optionName"]}
                      fieldKey={[fieldKey, "optionName"]}
                      rules={[
                        { required: true, message: "옵션 이름을 입력하세요." },
                      ]}
                    >
                      <Input
                        style={{ width: 200 }}
                        placeholder="옵션 이름 입력"
                      />
                    </Form.Item>
                    <Form.Item
                      {...fieldData}
                      name={[name, "optionValue"]}
                      fieldKey={[fieldKey, "optionValue"]}
                      rules={[
                        { required: true, message: "옵션 값을 입력하세요." },
                      ]}
                    >
                      <Input
                        style={{ width: 200 }}
                        placeholder="옵션 값 입력"
                      />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                )
              )}
            </Space>
          )}
        </Form.List>
      </Form>

      {options.length > 0 && (
        <div>
          <h3>선택한 옵션:</h3>
          <div>
            {options.map((option, idx) => (
              <Tag color="blue" key={idx}>
                {option.optionName}: {option.optionValue}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
