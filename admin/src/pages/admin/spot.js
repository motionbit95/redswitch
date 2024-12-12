import { Button, Col, Form, Input, Modal, Row, Table } from "antd";
import React, { useState } from "react";
import FileUpload from "../../components/button";

const AddModal = ({ isModalOpen, setIsModalOpen, data, onSubmit }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={isModalOpen}
      title="설치지점 등록"
      onCancel={() => {
        form.resetFields();
        setIsModalOpen(false);
      }}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setIsModalOpen(false);
          }}
        >
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit}>
          등록
        </Button>,
      ]}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={data}
      >
        <Form.Item
          name="spot_name"
          label="설치지점명"
          rules={[{ required: true, message: "설치지점명을 입력해주세요." }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="spot_logo" label="설치지점 로고">
              <FileUpload
                url={form.getFieldValue("spot_logo")}
                setUrl={(url) => form.setFieldsValue({ spot_logo: url })}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="spot_image" label="설치지점 이미지">
              <FileUpload
                url={form.getFieldValue("spot_image")}
                setUrl={(url) => form.setFieldsValue({ spot_image: url })}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const Spot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log(values);
  };

  const columns = [
    {
      title: "No",
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
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Spot;
