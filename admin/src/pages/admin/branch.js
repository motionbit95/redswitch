import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import KakaoAddressSearch from "../../components/kakao";
import FileUpload from "../../components/button";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import usePagination from "../../hook/usePagination";

const BranchModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  form,
  isEditMode,
}) => {
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(form.getFieldValue("branch_address"));
  }, [form.getFieldValue("branch_address")]);

  return (
    <Modal
      title={isEditMode ? "지점 수정" : "지점 추가"}
      visible={visible}
      width={900}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
        >
          취소
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            console.log("여기");
            form.submit();
          }}
        >
          {isEditMode ? "수정 완료" : "추가 완료"}
        </Button>,
      ]}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Descriptions bordered column={3} size="small">
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
            label="지점 주소"
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item
              name="branch_address"
              rules={[{ required: true, message: "지점 주소를 입력해주세요" }]}
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
            label="계약서 파일"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={1}
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
            label="지점 이미지"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={1}
          >
            <Form.Item name="branch_image" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("branch_image")}
                setUrl={(url) => form.setFieldsValue({ branch_image: url })}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="담당자명"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="branch_manager_name" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="담당자 전화번호"
            span={1}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="branch_manager_phone" style={{ marginBottom: 0 }}>
              <Input />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="NFC 설치 이미지"
            labelStyle={{ whiteSpace: "nowrap" }}
            span={1}
          >
            <Form.Item name="install_image" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("install_image")}
                setUrl={(url) => form.setFieldsValue({ install_image: url })}
              />
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

  // Fetch branch data
  useEffect(() => {
    fetchBranchs();
  }, []);

  const fetchBranchs = async () => {
    try {
      const response = await AxiosGet("/branches"); // Replace with your endpoint
      setBranchs(response.data);
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
    } catch (error) {
      message.error("지점 삭제 실패");
    }
  };

  // Edit branch - Open modal
  const handleEdit = (branch) => {
    console.log(branch);
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
    console.log("values", values);
    try {
      let branchData = { ...values };

      console.log(branchData);

      if (currentBranch) {
        console.log(branchData);
        await AxiosPut(`/branches/${currentBranch.id}`, branchData, {
          headers: { "Content-Type": "application/json" },
        });

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
      console.log(error);
      message.error("지점 처리 실패");
    }
  };

  const { pagination, setPagination, handleTableChange } = usePagination(10);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
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
      title: "지점명",
      dataIndex: "branch_name",
      key: "branch_name",
    },

    {
      title: "주소",
      dataIndex: "branch_address",
      key: "branch_address",
    },
    {
      title: "담당자명",
      dataIndex: "branch_manager_name",
      key: "branch_manager_name",
    },
    {
      title: "담당자 전화번호",
      dataIndex: "branch_manager_phone",
      key: "branch_manager_phone",
    },
    {
      title: "관리자",
    },
    {
      title: "관리자 전화번호",
    },
    {
      title: "객실 수",
      dataIndex: "branch_room_cnt",
      key: "branch_room_cnt",
    },
    {
      title: "설치 여부",
      dataIndex: "install_flag",
      key: "install_flag",

      render: (text) => {
        return (
          <Tag color={text === "0" ? "red" : "green"}>
            {text === "0" ? "미설치" : "설치"}
          </Tag>
        );
      },
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
            title="지점을 삭제하시겠습니까?"
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
        onClick={handleAddBranch}
      >
        지점 추가
      </Button>

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
        }}
      />

      {/* Add Branch Modal */}

      <BranchModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={!currentBranch ? currentBranch : {}}
        form={form}
        isEditMode={!!currentBranch}
      />
    </div>
  );
}

export default Branch;
