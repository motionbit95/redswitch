import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Row,
  Col,
  Tag,
  Cascader,
} from "antd";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import SelectProvider from "../../components/selectprovider";
import SelectBranch from "../../components/selectbranch";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null); // For edit
  const [form] = Form.useForm();

  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);

  // Fetch account data
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await AxiosGet("/accounts"); // Replace with your endpoint
      setAccounts(response.data);
    } catch (error) {
      message.error("계정 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDelete = async (id) => {
    try {
      await AxiosDelete(`/accounts/${id}`); // Replace with your endpoint
      setAccounts(accounts.filter((account) => account.id !== id));
      message.success("계정 삭제 성공");
      fetchAccounts();
    } catch (error) {
      message.error("계정 삭제 실패");
    }
  };

  // Edit account - Open modal
  const handleEdit = (account) => {
    setCurrentAccount(account);
    form.setFieldsValue(account); // Set the form fields to current account values
    setIsEditModalVisible(true);
  };

  // Handle form submit for account update
  const handleUpdate = async (values) => {
    const provider_id = selectedProvider.map((provider) => provider.id);
    const branch_id = selectedBranch.map((branch) => branch.id);
    console.log(provider_id, branch_id);
    try {
      await AxiosPut(`/accounts/${currentAccount.id}`, {
        provider_id: provider_id,
        branch_id: branch_id,
        ...values,
      }); // Replace with your endpoint
      setAccounts(
        accounts.map((account) =>
          account.id === currentAccount.id ? { ...account, ...values } : account
        )
      );
      setIsEditModalVisible(false);
      message.success("계정 수정 성공");
      fetchAccounts();
    } catch (error) {
      message.error("계정 수정 실패");
    }
  };

  // Add account - Open modal for creating new account
  const handleAddAccount = () => {
    setCurrentAccount(null); // Reset current account for new account creation
    form.resetFields(); // Clear form fields
    setIsAddModalVisible(true); // Open Add Account Modal
  };

  // Handle form submit for account creation
  const handleAdd = async (values) => {
    console.log(values.provider_id);
    const provider_id = selectedProvider.map((provider) => provider.id);
    const branch_id = selectedBranch.map((branch) => branch.id);
    try {
      // 서버로부터 데이터 추가 후 응답 받기
      const response = await AxiosPost("/accounts", {
        provider_id: provider_id,
        branch_id: branch_id,
        ...values,
      }); // Replace with your endpoint

      let newAccount = response.data.account;
      console.log(newAccount);
      // 함수형 업데이트로 accounts 상태 업데이트
      setAccounts((prevAccounts) => [...prevAccounts, newAccount]); // Ensure proper state update

      // 모달 닫기
      setIsAddModalVisible(false);

      // 폼 필드 초기화
      form.resetFields();

      // 성공 메시지
      message.success("계정 생성 성공");
      fetchAccounts();
    } catch (error) {
      message.error("계정 생성 실패");
    }
  };

  // Table columns configuration
  const columns = [
    // {
    //   title: "PK",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "이름",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "직급",
      dataIndex: "office_position",
      key: "office_position",
    },
    {
      title: "이메일",
      dataIndex: "user_email",
      key: "user_email",
    },
    {
      title: "전화번호",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "권한",
      dataIndex: "permission",
      key: "permission",
      render(text) {
        return text === "1" ? (
          <Tag color="red">본사관리자</Tag>
        ) : text === "2" ? (
          <Tag color="blue">지사관리자</Tag>
        ) : text === "3" ? (
          <Tag color="green">지점관리자</Tag>
        ) : (
          <Tag color="orange">거래처</Tag>
        );
      },
    },
    {
      title: "동작",
      key: "actions",

      render: (text, record) => (
        <Space>
          <a
            onClick={() => {
              console.log(record);
              handleEdit(record);
            }}
          >
            수정
          </a>
          <Popconfirm
            title="계정을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleCloseBranch = (removedName) => {
    const updatedBranches = selectedBranch.filter(
      (branch) => branch.branch_name !== removedName
    );
    setSelectedBranch(updatedBranches);
    console.log(updatedBranches);
  };

  const handleCloseProvider = (removedName) => {
    const updatedProvider = selectedProvider.filter(
      (provider) => provider.provider_name !== removedName
    );
    setSelectedProvider(updatedProvider);
    console.log(updatedProvider);
  };

  return (
    <div style={{ textAlign: "right" }}>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleAddAccount}
      >
        계정 추가
      </Button>

      <Table
        size="small"
        columns={columns}
        dataSource={accounts}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Edit Modal */}
      <Modal
        title="계정 수정"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={currentAccount}
          onFinish={handleUpdate}
        >
          <Form.Item
            name="permission"
            label="권한"
            rules={[{ required: true, message: "Permission을 선택해주세요" }]}
          >
            <Select>
              <Select.Option value="1">본사관리자</Select.Option>
              <Select.Option value="2">지사관리자</Select.Option>
              <Select.Option value="3">지점관리자</Select.Option>
              {/* <Select.Option value="4">거래처</Select.Option> */}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_id"
                label="ID"
                rules={[{ required: true, message: "ID를 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="user_password"
                label="패스워드"
                rules={[{ required: true, message: "패스워드를 입력해주세요" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_name"
                label="이름"
                rules={[{ required: true, message: "이름을 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="user_phone"
                label="전화번호"
                rules={[{ required: true, message: "전화번호를 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="user_email"
            label="이메일"
            rules={[{ required: true, message: "이메일을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="branch_id" label="지점 선택">
            {selectedBranch.map((branch, index) => (
              <Tag
                key={branch.id}
                color={
                  index % 3 === 0 ? "red" : index % 3 === 1 ? "blue" : "green"
                }
                closable
                onClose={() => handleCloseBranch(branch.branch_name)}
              >
                {branch.branch_name}
              </Tag>
            ))}
            <SelectBranch
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          </Form.Item>

          <Form.Item name="provider_id" label="거래처 선택">
            {selectedProvider.map((provider, index) => (
              <Tag
                key={provider.provider_name}
                color={
                  index % 3 === 0 ? "red" : index % 3 === 1 ? "blue" : "green"
                }
                closable
                onClose={() => handleCloseProvider(provider.provider_name)}
              >
                {provider.provider_name}
              </Tag>
            ))}
            <SelectProvider
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
            />
          </Form.Item>

          <Form.Item name="office_position" label="직급">
            <Input />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "right" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                수정 완료
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Add Modal */}
      <Modal
        title="계정 추가"
        visible={isAddModalVisible}
        centered
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="permission"
            label="권한"
            rules={[{ required: true, message: "Permission을 선택해주세요" }]}
          >
            <Select>
              <Select.Option value="1">본사관리자</Select.Option>
              <Select.Option value="2">지사관리자</Select.Option>
              <Select.Option value="3">지점관리자</Select.Option>
              {/* <Select.Option value="4">거래처</Select.Option> */}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_id"
                label="ID"
                rules={[{ required: true, message: "ID를 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="user_password"
                label="패스워드"
                rules={[{ required: true, message: "패스워드를 입력해주세요" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_name"
                label="이름"
                rules={[{ required: true, message: "이름을 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="user_phone"
                label="전화번호"
                rules={[{ required: true, message: "전화번호를 입력해주세요" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="user_email"
            label="이메일"
            rules={[{ required: true, message: "이메일을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="branch_id" label="지점 선택">
            {selectedBranch.map((branch, index) => (
              <Tag
                key={branch.branch_name}
                color={
                  index % 3 === 0 ? "red" : index % 3 === 1 ? "blue" : "green"
                }
                closable
                onClose={() => handleCloseBranch(branch.branch_name)}
              >
                {branch.branch_name}
              </Tag>
            ))}
            <SelectBranch
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          </Form.Item>

          <Form.Item name="provider_id" label="거래처 선택">
            {selectedProvider.map((provider, index) => (
              <Tag
                key={provider.provider_name}
                color={
                  index % 3 === 0 ? "red" : index % 3 === 1 ? "blue" : "green"
                }
                closable
                onClose={() => handleCloseProvider(provider.provider_name)}
              >
                {provider.provider_name}
              </Tag>
            ))}
            <SelectProvider
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
            />
          </Form.Item>

          <Form.Item name="office_position" label="직급">
            <Input />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "right" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                추가 완료
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Account;

const options = [
  {
    label: "City1",
    value: "city1",
    children: [
      {
        label: "dong1",
        value: "dong1",
        children: [
          {
            label: "Branch1",
            value: "branch1",
          },
          {
            label: "Branch2",
            value: "branch2",
          },
        ],
      },
      {
        label: "dong2",
        value: "dong2",
        children: [
          {
            label: "Branch3",
            value: "branch3",
          },
          {
            label: "Branch4",
            value: "branch4",
          },
        ],
      },
    ],
  },
  {
    label: "City2",
    value: "city2",
    children: [
      {
        label: "dong3",
        value: "dong3",
        children: [
          {
            label: "Branch5",
            value: "branch5",
          },
          {
            label: "Branch6",
            value: "branch6",
          },
        ],
      },
    ],
  },
];
