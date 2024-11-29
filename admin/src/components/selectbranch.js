import { Button, Popover, Table, Form, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../api";
import useSearchFilter from "../hook/useSearchFilter";

const SearchBranch = ({ selectedBranch, setSelectedBranch }) => {
  const [form] = Form.useForm();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async (search = "") => {
    try {
      const response = await AxiosGet("/branches"); // Replace with your endpoint
      setBranches(
        response.data
          .map((item) => item)
          .filter((item) => item.branch_name.includes(search))
          .map((item) => ({ key: item.id, ...item }))
      );
    } catch (error) {
      message.error("지점 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOK = () => {
    if (!selectedRowKeys.length) {
      message.warning("지점를 선택해주세요.");
      return;
    }

    const branch = branches.find((item) => item.key === selectedRowKeys[0]);
    if (!branch) {
      message.error("잘못된 지점가 선택되었습니다.");
      return;
    }

    setSelectedBranch(branch);
    setPopoverVisible(false);
  };

  const columns = [
    {
      title: "지점명",
      dataIndex: "branch_name",
      key: "provider_name",
    },
    {
      title: "시/도",
      dataIndex: "branch_sido",
      key: "branch_sido",
      ...getColumnSearchProps("branch_sido"),
    },
    {
      title: "시/군/구",
      dataIndex: "branch_sigungu",
      key: "branch_sigungu",
      ...getColumnSearchProps("branch_sigungu"),
    },
    {
      title: "담당자",
      dataIndex: "branch_manager_name",
      key: "branch_manager_name",
      ...getColumnSearchProps("branch_manager_name"),
    },
    {
      title: "담당자 전화번호",
      dataIndex: "branch_manager_phone",
      key: "branch_manager_phone",
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
    fetchBranches(value.search);
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
            placeholder="지점명을 검색하세요"
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
        dataSource={branches}
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
        title="지점를 선택해주세요."
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        placement="bottomLeft" // 버튼 아래 왼쪽 정렬
      >
        <Button>{selectedBranch?.branch_name || "지점 선택"}</Button>
      </Popover>
    </div>
  );
};

export default SearchBranch;
