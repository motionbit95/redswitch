import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useSearchFilter from "../../hook/useSearchFilter";
import { AxiosDelete, AxiosGet, AxiosPut } from "../../api";
import useCurrentUser from "../../hook/useCurrentUser";

const { Option } = Select;

const FranchisePost = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // For post
  const [franchise_post, setFranchisePost] = useState([]);

  const { getColumnSearchProps } = useSearchFilter(); // 훅 사용

  useEffect(() => {
    AxiosGet("/posts/franchises")
      .then((res) => {
        console.log(res.data);
        setFranchisePost(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOk = (values) => {
    console.log("데이터 > ", values);
    AxiosPut(`/posts/franchises/${currentPost.id}`, values)
      .then((res) => {
        console.log(res.data);
        setFranchisePost(
          franchise_post.map((post) => {
            if (post.id === currentPost.id) {
              return { ...currentPost, ...values };
            }
            return post;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    form.resetFields(); // Reset form fields

    setIsModalOpen(false);
  };
  const handleDelete = async (id) => {
    await AxiosDelete(`/posts/franchises/${id}`)
      .then(() => {
        message.success("가맹점 삭제 성공");
        // 상태에서 삭제한 항목 제거
        setFranchisePost(franchise_post.filter((post) => post.id !== id));
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("게시판 삭제 오류:", error);
      });
  };

  const handleEdit = (post) => {
    console.log("상세정보", post);
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
      title: "가맹점명",
      dataIndex: "franchise_name",
      key: "franchise_name",
      fixed: "left",
      ...getColumnSearchProps("franchise_name"),
    },
    {
      title: "객실 수",
      dataIndex: "franchise_room_cnt",
      key: "franchise_room_cnt",
      sorter: (a, b) => a.franchise_room_cnt - b.franchise_room_cnt,
      showSorterTooltip: false, // 정렬 툴팁을 숨깁니다
    },
    {
      title: "가맹점 주소",
      dataIndex: "franchise_address",
      key: "franchise_address",
      ...getColumnSearchProps("franchise_address"),
    },
    {
      title: "이메일",
      dataIndex: "franchise_manager_email",
      key: "franchise_manager_email",
      ...getColumnSearchProps("franchise_manager_email"),
    },
    {
      title: "담당자",
      dataIndex: "franchise_manager",
      key: "franchise_manager",
      ...getColumnSearchProps("franchise_manager"),
    },
    {
      title: "담당자 전화번호",
      dataIndex: "franchise_manager_phone",
      key: "franchise_manager_phone",
      ...getColumnSearchProps("franchise_manager_phone"),
    },
    {
      title: "영업담당자",
      dataIndex: "sales_manager",
      key: "sales_manager",
      ...getColumnSearchProps("sales_manager"),
    },
    {
      title: "태그",
      dataIndex: "flag",
      key: "flag",
      fixed: "right",
      filters: [
        {
          text: "상담요청",
          value: "0",
        },
        {
          text: "상담완료",
          value: "1",
        },
        {
          text: "계약완료",
          value: "2",
        },
        {
          text: "설치완료",
          value: "3",
        },
      ],
      onFilter: (value, record) => record.flag === value,
      render: (_, record) => (
        // <Tag>{record.flag}</Tag>
        <Tag
          color={
            record.flag === "0"
              ? "red"
              : record.flag === "1"
              ? "orange"
              : record.flag === "2"
              ? "blue"
              : "green"
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
      title: "자세히보기",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Button icon={<SearchOutlined />} onClick={() => handleEdit(record)} />
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={franchise_post}
        loading={loading}
        scroll={{ x: "max-content" }} // 가로 스크롤 활성화
        className="no-wrap-table"
      />
      <PostDetailModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentPost={currentPost}
        handleOk={handleOk}
        onDelete={() => handleDelete(currentPost.id)}
      />
    </>
  );
};

export const PostDetailModal = ({
  isModalOpen,
  setIsModalOpen,
  currentPost,
  handleOk,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const [memo, setMemo] = useState("");
  const [salesAccounts, setSalesAccounts] = useState([]);
  const { currentUser } = useCurrentUser();

  const flagOptions = [
    { label: "상담요청", value: "0" },
    { label: "상담완료", value: "1" },
    { label: "계약완료", value: "2" },
    { label: "설치완료", value: "3" },
  ];

  useEffect(() => {
    if (currentPost) {
      // 현재 포스트 정보로 폼 값 설정
      form.setFieldsValue({
        ...currentPost,
        flag: currentPost.flag, // 'flag' 값도 명시적으로 설정
        sales_manager: currentPost.sales_manager || null, // sales_manager가 없을 수도 있기 때문에 처리
      });

      // 메모 값도 초기화
      setMemo(currentPost.memo);
    }
  }, [currentPost, form]);

  useEffect(() => {
    AxiosGet("/accounts")
      .then((res) => {
        // const salesAccount = res.data.filter(
        //   (account) => account.permission === "2"
        // );
        // setSalesAccounts(salesAccount);
        setSalesAccounts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      {currentPost && (
        <Modal
          title="상세 정보"
          open={isModalOpen}
          centered
          onCancel={() => setIsModalOpen(false)}
          width={800}
          footer={
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
                direction: "rtl",
              }}
            >
              <Space style={{ direction: "ltr" }}>
                <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                  취소
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => {
                    handleOk(form.getFieldsValue());
                  }}
                >
                  저장
                </Button>
              </Space>
              {currentUser.permission === "1" && currentPost.flag === "3" && (
                <Popconfirm
                  title="삭제하시겠습니까?"
                  description={"삭제 시 더이상 해당 내용을 볼 수 없습니다."}
                  onConfirm={onDelete}
                >
                  <Button danger>삭제</Button>
                </Popconfirm>
              )}
            </Space>
          }
        >
          <Form form={form} layout="vertical" initialValues={currentPost}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="가맹점명">
                {currentPost.franchise_name}
              </Descriptions.Item>
              <Descriptions.Item label="태그">
                <Form.Item name="flag" style={{ marginBottom: 0 }}>
                  <Select defaultValue={currentPost.flag}>
                    {flagOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="객실수">
                {currentPost.franchise_room_cnt}
              </Descriptions.Item>
              <Descriptions.Item label="가맹점 주소">
                {currentPost.franchise_address}
              </Descriptions.Item>
              <Descriptions.Item label="담당자">
                {currentPost.franchise_manager}
              </Descriptions.Item>
              <Descriptions.Item label="전화번호">
                {currentPost.franchise_manager_phone}
              </Descriptions.Item>
              <Descriptions.Item label="이메일">
                {currentPost.franchise_manager_email}
              </Descriptions.Item>
              <Descriptions.Item label="영업담당자">
                <Form.Item name="sales_manager" style={{ marginBottom: 0 }}>
                  <Select
                    defaultValue={currentPost.sales_manager}
                    style={{ width: "100%", minWidth: "190px" }}
                    popupMatchSelectWidth={false}
                  >
                    <Option value={null}>선택</Option>
                    {salesAccounts.map(({ id, user_name, permission }) => (
                      <Option key={id} value={user_name}>
                        {user_name} -{" "}
                        {permission === "1"
                          ? "본사관리자"
                          : permission === "2"
                          ? "지사관리자"
                          : "지점관리자"}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <Form.Item label="비고" name="memo" style={{ marginTop: "20px" }}>
              <TextArea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={4}
                placeholder="메모를 자유롭게 남기세요"
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default FranchisePost;
