import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  message,
  Space,
  Popconfirm,
} from "antd";
import { AxiosPut, AxiosGet, AxiosDelete, AxiosPost } from "../../api"; // Assuming AxiosGet is a method to perform GET requests
import useSearchableColumn from "../../components/table";

const BDSMResults = () => {
  const [data, setData] = useState([]); // State to manage table data
  const [editingKey, setEditingKey] = useState(""); // Used to track which row is being edited
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false); // Modal visibility state
  const [modalTitle, setModalTitle] = useState("수정");
  const [selectedRecord, setSelectedRecord] = useState(null); // Stores the selected record for editing

  const { getColumnSearchProps } = useSearchableColumn();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call to fetch the list of all results
        const response = await AxiosGet("/bdsm/results");
        setData(response.data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("데이터를 가져오는 데 실패했습니다.");
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures it runs only once on mount

  // Function to show the edit modal with prefilled data
  const showEditModal = (record) => {
    setSelectedRecord(record); // Set the selected record
    form.setFieldsValue({
      tendency: record.tendency,
      description: record.description,
    });
    setVisible(true); // Show the modal
  };

  const handleAddSave = async () => {
    try {
      const values = await form.validateFields(); // Get the form values
      const addedRecord = {
        tendency: values.tendency,
        description: values.description,
        type: values.type || "",
      };

      // Call the API endpoint to update the record on the server
      const response = await AxiosPost(`/bdsm/results`, addedRecord);

      const updatedRecord = response.data.result;

      setData([...data, updatedRecord]); // Update the table data with the new values

      // Close the modal
      setVisible(false);

      // Show a success message
      message.success("등록이 완료되었습니다.");
    } catch (error) {
      console.error("Failed to save:", error);
      message.error("등록 실패. 다시 시도해주세요.");
    }
  };

  // Function to handle save action after editing and send data to the server
  const handleEditSave = async () => {
    try {
      const values = await form.validateFields(); // Get the form values
      const updatedRecord = {
        key: selectedRecord.key,
        tendency: values.tendency,
        description: values.description,
      };

      // Call the API endpoint to update the record on the server
      await AxiosPut(`/bdsm/results/${updatedRecord.key}`, updatedRecord);

      // Update the local state to reflect the changes
      const updatedData = data.map((item) =>
        item.key === updatedRecord.key ? updatedRecord : item
      );
      setData(updatedData); // Update the table data with the new values

      // Close the modal
      setVisible(false);

      // Show a success message
      message.success("수정이 완료되었습니다.");
    } catch (error) {
      console.error("Failed to save:", error);
      message.error("수정 실패. 다시 시도해주세요.");
    }
  };

  const deleteResult = async (key) => {
    console.log(key);
    try {
      setData(data.filter((item) => item.key !== key));
      await AxiosDelete(`/bdsm/results/${key}`);
    } catch (error) {
      console.error("Error deleting result:", error);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
      width: 50,
      sorter: (a, b) => a.key - b.key,
      defaultSortOrder: "descend",
    },
    {
      title: "성향",
      dataIndex: "tendency",
      key: "tendency",
      ...getColumnSearchProps("tendency"),
    },
    {
      width: 200,
      title: "동작",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setModalTitle("수정");
              showEditModal(record);
            }}
          >
            수정
          </a>
          <Popconfirm
            title="성향을 삭제하시겠습니까?"
            onConfirm={() => deleteResult(record.key)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            setModalTitle("추가");
            showEditModal({});
          }}
        >
          성향추가
        </Button>
      </div>
      <Table
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          position: ["bottomCenter"],
        }}
        size="small"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {record.description}
            </p>
          ),
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        dataSource={data} // Use the state data for the table's dataSource
      />
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          onFinish={(e) => {
            modalTitle === "추가" ? handleAddSave(e) : handleEditSave(e);
          }}
          initialValues={{
            tendency: selectedRecord?.tendency,
            description: selectedRecord?.description,
          }}
        >
          <Form.Item
            name="tendency"
            label="성향"
            rules={[{ required: true, message: "성향을 입력하세요!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="설명"
            rules={[{ required: true, message: "설명을 입력하세요!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BDSMResults;
