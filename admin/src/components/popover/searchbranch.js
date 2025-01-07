import { Button, Popover, Table, Form, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import { AxiosGet } from "../../api";
import useSearchFilter from "../../hook/useSearchFilter";

const SearchBranch = ({
  selectedBranch,
  setSelectedBranch,
  currentUser = null,
  multiple = false,
}) => {
  const [form] = Form.useForm();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [managableBranches, setManagableBranches] = useState([]);

  const { getColumnSearchProps } = useSearchFilter();

  useEffect(() => {
    if (popoverVisible) {
      fetchBranches();
    }
  }, [popoverVisible]);

  const fetchBranches = async (search = "") => {
    try {
      const response = await AxiosGet("/branches"); // Replace with your endpoint
      const branchData = response.data
        .map((item) => item)
        .filter((item) => item.branch_name.includes(search))
        .map((item) => ({ key: item.id, ...item }));
      setBranches(branchData);
      if (currentUser && currentUser.branch_id) {
        let usersBranches = branchData.filter(
          (branch) => currentUser.branch_id.some((id) => id === branch.id) // 배열 비교를 위한 수정
        );

        setManagableBranches(usersBranches);
      }
    } catch (error) {
      message.error("지점 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOK = () => {
    if (!selectedRowKeys.length) {
      message.warning("지점을 선택해주세요.");
      return;
    }

    // selectedRowKeys에 있는 key 값들로 branches에서 해당하는 항목을 찾기
    const selectedBranches = branches.filter((branch) =>
      selectedRowKeys.includes(branch.key)
    );

    // 만약 selectedBranches가 비어있다면 잘못된 지점이 선택된 경우
    if (selectedBranches.length === 0) {
      message.error("잘못된 지점이 선택되었습니다.");
      return;
    }

    // console.log(selectedBranches); // selectedBranches는 선택된 지점들의 배열입니다.
    setSelectedBranch(selectedBranches); // 상태를 업데이트할 때 전체 배열로 설정

    setPopoverVisible(false); // 팝오버 닫기
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
    type: multiple ? "checkbox" : "radio",
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
        dataSource={currentUser?.branch_id ? managableBranches : branches}
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
