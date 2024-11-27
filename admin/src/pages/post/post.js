import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import React, { useState } from "react";
import ToastEditor from "../../components/toasteditor";

const Post = () => {
  const dummyData = [
    {
      key: "1",
      post_title: "가맹점1",
      post_receiver: "KIM",
      post_sender: "Jone Do",
      coment: "Hi",
      created_at: "2023-08-23",
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

  const handleAdd = () => {
    setIsModalOpen(true);
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
      title: "게시판제목",
      dataIndex: "post_title",
      key: "post_title",
    },
    {
      title: "받은이",
      dataIndex: "post_receiver",
      key: "post_receiver",
    },
    {
      title: "보낸이",
      dataIndex: "post_sender",
      key: "post_sender",
    },
    {
      title: "답변",
      dataIndex: "coment",
      key: "coment",
    },
    {
      title: "생성일",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="게시물을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ textAlign: "right" }}>
      <Button onClick={handleAdd} style={{ marginBottom: 16 }}>
        글작성
      </Button>
      <Table
        size="small"
        columns={columns}
        dataSource={dummyData}
        loading={loading}
      />
      <Modal
        title={"게시판 글작성"}
        open={isModalOpen}
        onOk={handleOk}
        centered
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" initialValues={currentPost}>
          <Form.Item>
            <ToastEditor />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Post;
