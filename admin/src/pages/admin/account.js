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
  Tag,
  Descriptions,
  Row,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import SearchBranch from "../../components/popover/searchbranch";
import SearchProvider from "../../components/popover/searchprovider";
import useSearchFilter from "../../hook/useSearchFilter";

// 메인 Account 컴포넌트
const Account = () => {
  // 상태 관리
  const [accounts, setAccounts] = useState([]); // 계정 데이터
  const [branches, setBranches] = useState([]); // 지점 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // 수정 모달 표시 여부
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // 추가 모달 표시 여부
  const [currentAccount, setCurrentAccount] = useState(null); // 현재 수정 중인 계정
  const [selectedBranch, setSelectedBranch] = useState(null); // 선택된 지점
  const [selectedProvider, setSelectedProvider] = useState(null); // 선택된 거래처
  const [filterValue, setFilterValue] = useState("all"); // 필터 상태

  const { getColumnSearchProps } = useSearchFilter(); // 검색 필터 훅
  const [form] = Form.useForm(); // 폼 인스턴스

  // 데이터 가져오기
  useEffect(() => {
    fetchAccounts();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await AxiosGet("/branches");
      setBranches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedBranch) {
      console.log(selectedBranch.id);

      let filteredBranch = accounts.filter((account) => {
        return account.branch_id?.includes(selectedBranch.id);
      });

      setAccounts(filteredBranch);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedProvider) {
      let filteredProvider = accounts.filter((account) => {
        return account.provider_id?.includes(selectedProvider.id);
      });

      setAccounts(filteredProvider);
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (filterValue === "all") {
      fetchAccounts();
    }
  }, [filterValue]);

  const fetchAccounts = async () => {
    try {
      const response = await AxiosGet("/accounts");
      setAccounts(response.data);
    } catch (error) {
      message.error("계정 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 계정 삭제
  const handleDelete = async (id) => {
    try {
      await AxiosDelete(`/accounts/${id}`);
      setAccounts(accounts.filter((account) => account.id !== id));
      message.success("계정 삭제 성공");
    } catch (error) {
      message.error("계정 삭제 실패");
    }
  };

  // 계정 수정 모달 열기
  const handleEdit = (account) => {
    console.log("선택한 계정 : ", account);
    setCurrentAccount(account);
    form.setFieldsValue(account);
    setIsEditModalVisible(true);
  };

  // 계정 수정 처리
  const handleUpdate = async (values) => {
    try {
      await AxiosPut(`/accounts/${currentAccount.id}`, values);
      message.success("계정 수정 성공");
      fetchAccounts();
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("계정 수정 실패");
    }
  };

  // 계정 추가 모달 열기
  const handleAddAccount = () => {
    setCurrentAccount(null);
    form.resetFields();
    setIsAddModalVisible(true);
  };

  // 계정 추가 처리
  const handleAdd = async (values) => {
    try {
      await AxiosPost("/accounts", values);
      message.success("계정 생성 성공");
      fetchAccounts();
      setIsAddModalVisible(false);
    } catch (error) {
      message.error("계정 생성 실패");
    }
  };

  // 테이블 컬럼 설정
  const columns = [
    {
      title: "생성일자",
      dataIndex: "created_at",
      key: "created_at",
      fixed: "left",
      width: 100,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (text) => text.slice(0, 10),
    },
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
      fixed: "left",
      ...getColumnSearchProps("user_id"),
    },
    {
      title: "이름",
      dataIndex: "user_name",
      key: "user_name",
      fixed: "left",
      ...getColumnSearchProps("user_name"),
    },
    {
      title: "직급",
      dataIndex: "office_position",
      key: "office_position",
      ...getColumnSearchProps("office_position"),
    },
    {
      title: "이메일",
      dataIndex: "user_email",
      key: "user_email",
      ...getColumnSearchProps("user_email"),
    },
    {
      title: "전화번호",
      dataIndex: "user_phone",
      key: "user_phone",
      ...getColumnSearchProps("user_phone"),

      render: (text) => {
        return <span style={{ whiteSpace: "nowrap" }}>{text}</span>;
      },
    },
    {
      title: "권한",
      dataIndex: "permission",
      key: "permission",
      filters: [
        { text: "본사관리자", value: "1" },
        { text: "지사관리자", value: "2" },
        { text: "지점관리자", value: "3" },
      ],
      onFilter: (value, record) => record.permission === value,
      render: (text) => {
        const colors = { 1: "red", 2: "blue", 3: "green" };
        const labels = { 1: "본사관리자", 2: "지사관리자", 3: "지점관리자" };
        return <Tag color={colors[text]}>{labels[text]}</Tag>;
      },
    },
    {
      title: "지사/지점",
      dataIndex: "company_name",
      key: "company_name",
      render: (text, record) => {
        if (record.permission === "1") return "전체";
        if (record.permission === "2") return text;
        return (
          branches.find((branch) => record.branch_id?.includes(branch.id))
            ?.branch_name ?? ""
        );
      },
    },
    {
      title: "동작",
      key: "actions",
      fixed: "right",
      render: (text, record) => (
        <Space>
          <a
            style={{ whiteSpace: "nowrap" }}
            onClick={() => handleEdit(record)}
          >
            수정
          </a>
          <Popconfirm
            title="계정을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a style={{ whiteSpace: "nowrap" }}>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        style={{
          marginBottom: 16,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button type="primary" onClick={handleAddAccount}>
          계정 추가
        </Button>
      </Space>
      <Table
        size="small"
        columns={columns}
        dataSource={accounts}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, position: ["bottomCenter"] }}
        scroll={{ x: "max-content" }}
      />
      <AccountModal
        visible={isAddModalVisible || isEditModalVisible}
        isEdit={isEditModalVisible}
        form={form}
        centered
        width={700}
        onCancel={() => {
          setIsAddModalVisible(false);
          setIsEditModalVisible(false);
        }}
        onFinish={isEditModalVisible ? handleUpdate : handleAdd}
      />
    </div>
  );
};

// 계정 추가/수정 모달 컴포넌트
const AccountModal = ({ visible, isEdit, form, onCancel, onFinish }) => {
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState("1");
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (isEdit) {
      AxiosGet(`/accounts/${form.getFieldValue("id")}`).then((response) => {
        const account = response.data;
        console.log(account);
        setSelectedPermissions(account.permission);
        fetchBranchAndProviderData(account);
      });
    }
  }, [isEdit, form]);

  // 지사 및 지점 목록 불러오기
  useEffect(() => {
    AxiosGet("/branches")
      .then((response) => {
        setBranches(response.data);
        const companyNames = response.data
          .map((branch) => branch.company_name) // company_name 추출
          .filter((name) => name !== undefined && name !== null); // undefined와 null 제거

        // 중복 제거
        const uniqueCompanyNames = [...new Set(companyNames)];

        console.log(uniqueCompanyNames); // 결과 확인
        setCompanies(uniqueCompanyNames);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const fetchBranchAndProviderData = (account) => {
    // 지점 데이터 가져오기
    const branchPromises = account.branch_id?.map((branch) =>
      AxiosGet(`/branches/${branch}`)
        .then((response) => response.data)
        .catch((error) => console.error(error))
    );

    // 거래처 데이터 가져오기
    const providerPromises = account.provider_id?.map((provider) =>
      AxiosGet(`/providers/${provider}`).then((response) => response.data)
    );

    // Promise.all을 사용하여 모든 데이터를 가져오고 상태 업데이트
    Promise.all(branchPromises || []).then((branchData) => {
      setSelectedBranch(branchData);
    });

    Promise.all(providerPromises || []).then((providerData) => {
      setSelectedProvider(providerData);
    });
  };

  const handleCloseBranch = (removedName) => {
    setSelectedBranch((prev) =>
      prev.filter((branch) => branch?.branch_name !== removedName)
    );
  };

  const handleCloseProvider = (removedName) => {
    setSelectedProvider((prev) =>
      prev.filter((provider) => provider.provider_name !== removedName)
    );
  };

  const onSubmit = () => {
    const formValues = form.getFieldsValue();
    const { company_name } = formValues;

    console.log(company_name);

    let branchIds = [];

    // company_name이 있으면, company_name에 해당하는 branch.id를 가져옴
    if (company_name) {
      // selectedBranches에서 company_name에 해당하는 모든 branch를 찾아 branch.id를 가져오기
      const branchesMatchingCompany = branches.filter(
        (branch) => branch.company_name === company_name
      );

      if (branchesMatchingCompany.length > 0) {
        branchIds = branchesMatchingCompany.map((branch) => branch.id); // 해당하는 branch.id들을 배열로 설정
      }
    } else {
      // company_name이 없으면 기존 방식대로 branch.id들을 가져옴
      branchIds = selectedBranch.map((branch) => branch.id);
    }
    onFinish({
      ...form.getFieldsValue(),
      branch_id: branchIds,
      provider_id: selectedProvider.map((provider) => provider.id),
    });
  };

  return (
    <Modal
      title={isEdit ? "계정 수정" : "계정 추가"}
      visible={visible}
      centered
      width={800}
      onCancel={() => {
        onCancel();
        setSelectedBranch([]);
        setSelectedProvider([]);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            onCancel();
            setSelectedBranch([]);
            setSelectedProvider([]);
          }}
        >
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEdit ? "수정 완료" : "추가 완료"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">
            <Form.Item
              name="user_id"
              rules={[{ required: true, message: "ID를 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="패스워드">
            <Form.Item
              name="user_password"
              rules={[{ required: true, message: "패스워드를 입력해주세요" }]}
            >
              <Input.Password />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="이름">
            <Form.Item
              name="user_name"
              rules={[{ required: true, message: "이름을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="전화번호">
            <Form.Item
              name="user_phone"
              rules={[{ required: true, message: "전화번호를 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="이메일">
            <Form.Item
              name="user_email"
              rules={[{ required: true, message: "이메일을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="직급">
            <Form.Item
              name="office_position"
              rules={[{ required: true, message: "직급을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="권한" span={2}>
            <Form.Item
              name="permission"
              rules={[{ required: true, message: "권한을 선택해주세요" }]}
            >
              <Select onChange={(value) => setSelectedPermissions(value)}>
                <Select.Option value="1">본사관리자</Select.Option>
                <Select.Option value="2">지사관리자</Select.Option>
                <Select.Option value="3">지점관리자</Select.Option>
              </Select>
            </Form.Item>
          </Descriptions.Item>
          {selectedPermissions !== "1" && (
            <>
              {selectedPermissions === "3" && (
                <Descriptions.Item label="지점" span={2}>
                  <Space direction="vertical">
                    <SearchBranch
                      selectedBranch={selectedBranch}
                      setSelectedBranch={setSelectedBranch}
                      multiple={selectedPermissions === "2" ? true : false}
                    />
                    <Row>
                      {selectedBranch.map((branch) => (
                        <Tag
                          key={branch?.id}
                          closable
                          onClose={() => handleCloseBranch(branch?.branch_name)}
                        >
                          {branch?.branch_name || "[Unknown]"}
                        </Tag>
                      ))}
                    </Row>
                  </Space>
                </Descriptions.Item>
              )}
              {selectedPermissions === "2" && (
                <>
                  <Descriptions.Item label="지사" span={2}>
                    <Space direction="vertical">
                      <Form.Item name="company_name">
                        <Select style={{ width: "300px" }}>
                          {companies.map((company) => (
                            <Select.Option key={company} value={company}>
                              {company}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="거래처" span={2}>
                    <Space direction="vertical">
                      <SearchProvider
                        selectedProvider={selectedProvider}
                        setSelectedProvider={setSelectedProvider}
                        multiple
                      />
                      <Row>
                        {selectedProvider.map((provider) => (
                          <Tag
                            key={provider.id}
                            closable
                            onClose={() =>
                              handleCloseProvider(provider.provider_name)
                            }
                          >
                            {provider.provider_name}
                          </Tag>
                        ))}
                      </Row>
                    </Space>
                  </Descriptions.Item>
                </>
              )}
            </>
          )}
        </Descriptions>
      </Form>
    </Modal>
  );
};

export default Account;
