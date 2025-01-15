import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Upload,
  Button,
  Table,
  Space,
  message,
  Popconfirm,
  Descriptions,
  Alert,
} from "antd";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import KakaoAddressSearch from "../../components/kakao";
import FormItem from "antd/es/form/FormItem";
import FileUpload from "../../components/button";
import TextArea from "antd/es/input/TextArea";
import usePagination from "../../hook/usePagination";
import useCurrentUser from "../../hook/useCurrentUser";
import useSearchFilter from "../../hook/useSearchFilter";

const ProviderModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  form,
  isEditMode,
  onDelete,
}) => {
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(form.getFieldValue("provider_address"));
  }, [form.getFieldValue("provider_address")]);

  return (
    <Modal
      title={isEditMode ? "거래처 수정" : "거래처 추가"}
      visible={visible}
      width={800}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            direction: "rtl",
          }}
        >
          <Space style={{ direction: "ltr" }}>
            <Button
              key="cancel"
              onClick={() => {
                onCancel();
                form.resetFields();
              }}
            >
              취소
            </Button>
            {isEditMode ? (
              <Popconfirm
                title="수정하시겠습니까?"
                description={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>상품에 대한 정보는 수정되지않습니다.</span>
                    <span>기존에 등록된 상품을 추가로 수정해주세요.</span>
                  </div>
                }
                onconfirm={() => form.submit}
              >
                <Button key="submit" type="primary">
                  수정 완료
                </Button>
              </Popconfirm>
            ) : (
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                추가 완료
              </Button>
            )}
          </Space>
          {isEditMode && (
            <Popconfirm
              title="거래처를 삭제하시겠습니까?"
              description={
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    거래처 삭제 시 등록 되어있는 상품은 삭제되지않습니다.
                  </span>
                  <span>기존에 등록되어있는 상품을 제거해주세요.</span>
                </div>
              }
              onConfirm={onDelete}
            >
              <Button danger>삭제</Button>
            </Popconfirm>
          )}
        </Space>
      }
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item
            span={1}
            label="거래처명"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="provider_name"
              rules={[{ required: true, message: "거래처명을 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="거래처 코드"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="provider_code"
              rules={[
                { required: true, message: "거래처 코드을 입력해주세요" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={2}
            label="거래처 주소"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item
                name="provider_address"
                rules={[
                  { required: true, message: "거래처 주소를 입력해주세요" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Row gutter={8} style={{ width: "100%" }}>
                  <Col span={18}>
                    <Input readOnly value={address} />
                  </Col>
                  <Col span={6}>
                    <KakaoAddressSearch
                      onSelectAddress={(selectedAddress, sido, sigungu) => {
                        form.setFieldsValue({
                          provider_address: selectedAddress,
                          provider_sido: sido,
                          provider_sigungu: sigungu,
                        });
                        setAddress(selectedAddress);
                      }}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                name="provider_address_detail"
                rules={[
                  { required: true, message: "상세 주소를 입력해주세요" },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="상세 주소를 입력해주세요." />
              </Form.Item>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item
            label="거래처 전화번호"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="provider_contact"
              rules={[
                { required: true, message: "거래처 전화번호를 입력해주세요" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="사업자등록번호"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={2}
          >
            <Form.Item
              name="provider_brn"
              rules={[{ required: true, message: "사업자번호를 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="이메일"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="provider_email" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="사업자등록증 파일"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="business_file" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("business_file")}
                setUrl={(url) => form.setFieldsValue({ business_file: url })}
              />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="대표자명"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="provider_ceo_name"
              rules={[{ required: true, message: "대표자명을 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="대표자 전화번호"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="provider_ceo_phone"
              rules={[
                { required: true, message: "대표자 전화번호를 입력해주세요" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="담당자명"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="provider_manager_name" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            span={1}
            label="담당자 전화번호"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="provider_manager_phone"
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            span={1}
            label="결제방식"
            labelStyle={{ whiteSpace: "nowrap" }}
            style={{ marginBottom: 0 }}
          >
            <Form.Item name="bank_account_number" style={{ marginBottom: 0 }}>
              <TextArea
                placeholder="결제방식 혹은 계좌번호 등을 자유롭게 입력하세요."
                rows={3}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="통장사본 파일"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="bankbook_file" style={{ marginBottom: 0 }}>
              <Upload
                name="file"
                listType="picture"
                beforeUpload={(file) => {
                  return false; // Prevent automatic upload
                }}
              >
                <Button icon={<UploadOutlined />}>파일 업로드</Button>
              </Upload>
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            span={2}
            label="특이사항"
            labelStyle={{ whiteSpace: "nowrap" }}
            style={{ marginBottom: 0 }}
          >
            <Form.Item name="provider_description" style={{ marginBottom: 0 }}>
              <TextArea rows={3} />
            </Form.Item>
          </Descriptions.Item>

          <Row gutter={16} style={{ display: "none" }}>
            <Col span={12}>
              <FormItem
                name="provider_sido"
                label="시도"
                rules={[{ required: true, message: "시도를 입력해주세요" }]}
              >
                <Input readOnly />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name="provider_sigungu"
                label="시군구"
                rules={[{ required: true, message: "시구를 입력해주세요" }]}
              >
                <Input readOnly />
              </FormItem>
            </Col>
          </Row>
        </Descriptions>
      </Form>
    </Modal>
  );
};

const Provider = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [form] = Form.useForm();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const { currentUser } = useCurrentUser();
  const { getColumnSearchProps } = useSearchFilter();

  // Fetch provider data
  useEffect(() => {
    fetchProviders();
  }, [currentUser]);
  const fetchProviders = async () => {
    try {
      const response = await AxiosGet("/providers"); // Replace with your endpoint
      let total_provider = Array.from(response.data);
      if (currentUser.permission === "1") {
        // 본사관리자는 모든 지점을 관리할 수 있다.
        setProviders(total_provider);
      } else {
        // 지점관리자는 자신의 지점만 관리할 수 있다.

        // `total_provider` 배열의 각 객체의 `id` 값이 `currentUser.provider_id` 배열에 포함되는지 확인하여 필터링
        let filtered_provider = total_provider.filter((provider) => {
          return currentUser?.provider_id?.includes(provider.id);
        });

        setProviders(filtered_provider);
      }
    } catch (error) {
      console.error("거래처 데이터를 가져오는 중 오류 발생:", error);
      message.error("거래처 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Delete provider
  const handleDelete = async (id) => {
    try {
      await AxiosDelete(`/providers/${id}`);
      setProviders(providers.filter((provider) => provider.id !== id));
      message.success("거래처 삭제 성공");
      setIsModalVisible(false);
    } catch (error) {
      message.error("거래처 삭제 실패");
    }
  };

  // Edit provider - Open modal
  const handleEdit = (provider) => {
    setCurrentProvider(provider);
    form.setFieldsValue(provider); // Set the form fields to current provider values
    setIsModalVisible(true);
  };

  // Add provider - Open modal for creating new provider
  const handleAddProvider = () => {
    setCurrentProvider(null); // Reset current provider for new provider creation
    form.resetFields(); // Clear form fields
    setIsModalVisible(true); // Open Add Provider Modal
  };

  // Handle form submit for provider creation or update
  const handleSubmit = async (values) => {
    try {
      const isDuplicateCode = providers.some(
        (provider) => provider.provider_code === values.provider_code
      );

      if (
        isDuplicateCode &&
        (!currentProvider ||
          currentProvider.provider_code !== values.provider_code)
      ) {
        message.error("이미 존재하는 거래처 코드입니다.");
        return;
      }
      let providerData = { ...values };

      try {
        if (values.bankbook_file && values.bankbook_file.fileList.length > 0) {
          const file = values.bankbook_file.fileList[0].originFileObj;

          const fileUploadResponse = await uploadFile(file);
          const fileUrl = fileUploadResponse.data.url;

          providerData.bankbook_file = fileUrl;
        }
      } catch (error) {
        // 변경이 없을 경우
        providerData.bankbook_file = currentProvider?.bankbook_file;
      }

      if (currentProvider) {
        await AxiosPut(`/providers/${currentProvider.id}`, providerData, {
          headers: { "Content-Type": "application/json" },
        });

        setProviders(
          providers.map((provider) =>
            provider.id === currentProvider.id
              ? { ...provider, ...providerData }
              : provider
          )
        );
        message.success("거래처 수정 성공");
        fetchProviders();
      } else {
        const response = await AxiosPost("/providers", providerData, {
          headers: { "Content-Type": "application/json" },
        });

        setProviders((prevProviders) => [
          ...prevProviders,
          response.data.provider,
        ]);
        message.success("거래처 생성 성공");
        fetchProviders();
      }

      setIsModalVisible(false);
    } catch (error) {
      message.error("거래처 처리 실패");
    }
  };

  // Helper function to upload the file and get URL
  const uploadFile = async (file) => {
    const fileData = new FormData();
    fileData.append("file", file);

    return await AxiosPost("/upload", fileData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const { pagination, setPagination, handleTableChange } = usePagination(10);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "No.",
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      fixed: "left",
      width: 50,
    },
    {
      title: "업체명",
      dataIndex: "provider_name",
      key: "provider_name",
      ...getColumnSearchProps("provider_name"),
    },
    // {
    //   title: "대표자명",
    //   dataIndex: "provider_ceo_name",
    //   key: "provider_ceo_name",
    // },
    // {
    //   title: "대표자 전화번호",
    //   dataIndex: "provider_ceo_phone",
    //   key: "provider_ceo_phone",
    // },
    {
      title: "담당자명",
      dataIndex: "provider_manager_name",
      key: "provider_manager_name",
      ...getColumnSearchProps("provider_manager_name"),
    },
    {
      title: "담당자 전화번호",
      dataIndex: "provider_manager_phone",
      key: "provider_manager_phone",
      ...getColumnSearchProps("provider_manager_phone"),
    },
    {
      title: "사업자등록번호",
      dataIndex: "provider_brn",
      key: "provider_brn",
      ...getColumnSearchProps("provider_brn"),
    },
    {
      title: "대표자명",
      dataIndex: "provider_ceo_name",
      key: "provider_ceo_name",
      ...getColumnSearchProps("provider_ceo_name"),
    },
    {
      title: "대표자 전화번호",
      dataIndex: "provider_ceo_phone",
      key: "provider_ceo_phone",
      ...getColumnSearchProps("provider_ceo_phone"),
    },
    {
      title: "이메일",
      dataIndex: "provider_email",
      key: "provider_email",
      ...getColumnSearchProps("provider_email"),
    },
    {
      title: "자세히보기",
      key: "action",
      render: (_, record) => (
        <Button icon={<SearchOutlined />} onClick={() => handleEdit(record)} />
      ),
    },
  ];

  return (
    <div>
      {/* 본사관리자만 거래처 추가 가능 */}
      {currentUser.permission === "1" && (
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={handleAddProvider}
        >
          거래처 추가
        </Button>
      )}

      {currentUser.permission === "3" ? (
        <>
          <Alert message="거래처 관리 권한이 없습니다." type="error" showIcon />
        </>
      ) : (
        <>
          <Table
            size="small"
            columns={columns}
            dataSource={providers}
            rowKey="id"
            loading={loading}
            onChange={(pagination, filters, sorter) => {
              handleTableChange(pagination);
              handleChange(pagination, filters, sorter);
            }}
            pagination={{
              ...pagination,
              defaultPageSize: 10,
              showSizeChanger: true,
              position: ["bottomCenter"],
            }}
          />

          {/* Reused Modal */}
          <ProviderModal
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onSubmit={handleSubmit}
            initialValues={!currentProvider ? currentProvider : {}}
            form={form}
            isEditMode={!!currentProvider}
            onDelete={() => handleDelete(currentProvider.id)}
          />
        </>
      )}
    </div>
  );
};

export default Provider;
