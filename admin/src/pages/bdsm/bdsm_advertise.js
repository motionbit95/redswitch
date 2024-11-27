import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
  Select,
  Modal,
  DatePicker,
  Upload,
} from "antd";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api"; // Axios 호출 함수
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs"; // dayjs 임포트

const BDSMAdvertisement = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [advertisementList, setAdvertisementList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 visibility 상태
  const [selectedAd, setSelectedAd] = useState(null); // 선택된 광고

  useEffect(() => {
    handleSearchAdvertisements();
  }, []);

  const handleSearchAdvertisements = async () => {
    try {
      const response = await AxiosGet("/advertisements");
      console.log("광고 리스트 조회 성공", response.data);
      setAdvertisementList(response.data.data);
    } catch (error) {
      message.error("광고 조회 실패");
    }
  };

  const handleEdit = (advertisement) => {
    setSelectedAd(advertisement);
    form.setFieldsValue({
      ...advertisement,
      active_datetime: dayjs(advertisement.active_datetime),
      expire_datetime: dayjs(advertisement.expire_datetime),
    }); // 광고 데이터를 폼에 채우기
    setIsModalVisible(true); // 모달 열기
  };

  const handleDelete = async (pk) => {
    try {
      await AxiosDelete(`/advertisements/${pk}`);
      handleSearchAdvertisements();
      message.success("광고 삭제 성공");
    } catch (error) {
      message.error("광고 삭제 실패");
    }
  };

  const handleSubmit = async (values) => {
    // 날짜 값이 유효한지 확인 (dayjs로 변환 후 확인)
    const activeDate = dayjs(values.active_datetime);
    const expireDate = dayjs(values.expire_datetime);

    if (!activeDate.isValid() || !expireDate.isValid()) {
      message.error("날짜 형식이 올바르지 않습니다.");
      return;
    }

    try {
      const data = {
        ...values,
        pk: selectedAd ? selectedAd.pk : null, // 수정 시 pk 값 추가
        created_at: selectedAd
          ? selectedAd.created_at
          : new Date().toISOString(),
      };

      if (selectedAd) {
        // 광고 수정
        await AxiosPut(`/advertisements/${selectedAd.pk}`, data);
        message.success("광고 수정 성공");
      } else {
        // 새로운 광고 생성
        await AxiosPost("/advertisements", data);
        message.success("광고 생성 성공");
      }
      handleSearchAdvertisements();
      form.resetFields(); // 폼 초기화
      setSelectedAd(null); // 선택된 광고 초기화
      setIsModalVisible(false); // 모달 닫기
    } catch (error) {
      message.error("광고 처리 실패");
    }
  };

  const columns = [
    {
      title: "광고명",
      dataIndex: "banner_advertiser",
      key: "banner_advertiser",
    },
    {
      title: "광고 코드",
      dataIndex: "pk",
      key: "pk",
    },
    {
      title: "생성일",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "동작",
      key: "actions",
      render: (text, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>수정</a>
          <Popconfirm
            title="이 광고를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.pk)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={() => {
            setSelectedAd(null); // 광고 선택 초기화
            form.resetFields(); // 폼 초기화
            setIsModalVisible(true); // 모달 열기
          }}
        >
          광고 생성
        </Button>
      </div>

      {/* 광고 생성/수정 모달 */}
      <Modal
        title={selectedAd ? "광고 수정" : "광고 생성"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)} // 모달 닫기
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {selectedAd ? "수정" : "생성"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            banner_advertiser: "",
            banner_image: "",
            banner_site: "",
            banner_position: 1,
            manager_phone: "",
            manager_name: "",
            brn: "",
            business_file: "",
            amount: 0,
            active_datetime: null,
            expire_datetime: null,
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="광고주명"
                name="banner_advertiser"
                rules={[
                  { required: true, message: "광고주명을 입력해주세요!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="광고 이미지" name="banner_image">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>이미지 업로드</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="광고 사이트" name="banner_site">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="광고 위치"
                name="banner_position"
                rules={[
                  { required: true, message: "광고 위치를 입력해주세요!" },
                ]}
              >
                <Select>
                  <Select.Option value={0}>위쪽</Select.Option>
                  <Select.Option value={1}>아래쪽</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="담당자 전화번호" name="manager_phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="담당자 이름" name="manager_name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="사업자 등록번호" name="brn">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="사업자 등록 파일" name="business_file">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>파일 업로드</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="광고 금액" name="amount">
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="활성화 날짜"
                name="active_datetime"
                rules={[
                  { required: true, message: "활성화 날짜를 입력해주세요!" },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="만료 날짜"
                name="expire_datetime"
                rules={[
                  { required: true, message: "만료 날짜를 입력해주세요!" },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Table
        size="small"
        columns={columns}
        dataSource={advertisementList}
        rowKey="pk"
        loading={loading}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
      />
    </Space>
  );
};

export default BDSMAdvertisement;
