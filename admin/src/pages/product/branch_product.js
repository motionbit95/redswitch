import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../api";
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
  Select,
  Space,
  Table,
} from "antd";
import useSelectedBranch from "../../hook/useSelectedBranch";
import SearchMaterial from "../../components/popover/searchmaterial";
import FileUpload from "../../components/button";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import SearchProduct from "../../components/popover/searchproduct";

const { Item } = Descriptions;
const { Option } = Select;
const { Tag } = Descriptions;

function Product(props) {
  const [filter, setFilter] = useState("branch"); // 필터 상태 추가
  const [keyword, setKeyword] = useState(null); // 검색어 상태 추가

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Filter
          onChange={setFilter}
          value={filter}
          onSearch={(value, record) => setKeyword(record)}
        />
        {<ProductModal />}
      </Space>

      <Table />
    </Space>
  );
}

const ProductModal = (props) => {
  const [visible, setVisible] = useState(false);
  const { selectedBranch } = useSelectedBranch();
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [form] = Form.useForm();

  const extraFields = [
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
  return (
    <div>
      <Button
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
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="상품 추가"
        footer={[
          <Button
            key="back"
            onClick={() => {
              console.log(form.getFieldsValue());
            }}
          >
            테스트
          </Button>,
        ]} // footer를 비워줌
        width={800}
      >
        {/* 상품 추가 컴포넌트 */}
        {selectedBranch && <h3>{selectedBranch.branch_name}</h3>}

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
                    console.log(products[0]);
                    setSelectedMaterial(products[0]);
                  }}
                  multiple={false}
                />
              </Space>
            }
          >
            <Input
              value={selectedMaterial?.product_name}
              onChange={(e) =>
                setSelectedMaterial({
                  ...selectedMaterial,
                  product_code: e.target.value,
                })
              }
            />
          </Item>
          <Item label="상품코드">{selectedMaterial?.product_code}</Item>
          <Item label="거래처">{selectedMaterial?.provider_name}</Item>
          <Item label="카테고리">
            {
              categories.find(
                (category) =>
                  category.product_category_code ===
                  selectedMaterial?.product_category_code
              )?.product_category
            }
          </Item>
          <Item label="판매가격">
            <Input
              value={Number(selectedMaterial?.product_sale || 0)}
              onChange={(e) =>
                setSelectedMaterial({
                  ...selectedMaterial,
                  product_sale: e.target.value,
                })
              }
            />
            {/* {Number(selectedMaterial?.product_sale || 0).toLocaleString()}원 */}
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
                      {field.name === "original_image" && (
                        <FileUpload
                          url={form.getFieldValue("original_image")}
                          setUrl={(url) =>
                            form.setFieldsValue({ original_image: url })
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
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  옵션 추가
                </Button>
              </Form.Item>
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
            </>
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
