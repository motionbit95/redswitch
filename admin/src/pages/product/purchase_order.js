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
  Tabs,
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
import TabPane from "antd/es/tabs/TabPane";

const DetailModal = ({
  open,
  onClose,
  data,
  materials,
  providers,
  branch,
  orderHistory,
}) => {
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    console.log(data, branch);
  }, []);

  // 물자 정보 불러오기

  useEffect(() => {
    let filteredOrders = [];
    console.log(data.map((order) => order.material_pk));
    console.log(materials);
    data.map((order) => {
      let item = materials.filter(
        (material) => material.pk === order.material_pk
      );
      if (item.length > 0) {
        filteredOrders.push({
          ...order,
          product_name: item[0].product_name,
          product_code: item[0].product_code,
          provider_name:
            providers.filter(
              (provider) => provider.id === item[0].provider_id
            )[0].provider_name || "",
          product_price: item[0].product_price,
        });
      }
    });

    setFilteredOrders(filteredOrders);
  }, [data]);

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

  return (
    <Modal
      title="발주 내역"
      open={open}
      centered
      onCancel={onClose}
      footer={null}
    >
      <Descriptions
        size="small"
        bordered
        column={2}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="발주지점">{branch}</Descriptions.Item>
        <Descriptions.Item label="발주 일자">
          {dayjs(orderHistory[0]?.ordering_date).format("YYYY-MM-DD")}
        </Descriptions.Item>
      </Descriptions>
      {/* <Button
        style={{ float: "right" }}
        icon={<DownloadOutlined />}
        onClick={exportToExcel}
      >
        엑셀 다운로드
      </Button> */}
      <Table size="small" columns={columns} dataSource={filteredOrders} />
    </Modal>
  );
};

const Purchase_order = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelModalOpen, setExcelModalOpen] = useState();

  const [orderHistory, setOrderHistory] = useState([]); // 발주 이력
  const [orderDetails, setOrderDetails] = useState([]); // 발주 상세
  const [excelOrder, setExcelOrder] = useState([]);
  const [branches, setBranches] = useState([]); // 지점
  const [materials, setMaterials] = useState([]); // 물자
  const [providers, setProviders] = useState([]); // 거래처

  const [historyPK, setHistoryPK] = useState(null); // 발주 이력 PK
  const [excelPK, setExcelPK] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("0");
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 페이지 로드 시
  useEffect(() => {
    AxiosGet("/products/ordering_history")
      .then((res) => {
        const selectWithKeys = res.data.map((selected) => ({
          ...selected,
          key: selected.pk,
        }));
        setOrderHistory(selectWithKeys);
      })
      .catch((err) => {
        message.error("발주 이력을 불러오는 데 실패했습니다.");
      });

    AxiosGet("/products/materials")
      .then((res) => {
        setMaterials(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    AxiosGet("/branches")
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    AxiosGet("/providers")
      .then((res) => {
        setProviders(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // 발주 내역 불러오기
  useEffect(() => {
    const fetchPurchaseOrder = async () => {
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

  // 엑셀에 들어갈 발주 내역 불러오기
  useEffect(() => {
    const fetchExcelOrder = async () => {
      console.log("상세 내역", excelPK);

      try {
        // 배열인 경우 각각의 historyPK로 요청
        if (Array.isArray(excelPK)) {
          const promises = excelPK.map((id) =>
            AxiosGet(`/products/ordering-products/history/${id}`)
          );
          const responses = await Promise.all(promises);

          // 모든 응답 데이터를 합쳐서 setExcelOrder에 저장
          const combinedData = responses.map((res, index) => {
            const matchingOrder = orderHistory.find(
              (order) => order.pk === excelPK[index] // excelPK와 pk를 매칭
            );
            return {
              ...res.data, // 기존 응답 데이터
              branch_id: matchingOrder?.branch_id || null, // branch_id 추가
              key: excelPK[index],
              date: matchingOrder?.created_at || null,
            };
          });
          setExcelOrder(combinedData.flat()); // 데이터를 1차원 배열로 만듦
        } else {
          // 단일 값인 경우
          const response = await AxiosGet(
            `/products/ordering-products/history/${excelPK}`
          );

          const matchingOrder = orderHistory.find(
            (order) => order.pk === excelPK
          );
          setExcelOrder([
            {
              ...response.data,
              branch_id: matchingOrder?.branch_id || null,
            },
          ]);
        }
      } catch (error) {
        message.error("발주 내역을 불러오는 데 실패했습니다.");
      }
    };

    fetchExcelOrder();
  }, [excelPK]);

  // 발주 내역 엑셀 다운로드 버튼
  const handleExcel = () => {
    setExcelPK(selectedRowKeys);
    setExcelModalOpen(true);
  };

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

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
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
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div />
        <Button
          style={{ float: "right" }}
          icon={<DownloadOutlined />}
          onClick={handleExcel}
          disabled={selectedRowKeys.length === 0}
        >
          엑셀 다운로드
        </Button>
      </Space>

      <Table
        size="small"
        columns={columns}
        dataSource={orderHistory}
        rowSelection={rowSelection}
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
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={orderDetails}
        materials={materials}
        providers={providers}
        branch={selectedBranch}
        orderHistory={orderHistory}
      />

      <ExcelModal
        open={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        data={excelOrder}
        materials={materials}
        providers={providers}
        branches={branches}
      />
    </Space>
  );
};

const ExcelModal = (props) => {
  const { open, onClose, data, materials, providers, branches } = props;
  const [branchData, setBranchData] = useState([]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = [
    {
      title: "지점",
      dataIndex: "branch_id",
      key: "branch_id",

      render: (text, record) => {
        const branch = branches.find((branch) => branch.id === text);
        return branch ? branch.branch_name : "unknown";
      },
    },
    {
      title: "발주일시",
      dataIndex: "date",

      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const subColumns = [
    {
      title: "상품코드",
      dataIndex: "material_pk",
      key: "material_pk",
    },
    {
      title: "상품명",
      key: "material_name",
      render: (_, record) => {
        const material = materials.find(
          (item) => item.pk === record.material_pk
        );
        return material ? material.name : "unknown";
      },
    },
    {
      title: "수량",
      dataIndex: "ordered_cnt",
      key: "ordered_cnt",
    },
    {
      title: "거래처",
      key: "provider_name",
      render: (_, record) => {
        const provider = providers.find(
          (item) => item.pk === record.material_pk
        );
        return provider ? provider.name : "unknown";
      },
    },
  ];
  return (
    <Modal
      title="발주 내역"
      open={open}
      centered
      width={700}
      onCancel={onClose}
      footer={[
        <Button onClick={onClose}>닫기</Button>,
        <Button type="primary">다운로드</Button>,
      ]}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="지점 별" key="1">
          <Table
            size="small"
            columns={columns}
            dataSource={data.map((item) => [item])}
            rowKey={(record) => record.key}
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  size="small"
                  columns={subColumns}
                  dataSource={record[0]}
                  rowKey={(item) => item.pk}
                  pagination={false}
                />
              ),
            }}
          />
        </TabPane>
        <TabPane tab="거래처 별" key="2">
          <Table size="small" columns={columns} dataSource={[]} />
        </TabPane>
      </Tabs>
      {/* <Descriptions
        size="small"
        bordered
        column={2}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="발주지점"></Descriptions.Item>
        <Descriptions.Item label="발주 일자"></Descriptions.Item>
      </Descriptions> */}
    </Modal>
  );
};

export default Purchase_order;
