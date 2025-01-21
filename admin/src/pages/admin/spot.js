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
  Tooltip,
  Rate,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import FileUpload from "../../components/button";
import SearchBranch from "../../components/popover/searchbranch";
import { AxiosDelete, AxiosGet, AxiosPost } from "../../api";
import usePagination from "../../hook/usePagination";
import { useNavigate } from "react-router-dom";

const AddModal = ({
  isModalOpen,
  setIsModalOpen,
  data,
  onComplete,
  isEditMode,
  currentSpot,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem("selectedBranch")
      ? JSON.parse(localStorage.getItem("selectedBranch"))
      : null
  );

  const handlesubmit = async (values) => {
    const spot_name = selectedBranch?.branch_name;
    const branch_address = selectedBranch?.branch_address;
    const install_flag = selectedBranch?.install_flag;
    const spot_id = selectedBranch.id;
    const branch_address_detail = selectedBranch?.branch_address_detail;

    if (install_flag === "0") {
      return message.warning(
        "미설치 된 지점은 등록할수 없습니다. 여부를 변경 후 등록해주세요."
      );
    }
    try {
      let spotData = {
        ...values,
        spot_name,
        branch_address,
        install_flag,
        spot_id,
        branch_address_detail,
      };

      console.log("spotID", spot_id, spotData);

      const response = isEditMode
        ? await AxiosPost(`/spots/${currentSpot.id}`, spotData) // 수정 API 호출
        : await AxiosPost("/spots", spotData); // 신규 등록 API 호출

      if (response.status === 201 || response.status === 200) {
        message.success(
          isEditMode ? "설치지점 수정 성공" : "설치지점 등록 성공"
        );
        setIsModalOpen(false);
        onComplete();
      } else {
        message.error("설치지점 처리 중 오류가 발생했습니다.");
      }
    } catch (err) {
      message.error("오류가 발생했습니다.");
    }
  };

  return (
    <Modal
      open={isModalOpen}
      width={650}
      title={isEditMode ? "설치지점 수정" : "설치지점 등록"} // 수정/등록 구분
      onCancel={() => {
        form.resetFields();
        setSelectedBranch(null);
        setIsModalOpen(false);
      }}
      footer={
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            direction: "rtl",
          }}
        >
          <Space style={{ direction: "ltr" }}>
            <Button
              key="back"
              onClick={() => {
                form.resetFields();
                setSelectedBranch(null);
                setIsModalOpen(false);
              }}
            >
              취소
            </Button>
            <Button key="submit" type="primary" onClick={() => form.submit()}>
              {isEditMode ? "수정" : "등록"}
            </Button>
          </Space>
          {selectedBranch?.install_flag === "0" && (
            <Popconfirm
              title="설치여부 수정"
              onConfirm={() => navigate("/branch/branch")}
            >
              <Button>설치여부 수정</Button>
            </Popconfirm>
          )}
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handlesubmit}
        initialValues={data}
      >
        <Descriptions column={3} size="small" bordered>
          {isEditMode ? (
            <>
              <Descriptions.Item
                label="설치지점"
                labelStyle={{ whiteSpace: "nowrap" }}
                span={2}
              >
                {data?.spot_name}
              </Descriptions.Item>
              <Descriptions.Item
                label="설치여부"
                labelStyle={{ whiteSpace: "nowrap" }}
              >
                {data?.install_flag === "0" ? "미설치" : "설치완료"}
              </Descriptions.Item>
              <Descriptions.Item
                label="주소"
                labelStyle={{ whiteSpace: "nowrap" }}
                span={3}
              >
                <Space>
                  {data?.branch_address}
                  {data?.branch_address_detail && (
                    <div>{data?.branch_address_detail}</div>
                  )}
                </Space>
              </Descriptions.Item>
            </>
          ) : (
            <>
              <Descriptions.Item
                label="설치지점"
                span={selectedBranch ? 2 : 3}
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
              {selectedBranch && (
                <Descriptions.Item label="설치 여부">
                  {selectedBranch && (
                    <div>
                      {selectedBranch?.install_flag === "0"
                        ? "미설치"
                        : "설치완료"}
                    </div>
                  )}
                </Descriptions.Item>
              )}

              {selectedBranch && (
                <Descriptions.Item label="주소" span={3}>
                  {selectedBranch && (
                    <Space>
                      <div>{selectedBranch?.branch_address}</div>
                      <div>{selectedBranch?.branch_address_detail}</div>
                    </Space>
                  )}
                </Descriptions.Item>
              )}
            </>
          )}

          {/* <Descriptions.Item
            label={
              <Space>
                별점 등록
                <Tooltip
                  placement="bottom"
                  title="임의로 표기할 점수를 등록해주세요."
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            labelStyle={{ whiteSpace: "nowrap" }}
            span={3}
          >
            <Form.Item name="spot_score" style={{ marginBottom: 0 }}>
              <Rate allowHalf />
            </Form.Item>
          </Descriptions.Item> */}

          <Descriptions.Item
            label={
              <Space>
                설치지점 로고
                <Tooltip placement="bottom" title="jpg, png 등 이미지 파일">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
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
            label={
              <Space>
                설치지점 이미지
                <Tooltip placement="bottom" title="jpg, png 등 이미지 파일">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
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

  const [spots, setSpots] = useState([]);
  const [currentSpot, setCurrentSpot] = useState(null);

  useEffect(() => {
    fetchSpots();
    console.log(spots);
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await AxiosGet("/spots");
      setSpots(response.data);
    } catch (err) {
      message.error("설치지점 리스트를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleAdd = () => {
    setCurrentSpot(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (spot) => {
    setCurrentSpot(spot);
    form.setFieldsValue(spot);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    try {
      AxiosDelete(`/spots/${id}`);
      setSpots(spots.filter((spot) => spot.id !== id));
      message.success("설치지점 삭제 성공");
    } catch (err) {}
  };

  const { pagination, setPagination, handleTableChange } = usePagination();

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
      title: "주소",
      dataIndex: "branch_address",
      key: "branch_address",
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
      render: (text) => (
        <Image
          src={text || "#f1f1f1"}
          alt="spot_logo"
          style={{ width: "40px", height: "40px" }}
        />
      ),
    },
    {
      title: "설치지점 이미지",
      dataIndex: "spot_image",
      key: "spot_image",
      render: (text) => (
        <Image
          src={text || "#f1f1f1"}
          alt="spot_image"
          style={{ width: "40px", height: "40px" }}
        />
      ),
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
            title="설치지점을 삭제하시겠습니까?"
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
        <Button type="primary" onClick={handleAdd}>
          지점 등록
        </Button>
      </Row>
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={spots}
        onChange={(pagination, filters, sorter) => {
          handleTableChange(pagination);
        }}
        pagination={{
          ...pagination,
          defaultPageSize: 10,
          showSizeChanger: true,
          position: ["bottomCenter"],
        }}
      />
      {/* 스팟 추가 및 수정 모달 */}
      <AddModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={!currentSpot ? {} : currentSpot}
        isEditMode={!!currentSpot}
        onComplete={fetchSpots}
      />
    </div>
  );
};

export default Spot;
