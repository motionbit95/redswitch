import {
  Button,
  Cascader,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../api";

const Searchprovider = ({
  selectedProvider,
  setSelectedProvider,
  setisSelectedProvider,
  onComplete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await AxiosGet("/providers"); // Replace with your endpoint
      setProviders(response.data.map((item) => ({ key: item.id, ...item })));
    } catch (error) {
      message.error("가맹점 데이터를 가져오는 데 실패함.");
    } finally {
      setLoading(false);
      console.log(providers);
    }
  };

  const handleOK = () => {
    if (!selectedRowKeys.length) {
      message.warning("가맹점를 선택해주세요.");
      return;
    }

    const provider = providers.find((item) => item.key === selectedRowKeys[0]);
    if (!provider) {
      message.error("잘못된 가맹점가 선택되었습니다.");
      return;
    }

    setSelectedProvider(provider);
    setisSelectedProvider(true);
    setIsModalOpen(false);
    onComplete();
  };

  const columns = [
    {
      title: "가맹점명",
      dataIndex: "provider_name",
      key: "provider_name",
    },
    {
      title: "가맹점코드",
      dataIndex: "provider_code",
      key: "provider_code",
    },
    {
      title: "담당자",
      dataIndex: "provider_manager_name",
      key: "provider_manager_name",
    },
    {
      title: "담당자 전화번호",
      dataIndex: "provider_manager_phone",
      key: "provider_manager_phone",
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedProvider(providers.find((c) => c.key === newSelectedRowKeys[0]));
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>가맹점 선택</Button>

      <Modal
        title="가맹점 검색"
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => handleOK(selectedRowKeys[0])}
          >
            선택
          </Button>,
        ]}
      >
        <SearchForm />
        <Table
          size="small"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={providers}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </>
  );
};
const SearchForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  return <div>검색 폼</div>;
};

export default Searchprovider;
