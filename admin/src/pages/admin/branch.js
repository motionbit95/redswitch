import {
  Alert,
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import KakaoAddressSearch from "../../components/kakao";
import FileUpload from "../../components/button";
import {
  InfoCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import usePagination from "../../hook/usePagination";
import useSearchFilter from "../../hook/useSearchFilter";
import useCurrentUser from "../../hook/useCurrentUser";
import { render } from "@testing-library/react";

const BranchModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  form,
  isEditMode,
  onDelete,
}) => {
  const [address, setAddress] = useState();
  const [isChecked, setIsChecked] = useState(true);
  const [isChecked2, setIsChecked2] = useState(true);

  const handleCheck = (e) => {
    setIsChecked(e.target.checked);
    if (!e.target.checked) {
      form.resetFields(["delivery_fee"]); // 체크 해제시 'delivery_fee' 필드를 초기화
    }
  };

  const handleCheck2 = (e) => {
    setIsChecked2(e.target.checked);
    if (!e.target.checked) {
      form.resetFields(["company_name"]); // 체크 해제시 'delivery_fee' 필드를 초기화
    }
  };

  useEffect(() => {
    if (visible) {
      setIsChecked(form.getFieldValue("delivery_fee") !== 0); // 모달이 열릴 때 체크박스 상태 설정
      setIsChecked2(form.getFieldValue("company_name") !== undefined);
    }
  }, [visible, form]);

  useEffect(() => {
    setAddress(form.getFieldValue("branch_address"));
  }, [form.getFieldValue("branch_address")]);

  return (
    <Modal
      title={isEditMode ? "지점 수정" : "지점 추가"}
      open={visible}
      width={950}
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
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              {isEditMode ? "수정 완료" : "추가 완료"}
            </Button>
          </Space>
          {isEditMode && (
            <Popconfirm title="지점을 삭제하시겠습니까?" onConfirm={onDelete}>
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
            label="지점명"
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_name"
              rules={[{ required: true, message: "지점명을 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="객실 수"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={1}
          >
            <Form.Item
              name={"branch_room_cnt"}
              rules={[{ required: true, message: "객실 수를 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="사업자등록번호"
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_brn"
              rules={[
                { required: true, message: "사업자등록번호를 입력해주세요" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="이메일"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_email"
              rules={[{ required: true, message: "이메일을 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="지점 전화번호"
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_contact"
              rules={[
                { required: true, message: "지점 전화번호를 입력해주세요" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="지점 주소"
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item
                name="branch_address"
                rules={[
                  { required: true, message: "지점 주소를 입력해주세요" },
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
                          branch_address: selectedAddress,
                          branch_sido: sido,
                          branch_sigungu: sigungu,
                        });
                        setAddress(selectedAddress);
                      }}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                name="branch_address_detail"
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
            label={
              <Space>
                계약서 파일
                <Tooltip
                  placement="right"
                  title="계약서, 사업자등록증, 통장사본을 pdf 파일로 묶어서 한번에 업로드해주세요"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            labelStyle={{ whiteSpace: "nowrap" }}
            span={2}
          >
            <Form.Item name="contract_image" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("contract_image")}
                setUrl={(url) => form.setFieldsValue({ contract_image: url })}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="대표자명"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_ceo_name"
              rules={[{ required: true, message: "대표자명을 입력해주세요" }]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="대표자 전화번호"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_ceo_phone"
              rules={[
                { required: true, message: "대표자 전화번호를 입력해주세요" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="설치여부"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={1}
          >
            <Form.Item name="install_flag" style={{ marginBottom: 0 }}>
              <Select>
                <Select.Option value="0">미설치</Select.Option>
                <Select.Option value="1">설치완료</Select.Option>
              </Select>
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space direction="vertical">
                <div>지점 배달료</div>
                <Checkbox
                  onChange={handleCheck}
                  checked={isChecked}
                  style={{ transform: "scale(0.8)" }}
                >
                  사용여부
                </Checkbox>
              </Space>
            }
            labelStyle={{ whiteSpace: "nowrap" }}
            span={1}
          >
            <Form.Item
              help="* 1건당 배달비용"
              name="delivery_fee"
              style={{ marginBottom: 0 }}
            >
              <Input
                defaultValue={0}
                disabled={!isChecked}
                type="number"
                addonAfter="원"
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="지점 이미지(외부)"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={2}
          >
            <Form.Item name="branch_image" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("branch_image")}
                setUrl={(url) => form.setFieldsValue({ branch_image: url })}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="NFC 설치 이미지(내부)"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={2}
          >
            <Form.Item name="install_image" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("install_image")}
                setUrl={(url) => form.setFieldsValue({ install_image: url })}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space direction="horizontal">
                <div>지사명</div>
                <Tooltip
                  placement="right"
                  title="지사명을 정확히 입력해주세요."
                >
                  <InfoCircleOutlined />
                </Tooltip>
                <Checkbox
                  onChange={handleCheck2}
                  checked={isChecked2}
                  style={{ transform: "scale(0.8)" }}
                >
                  지사여부
                </Checkbox>
              </Space>
            }
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="company_name" style={{ marginBottom: 0 }}>
              <Input disabled={!isChecked2} />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="담당자명"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="branch_manager_name" style={{ marginBottom: 0 }}>
              <Input defaultValue={""} />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="담당자 전화번호"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="branch_manager_phone" style={{ marginBottom: 0 }}>
              <Input defaultValue={""} />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            label="특이사항"
            span={3}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="branch_description" style={{ marginBottom: 0 }}>
              <TextArea rows={3} />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>

        <Row gutter={16} style={{ display: "none" }}>
          <Col span={12}>
            <FormItem
              name="branch_sido"
              label="시도"
              rules={[{ required: true, message: "시도를 입력해주세요" }]}
            >
              <Input readOnly />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name="branch_sigungu"
              label="시군구"
              rules={[{ required: true, message: "시구를 입력해주세요" }]}
            >
              <Input readOnly />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

function Branch(props) {
  const [loading, setLoading] = useState(true);
  const [branchs, setBranchs] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [form] = Form.useForm();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const { currentUser } = useCurrentUser();
  const { getColumnSearchProps } = useSearchFilter();

  // Fetch branch data
  useEffect(() => {
    fetchBranchs();
  }, [currentUser]);

  const fetchBranchs = async () => {
    try {
      const response = await AxiosGet("/branches"); // Replace with your endpoint

      let total_branch = Array.from(response.data);
      if (currentUser.permission === "1") {
        // 본사관리자는 모든 지점을 관리할 수 있다.
        setBranchs(total_branch);
      } else {
        // 지점관리자는 자신의 지점만 관리할 수 있다.

        // `total_branch` 배열의 각 객체의 `id` 값이 `currentUser.branch_id` 배열에 포함되는지 확인하여 필터링
        let filtered_branch = total_branch.filter((branch) => {
          return currentUser?.branch_id?.includes(branch.id);
        });

        setBranchs(filtered_branch);
      }
    } catch (error) {
      message.error("지점 데이터를 가져오는 데 실패했습니다..");
    } finally {
      setLoading(false);
    }
  };

  // Delete branch
  const handleDelete = async (id) => {
    try {
      await AxiosDelete(`/branches/${id}`);
      setBranchs(branchs.filter((branch) => branch.id !== id));
      message.success("지점 삭제 성공");

      setIsModalVisible(false);
    } catch (error) {
      message.error("지점 삭제 실패");
    }
  };

  // Edit branch - Open modal
  const handleEdit = (branch) => {
    setCurrentBranch(branch);
    form.setFieldsValue(branch); // Set the form fields to current branch values
    setIsModalVisible(true);
  };

  // Add branch - Open modal for creating new branch
  const handleAddBranch = () => {
    setCurrentBranch(null); // Reset current Branch for new branch creation
    form.resetFields(); // Clear form fields
    setIsModalVisible(true); // Open Add Branch Modal
  };

  // Handle form submit for branch creation or update
  const handleSubmit = async (values) => {
    try {
      let branchData = { ...values };
      console.log(branchData);

      if (currentBranch) {
        AxiosPut(`branches/${currentBranch.id}`, branchData);
        // await AxiosPut(`/branches/${currentBranch.id}`, branchData, {
        //   headers: { "Content-Type": "application/json" },
        // });

        setBranchs(
          branchs.map((branch) =>
            branch.id === currentBranch.id
              ? { ...branch, ...branchData }
              : branch
          )
        );
        message.success("지점 수정 성공");
        fetchBranchs();
      } else {
        const response = await AxiosPost("/branches ", branchData, {
          headers: { "Content-Type": "application/json" },
        });

        setBranchs((prevBranchs) => [...prevBranchs, response.data.branch]);
        message.success("지점 생성 성공");
        fetchBranchs();
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("지점 처리 실패");
    }
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
      title: "링크",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (text) => (
        <a href={`${"http://localhost:3001"}/spot/${text}`}>바로가기</a>
      ),
    },
    {
      title: "지점명",
      dataIndex: "branch_name",
      key: "branch_name",
      ...getColumnSearchProps("branch_name"),
    },
    {
      title: "객실 수",
      dataIndex: "branch_room_cnt",
      key: "branch_room_cnt",
      sorter: (a, b) => a.branch_room_cnt - b.branch_room_cnt,
    },
    {
      title: "주소",
      dataIndex: "branch_address",
      key: "branch_address",
      ...getColumnSearchProps("branch_address"),
    },
    {
      title: "지사",
      dataIndex: "company_name",
      key: "company_name",
      ...getColumnSearchProps("company_name"),
    },
    {
      title: "담당자명",
      dataIndex: "branch_manager_name",
      key: "branch_manager_name",
      ...getColumnSearchProps("branch_manager_name"),
    },
    {
      title: "담당자 전화번호",
      dataIndex: "branch_manager_phone",
      key: "branch_manager_phone",
      ...getColumnSearchProps("branch_manager_phone"),
    },
    {
      title: "사업자등록번호",
      dataIndex: "branch_brn",
      key: "branch_brn",
      ...getColumnSearchProps("branch_brn"),
    },
    {
      title: "이메일",
      dataIndex: "branch_email",
      key: "branch_email",
      ...getColumnSearchProps("branch_email"),
    },
    {
      title: "설치여부",
      dataIndex: "install_flag",
      key: "install_flag",

      render: (text) => {
        return (
          <Tag color={text === "0" ? "red" : "green"}>
            {text === "0" ? "미설치" : "설치"}
          </Tag>
        );
      },

      filters: [
        { text: "설치", value: "1" },
        { text: "미설치", value: "0" },
      ],
      onFilter: (value, record) => record.install_flag === value,
    },
    {
      title: "자세히보기",
      key: "actions",
      width: 100,
      fixed: "right",
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
          onClick={handleAddBranch}
        >
          지점 추가
        </Button>
      )}
      {currentUser.permission === "3" ? (
        <>
          <Alert message="지점 관리 권한이 없습니다." type="error" showIcon />
        </>
      ) : (
        <>
          <Table
            size="small"
            columns={columns}
            dataSource={branchs}
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
            scroll={{ x: "max-content" }} // 가로 스크롤 활성화
            className="no-wrap-table"
          />

          {/* Add Branch Modal */}

          <BranchModal
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onSubmit={handleSubmit}
            initialValues={!currentBranch ? currentBranch : {}}
            form={form}
            isEditMode={!!currentBranch}
            onDelete={() => handleDelete(currentBranch.id)}
          />
        </>
      )}
    </div>
  );
}

export default Branch;
