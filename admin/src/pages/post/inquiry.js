import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Checkbox,
  Typography,
  Switch,
  Row,
  Col,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ToastEditor from "../../components/toasteditor";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";

const { Option } = Select;
const { Title } = Typography;

// 현재 로그인 사용자 (더미 데이터)
const currentUser = {
  id: "-OCRwtnmaTllsx2c3OWM", // -OCRwmUYTeUtxH-auNvx
  user_id: "krystal", // redswitch
  user_name: "박수정",
  permission: "2", // 1
};

const InquiryBoard = () => {
  const [inquiries, setInquiries] = useState([]);

  const [users, setUsers] = useState([]);

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    AxiosGet("/posts/inquiries")
      .then((res) => {
        console.log(res.data);
        setInquiries(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    AxiosGet("/accounts")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    AxiosGet("/branches")
      .then((res) => {
        console.log(res.data);
        setBranches(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // sticky 필드가 true인 항목들을 최상단에 배치
  const sortedinquiries = [
    ...inquiries.filter((inquiry) => inquiry.sticky), // sticky가 true인 항목
    ...inquiries.filter((inquiry) => !inquiry.sticky), // 나머지 항목들
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [form] = Form.useForm();
  const [groupType, setGroupType] = useState(""); // 그룹 타입 설정

  // 게시판 추가/수정 모달 열기
  const showModal = (inquiry = null) => {
    form.resetFields();
    setGroupType(""); // 그룹 타입 초기화
    if (inquiry) {
      form.setFieldsValue({ ...inquiry, allowedUsers: inquiry.allowedUsers });
    }
    setCurrentInquiry(inquiry);
    setIsModalVisible(true);
  };

  // 게시판 상세보기 모달 열기
  const showDetailModal = (inquiry) => {
    const hasAccess =
      inquiry.allowedUsers.includes(currentUser.id) ||
      inquiry.author === currentUser.user_id;
    if (!hasAccess) {
      message.error("열람 권한이 없습니다.");
      return;
    }
    setCurrentInquiry(inquiry);
    setIsDetailModalVisible(true);
  };

  // 게시판 추가/수정 처리
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { groups, allowedUsers } = values;

        // 그룹 설정에 따른 사용자 권한 적용
        let finalAllowedUsers = [];
        if (groups.includes("직접설정")) {
          finalAllowedUsers = allowedUsers;
        } else {
          finalAllowedUsers = users
            .filter((user) => groups.includes(user.role))
            .map((user) => user.id);
        }

        if (currentInquiry) {
          // 수정

          AxiosPut(`/posts/inquiries/${currentInquiry.id}`, {
            ...values,
            allowedUsers: finalAllowedUsers,
            updatedAt: new Date().toISOString(),
          })
            .then((response) => {
              console.log(response.data);
              setInquiries(
                inquiries.map((inquiry) =>
                  inquiry.id === currentInquiry.id
                    ? {
                        ...inquiry,
                        ...values,
                        allowedUsers: finalAllowedUsers,
                        updatedAt: new Date().toISOString(),
                      }
                    : inquiry
                )
              );
              message.success("게시판이 수정되었습니다.");
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          // 추가
          const newInquiry = {
            ...values,
            allowedUsers: finalAllowedUsers,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // 호출
          AxiosPost("/posts/inquiries", newInquiry)
            .then((response) => {
              console.log(response.data);
              setInquiries([...inquiries, newInquiry]);
              message.success("게시판이 추가되었습니다.");
            })
            .catch((error) => {
              console.error(error);
            });
        }
        setIsModalVisible(false);
      })
      .catch(() => {
        message.error("게시판을 처리하는 데 실패했습니다.");
      });
  };

  // 게시판 삭제 처리
  const handleDelete = (id) => {
    AxiosDelete(`/posts/inquiries/${id}`)
      .then((response) => {
        setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
        console.log(response.data);
        message.success("게시판이 삭제되었습니다.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "No.",
      dataIndex: "sticky",
      key: "sticky",
      width: 100,
      render: (text, record, index) => {
        return record.sticky ? (
          <Tag color="blue">공지</Tag>
        ) : (
          <span>{index + 1}</span>
        );
      },
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        const hasAccess = true;
        // record.allowedUsers.includes(currentUser.id) ||
        // record.author === currentUser.user_id;
        return hasAccess ? (
          <Link
            onClick={() => showDetailModal(record)}
            style={{
              color: record.sticky ? "#1890ff" : "#000",
              fontWeight: record.sticky ? "bold" : "normal", // sticky일 경우 강조
            }}
          >
            {text}
          </Link>
        ) : (
          <span style={{ color: "#aaa", cursor: "not-allowed" }}>{text}</span>
        );
      },
    },
    {
      title: "작성자",
      dataIndex: "author",
      key: "author",
      width: 150,
    },
    {
      title: "작성일시",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 250,
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "작업",
      key: "action",
      fixed: "right",
      width: 100,

      render: (text, record) => (
        <Space
          style={{
            display: record.author === currentUser.user_id ? "flex" : "none",
          }}
        >
          <a
            onClick={() => {
              showModal(record);
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

  // 테이블에서 고정 항목을 항상 상단에 표시하려면 sticky 스타일 추가
  <Table
    columns={columns}
    dataSource={inquiries.sort(
      (a, b) => (b.sticky ? 1 : 0) - (a.sticky ? 1 : 0)
    )} // sticky가 true인 항목을 최상단으로 정렬
    rowKey="id"
  />;

  // 행 스타일링 (sticky 필드를 기준으로 강조)
  const rowClassName = (record) => {
    return record.sticky ? "sticky-row" : "";
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        게시판 작성
      </Button>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={sortedinquiries}
        rowClassName={rowClassName}
        size="small"
      />

      {/* 게시판 추가/수정 모달 */}
      <Modal
        title={currentInquiry ? "게시판 수정" : "게시판 추가"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        cancelText="닫기"
        okText={currentInquiry ? "수정" : "추가"}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="작성자"
                name="author"
                initialValue={
                  currentInquiry ? currentInquiry.author : currentUser.user_id
                }
                rules={[{ required: true, message: "작성자를 입력해주세요" }]}
                tooltip="작성자 ID입니다."
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            {currentUser.permission === "1" && (
              <Col span={12}>
                {/* 상단 고정 체크박스 - 관리자만 가능 */}
                <Form.Item
                  label="상단 고정 여부"
                  name="sticky"
                  valuePropName="checked"
                  tooltip={"테이블 상단에 공지로 고정됩니다."}
                >
                  <Switch
                    checkedChildren="상단 고정"
                    unCheckedChildren="상단 고정 해제"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          {/* <Form.Item>
            <div>{currentUser.branch_id[0]}</div>
          </Form.Item> */}
          <Form.Item label="지점 선택" name="branch">
            <Select
              showSearch
              placeholder="지점 선택"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {branches.map((branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="제목"
            name="title"
            rules={[{ required: true, message: "제목을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="내용"
            name="content"
            rules={[{ required: true, message: "내용을 입력해주세요" }]}
            initialValue={currentInquiry?.content} // 여기에서 초기 값을 제공
          >
            <ToastEditor initialValue={currentInquiry?.content} />
          </Form.Item>
        </Form>
      </Modal>

      <InquiryDetailModal
        isDetailModalVisible={isDetailModalVisible}
        setIsDetailModalVisible={setIsDetailModalVisible}
        currentInquiry={currentInquiry}
        setCurrentInquiry={currentInquiry}
        setInquiries={setInquiries}
        currentUser={currentUser}
        inquiries={inquiries}
      />
    </div>
  );
};

const InquiryDetailModal = ({
  isDetailModalVisible,
  setIsDetailModalVisible,
  currentInquiry,
  setCurrentInquiry,
  setInquiries,
  currentUser,
  inquiries,
}) => {
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null); // Track which comment is being edited
  const [editedContent, setEditedContent] = useState("");

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!commentContent) {
      message.error("댓글을 입력해주세요.");
      return;
    }

    try {
      const response = await AxiosPost(
        `/posts/inquiries/${currentInquiry.id}/comments`,
        {
          user: currentUser.user_id,
          content: commentContent,
        }
      );

      const newComment = response.data;

      // Update the local state with the new comment
      setCurrentInquiry({
        ...currentInquiry,
        comments: currentInquiry.comments
          ? [...currentInquiry.comments, newComment]
          : [newComment],
      });

      // Update the global inquiries state
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id === currentInquiry.id
            ? {
                ...inquiry,
                comments: inquiry.comments
                  ? [...inquiry.comments, newComment]
                  : [newComment],
              }
            : inquiry
        )
      );

      setCommentContent(""); // Clear the input field
    } catch (error) {
      message.error("댓글 추가에 실패했습니다.");
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      console.log(
        `/posts/inquiries/${currentInquiry.id}/comments/${commentId}`
      );
      await AxiosDelete(
        `/posts/inquiries/${currentInquiry.id}/comments/${commentId}`
      );

      // Update the local state to remove the deleted comment
      setCurrentInquiry({
        ...currentInquiry,
        comments: currentInquiry.comments.filter(
          (comment) => comment.id !== commentId
        ),
      });

      // Update the global inquiries state
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id === currentInquiry.id
            ? {
                ...inquiry,
                comments: inquiry.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : inquiry
        )
      );
    } catch (error) {
      message.error("댓글 삭제에 실패했습니다.");
    }
  };

  // Handle editing a comment
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  // Handle saving the edited comment
  const handleSaveEditedComment = async () => {
    if (!editedContent) {
      message.error("댓글을 입력해주세요.");
      return;
    }

    try {
      const response = await AxiosPut(
        `/posts/inquiries/${currentInquiry.id}/comments/${editingCommentId}`,
        {
          content: editedContent,
        }
      );

      const updatedComment = response.data;

      // Update the local state with the edited comment
      setCurrentInquiry({
        ...currentInquiry,
        comments: currentInquiry.comments.map((comment) =>
          comment.id === editingCommentId
            ? {
                ...comment,
                content: updatedComment.content,
                updatedAt: updatedComment.updatedAt,
              }
            : comment
        ),
      });

      // Update the global inquiries state
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id === currentInquiry.id
            ? {
                ...inquiry,
                comments: inquiry.comments.map((comment) =>
                  comment.id === editingCommentId
                    ? {
                        ...comment,
                        content: updatedComment.content,
                        updatedAt: updatedComment.updatedAt,
                      }
                    : comment
                ),
              }
            : inquiry
        )
      );

      // Reset editing state
      setEditingCommentId(null);
      setEditedContent("");
    } catch (error) {
      message.error("댓글 수정에 실패했습니다.");
    }
  };

  return (
    <Modal
      title="상세보기"
      visible={isDetailModalVisible}
      onCancel={() => setIsDetailModalVisible(false)}
      footer={[
        <Button
          key="back"
          onClick={() => setIsDetailModalVisible(false)}
          style={{ borderRadius: "8px" }}
        >
          닫기
        </Button>,
      ]}
      width={800}
      style={{ borderRadius: "8px" }}
    >
      {currentInquiry && (
        <div style={{ padding: "20px" }}>
          <Title level={3} style={{ fontWeight: "bold", marginBottom: "10px" }}>
            {currentInquiry.title}
          </Title>
          <Typography.Text
            style={{
              color: "#888",
              marginBottom: "20px",
              display: "block",
            }}
          >
            <span>작성자: {currentInquiry.author}</span>
            <span style={{ marginLeft: "20px" }}>
              작성일: {new Date(currentInquiry.createdAt).toLocaleString()}
            </span>
            <span style={{ marginLeft: "20px" }}>
              수정일: {new Date(currentInquiry.updatedAt).toLocaleString()}
            </span>
          </Typography.Text>
          <div style={{ marginBottom: "20px" }}>
            <Title level={5} style={{ fontWeight: "bold" }}>
              내용
            </Title>
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                minHeight: "150px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: currentInquiry.content }}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <Title level={5}>댓글</Title>
            <div>
              {currentInquiry.comments?.map((comment) => (
                <div
                  key={comment.id}
                  style={{ marginBottom: "10px", position: "relative" }}
                >
                  <Typography.Text strong>{comment.user}</Typography.Text>

                  {editingCommentId === comment.id ? (
                    <Row
                      gutter={16}
                      style={{
                        alignItems: "flex-end",
                        display: "flex",
                      }}
                    >
                      <Col flex="auto">
                        <TextArea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows={4}
                          style={{ width: "100%", marginTop: "10px" }}
                        />
                      </Col>
                      <Col>
                        <Button
                          size="large"
                          shape="circle"
                          type="primary"
                          onClick={handleSaveEditedComment}
                          style={{ marginTop: "10px" }}
                          icon={<EditOutlined />}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <>
                      <Typography.Text
                        style={{
                          display: "block",
                          marginTop: "5px",
                          fontSize: "14px",
                        }}
                      >
                        {comment.content}
                      </Typography.Text>
                      <Typography.Text
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#888",
                          marginTop: "5px",
                        }}
                      >
                        {dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </Typography.Text>
                    </>
                  )}

                  {comment.user === currentUser.user_id &&
                    !editingCommentId && (
                      <div style={{ position: "absolute", top: 0, right: 0 }}>
                        <Button
                          size="small"
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() =>
                            handleEditComment(comment.id, comment.content)
                          }
                          style={{ fontSize: "12px", padding: "0" }}
                        />
                        <Popconfirm
                          title="댓글을 삭제하시겠습니까?"
                          onConfirm={() => handleDeleteComment(comment.id)}
                        >
                          <Button
                            size="small"
                            type="link"
                            icon={<DeleteOutlined />}
                            // onClick={() => handleDeleteComment(comment.id)}
                            style={{
                              fontSize: "12px",
                              padding: "0",
                              marginLeft: "10px",
                            }}
                          />
                        </Popconfirm>
                      </div>
                    )}
                </div>
              ))}
            </div>

            <Row
              gutter={16}
              style={{
                marginTop: "20px",
                alignItems: "flex-end",
                display: "flex",
              }}
            >
              <Col flex="auto">
                <TextArea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  placeholder="댓글을 입력하세요"
                  style={{ width: "100%" }}
                />
              </Col>

              <Col>
                <Button
                  size="large"
                  type="primary"
                  shape="circle"
                  onClick={handleAddComment}
                  style={{ marginTop: "10px" }}
                  icon={<ArrowUpOutlined />}
                />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InquiryBoard;
