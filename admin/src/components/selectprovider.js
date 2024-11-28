import { Button, Form, Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../api";

const SelectProvider = ({ selectedProvider, setSelectedProvider }) => {
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
      message.error("가맹점 데이터 가져오기 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleOK = () => {
    try {
      if (selectedProviders.length === 0) {
        message.error("가맹점를 선택해주세요.");
        return;
      }
      // 선택된 지점 배열을 부모 컴포넌트로 전달
      setSelectedProvider(selectedProviders);

      // 모달 닫기 및 선택 초기화
      setIsModalOpen(false);
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error in handleOK:", error.message);
      message.error(error.message || "선택 처리 중 오류가 발생했습니다.");
    }
  };

  const columns = [
    {
      title: "가맹점명",
      dataIndex: "provider_name",
      key: "provider_name",
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 선택된 Row의 키값 배열
  const [selectedProviders, setSelectedProviders] = useState([]); // 선택된 데이터 배열

  const onSelectChange = (newSelectedRowKeys) => {
    // 선택된 키값 배열 저장
    setSelectedRowKeys(newSelectedRowKeys);
    // 선택된 데이터 배열 저장
    const selectedData = providers.filter((item) =>
      newSelectedRowKeys.includes(item.key)
    );
    setSelectedProviders(selectedData);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>가맹점 선택</Button>

      <Modal
        title="가맹점 검색"
        centered
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedRowKeys([]);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedRowKeys([]);
            }}
          >
            닫기
          </Button>,
          <Button key="submit" type="primary" onClick={handleOK}>
            저장
          </Button>,
        ]}
      >
        {/* <SearchForm /> */}
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

export default SelectProvider;
