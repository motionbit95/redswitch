import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import useSearchableColumn, {
  getColumnSearchProps,
} from "../../components/table";

const strList = [
  "동의",
  "대체적으로 동의",
  "약간 동의",
  "모르겠음",
  "약간 비동의",
  "대체적으로 비동의",
  "비동의",
];
const BDSMQuestions = () => {
  const [dataSource, setDataSource] = useState([]);
  const [expandDataSource, setExpandDataSource] = useState({}); // 객체로 초기화
  const { getColumnSearchProps } = useSearchableColumn();

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const addQuestion = async () => {
    AxiosPost("/bdsm/questions", {
      question: "",
    })
      .then((response) => {
        console.log("Question added:", response.data);

        const newData = {
          key: dataSource.length + 1,
          question: "",
        };
        setDataSource([...dataSource, newData]);
      })
      .catch((error) => {
        console.error("Error adding question:", error);
      });
  };

  const editQuestion = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const editAnswer = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const saveQuestion = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
      }

      console.log({ ...row, question_pk: key });
      AxiosPut(`/bdsm/questions`, {
        ...row,
        question_pk: key,
      })
        .then((response) => {
          console.log("Question updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating question:", error);
        });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const saveAnswer = async (question_pk, key) => {
    try {
      const row = await form.validateFields(); // Validate form fields before saving
      const newData = [...expandDataSource[question_pk]]; // Clone the existing answers

      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row, // Merge new form data into the existing item
        });
        // Update the state with new answers
        setExpandDataSource((prev) => ({
          ...prev,
          [question_pk]: newData,
        }));
        setEditingKey("");
      } else {
        newData.push(row); // Add new answer if not found
        setExpandDataSource((prev) => ({
          ...prev,
          [question_pk]: newData,
        }));
        setEditingKey("");
      }

      console.log(newData[index]);

      // Now send the updated answer data to the server
      AxiosPut(`/bdsm/answers`, newData[index]) // Send the specific answer data
        .then((response) => {
          console.log("Answer updated successfully:", response);
        })
        .catch((error) => {
          console.error("Error updating answer:", error);
        });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const deleteQuestion = async (key) => {
    try {
      await AxiosDelete(`/bdsm/questions/${key}`);
      setDataSource(dataSource.filter((item) => item.key !== key));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  useEffect(() => {
    // Fetch questions data using Axios
    const fetchQuestions = async () => {
      try {
        const response = await AxiosGet("/bdsm/questions");
        const questions = response.data;
        console.log(questions);
        setDataSource(
          questions.map((value, index) => ({
            key: index + 1, // 인덱스를 키로 사용
            question: value.question,
          }))
        );
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleExpand = async (expanded, record) => {
    if (expanded) {
      try {
        const response = await AxiosGet(`/bdsm/answers/${record.key}`);
        const answers = response.data;
        console.log(answers);

        setExpandDataSource((prev) => ({
          ...prev,
          [record.key]: answers.map((value, index) => ({
            key: `answer-${index}`,
            answer: value.step,
            ...value,
          })),
        }));
      } catch (error) {
        console.error(
          `Error fetching answers for question ${record.key}:`,
          error
        );
      }
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key - b.key, // Sorting in descending order
      defaultSortOrder: "descend", // Initially sorted in descending order
    },
    {
      title: "질문",
      dataIndex: "question",
      key: "question",
      editable: true,

      ...getColumnSearchProps("question"),
    },
    {
      width: "100px",
      fixed: "right",
      title: "동작",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => saveQuestion(record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              저장
            </Typography.Link>
            <Popconfirm
              title="변경을 취소하시겠습니까?"
              onConfirm={cancel}
              cancelText="취소"
              okText="확인"
            >
              <a>취소</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => editQuestion(record)}
            >
              수정
            </Typography.Link>
            <Popconfirm
              title="문항을 삭제하시겠습니까?"
              onConfirm={() => deleteQuestion(record.key)}
              cancelText="삭제"
              okText="확인"
            >
              <a>삭제</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const expandColumns = [
    {
      width: "100px",
      fixed: "left",
      title: "동작",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => saveAnswer(record.question_pk, record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              저장
            </Typography.Link>
            <Popconfirm
              title="변경을 취소하시겠습니까?"
              onConfirm={cancel}
              cancelText="취소"
              okText="확인"
            >
              <a>취소</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => editAnswer(record)}
          >
            수정
          </Typography.Link>
        );
      },
    },
    // {
    //   title: "index",
    //   dataIndex: "index",
    //   key: "index",
    // },
    {
      title: "답변",
      dataIndex: "answer",
      key: "answer",
      render: (text) => <span>{strList[text - 1]}</span>,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          마스터/
          <br />
          미스트레스
        </div>
      ),
      dataIndex: "master_mistress_",
      key: "master_mistress_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          슬레이브
        </div>
      ),
      dataIndex: "slave_",
      key: "slave_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          헌터
        </div>
      ),
      dataIndex: "hunter_",
      key: "hunter_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          프레이
        </div>
      ),
      dataIndex: "prey_",
      key: "prey_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          브랫테이머
        </div>
      ),
      dataIndex: "brat_tamer_",
      key: "brat_tamer_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          브랫
        </div>
      ),
      dataIndex: "brat_",
      key: "brat_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          오너
        </div>
      ),
      dataIndex: "owner_",
      key: "owner_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          펫
        </div>
      ),
      dataIndex: "pet_",
      key: "pet_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          대디/마미
        </div>
      ),
      dataIndex: "daddy_mommy_",
      key: "daddy_mommy_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          리틀
        </div>
      ),
      dataIndex: "little_",
      key: "little_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          사디스트
        </div>
      ),
      dataIndex: "sadist_",
      key: "sadist_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          마조히스트
        </div>
      ),
      dataIndex: "masochist_",
      key: "masochist_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          스팽커
        </div>
      ),
      dataIndex: "spanker_",
      key: "spanker_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          스팽키
        </div>
      ),
      dataIndex: "spankee_",
      key: "spankee_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          디그레이더
        </div>
      ),
      dataIndex: "degrader_",
      key: "degrader_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          디그레이디
        </div>
      ),
      dataIndex: "degradee_",
      key: "degradee_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          리거
        </div>
      ),
      dataIndex: "rigger_",
      key: "rigger_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          로프버니
        </div>
      ),
      dataIndex: "rope_bunny_",
      key: "rope_bunny_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          도미넌트
        </div>
      ),
      dataIndex: "dominant_",
      key: "dominant_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          서브미시브
        </div>
      ),
      dataIndex: "submissive_",
      key: "submissive_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          스위치
        </div>
      ),
      dataIndex: "switch_",
      key: "switch_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
    {
      title: (
        <div style={{ writingMode: "vertical-lr", textAlign: "center" }}>
          바닐라
        </div>
      ),
      dataIndex: "vanilla_",
      key: "vanilla_",
      render: (text) => <span>{text === 0 ? "" : text}</span>,
      editable: true,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "string",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const mergedExpandColumns = expandColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const expandedRowRender = (record) => {
    return (
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <Table
          size="small"
          columns={mergedExpandColumns}
          dataSource={expandDataSource[record.key] || []} // 배열이 없으면 빈 배열
          scroll={{ x: "max-content" }} // 하위 테이블에만 가로 스크롤 적용
          style={{ width: "100%" }} // 하위 테이블의 width 설정
          pagination={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        />
      </div>
    );
  };

  return (
    <Form form={form} component={false}>
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" onClick={addQuestion}>
          질문추가
        </Button>
      </div>
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <Table
          size="small"
          columns={mergedColumns}
          expandable={{
            expandedRowRender,
            onExpand: handleExpand,
          }}
          dataSource={dataSource}
          scroll={{ x: "max-content" }} // 부모 테이블에 스크롤 적용 안함 (필요시 추가 가능)
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 10,
            showSizeChanger: true,
            onChange: cancel,
            position: ["bottomCenter"],
          }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        />
      </div>
    </Form>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber style={{ width: "36px" }} />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default BDSMQuestions;
