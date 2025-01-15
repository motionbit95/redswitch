import { Button, Popover, Table, Form, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../api";
import useSearchFilter from "../../hook/useSearchFilter";
import useCurrentUser from "../../hook/useCurrentUser";

const SearchProvider = ({
  selectedProvider,
  setSelectedProvider,
  multiple = false,
}) => {
  const [form] = Form.useForm();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  const { currentUser } = useCurrentUser(); // 사용자 정보 가져오기

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
        let newData = total_provider.map((provider) => {
          return {
            ...provider,
            key: provider.id,
          };
        });

        setProviders(newData);
      } else {
        // 지점관리자는 자신의 지점만 관리할 수 있다.

        // `total_provider` 배열의 각 객체의 `id` 값이 `currentUser.provider_id` 배열에 포함되는지 확인하여 필터링
        let filtered_provider = total_provider.filter((provider) => {
          return currentUser?.provider_id?.includes(provider.id);
        });

        let newData = filtered_provider.map((provider) => {
          return {
            ...provider,
            key: provider.id,
          };
        });

        setProviders(newData);
      }
    } catch (error) {
      console.error("거래처 데이터를 가져오는 중 오류 발생:", error);
      message.error("거래처 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOK = () => {
    if (!selectedRowKeys.length) {
      // message.warning("거래처를 선택해주세요.");
      setSelectedProvider([]);
      setPopoverVisible(false);
      return;
    }

    // selectedRowKeys에 있는 key 값들로 providers에서 해당하는 항목을 찾기
    const selectedProviders = providers.filter((provider) =>
      selectedRowKeys.includes(provider.key)
    );

    // 만약 selectedProviders가 비어있다면 잘못된 거래처가 선택된 경우
    if (selectedProviders.length === 0) {
      message.error("잘못된 거래처가 선택되었습니다.");
      return;
    }

    // 선택된 거래처들을 상태에 저장
    setSelectedProvider(selectedProviders); // 상태를 전체 배열로 설정

    setPopoverVisible(false); // 팝오버 닫기
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
    type: multiple ? "checkbox" : "radio",
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
