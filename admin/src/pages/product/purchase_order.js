import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Descriptions,
  Tag,
  Popover,
  Checkbox,
  Radio,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import SearchProvider from "../../components/popover/searchprovider";
import SearchMaterial from "../../components/popover/searchmaterial";
import { useNavigate } from "react-router-dom";
import { AxiosDelete, AxiosGet, AxiosPost, AxiosPut } from "../../api";
import dayjs from "dayjs";
import usePagination from "../../hook/usePagination";
import useExportToExcel from "../../hook/useExportToExcel";

const DetailModal = ({
  isModalOpen,
  setIsModalOpen,
  historyPK,
  selectedBranch,
}) => {
  const [orderDetails, setOrderDetails] = useState([]); // 발주 상세 데이터 상태 관리
  const [materials, setMaterials] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await AxiosGet("/providers"); // Replace with your endpoint
        let total_provider = Array.from(response.data);
        setProviders(total_provider);
      } catch (error) {
        message.error("거래처 데이터를 가져오는 데 실패했습니다.");
      }
    };
    fetchProviders();
  }, []);
  // 발주 내역 불러오기
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      console.log(historyPK);
      try {
        const response = await AxiosGet(
          `/products/ordering-products/history/${historyPK}`
        );
        setOrderDetails(response.data);
      } catch (error) {
        message.error("발주 내역을 불러오는 데 실패했습니다.");
      }
    };

    if (!historyPK) {
      return;
    }
    fetchPurchaseOrder();
  }, [historyPK]);

  // 물자 정보 불러오기
  useEffect(() => {
    const fetchMaterials = async () => {
      AxiosGet("/products/materials")
        .then((res) => {
          setMaterials(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    let filteredOrders = [];
    console.log(orderDetails.map((order) => order.material_pk));
    console.log(materials);
    orderDetails.map((order) => {
      let data = materials.filter(
        (material) => material.pk === order.material_pk
      );
      if (data.length > 0) {
        filteredOrders.push({
          ...order,
          product_name: data[0].product_name,
          product_code: data[0].product_code,
          provider_name:
            providers.filter(
              (provider) => provider.id === data[0].provider_id
            )[0].provider_name || "",
          product_price: data[0].product_price,
        });
      }
    });

    setFilteredOrders(filteredOrders);
  }, [orderDetails]);

  const columns = [
    {
      title: "상품명",
      dataIndex: "product_name",
      key: "material_name",
    },
    {
      title: "상품코드",
      dataIndex: "product_code",
      key: "material_code",
    },
    {
      title: "상품 금액",
      dataIndex: "product_price",
      key: "product_price",
    },
    {
      title: "발주 수량",
      dataIndex: "ordered_cnt",
      key: "ordered_cnt",
    },
    {
      title: "거래처명",
      dataIndex: "provider_name",
      key: "provider_name",
    },
  ];

  // Use the custom hook to export data to Excel
  const exportToExcel = useExportToExcel(
    filteredOrders,
    columns,
    [],
    "발주 내역" +
      "_" +
      selectedBranch +
      "_" +
      dayjs(filteredOrders[0]?.created_at).format("YYYYMMDD")
  );

  return (
    <Modal
      title="발주 내역"
      open={isModalOpen}
      centered
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Descriptions
        size="small"
        bordered
        column={2}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="발주지점">{selectedBranch}</Descriptions.Item>
        <Descriptions.Item label="발주 일자">
          {dayjs(orderDetails[0]?.ordering_date).format("YYYY-MM-DD")}
        </Descriptions.Item>
      </Descriptions>
      <Button
        style={{ float: "right" }}
        icon={<DownloadOutlined />}
        onClick={exportToExcel}
      >
        엑셀 다운로드
      </Button>
      <Table size="small" columns={columns} dataSource={filteredOrders} />
    </Modal>
  );
};

const Purchase_order = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [branches, setBranches] = useState([]);
  const [historyPK, setHistoryPK] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("0");
  const [currentRecord, setCurrentRecord] = useState(null);

  // 발주 이력 가져오기 (본사 기준)
  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      const response = await AxiosGet("/products/ordering_history");
      console.log(response.data);
      setOrderHistory(response.data);
    } catch (error) {
      message.error("발주 이력을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    AxiosGet("/branches")
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => console.err(err));
  }, [orderHistory]);

  // 발주 내역 확인 버튼
  const handleDetail = (record) => {
    console.log(record);
    setIsModalOpen(true);
    setHistoryPK(record.pk);

    const branch = branches.find((branch) => branch.id === record.branch_id);
    const branchName = branch ? branch.branch_name : null;

    setSelectedBranch(branchName); // branch_name 저장
  };

  // 발주 이력 삭제
  const handleDelete = (id) => {
    AxiosDelete(`/products/ordering_history/${id}`)
      .then((response) => {
        message.success("발주 이력이 성공적으로 삭제되었습니다.");
        fetchOrders();
      })
      .catch((error) => {
        console.error("발주 이력 삭제 오류:", error);
        message.error("발주 이력을 삭제하는 데 실패했습니다.");
      });
  };

  // 발주 내역 수정
  const handleUpdate = async () => {
    console.log(currentRecord.pk, selectedStatus);
    const updateData = parseInt(selectedStatus);

    // 선택된 상태와 현재 상태가 동일한 경우
    if (updateData === currentRecord.arrive) {
      message.warning("변경 사항이 없습니다.");
      return;
    }

    try {
      // 서버 요청
      const currentDate = new Date().toISOString();
      if (updateData === 3) {
        await AxiosPut(`/products/ordering_history/${currentRecord.pk}`, {
          arrive: updateData,
          receving_date: currentDate,
        });
      } else {
        await AxiosPut(`/products/ordering_history/${currentRecord.pk}`, {
          arrive: updateData,
          receving_date: null,
        });
      }

      message.success("발주 상태가 성공적으로 업데이트되었습니다.");
      setPopoverVisible(false); // 팝오버 닫기
      fetchOrders(); // 테이블 데이터 새로 고침
    } catch (error) {
      console.error("발주 상태 업데이트 오류:", error);
      message.error("발주 상태 업데이트에 실패했습니다.");
    }
  };

  // 발주 상태 체크박스 선택
  const handleRadioChange = (e) => {
    setSelectedStatus(e.target.value); // 선택된 상태 값 설정
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
      title: "발주 일자",
      dataIndex: "created_at",
      key: "created_at",

      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),

      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "지점명",

      render: (text, record) => {
        let branch = branches.filter(
          (branch) => branch.id === record.branch_id
        );
        return <span>{branch[0]?.branch_name}</span>;
      },
    },
    {
      title: "발주 상태",
      dataIndex: "arrive",
      key: "arrive",
      render(text, record) {
        return (
          <Popover
            placement="right"
            content={
              <div>
                <Radio.Group
                  style={{ display: "flex", flexDirection: "column" }}
                  onChange={handleRadioChange} // 선택된 상태 값 관리
                  value={selectedStatus} // 현재 선택된 값 표시
                >
                  <Radio value="0">발주 신청</Radio>
                  <Radio value="1">발주 확인</Radio>
                  <Radio value="2">배송 중</Radio>
                  <Radio value="3">수령 완료</Radio>
                </Radio.Group>
                <Row justify="end" gutter={8} style={{ marginTop: "10px" }}>
                  <Col span={12}>
                    <Button
                      style={{ width: "100%" }}
                      onClick={() => setPopoverVisible(false)}
                    >
                      닫기
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Popconfirm
                      title="정말로 업데이트 하시겠습니까?"
                      onConfirm={handleUpdate}
                      onCancel={() => setPopoverVisible(false)}
                      okText="확인"
                      cancelText="취소"
                    >
                      <Button style={{ width: "100%" }} type="primary">
                        확인
                      </Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </div>
            }
            title="발주 상태 변경"
            trigger="click"
            open={
              popoverVisible &&
              currentRecord?.pk === record.pk &&
              currentRecord?.arrive !== 3
            } // Popover 가시성 제어
            onOpenChange={(visible) => {
              setPopoverVisible(visible);
              if (visible) {
                setCurrentRecord(record); // 현재 기록 설정
                setSelectedStatus(record.arrive); // 현재 상태 값으로 초기화
              } else {
                setCurrentRecord(null);
              }
            }}
          >
            <Tag
              color={
                text === 0
                  ? "red"
                  : text === 1
                  ? "blue"
                  : text === 2
                  ? "orange"
                  : "green"
              }
            >
              {text === 0
                ? "발주 신청"
                : text === 1
                ? "발주 확인"
                : text === 2
                ? "배송 중"
                : "수령 완료"}
            </Tag>
          </Popover>
        );
      },
    },
    {
      title: "입고 일자",
      dataIndex: "receving_date",
      key: "receving_date",
      render: (text) => (
        <span>{text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : ""}</span>
      ),
    },
    {
      title: "발주 내역",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<SearchOutlined />}
          onClick={() => handleDetail(record)}
        />
      ),
    },
    {
      title: "동작",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="발주 이력을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.pk)}
          >
            <a>삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginTop: 45 }} />
      <Table
        size="small"
        columns={columns}
        dataSource={orderHistory}
        onChange={(pagination, filters, sorter) => {
          handleTableChange(pagination);
          handleChange(pagination, filters, sorter);
        }}
        pagination={{
          ...pagination,
          defaultPageSize: 10,
          showSizeChanger: true,
          position: ["bottomCenter"],
        }}
      />

      <DetailModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        historyPK={historyPK}
        selectedBranch={selectedBranch}
      />
    </div>
  );
};

export default Purchase_order;
