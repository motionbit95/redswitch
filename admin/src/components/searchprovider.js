import { Button, Popover, Table, Form, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../api";
import useSearchFilter from "../hook/useSearchFilter";

const SearchProvider = ({
  selectedProvider,
  setSelectedProvider,
  setisSelectedProvider,
}) => {
  const [form] = Form.useForm();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async (search = "") => {
    try {
      const response = await AxiosGet("/providers"); // Replace with your endpoint
      setProviders(
        response.data
          .map((item) => item)
          .filter((item) => item.provider_name.includes(search))
          .map((item) => ({ key: item.id, ...item }))
      );
    } catch (error) {
      message.error("거래처 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOK = () => {
    if (!selectedRowKeys.length) {
      message.warning("거래처를 선택해주세요.");
      return;
    }

    const provider = providers.find((item) => item.key === selectedRowKeys[0]);
    if (!provider) {
      message.error("잘못된 거래처가 선택되었습니다.");
      return;
    }

    setSelectedProvider(provider);
    setisSelectedProvider(true);
    setPopoverVisible(false);
  };

  const columns = [
    {
      title: "거래처명",
      dataIndex: "provider_name",
      key: "provider_name",
    },
    {
      title: "시/도",
      dataIndex: "provider_sido",
      key: "provider_sido",
      ...getColumnSearchProps("provider_sido"),
    },
    {
      title: "시/군/구",
      dataIndex: "provider_sigungu",
      key: "provider_sigungu",
      ...getColumnSearchProps("provider_sigungu"),
    },
    {
      title: "거래처코드",
      dataIndex: "provider_code",
      key: "provider_code",
      ...getColumnSearchProps("provider_code"),
    },
    {
      title: "담당자",
      dataIndex: "provider_manager_name",
      key: "provider_manager_name",
      ...getColumnSearchProps("provider_manager_name"),
    },
    {
      title: "담당자 전화번호",
      dataIndex: "provider_manager_phone",
      key: "provider_manager_phone",
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const searchProviders = (value) => {
    fetchProviders(value.search);
  };

  const content = (
    <div style={{ width: 700 }}>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
        onFinish={searchProviders}
      >
        <Form.Item name="search" label="검색">
          <Input
            placeholder="거래처명을 검색하세요"
            allowClear
            style={{ width: 200 }}
          />
        </Form.Item>
        <Button type="primary" onClick={() => form.submit()}>
          검색
        </Button>
      </Form>
      <Table
        size="small"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={providers}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <Space style={{ marginTop: 16 }}>
        <Button onClick={() => setPopoverVisible(false)}>닫기</Button>
        <Button type="primary" onClick={handleOK}>
          선택
        </Button>
      </Space>
    </div>
  );

  return (
    <div style={{ textAlign: "left" }}>
      <Popover
        content={content}
        title="거래처를 선택해주세요."
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        placement="bottomLeft" // 버튼 아래 왼쪽 정렬
      >
        <Button>{selectedProvider?.provider_name || "거래처 선택"}</Button>
      </Popover>
    </div>
  );
};

export default SearchProvider;
