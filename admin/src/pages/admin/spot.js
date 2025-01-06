import {
  Button,
  Descriptions,
  Form,
  Modal,
  Row,
  Table,
  message,
  Popconfirm,
  Space,
  Image,
  Tag,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import FileUpload from "../../components/button";
import SearchBranch from "../../components/popover/searchbranch";
import { AxiosDelete, AxiosGet, AxiosPost } from "../../api";
import usePagination from "../../hook/usePagination";

const AddModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const [form] = Form.useForm();
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handlesubmit = async (values) => {
    const spot_name = selectedBranch.branch_name;
    const branch_address = selectedBranch.branch_address;
    const install_flag = selectedBranch.install_flag;

    const spot_image = values.spot_image;
    const spot_logo = values.spot_logo;

    console.log("values", values);
    try {
      let spotData = { ...values };

      console.log(spotData);
      const response = await AxiosPost("/spots", {
        ...values,
        spot_name,
        branch_address,
        install_flag,
      });
      if (response.status === 201) {
        console.log(response.data);
        message.success("설치지점 등록 성공");
        setIsModalOpen(false);
      } else {
        message.error("설치지점 등록 중 오류가 발생했습니다.");
      }
    } catch {}
  };

  return (
    <Modal
      open={isModalOpen}
      width={620}
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
        <Descriptions column={3} size="small" bordered>
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
          <Descriptions.Item label="설치 여부">
            {selectedBranch && (
              <div>
                {selectedBranch?.install_flag === "0" ? "미설치" : "설치완료"}
              </div>
            )}
          </Descriptions.Item>
          {selectedBranch && (
            <Descriptions.Item label="주소" span={3}>
              {selectedBranch && <div>{selectedBranch?.branch_address}</div>}
            </Descriptions.Item>
          )}

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [spots, setSpots] = useState([]);
  const [currentSpot, setCurrentSpot] = useState(null);

  useEffect(() => {
    AxiosGet("/spots")
      .then((res) => {
        console.log(res.data);
        setSpots(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEdit = (spot) => {
    console.log(spot);
    setCurrentSpot(spot);
    form.setFieldsValue(spot);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    try {
      AxiosDelete(`/spots/${id}`);
      setSpots(spots.filter((spot) => spot.id !== id));
      message.success("설치지점 삭제 성공");
    } catch (err) {}
  };

  const { pagination, setPagination, handleTableChange } = usePagination();

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
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
      title: "설치지점명",
      dataIndex: "spot_name",
      key: "spot_name",
    },
    {
      title: "설치여부",
      dataIndex: "install_flag",
      key: "install_flag",

      render: (text) => {
        return (
          <Tag color={text === "0" ? "red" : "green"}>
            {text === "0" ? "미설치" : "설치 완료"}
          </Tag>
        );
      },
    },
    {
      title: "설치지점 로고",
      dataIndex: "spot_logo",
      key: "spot_logo",

      render: (text) => {
        return (
          <>
            {text ? (
              <Image
                src={text}
                alt="spot_logo"
                style={{ width: "40px", height: "40px" }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f1f1f1",
                }}
              ></div>
            )}
          </>
        );
      },
    },
    {
      title: "설치지점 이미지",
      dataIndex: "spot_image",
      key: "spot_image",

      render: (text) => {
        return (
          <>
            {text ? (
              <Image
                src={text}
                alt="spot_image"
                style={{ width: "40px", height: "40px" }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#f1f1f1",
                }}
              ></div>
            )}
          </>
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
            title="거래처를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
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
      <Table
        size="small"
        columns={columns}
        dataSource={spots}
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
      {/* 스팟 추가 모달 */}
      <AddModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <EditModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        data={currentSpot}
      />
    </div>
  );
};

const EditModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <Modal
      title="지점 수정"
      open={isModalOpen}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onFinish(values);
            setIsModalOpen(false);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      onCancel={() => setIsModalOpen(false)}
    >
      <Form
        form={form}
        name="form_in_modal"
        layout="vertical"
        initialValues={data}
      >
        <Form.Item
          name="spot_name"
          label="설치지점명"
          rules={[
            {
              required: true,
              message: "설치지점명을 입력해주세요.",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Spot;
