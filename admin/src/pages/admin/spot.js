import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import FileUpload from "../../components/button";
import SearchBranch from "../../components/popover/searchbranch";

const AddModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const [form] = Form.useForm();
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    console.log(selectedBranch);
  }, []);

  const handlesubmit = async (values) => {
    console.log(values);
    try {
    } catch {}
  };

  return (
    <Modal
      open={isModalOpen}
      width={600}
      title="설치지점 등록"
      onCancel={() => {
        form.resetFields();
        setSelectedBranch(null);
        setIsModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setSelectedBranch(null);
            setIsModalOpen(false);
          }}
        >
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          등록
        </Button>,
      ]}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handlesubmit}
        initialValues={data}
      >
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item
            label="설치지점"
            span={2}
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="spot_name" style={{ marginBottom: 0 }}>
              <SearchBranch
                selectedBranch={selectedBranch}
                setSelectedBranch={(branches) => {
                  setSelectedBranch(branches[0]);
                }}
                multiple={false}
              />
            </Form.Item>
          </Descriptions.Item>

          <Descriptions.Item
            label="설치지점 로고"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="spot_logo" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("spot_logo")}
                setUrl={(url) => form.setFieldsValue({ spot_logo: url })}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item
            label="설치지점 이미지"
            labelStyle={{ whiteSpace: "nowrap" }}
          >
            <Form.Item name="spot_image" style={{ marginBottom: 0 }}>
              <FileUpload
                url={form.getFieldValue("spot_image")}
                setUrl={(url) => form.setFieldsValue({ spot_image: url })}
              />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>
      </Form>
    </Modal>
  );
};

const Spot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "No",
    },
    {
      title: "설치지점명",
      dataIndex: "spot_name",
      key: "spot_name",
    },
    {
      title: "설치지점 로고",
      dataIndex: "spot_logo",
      key: "spot_logo",
    },
    {
      title: "설치지점 이미지",
      dataIndex: "spot_image",
      key: "spot_image",
    },
  ];

  return (
    <div>
      <Row
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          지점 등록
        </Button>
      </Row>
      <Table size="small" columns={columns} dataSource={[]} />
      {/* 스팟 추가 모달 */}
      <AddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={[]}
      />
    </div>
  );
};

export default Spot;
