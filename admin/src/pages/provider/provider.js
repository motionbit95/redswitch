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
} from "antd";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import { UploadOutlined } from "@ant-design/icons";
import KakaoAddressSearch from "../../components/kakao";
import FormItem from "antd/es/form/FormItem";
import FileUpload from "../../components/button";

const ProviderModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  form,
  isEditMode,
}) => {
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(form.getFieldValue("provider_address"));
  }, [form.getFieldValue("provider_address")]);

  return (
    <Modal
      title={isEditMode ? "거래처 수정" : "거래처 추가"}
      visible={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="provider_name"
              label="거래처명"
              rules={[{ required: true, message: "거래처명을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="provider_code"
              label="거래처 코드"
              rules={[
                { required: true, message: "거래처 코드을 입력해주세요" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

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

        <Form.Item
          name="provider_address"
          label="거래처 주소"
          rules={[{ required: true, message: "거래처 주소를 입력해주세요" }]}
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="provider_contact"
              label="거래처 전화번호"
              rules={[
                { required: true, message: "거래처 전화번호를 입력해주세요" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="provider_brn"
              label="사업자등록번호"
              rules={[{ required: true, message: "사업자번호를 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="provider_ceo_name"
              label="대표자명"
              rules={[{ required: true, message: "대표자명을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="provider_ceo_phone"
              label="대표자 전화번호"
              rules={[
                { required: true, message: "대표자 전화번호를 입력해주세요" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="provider_manager_name" label="담당자명">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="provider_manager_phone" label="담당자 전화번호">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="bank_account_number" label="계좌번호">
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="business_file" label="사업자등록증 파일">
              <FileUpload
                url={form.getFieldValue("business_file")}
                setUrl={(url) => form.setFieldsValue({ business_file: url })}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bankbook_file" label="통장사본 파일">
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
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "right" }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "수정 완료" : "추가 완료"}
            </Button>
          </Form.Item>
        </div>
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

  // Fetch provider data
  useEffect(() => {
    fetchProviders();
  }, []);
  const fetchProviders = async () => {
    try {
      const response = await AxiosGet("/providers"); // Replace with your endpoint
      setProviders(response.data);
    } catch (error) {
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
      let providerData = { ...values };

      console.log(providerData);

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
        console.log(providerData);
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

    console.log(fileData);

    return await AxiosPost("/upload", fileData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const columns = [
    {
      title: "업체명",
      dataIndex: "provider_name",
      key: "provider_name",
    },
    {
      title: "담당자명",
      dataIndex: "provider_manager_name",
      key: "provider_manager_name",
    },
    {
      title: "담당자 전화번호",
      dataIndex: "provider_manager_phone",
      key: "provider_manager_phone",
    },
    {
      title: "사업자등록번호",
      dataIndex: "provider_brn",
      key: "provider_brn",
    },
    {
      title: "관리자명",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "관리자 전화번호",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "동작",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="거래처를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "right" }}>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleAddProvider}
      >
        거래처 추가
      </Button>

      <Table
        size="small"
        columns={columns}
        dataSource={providers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Reused Modal */}
      <ProviderModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={!currentProvider ? currentProvider : {}}
        form={form}
        isEditMode={!!currentProvider}
      />
    </div>
  );
};

export default Provider;
