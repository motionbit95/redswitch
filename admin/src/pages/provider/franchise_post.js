import { Form, Input, Modal, Popconfirm, Space, Table, Tag } from "antd";
import React, { useState } from "react";

const FranchisePost = () => {
  // const [flag, setFlag] = useState("0");
  const dummyData = [
    {
      key: "1",
      franchise_name: "가맹점1",
      franchise_room_cnt: "10",
      franchise_address: "서울시",
      franchise_manager: "이상원",
      franchise_manager_phone: "010-1234-5678",
      franchise_manager_email: "7oFyI@example.com",
      flag: "2",
      name: "임시",
    },
  ];

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // For post

  const handleOk = (values) => {
    console.log("받음!", values);
  };
  const handleDelete = (record) => {
    console.log("Delete", record);
  };

  const handleEdit = (post) => {
    console.log("Edit", post);
    setCurrentPost(post);
    form.setFieldsValue(post); // Set the form fields to current account values
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "No.",
      render: (text, record, index) => index + 1,
      fixed: "left",
      width: 50,
    },
    {
      title: "가맹점 명",
      dataIndex: "franchise_name",
      key: "franchise_name",
    },
    {
      title: "객실 수",
      dataIndex: "franchise_room_cnt",
      key: "franchise_room_cnt",
    },
    {
      title: "가맹점 주소",
      dataIndex: "franchise_address",
      key: "franchise_address",
    },
    {
      title: "담당자",
      dataIndex: "franchise_manager",
      key: "franchise_manager",
    },
    {
      title: "전화번호",
      dataIndex: "franchise_manager_phone",
      key: "franchise_manager_phone",
    },
    {
      title: "이메일",
      dataIndex: "franchise_manager_email",
      key: "franchise_manager_email",
    },
    {
      title: "영업담당자",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tag",
      dataIndex: "flag",
      key: "flag",
      render: (_, record) => (
        // <Tag>{record.flag}</Tag>
        <Tag
          color={
            record.flag === "0"
              ? "red"
              : record.flag === "1"
              ? "green"
              : record.flag === "2"
              ? "blue"
              : "orange"
          }
        >
          {record.flag === "0"
            ? "상담요청"
            : record.flag === "1"
            ? "상담완료"
            : record.flag === "2"
            ? "계약완료"
            : "설치완료"}
        </Tag>
      ),
    },
    {
      title: "동작",
      key: "action",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="해당 게시물을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.pk)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Table
        size="small"
        style={{ marginTop: 48 }}
        columns={columns}
        dataSource={dummyData}
        loading={loading}
      />
      <Modal
        title={[]}
        visible={isModalOpen}
        onOk={handleOk}
        centered
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" initialValues={currentPost}>
          <Form.Item name="franchise_name" label="가맹점명">
            <Input />
          </Form.Item>
          <Form.Item name="franchise_room_cnt" label="객실수">
            <Input />
          </Form.Item>
          <Form.Item name="franchise_address" label="가맹점주소">
            <Input />
          </Form.Item>
          <Form.Item name="franchise_manager" label="담당자">
            <Input />
          </Form.Item>
          <Form.Item name="franchise_manager_phone" label="전화번호">
            <Input />
          </Form.Item>
          <Form.Item name="franchise_manager_email" label="이메일">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FranchisePost;
